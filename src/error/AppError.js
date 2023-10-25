/**
 * Represents an error that occurs in the application.
 * @class
 * @extends Error
 */
class AppError extends Error{
    /**
     * Creates an instance of AppError.
     * @param {string} message - The error message.
     * @param {number} statusCode - The HTTP status code associated with the error.
     * @param {Object} errors - Optional field for additional error information.
     */
    constructor(message,statusCode,errors = []){
        super(message)
        this.statusCode = statusCode
        this.status = this.statusCode.toString().startsWith('4') ? "fail" : "error";
        this.isOperational = true
        this.errors = errors
        
        Error.captureStackTrace(this, this.contructor)
    }
}

module.exports = AppError