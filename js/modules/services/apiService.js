/**
 * API Service Module
 * Centralizes all API calls in one place for better maintainability and testability
 * Implements consistent error handling, response formatting, and request management
 */

import { validateFormData } from '../utils/validation.js';
import { createError, handleError } from '../utils/errorHandler.js';
import { handleFetchError, createFetchWithErrorHandling as createFetchWrapper } from '../utils/errorBridge.js';

/**
 * API Configuration
 * Contains API-related configuration settings
 */
const apiConfig = {
    baseUrl: '', // Empty for same-origin requests
    defaultHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    timeout: 10000, // 10 seconds
    retryAttempts: 1,
    endpoints: {
        contactForm: '/api/contact',
        launchEcosystem: '/api/launch-ecosystem',
        launchCodeProcessor: '/api/launch-code-processor'
    }
};

/**
 * Request timeout handler
 * @param {number} ms - Timeout in milliseconds
 * @returns {Promise} - Promise that rejects after specified timeout
 */
const timeoutPromise = (ms) => {
    return new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error(`Request timed out after ${ms}ms`));
        }, ms);
    });
};

/**
 * Handles API responses consistently
 * @param {Response} response - Fetch API response
 * @returns {Promise} - Resolved with response JSON or rejected with error
 */
const handleResponse = async (response) => {
    if (!response.ok) {
        // Use the error bridge to handle fetch errors consistently
        const error = await handleFetchError(response);
        throw error;
    }
    
    // Parse JSON response or return empty object if no content
    if (response.status === 204) {
        return { success: true };
    }
    
    try {
        return await response.json();
    } catch (error) {
        // Use handleError for consistent logging
        const parseError = createError(
            'Failed to parse JSON response', 
            'unknown', 
            'warning', 
            { responseStatus: response.status, responseUrl: response.url }
        );
        handleError(parseError);
        
        return { 
            success: true, 
            warning: 'Response could not be parsed as JSON',
            timestamp: new Date().toISOString()
        };
    }
};

/**
 * Makes a fetch request with standardized error handling
 * @param {string} url - API endpoint URL
 * @param {Object} options - Fetch options
 * @param {Object} retryOptions - Options for retry mechanism
 * @returns {Promise} - Promise resolving to API response
 */
const fetchWithErrorHandling = async (url, options = {}, retryOptions = {}) => {
    // Use the createFetchWrapper from errorBridge to create a fetch function with consistent error handling
    const enhancedFetch = createFetchWrapper(fetch, {
        notifyUser: options.notifyUser
    });
    
    const { retries = apiConfig.retryAttempts, retryDelay = 1000 } = retryOptions;
    let lastError = null;
    
    // Construct the full URL with base URL if provided
    const fullUrl = apiConfig.baseUrl ? `${apiConfig.baseUrl}${url}` : url;
    
    // Combine default headers with custom headers
    const headers = {
        ...apiConfig.defaultHeaders,
        ...(options.headers || {})
    };
    
    // Create the request function to execute
    const executeRequest = async (attempt = 0) => {
        try {
            // Race the fetch against a timeout
            const controller = new AbortController();
            const { signal } = controller;
            
            // Add signal to options if not already present
            const fetchOptions = {
                ...options,
                headers,
                signal
            };
            
            const timeoutId = setTimeout(() => controller.abort(), apiConfig.timeout);
            
            try {
                const response = await Promise.race([
                    enhancedFetch(fullUrl, fetchOptions),
                    timeoutPromise(apiConfig.timeout)
                ]);
                
                clearTimeout(timeoutId);
                return await handleResponse(response);
            } finally {
                clearTimeout(timeoutId);
            }
        } catch (error) {
            // Handle abort errors (timeout)
            if (error.name === 'AbortError') {
                throw createError(
                    `Request to ${url} timed out after ${apiConfig.timeout}ms`,
                    'timeout',
                    'error',
                    { url, timeout: apiConfig.timeout }
                );
            }
            
            // If we have retries left, try again after delay
            if (attempt < retries) {
                lastError = error;
                
                // Log retry attempt
                console.info(`Retrying request to ${url} (attempt ${attempt + 1} of ${retries})`);
                
                // Wait for the retry delay
                await new Promise(resolve => setTimeout(resolve, retryDelay));
                
                // Exponential backoff for retry delay
                return executeRequest(attempt + 1);
            }
            
            // No more retries, throw the error
            throw error;
        }
    };
    
    return executeRequest();
};

