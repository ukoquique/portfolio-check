/**
 * Error Bridge Module
 * 
 * This module provides a bridge between server-side and client-side error handling
 * to ensure consistent error handling throughout the application. It translates
 * server-side error responses into client-side error objects with consistent structure.
 * 
 * Key features:
 * - Server-to-client error mapping with consistent format
 * - HTTP status code to error type/severity mapping
 * - Enhanced fetch error handling with improved user feedback
 * - Fetch wrapper with built-in error handling
 * 
 * This module works in conjunction with both the server-side errorHandler.js and
 * the client-side errorHandler.js to create a unified error handling system.
 * 
 * @module utils/errorBridge
 */

import { createError, handleError } from './errorHandler.js';

/**
 * Maps server error responses to client-side error objects
 * @param {Object} serverError - Server error response object
 * @returns {Object} - Client-side error object
 */
export const mapServerErrorToClientError = (serverError) => {
    // Extract relevant information from server error
    const {
        error: errorCode = 'unknown',
        message = 'An unknown error occurred',
        statusCode = 500
    } = serverError || {};
    
    // Map status code to severity
    let severity;
    if (statusCode >= 500) {
        severity = 'error';
    } else if (statusCode >= 400) {
        severity = 'warning';
    } else {
        severity = 'info';
    }
    
    // Map status code to error type
    let type;
    switch (statusCode) {
        case 400:
            type = 'validation';
            break;
        case 401:
        case 403:
            type = 'auth';
            break;
        case 404:
            type = 'notFound';
            break;
        case 408:
            type = 'timeout';
            break;
        case 500:
        case 502:
        case 503:
        case 504:
            type = 'api';
            break;
        default:
            type = 'unknown';
    }
    
    // Create a client-side error object
    return createError(
        message,
        type,
        severity,
        { serverErrorCode: errorCode, statusCode }
    );
};

/**
 * Handles a fetch response error
 * @param {Response} response - Fetch API response object
 * @returns {Promise<Object>} - Promise that resolves to the error object
 */
export const handleFetchError = async (response) => {
    try {
        // Try to parse the error response as JSON
        const errorData = await response.json();
        return mapServerErrorToClientError({
            ...errorData,
            statusCode: response.status
        });
    } catch (error) {
        // If parsing fails, create a generic error
        return createError(
            `Request failed with status: ${response.status}`,
            'network',
            'error',
            { statusCode: response.status }
        );
    }
};

/**
 * Creates an async fetch wrapper with consistent error handling
 * @param {Function} fetchFn - The fetch function to wrap
 * @param {Object} options - Options for error handling
 * @returns {Function} - Wrapped fetch function with error handling
 */
export const createFetchWithErrorHandling = (fetchFn, options = {}) => {
    return async (...args) => {
        try {
            const response = await fetchFn(...args);
            
            if (!response.ok) {
                const error = await handleFetchError(response);
                return handleError(error, options.notifyUser);
            }
            
            return response;
        } catch (error) {
            // Handle network errors
            const networkError = createError(
                error.message || 'Network error',
                'network',
                'error',
                error
            );
            return handleError(networkError, options.notifyUser);
        }
    };
};

export default {
    mapServerErrorToClientError,
    handleFetchError,
    createFetchWithErrorHandling
};
