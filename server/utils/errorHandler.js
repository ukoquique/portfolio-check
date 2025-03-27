/**
 * Custom error classes for better error handling
 */
class AppError extends Error {
    constructor(message, statusCode, errorCode) {
        super(message);
        this.statusCode = statusCode || 500;
        this.errorCode = errorCode || 'INTERNAL_ERROR';
        this.isOperational = true;
        
        Error.captureStackTrace(this, this.constructor);
    }
}

class NotFoundError extends AppError {
    constructor(message) {
        super(message || 'Resource not found', 404, 'NOT_FOUND');
    }
}

class ValidationError extends AppError {
    constructor(message) {
        super(message || 'Validation failed', 400, 'VALIDATION_ERROR');
    }
}

class ServerError extends AppError {
    constructor(message) {
        super(message || 'Internal server error', 500, 'SERVER_ERROR');
    }
}

class FileError extends AppError {
    constructor(message, errorCode) {
        super(message || 'File operation failed', 500, errorCode || 'FILE_ERROR');
    }
}

/**
 * Maps Node.js error codes to custom error types
 * @param {Error} error - Original error
 * @returns {AppError} - Converted application error
 */
const mapNodeErrorToAppError = (error) => {
    const errorMap = {
        ENOENT: () => new NotFoundError(`File not found: ${error.path}`),
        EACCES: () => new FileError(`Permission denied: ${error.path}`, 'PERMISSION_DENIED'),
        EADDRINUSE: () => new ServerError(`Port already in use: ${error.port}`),
        ECONNREFUSED: () => new ServerError('Connection refused'),
        ETIMEDOUT: () => new ServerError('Connection timed out'),
        ENOTFOUND: () => new ServerError('DNS lookup failed')
    };
    
    const errorFactory = errorMap[error.code];
    if (errorFactory) {
        const appError = errorFactory();
        appError.originalError = error;
        return appError;
    }
    
    // Default case - wrap in ServerError
    const serverError = new ServerError(error.message);
    serverError.originalError = error;
    return serverError;
};

/**
 * Handles errors in HTTP responses
 * @param {Error} error - Error to handle
 * @param {http.ServerResponse} res - HTTP response object
 * @param {Object} logger - Logger instance
 */
const handleHttpError = (error, res, logger) => {
    let appError = error;
    
    // Convert regular errors to AppError
    if (!(error instanceof AppError)) {
        appError = mapNodeErrorToAppError(error);
    }
    
    // Log the error with appropriate level
    const logLevel = appError.statusCode >= 500 ? 'error' : 'warn';
    logger(logLevel, appError.message, {
        statusCode: appError.statusCode,
        errorCode: appError.errorCode,
        stack: appError.stack,
        originalError: appError.originalError ? {
            message: appError.originalError.message,
            code: appError.originalError.code
        } : undefined
    });
    
    // Send appropriate response based on content type expectations
    const acceptHeader = res.req ? res.req.headers.accept : '';
    
    if (acceptHeader && acceptHeader.includes('application/json')) {
        res.writeHead(appError.statusCode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            error: appError.errorCode,
            message: appError.message,
            statusCode: appError.statusCode
        }));
    } else {
        // HTML response for browser requests
        res.writeHead(appError.statusCode, { 'Content-Type': 'text/html' });
        
        if (appError.statusCode === 404) {
            res.end(`
                <html>
                    <head><title>404 - Not Found</title></head>
                    <body>
                        <h1>404 - Not Found</h1>
                        <p>${appError.message}</p>
                        <a href="/">Go to Home</a>
                    </body>
                </html>
            `);
        } else {
            res.end(`
                <html>
                    <head><title>Error ${appError.statusCode}</title></head>
                    <body>
                        <h1>Error ${appError.statusCode}</h1>
                        <p>${appError.message}</p>
                        <a href="/">Go to Home</a>
                    </body>
                </html>
            `);
        }
    }
};

/**
 * Sets up global error handlers for uncaught exceptions and unhandled rejections
 * @param {Object} logger - Logger instance
 */
const setupGlobalErrorHandlers = (logger) => {
    process.on('uncaughtException', (error) => {
        logger('error', 'UNCAUGHT EXCEPTION', { 
            error: error.message,
            stack: error.stack
        });
        
        // Give the logger time to write before exiting
        setTimeout(() => {
            process.exit(1);
        }, 100);
    });
    
    process.on('unhandledRejection', (reason, promise) => {
        logger('error', 'UNHANDLED REJECTION', { 
            reason: reason instanceof Error ? reason.message : reason,
            stack: reason instanceof Error ? reason.stack : undefined
        });
    });
};

module.exports = {
    AppError,
    NotFoundError,
    ValidationError,
    ServerError,
    FileError,
    mapNodeErrorToAppError,
    handleHttpError,
    setupGlobalErrorHandlers
};
