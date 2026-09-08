import { describe, it, expect,afterEach, beforeAll,afterAll, beforeEach} from 'vitest'
import {createVOPRFService} from "../../../src/services/auth/voprf/voprfService.mjs";
import {evaluator, voprfClient} from "../../../src/lib/voprf.mjs";
import {faker} from "@faker-js/faker";
import {ServiceUnavailable} from "../../../src/errors/serviceUnavailable.mjs";

describe("VOPRFService", () => {
    let voprfService;
    beforeEach(async () => {
       voprfService = createVOPRFService({
           voprfClient, evaluator
       })
    })
    describe("voprfService.bindVOPRF", () => {
        it("bind email", async () => {
            const email = faker.internet.email()
            const firstBind = await voprfService.bindVOPRF(email)

            const secondBind= await voprfService.bindVOPRF(email)
            expect(firstBind.finData).not.toEqual(secondBind.finData)
            expect(firstBind.evalReqB64U).not.toBe(secondBind.evalReqB64U)
            expect(firstBind.evalReqB64U).toMatch(/^[A-Za-z0-9\-_]+$/)
            expect(secondBind.evalReqB64U).toMatch(/^[A-Za-z0-9\-_]+$/)
        })
        it("throw ServiceUnavailable Error", async () => {
            const email = faker.internet.email()
            voprfService = createVOPRFService({
                voprfClient: "stirng", evaluator: "stirng"
            })
            await expect(voprfService.bindVOPRF(email)).rejects.toBeInstanceOf(ServiceUnavailable)
        })
    })
    describe("voprfService.evaluateVOPRF", () => {
        it("return the evaluation", async () => {
            const email = faker.internet.email()
            const firstBind = await voprfService.bindVOPRF(email)

            const secondBind = await voprfService.bindVOPRF(email)

            const firstEvaluation = await voprfService.evaluateVOPRF(firstBind.evalReqB64U)
            const secondEvaluation = await voprfService.evaluateVOPRF(secondBind.evalReqB64U)
            expect(firstEvaluation).not.toBe(secondEvaluation)
            expect(firstEvaluation).toMatch(/^[A-Za-z0-9\-_]+$/)
            expect(secondEvaluation).toMatch(/^[A-Za-z0-9\-_]+$/)
        })
    })
    describe("voprfService.unbindVOPRF", () => {
        it("unblind and get same thing", async () => {
            const email = faker.internet.email()
            const first = await voprfService.bindVOPRF(email)
            const second = await voprfService.bindVOPRF(email)
            const firstEval = await voprfService.evaluateVOPRF(first.evalReqB64U)
            const secondEval = await voprfService.evaluateVOPRF(second.evalReqB64U)
            expect(await voprfService.unbindVOPRF(first.finData, firstEval)).toBe(await voprfService.unbindVOPRF(second.finData, secondEval))

        })
    })
})