import {
    VOPRFClient,
    VOPRFServer,
} from '@cloudflare/voprf-ts'
import { voprfConfig } from '../config/voprfConfig.mjs'

const {suite, privateKey, publicKey} = voprfConfig
const evaluator = new VOPRFServer(suite, privateKey)
const voprfClient = new VOPRFClient(suite, publicKey)

export {voprfClient, evaluator}