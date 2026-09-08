import bcrypt from 'bcrypt'
import dbMapper from '../../../util/dbMapper.mjs'


export function createSignupService(userRepo){
    /*
    return{
        signupUser
    }
    async function signupUser(emailHash, passwordHash) {
        const user = dbMapper.fromDb(await userRepo.findByEmailHash(emailHash))
        if (user !== null) {
            await userRepo.deleteByUserId(user.userId)
        }
        //perform password hash
        const username = await generateUserName(userRepo)
        //perform database insertion for user creation
        await userRepo.insertUser({
            email: emailHash,
            passwordHash: passwordHash,
            username: username,
        })
    }
*/
}