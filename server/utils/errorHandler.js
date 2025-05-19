/**
 * Error Handler Module - Server Side
 * 
 * This module provides centralized error handling functionality for the server.
 * It implements a comprehensive error handling system with custom error classes,
 * standardized error responses, and consistent error logging.
 * 
 * Key features:
 * - Custom error classes with appropriate HTTP status codes
 * - Standardized error response format for both JSON and HTML
 * - Error mapping from Node.js errors to application errors
 * - Consistent error logging with appropriate severity levels
 * - Enhanced error pages with improved styling
 * - Global error handlers for uncaught exceptions
 * 
 * This module works in conjunction with the client-side errorHandler.js and
 * errorBridge.js to create a unified error handling system.
 * 
 * @module server/utils/errorHandler
 */

// Configuration for error handling
const errorConfig = {
    // Whether to log detailed errors
    enableDetailedLogging: true,
    
    // Default error messages by status code
    defaultMessages: {
        400: 'Bad request',
        401: 'Unauthorized',
        403: 'Forbidden',
        404: 'Not found',
        500: 'Internal server error',
        503: 'Service unavailable'  
    },
    
    // Error severity levels (matching client-side)
    severityLevels: {
        INFO: 'info',
        WARNING: 'warning',
        ERROR: 'error',
        CRITICAL: 'critical'
    }
};

/**
 * Custom error classes for better error handling
 */
class AppError extends Error {
    constructor(message, statusCode, errorCode) {
        super(message);
        this.statusCode = statusCode || 500;
        this.errorCode = errorCode || 'INTERNAL_ERROR';
        this.isOperational = true;
        this.timestamp = new Date().toISOString();
        this.severity = statusCode >= 500 ? 
            errorConfig.severityLevels.ERROR : 
            errorConfig.severityLevels.WARNING;
        
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
 * Creates a standardized error response object
 * @param {AppError} appError - Application error object
 * @returns {Object} Standardized error response
 */
const createErrorResponse = (appError) => {
    return {
        error: appError.errorCode,
        message: appError.message,
        statusCode: appError.statusCode,
        timestamp: appError.timestamp
    };
};

/**
 * Generates an HTML error page
 * @param {AppError} appError - Application error object
 * @returns {string} HTML content
 */
const generateErrorHtml = (appError) => {
    const isNotFound = appError.statusCode === 404;
    const title = isNotFound ? '404 - Not Found' : `Error ${appError.statusCode}`;
    const heading = isNotFound ? '404 - Not Found' : `Error ${appError.statusCode}`;
    
    return `
        <html>
            <head>
                <title>${title}</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 650px; margin: 0 auto; padding: 20px; }
                    h1 { color: #e74c3c; }
                    .error-container { border: 1px solid #ddd; padding: 20px; border-radius: 5px; }
                    .home-link { display: inline-block; margin-top: 20px; color: #3498db; text-decoration: none; }
                    .home-link:hover { text-decoration: underline; }
                </style>
            </head>
            <body>
                <div class="error-container">
                    <h1>${heading}</h1>
                    <p>${appError.message}</p>
                    <a class="home-link" href="/">Go to Home</a>
                </div>
            </body>
        </html>
    `;
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
    const logLevel = appError.severity === errorConfig.severityLevels.ERROR ? 'error' : 'warn';
    
    // Create structured log data
    const logData = {
        statusCode: appError.statusCode,
        errorCode: appError.errorCode,
        timestamp: appError.timestamp
    };
    
    // Add stack trace in development or if detailed logging is enabled
    if (errorConfig.enableDetailedLogging || process.env.NODE_ENV !== 'production') {
        logData.stack = appError.stack;
        
        if (appError.originalError) {
            logData.originalError = {
                message: appError.originalError.message,
                code: appError.originalError.code
            };
        }
    }
    
    // Log the error
    logger(logLevel, `[${appError.errorCode}] ${appError.message}`, logData);
    
    // Send appropriate response based on content type expectations
    const acceptHeader = res.req ? res.req.headers.accept : '';
    
    if (acceptHeader && acceptHeader.includes('application/json')) {
        // JSON response for API requests
        res.writeHead(appError.statusCode, { 
            'Content-Type': 'application/json',
            'X-Error-Code': appError.errorCode
        });
        res.end(JSON.stringify(createErrorResponse(appError)));
    } else {
        // HTML response for browser requests
        res.writeHead(appError.statusCode, { 
            'Content-Type': 'text/html',
            'X-Error-Code': appError.errorCode
        });
        res.end(generateErrorHtml(appError));
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
    setupGlobalErrorHandlers,
    errorConfig,
    createErrorResponse,
    generateErrorHtml
};
