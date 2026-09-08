import { NotFoundError } from '../../../errors/notFoundError.mjs'
import { UnauthorizedError } from '../../../errors/unauthorizedError.mjs'
import dbMapper from '../../../util/dbMapper.mjs'


export function createLoginService({authRepo, passwordService, jwtTokenService}) {

    return{
        loginUser
    }
    async function loginUser(emailHash, password) {
        const user = dbMapper.fromDb(await authRepo.findByEmailHash(emailHash))
        if (!user) {
            throw new NotFoundError({
                emailHash: 'Not Found',
            },"Given EmailHash can not be found in our database.")
        }
        const matched = await passwordService.comparePassword(password, user.passwordHash)
        if (!matched) {
            throw new UnauthorizedError({
                password: 'Incorrect password',
            }, "Incorrect password. Please try again.")
        }
        const token = jwtTokenService.issueAccessToken(user.userUuid)
        return token
    }
}