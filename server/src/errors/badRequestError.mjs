import { AppError } from './appError.mjs'
export class BadRequestError extends AppError {
    constructor(data = null, message = 'Bad request') {
        super(message, 400, 'BAD_REQUEST', data)
    }
}
