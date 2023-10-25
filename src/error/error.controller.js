const AppError = require("./AppError")


const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
    const value = err.message.match(/(["'])(\\?.)*?\1/)[0];

    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);

    const message = `Invalid input data`;
    return new AppError(message, 400, errors);
};

const handleJWTError = () =>
    new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
    new AppError('Your token has expired! Please log in again.', 401);

/**
 * Global error handler middleware function.
 * @param {Error} error - The error object.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {void}
 */
function globalErrorHandler(error, req, res, next) {
    error.status = error.status || "error"
    error.statusCode = error.statusCode || 500

    if (process.env.NODE_ENV === "development") handleDevErrors(error, res)


    if (process.env.NODE_ENV === "production") {
        let err = { ...error, message: error.message, name: error.name }

        if (err.name === 'CastError') err = handleCastErrorDB(err);
        if (err.code === 11000) err = handleDuplicateFieldsDB(err);
        if (err.name === 'ValidationError' || err.name === "ValidatorError")
            err = handleValidationErrorDB(err);
        if (err.name === 'JsonWebTokenError') err = handleJWTError();
        if (err.name === 'TokenExpiredError') err = handleJWTExpiredError();

        handleProdErrors(err, res)
    }
}


function handleDevErrors(error, res) {
    res.status(error.statusCode).json({ status: error.status, message: error.message, stack: error.stack, error })
}

function handleProdErrors(error, res) {
    if (error.isOperational) {
        return res.status(error.statusCode).json({ status: error.status, message: error.message, errors: error.errors })
    }

    console.log(error.name)
    console.log(error)
    res.status(error.statusCode).json({ status: error.status, message: "Something went really wrong please try again" })

}

module.exports = globalErrorHandler