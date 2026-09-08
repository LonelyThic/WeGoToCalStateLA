import { AppError } from './appError.mjs'
export class GoneError extends AppError {
    constructor(data = null, message = 'GONE') {
        super(message, 410, 'GONE', data)
    }
}
