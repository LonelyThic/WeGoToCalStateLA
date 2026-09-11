import * as client from 'openid-client'
import {openIdConfig} from '../config/openIdConfig.mjs'
const {google} = openIdConfig

export const openIdClient = {
    googleClient : await client.discovery(
        google.issuer,
        google.clientId,
        google.clientSecret
    ),

}