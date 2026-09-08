import { uniqueUsernameGenerator } from 'unique-username-generator'
import config from '../../config/usernameConfig.mjs'
export function createUsernameService(userRepo) {
    return{
        generateUsername
    }
    async function generateUsername() {
        let username
        let exist = true
        while (exist) {
            username = uniqueUsernameGenerator(config)
            //check if the username exist in the database or not
            const user = await userRepo.findByUsername(username)
            if (!user) {
                exist = false
            }
        }
        return username
    }

}