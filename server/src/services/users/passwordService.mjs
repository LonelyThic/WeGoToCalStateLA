import bcrypt from 'bcrypt'
export function createPasswordService(round = 12){
    return{
        hashPassword,
        comparePassword,
    }
    async function hashPassword(password) {
        const passwordHash = await bcrypt.hash(password, round)
        return passwordHash
    }

    async function comparePassword(password, passwordHash) {
        const matched = await bcrypt.compare(password, passwordHash)
        return matched
    }

}