import { AppError } from './appError.mjs'

export class ServiceUnavailable extends AppError {
    constructor(data = null, message = 'Service Unavailable') {
        super(message, 503, 'SERVICE_UNAVAILABLE', data)
    }
}
