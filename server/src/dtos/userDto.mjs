const PUBLIC_FIELDS = ['userUuid', 'username', 'createdAt']
const PRIVATE_FIELDS = ['updatedAt']

export default class UserDto {
    constructor(user, { scope }) {
        if (scope === 'public' || scope === 'private') {
            PUBLIC_FIELDS.forEach((p) => {
                this[p] = user[p]
            })
        }
        else if (scope === 'private') {
            PRIVATE_FIELDS.forEach((p) => {
                this[p] = user[p]
            })
        }
        else{
            throw new TypeError("Scope must be either public or private")
        }
    }
}
