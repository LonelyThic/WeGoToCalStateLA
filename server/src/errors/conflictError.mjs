import { AppError } from './appError.mjs'
export class ConflictError extends AppError {
    constructor(data = null, message = 'Conflict') {
        super(message, 409, 'CONFLICT', data)
    }
}
