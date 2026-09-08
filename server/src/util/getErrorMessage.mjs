export default function getErrorMessage(error) {
    if (error instanceof Error) {
        return error.message
    }
    //check error with type object instead of Error and contain a message field
    if (error && typeof error === 'object' && 'message' in error) {
        return String(error.message)
    }
    if (typeof error === 'string') {
        return error
    }
    return 'An error occurred'
}
