export class AppError extends Error {
    constructor(message, statusCode, code, data) {
        super()
        this.message = message
        this.statusCode = statusCode
        this.code = code
        this.data = data
    }
}
