import {Router} from "express";
import {emailHashPasswordSchema, evalReqB64UhSchema} from "../../validators/authValidators.mjs";
import {jsend} from "../../util/jSend.mjs";

export function createVOPRFRouter(voprfService){
    const router = Router()

    router.post('/voprf', async (req, res) => {
        const { evalReqB64U } = evalReqB64UhSchema.parse(req.body)
        const evaluationB64U = await voprfService.evaluateVOPRF(evalReqB64U)
        res.json(jsend.success({ evaluationB64U : evaluationB64U}))
    })

    router.post('/voprf-register', async (req, res) => {
        const emailHash = await voprfService.handleServerVOPRF(req.body.email)
        res.json(jsend.success({
            emailHash
        }))
    })

    return router
}
