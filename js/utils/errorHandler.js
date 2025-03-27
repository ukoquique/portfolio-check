/**
 * Client-side error handling utilities
 * Provides consistent error handling across the application
 */
import notificationSystem from '../notifications.js';

/**
 * Custom application error class
 */
export class AppError extends Error {
    constructor(message, code = 'UNKNOWN_ERROR', data = null) {
        super(message);
        this.name = 'AppError';
        this.code = code;
        this.data = data;
        
        // Capture stack trace
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, AppError);
        }
    }
}

/**
 * Handles errors consistently across the application
 * @param {Error} error - The error to handle
 * @param {Object} options - Error handling options
 * @returns {void}
 */
export function handleError(error, options = {}) {
    const {
        silent = false,
        notificationId = null,
        logToConsole = true,
        defaultMessage = 'An unexpected error occurred'
    } = options;
    
    // Log to console if enabled
    if (logToConsole) {
        console.error('Error:', error);
    }
    
    // Get appropriate error message
    const errorMessage = error.message || defaultMessage;
    
    // Show notification if not silent
    if (!silent) {
        if (notificationId) {
            notificationSystem.update(
                notificationId,
                `Error: ${errorMessage}`,
                'error',
                'fas fa-exclamation-circle'
            );
        } else {
            notificationSystem.show(
                `Error: ${errorMessage}`,
                'error',
                'fas fa-exclamation-circle'
            );
        }
    }
    
    // Return the error for further handling if needed
    return error;
}

/**
 * Creates a safe wrapper around async functions to handle errors consistently
 * @param {Function} fn - The async function to wrap
 * @param {Object} options - Error handling options
 * @returns {Function} - Wrapped function that handles errors
 */
export function createSafeAsyncHandler(fn, options = {}) {
    return async function safeAsyncHandler(...args) {
        try {
            return await fn(...args);
        } catch (error) {
            return handleError(error, options);
        }
    };
}

export default {
    AppError,
    handleError,
    createSafeAsyncHandler
};
