import { createRemoteJWKSet } from 'jose'
import { keycloakConfig} from '../config/authConfig.mjs'

const {issuer} = keycloakConfig

export const keycloakJWK = createRemoteJWKSet(
    new URL(`${issuer}/protocol/openid-connect/certs`)
)
