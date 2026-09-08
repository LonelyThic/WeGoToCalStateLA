import { describe, it, expect, beforeEach} from 'vitest'
import UserDto from '../../src/dtos/userDto.mjs'

let user;
describe("User Dto unit test", () => {
    beforeEach(() => {
        user = {
            userId: 1,
            username: 'lazy-bird',
            displayName: 'lazy bird',
            createdAt: Date.now(),
            updatedAt: Date.now(),
        }
    })
    it("return a user dto with only public field", () => {
        const userDto = new UserDto(user, {scope: "public"})
        expect(userDto).toEqual({
            userId: user.userId,
            username: user.username,
            displayName: user.displayName,
            createdAt: user.createdAt
        })
    })

    it("return a user dto with public field and private field", () => {
        const userDto = new UserDto(user, {scope: "private"})
        expect(userDto).toEqual({
            userId: user.userId,
            username: user.username,
            displayName: user.displayName,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        })
    })
    it("throw a error if scope is neither public or private", () => {
        function errFunction(){
            const userDto = new UserDto(user,{scope: "something"})
        }
        expect(errFunction).toThrow(TypeError)
    })
})