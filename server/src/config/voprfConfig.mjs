import { generatePublicKey, Oprf, randomPrivateKey } from '@cloudflare/voprf-ts'
import {base64UrlStringToUint8Array} from "../util/encoding.mjs";

const suite = Oprf.Suite.P384_SHA384
const privateKey =
    base64UrlStringToUint8Array(process.env.VOPRF_PRIVATE_KEY) || (await randomPrivateKey(suite))
const publicKey =
    base64UrlStringToUint8Array(process.env.VOPRF_PUBLIC_KEY) || (await generatePublicKey(suite, privateKey))

export const voprfConfig = {
    suite,
    privateKey,
    publicKey,
}