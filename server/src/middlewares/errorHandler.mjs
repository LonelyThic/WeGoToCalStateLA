import getErrorMessage from '../util/getErrorMessage.mjs'
import { AppError } from '../errors/appError.mjs'
import { jsend } from '../util/jSend.mjs'
import { ZodError } from 'zod'
import { ReplyError } from 'ioredis'
export default function errorHandler(err, req, res, next) {
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === "test") {
        console.log(err)
    }
    //close the connection and print to stacktrace(if not in production)
    if (res.headersSent) {
        return next(err)
    }

    if (err instanceof ZodError) {
        const data = {}
        for (const issue of err.issues) {
            const key =
                issue.path && issue.path.length > 0
                    ? issue.path.join('.')
                    : '_global'
            if (data[key]) {
                if (Array.isArray(data[key])) {
                    data[key].push(issue.message)
                } else {
                    data[key] = [data[key], issue.message]
                }
            } else {
                data[key] = issue.message
            }
        }
        return res.status(400).json(jsend.fail(data, 'Validation Error'))
    }
    if (err instanceof AppError) {
        //check for custom error
        const payload = jsend.fail(err.data, err.message)
        if(process.env.NODE_ENV === 'development'){
            payload.debug = {
                name: err.name,
                statusCode: err.statusCode,
                code: err.code,
                stack: err.stack
            }
        }
        return res
            .status(err.statusCode)
            .json(payload)
    }
    return res.status(500).json(jsend.error(getErrorMessage(err)))
}
