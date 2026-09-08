import { faker } from '@faker-js/faker'
import { hkdf } from '../src/util/hash.mjs'
import bcrypt from 'bcrypt'
import {uint8ArrayToBase64UrlString} from "../src/util/encoding.mjs";
import crypto from "crypto";
import {openIdClient} from "../src/lib/openIdClient.mjs";
import * as client from "openid-client";
import {randomPKCECodeVerifier} from "openid-client";
import {createVOPRFService} from "../src/services/auth/voprf/voprfService.mjs";
import {evaluator, voprfClient} from "../src/lib/voprf.mjs";

const voprfService = createVOPRFService({
    voprfClient, evaluator
})
export async function createRandomUser() {
    const username = faker.internet.username()
    const password = faker.internet.password({
        length: 15,
        prefix: "Ab1!",
        pattern: /[A-Za-z0-9@$!%*?&]/,
    });
    const email = faker.internet.email()
    const user = {
        userUuid: faker.string.uuid(),
        username,
        displayName: username,
        email,
        emailHash: await voprfService.handleServerVOPRF(email),
        password,
        passwordHash: await bcrypt.hash(password, 12),
    }
    return user
}

export function createRandomThread(userId){
    const thread = {
        userId: userId,
        threadUuid: faker.string.uuid(),
        title: faker.lorem.sentence(10),
        content: faker.lorem.paragraph(20)
    }
    return thread
}


export function createRandomComment(userId, threadId){
    const comment = {
        userId,
        threadId,
        commentUuid: faker.string.uuid(),
        parentCommentId: null,
        content: faker.lorem.paragraph(20)
    }
    return comment
}

export function createRandomChildComment(userId, threadId, comment){
    const child = {
        userId,
        threadId,
        parentCommentId: comment.commentId,
        parentCommentUuid: comment.commentUuid,
        commentUuid: faker.string.uuid(),
        content: faker.lorem.paragraph(20)
    }
    return child
}



export async function createRandomOtp() {
    const key = uint8ArrayToBase64UrlString(crypto.randomBytes(32))
    const code = faker.string.numeric({length: 6, allowLeadingZeros: true})
    const otpVal = {
        otpCodeHash: await bcrypt.hash(code, 10),
        email: faker.internet.email()
    }
    return {key, otpVal}
}

export async function createRandomOidc(provider){
    const codeVerifier  = randomPKCECodeVerifier()
    const oidcVal = {
        provider,
        codeVerifier,
        state: client.randomState(),
        nonce: client.randomNonce(),
        codeChallenge: await client.calculatePKCECodeChallenge(codeVerifier)
    }
    return oidcVal
}

export async function seedUsers(db, count){
    const users = []
    for(let i = 0; i < count; i++){
        const user = await createRandomUser()
        const userId = await db.insertUser(user)
        users.push({...user, userId})
    }
    return users
}

export async function cleanSeed(db){
    await db.execute()
}

export async function seedThreads(users, db, perUser){
    const threads = []
    for(const user of users){
        for(let i = 0; i < perUser; i++){
            const thread = createRandomThread(user.userId)
            const threadId = await db.insertThread(thread)
            threads.push({...thread, threadId, userId: user.userId, userUuid: user.userUuid})
        }
    }
    return threads
}

export async function seedComments(db, users, threads, threadPerComment, commentPerComment) {

    const parents = [];
    const children = [];

    for (const user of users) {
        const thread = threads[0]
        for (let i = 0; i < threadPerComment; i++) {
            const comment = createRandomComment(user.userId, thread.threadId);
            const {inserted, insertId} = await db.insertComment(comment);
            if (!inserted) continue;
            parents.push({...comment, commentId: insertId, userUuid: user.userUuid, threadUuid: thread.threadUuid});
        }
    }

    for(const user of users) {
        const parent = parents[0]
        for(let i = 0; i < commentPerComment; i++){
            const child = createRandomChildComment(user.userId, parent.threadId, parent, );

            const { inserted, insertId } = await db.insertCommentWithParent(child);
            if (!inserted) continue;
            children.push({ ...child, commentId: insertId, userUuid: user.userUuid, threadUuid: parent.threadUuid});
        }
    }
    return {parents, children}


}