// Validation functions moved to utils/validation.js

/**
 * API service object with methods for different API endpoints
 */
const apiService = {
    /**
     * Launches the ecosystem simulation
     * @returns {Promise} - Promise resolving to API response with success message
     */
    launchEcosystemSimulation() {
        return fetchWithErrorHandling(apiConfig.endpoints.launchEcosystem, {
            method: 'POST'
        })
        .then(response => {
            // Ensure response has a consistent format with explicit success message
            return {
                success: true,
                message: 'Ecosystem Simulation launched successfully!',
                ...response
            };
        })
        .catch(error => {
            // Use the centralized error handling
            const enhancedError = createError(
                'Failed to launch ecosystem simulation',
                'api',
                'error',
                error
            );
            handleError(enhancedError);
            throw enhancedError;
        });
    },
    
    /**
     * Launches the Code Processor Python application
     * @returns {Promise} - Promise resolving to API response with success message
     */
    launchCodeProcessor() {
        return fetchWithErrorHandling(apiConfig.endpoints.launchCodeProcessor, {
            method: 'POST'
        })
        .then(response => {
            // Ensure response has a consistent format with explicit success message
            return {
                success: true,
                message: 'Code Processor launched successfully!',
                ...response
            };
        })
        .catch(error => {
            // Use the centralized error handling
            const enhancedError = createError(
                'Failed to launch Code Processor',
                'api',
                'error',
                error
            );
            handleError(enhancedError);
            throw enhancedError;
        });
    },
    
    /**
     * Submits contact form data
     * @param {Object} formData - Form data object
     * @returns {Promise} - Promise resolving to API response
     */
    submitContactForm(formData) {
        // Validate form data
        const validation = validateFormData(formData);
        if (!validation.isValid) {
            const validationError = createError(
                Object.values(validation.errors)[0],
                'validation',
                'warning',
                { formData, errors: validation.errors }
            );
            handleError(validationError);
            return Promise.reject(validationError);
        }

        // For now, this is a mock implementation
        // In a real application, this would be a real API call
        return new Promise((resolve, reject) => {
            // Simulate API call with setTimeout
            setTimeout(() => {
                try {
                    // Simulate successful response
                    resolve({ 
                        success: true,
                        message: 'Your message has been sent successfully!' 
                    });
                } catch (error) {
                    const apiError = createError(
                        'Failed to send message',
                        'api',
                        'error',
                        error
                    );
                    handleError(apiError);
                    reject(apiError);
                }
            }, 1000);
            
            // Real implementation would use fetchWithErrorHandling
            /*
            return fetchWithErrorHandling(apiConfig.endpoints.contactForm, {
                method: 'POST',
                body: JSON.stringify(formData)
            });
            */
        });
    },
    
    /**
     * Generic method to make GET requests
     * @param {string} endpoint - API endpoint URL
     * @param {Object} queryParams - Query parameters
     * @returns {Promise} - Promise resolving to API response
     */
    get(endpoint, queryParams = {}) {
        // Build query string
        const queryString = Object.entries(queryParams)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');
        
        const url = queryString ? `${endpoint}?${queryString}` : endpoint;
        
        return fetchWithErrorHandling(url, {
            method: 'GET'
        });
    },
    
    /**
     * Generic method to make POST requests
     * @param {string} endpoint - API endpoint URL
     * @param {Object} data - Request data
     * @returns {Promise} - Promise resolving to API response
     */
    post(endpoint, data = {}) {
        return fetchWithErrorHandling(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },
    
    /**
     * Generic method to make PUT requests
     * @param {string} endpoint - API endpoint URL
     * @param {Object} data - Request data
     * @returns {Promise} - Promise resolving to API response
     */
    put(endpoint, data = {}) {
        return fetchWithErrorHandling(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },
    
    /**
     * Generic method to make DELETE requests
     * @param {string} endpoint - API endpoint URL
     * @returns {Promise} - Promise resolving to API response
     */
    delete(endpoint) {
        return fetchWithErrorHandling(endpoint, {
            method: 'DELETE'
        });
    }
};

export default apiService;
export { handleResponse, apiConfig, fetchWithErrorHandling };
