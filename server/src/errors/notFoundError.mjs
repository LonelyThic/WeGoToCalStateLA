import { AppError } from './appError.mjs'

export class NotFoundError extends AppError {
    constructor(data = null, message = 'Not found') {
        super(message, 404, 'NOT_FOUND', data)
    }
}
