import crypto from "node:crypto";
import {uint8ArrayToBase64UrlString} from "./encoding.mjs";

export function generateKey(bytes) {
    return uint8ArrayToBase64UrlString(crypto.randomBytes(bytes))
}