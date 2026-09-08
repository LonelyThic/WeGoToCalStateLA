import {SendTemplatedEmailCommand} from "@aws-sdk/client-ses"
import {sesClient} from "../../../lib/ses.mjs";
import bcrypt from 'bcrypt'
import { UnauthorizedError } from '../../../errors/unauthorizedError.mjs'
import crypto from 'crypto'
import { uint8ArrayToBase64UrlString } from '../../../util/encoding.mjs'

export function createEmailService(){
    return{
        sendOTPEmail
    }
    async function sendOTPEmail(receiver, optCode) {
        const emailSendCommand = new SendTemplatedEmailCommand({
            Destination: { ToAddresses: [receiver] },
            TemplateData: JSON.stringify({ otpCode: optCode }),
            Source: 'baohang193@gmail.com',
            Template: 'EmailOTPTemplate',
        })
        await sesClient.send(emailSendCommand)
    }

}