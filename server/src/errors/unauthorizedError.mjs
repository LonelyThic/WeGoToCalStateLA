import { AppError } from './appError.mjs'

export class UnauthorizedError extends AppError {
    constructor(data = null, message = 'Unauthorized') {
        super(message, 401, 'UNAUTHORIZED', data)
    }
}
