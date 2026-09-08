import bcrypt from 'bcrypt'
import { UnauthorizedError } from '../../../errors/unauthorizedError.mjs'
import {generateOTP} from "../../../util/otpGenerator.mjs";
import {generateKey} from "../../../util/keyGenerator.mjs";

export function createOTPService({otpStore, jwtTokenService, round = 10}){
    return{
        saveOTP,
        verifyOTP,
    }

    async function saveOTP(email) {
        // generate the code
        const otpCode = generateOTP()
        //hash and salt the otp
        const otpCodeHash = await bcrypt.hash(otpCode, round)
        // generate a challenge id / unique identifier to avoid expose on email
        const key = generateKey(32)
        await otpStore.save(key, {
            email,
            otpCodeHash,
        })
        const token = jwtTokenService.issueOTPToken(key)
        //send the code to reciver email
        return {key, token , otpCode}
    }

    async function verifyOTP(key, otpCode) {
        //retreive th target value from redis
        const otpValue = await otpStore.consume(key)
        //check if exist
        if (!otpValue|| Object.keys(otpValue).length === 0) {
            throw new UnauthorizedError(
                { otp : "Record not found" },
                'OTP expired. Please request a new code.'
            )
        }
        //increment the key because it exist
        await otpStore.incrementAttempts(key)
        const {email, otpCodeHash, attempts} = otpValue

        if(attempts >= 5) {
            await otpStore.deleteOTP(key)
            throw new UnauthorizedError(
                { otp : "Too many failed attempts" },
                'Too many failed attempts. Please request a new code.'
            )
        }
        if (!(await bcrypt.compare(otpCode, otpCodeHash))) {
            throw new UnauthorizedError(
                {otp: "Incorrect OTP"},
                'Incorrect OTP. Please try again.'
            )
        }
        //delete the key object pair if otp is correct
        await otpStore.deleteOTP(key)
    }
}