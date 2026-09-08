import { Router } from 'express'
import {
    usernameSchema,
} from '../validators/userValidators.mjs'
import UserDto from '../dtos/userDto.mjs'
import { jsend } from '../util/jSend.mjs'
import { reqAuth } from '../middlewares/reqAuth.mjs'

export function createUserRouter(userService){

    const router = Router()

    router.get('/me', reqAuth(userService),  async (req, res) => {
        res.status(200).json(jsend.success({ user: new UserDto(req.user, {scope: "public"})}))
    })

    // not enabled due to no field can be updated as for now
    /*
    router.patch('/me',  async (req, res) => {
        const payload = userSchema.parse(req.body)
        const user = await userService.patchByUserUuid(req.userUuid, payload)
        const userDisplay = new UserDto(user, { scope: 'private' })
        res.status(200).send(jsend.success({ user: userDisplay }))
    })
     */

    router.delete('/me', reqAuth(userService), async (req, res) => {
        const result = await userService.deleteByUserUuid(req.userUuid)
        res.status(200).send(jsend.success(null))
    })

    router.get('/profile/:username', reqAuth(userService),  async (req, res) => {
        const { username } = usernameSchema.parse({ username: req.params.username })
        const user = await userService.getByUsername(username)
        const userDisplay = new UserDto(user, { scope: 'public' })
        res.status(200).json(jsend.success({ user: userDisplay }))
    })

    return router

}