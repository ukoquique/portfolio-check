/**
 * Error Handler Module
 * Provides centralized error handling functionality for the application
 */

// Configuration for error handling
const errorConfig = {
    // Whether to log errors to console
    enableConsoleLogging: true,
    
    // Whether to show user-friendly error messages
    showUserFriendlyMessages: true,
    
    // Default error message to show users
    defaultErrorMessage: 'Something went wrong. Please try again later.',
    
    // Error types and their user-friendly messages
    errorMessages: {
        'network': 'Network error. Please check your connection and try again.',
        'api': 'Server error. Please try again later.',
        'validation': 'Please check your input and try again.',
        'auth': 'Authentication error. Please log in again.',
        'notFound': 'The requested resource was not found.',
        'timeout': 'Request timed out. Please try again.',
        'unknown': 'An unexpected error occurred. Please try again later.'
    },
    
    // Error severity levels
    severityLevels: {
        INFO: 'info',
        WARNING: 'warning',
        ERROR: 'error',
        CRITICAL: 'critical'
    }
};

/**
 * Creates a standardized error object with additional metadata
 * @param {string} message - Error message
 * @param {string} type - Error type (network, api, validation, etc.)
 * @param {string} severity - Error severity level
 * @param {*} originalError - Original error object or data
 * @returns {Object} Standardized error object
 */
export const createError = (message, type = 'unknown', severity = errorConfig.severityLevels.ERROR, originalError = null) => {
    const timestamp = new Date().toISOString();
    
    return {
        message,
        type,
        severity,
        timestamp,
        originalError,
        userMessage: errorConfig.errorMessages[type] || errorConfig.defaultErrorMessage
    };
};

/**
 * Handles an error by logging it and optionally showing a user-friendly message
 * @param {Object|Error} error - Error object to handle
 * @param {Function} [notifyUser] - Function to notify the user (optional)
 * @returns {Object} The standardized error object
 */
export const handleError = (error, notifyUser = null) => {
    // Convert to standardized error if needed
    const standardError = error.type ? error : createError(
        error.message || String(error),
        'unknown',
        errorConfig.severityLevels.ERROR,
        error
    );
    
    // Log error to console if enabled
    if (errorConfig.enableConsoleLogging) {
        console.error(`[${standardError.severity.toUpperCase()}] [${standardError.timestamp}]`, standardError.message);
        
        if (standardError.originalError) {
            console.error('Original error:', standardError.originalError);
        }
    }
    
    // Show user-friendly message if enabled and notifyUser function is provided
    if (errorConfig.showUserFriendlyMessages && typeof notifyUser === 'function') {
        notifyUser(standardError.userMessage, 'error');
    }
    
    return standardError;
};

/**
 * Creates an async error handler that wraps a function in a try-catch block
 * @param {Function} fn - Async function to wrap
 * @param {Function} [notifyUser] - Function to notify the user (optional)
 * @param {Object} [options] - Additional options
 * @returns {Function} Wrapped function with error handling
 */
export const createAsyncErrorHandler = (fn, notifyUser = null, options = {}) => {
    return async (...args) => {
        try {
            return await fn(...args);
        } catch (error) {
            const errorType = options.errorType || 'unknown';
            const severity = options.severity || errorConfig.severityLevels.ERROR;
            
            const standardError = handleError(
                createError(error.message || String(error), errorType, severity, error),
                notifyUser
            );
            
            // If a fallback value is provided, return it
            if ('fallbackValue' in options) {
                return options.fallbackValue;
            }
            
            // Re-throw the standardized error if specified
            if (options.rethrow) {
                throw standardError;
            }
            
            return null;
        }
    };
};

/**
 * Global error event handler for uncaught errors
 * @param {Function} notifyUser - Function to notify the user
 */
export const setupGlobalErrorHandler = (notifyUser) => {
    // Handle uncaught exceptions
    window.addEventListener('error', (event) => {
        const error = createError(
            event.message || 'Uncaught error',
            'unknown',
            errorConfig.severityLevels.CRITICAL,
            event.error
        );
        
        handleError(error, notifyUser);
        
        // Prevent default browser error handling
        event.preventDefault();
    });
    
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
        const error = createError(
            event.reason?.message || 'Unhandled promise rejection',
            'unknown',
            errorConfig.severityLevels.CRITICAL,
            event.reason
        );
        
        handleError(error, notifyUser);
        
        // Prevent default browser error handling
        event.preventDefault();
    });
};

export default {
    createError,
    handleError,
    createAsyncErrorHandler,
    setupGlobalErrorHandler,
    errorConfig
};
