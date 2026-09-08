import base64url from "base64url";
export function base64UrlStringToUint8Array(base64UrlString) {

    return base64url.toBuffer(base64UrlString)
}
export function uint8ArrayToBase64UrlString(uint8Array) {
    return base64url.encode(uint8Array)
}