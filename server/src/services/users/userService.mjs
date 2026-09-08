import buildPatchQuery from '../../util/buildPatchQuery.mjs'
import dbMapper from '../../util/dbMapper.mjs'
import { NotFoundError } from '../../errors/notFoundError.mjs'
export function createUserService({userRepo}) {
    return{
        getByUserId,
        patchByUserId,
        patchByUserUuid,
        getByUsername,
        deleteByUserId,
        deleteByUserUuid,
        createUser,
        getUserCount,
        getByUserUuid,
        provisionUser,
    }
    async function getUserCount(){
        const count = await userRepo.getCount()
        return count
    }

    async function createUser({username, userUuid, createdAt}) {
        //perform database insertion for user creation
        const insertId = await userRepo.insertUser({
            username,
            userUuid,
            createdAt,
        })
        return dbMapper.fromDb(await userRepo.findByUserId(insertId))
    }


    async function getByUserId(userId) {
        const user = dbMapper.fromDb(await userRepo.findByUserId(userId))
        if (!user) {
            throw new NotFoundError(
                null,
                'Can not found the user'
            )
        }
        return user
    }
    async function getByUsername(username) {
        const user = dbMapper.fromDb(await userRepo.findByUsername(username))
        if (!user) {
            throw new NotFoundError(null, 'Can not found the user')
        }
        return user
    }

    async function getByUserUuid(userUuid) {
        const user = dbMapper.fromDb(await userRepo.findByUserUuid(userUuid))
        if (!user) {
            throw new NotFoundError(null, 'Can not found the user')
        }
        return user
    }

    async function provisionUser({userUuid, username, createdAt}) {
        let user = dbMapper.fromDb(await userRepo.findByUserUuid(userUuid))
        if(user == null){
            user = await createUser({userUuid, username, createdAt})
        }
        return user
    }


    async function patchByUserId(userId, payload) {

        const { sqlQuery, dataList } = buildPatchQuery(
            'users',
            dbMapper.toDb(payload)
        )
        const {existed, changed} = await userRepo.updateByUserId(userId, sqlQuery, dataList)
        if(!existed){
            throw new NotFoundError(
                null,
                'Can not found current user'
            )
        }
        const user = await getByUserId(userId)
        return user
    }

    async function patchByUserUuid(userUuid, payload) {

        const { sqlQuery, dataList } = buildPatchQuery(
            'users',
            dbMapper.toDb(payload)
        )
        const {existed, changed} = await userRepo.updateByUserUuid(userUuid, sqlQuery, dataList)
        if(!existed){
            throw new NotFoundError(
                null,
                'Can not found current user'
            )
        }
        const user = await getByUserUuid(userUuid)
        return user
    }


    async function deleteByUserId(userId) {
        const removed = await userRepo.deleteByUserId(userId)
        //this mean not found user
        if(!removed){
            throw new NotFoundError(null ,"Can not found the user")
        }
    }

    async function deleteByUserUuid(userUuid) {
        const removed = await userRepo.deleteByUserUuid(userUuid)
        //this mean not found user
        if(!removed){
            throw new NotFoundError(null ,"Can not found the user")
        }
    }
}