/**
 * Business Logic Module
 * Contains core business logic functions for the application
 */

import apiService from '../services/apiService.js';
import { isValidEmail, validateFormWithNotifications } from '../utils/validation.js';
import { getProjectConfig, getProjectByKey } from '../data/projectData.js';
import { isFeatureEnabled } from '../config/appConfig.js';
import { createError, handleError } from '../utils/errorHandler.js';

/**
 * Generate project overview content
 * @param {string} projectKey - Key of the project
 * @returns {string} HTML content for the modal
 * @throws {Error} If projectKey is invalid or project not found
 */
const generateProjectOverview = (projectKey) => {
    // Input validation
    if (!projectKey) {
        throw new Error('Invalid project key');
    }

    const project = getProjectConfig(projectKey);
    
    // Data validation
    if (!project || !project.overview || typeof project.overview !== 'object') {
        throw new Error('Invalid project overview data');
    }

    try {
        return `
            <div class="overview-section description-section">
                <h3>Project Overview</h3>
                <p>${escapeHtml(project.overview.description || 'No description available')}</p>
            </div>
            
            <div class="overview-section features-section">
                <h3>Key Features</h3>
                <ul>
                    ${generateListItems(project.overview.features)}
                </ul>
            </div>
            
            <div class="overview-section tech-section">
                <h3>Technologies Used</h3>
                <ul>
                    ${generateListItems(project.overview.technologies)}
                </ul>
            </div>
            
            <div class="overview-section instructions-section">
                <h3>How to Use</h3>
                <ol>
                    ${generateListItems(project.overview.instructions, true)}
                </ol>
            </div>
        `;
    } catch (error) {
        const standardError = handleError(createError('Error generating project overview', 'ui', 'error', error));
        throw standardError;
    }
};

/**
 * Generate HTML list items from an array
 * @param {Array} items - Array of items to convert to list items
 * @param {boolean} [isOrdered=false] - Whether to use ordered list items
 * @returns {string} HTML string of list items
 */
const generateListItems = (items, isOrdered = false) => {
    if (!Array.isArray(items) || items.length === 0) {
        return `<li>No items available</li>`;
    }

    return items
        .filter(item => typeof item === 'string')
        .map(item => `<li>${escapeHtml(item)}</li>`)
        .join('');
};

/**
 * Escape HTML special characters
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
const escapeHtml = (str) => {
    if (typeof str !== 'string') return '';
    
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
};

/**
 * Process form submission
 * @param {Object} formData - Form data object
 * @returns {Promise} Promise resolving to success or error message
 * @throws {Error} If formData is invalid
 */
const submitContactForm = (formData) => {
    // Basic input validation
    if (!formData || typeof formData !== 'object') {
        throw new Error('Invalid form data');
    }

    // Delegate to the API service for form submission and validation
    return apiService.submitContactForm(formData)
        .then(response => {
            // Extract the success message from the response
            return response.success ? response.message : 'Error submitting form';
        });
};

/**
 * Launch the ecosystem simulation
 * @returns {Promise} Promise resolving to launch result with standardized format
 * @throws {Error} If launch fails or feature is disabled
 */
const launchEcosystemSimulation = () => {
    // Check if the ecosystem simulation feature is enabled
    if (!isFeatureEnabled('ecosystemSimulation')) {
        return Promise.reject({
            success: false,
            message: 'Ecosystem Simulation is currently disabled',
            userMessage: 'This feature is currently unavailable. Please try again later.'
        });
    }
    
    // Delegate to the API service and ensure consistent response format
    return apiService.launchEcosystemSimulation()
        .then(response => {
            // Handle redirect response (for production environment)
            if (response.redirect) {
                // Open the redirect URL in a new tab
                window.open(response.redirect, '_blank');
            }
            
            // Ensure we have a standardized response format
            return {
                success: true,
                message: response.message || 'Ecosystem Simulation launched successfully!',
                ...response
            };
        });
};

/**
 * Launch the Code Processor Python application
 * @returns {Promise} Promise resolving to launch result with standardized format
 * @throws {Error} If launch fails or feature is disabled
 */
const launchCodeProcessor = () => {
    // Check if the Code Processor feature is enabled
    if (!isFeatureEnabled('codeProcessor')) {
        return Promise.reject({
            success: false,
            message: 'Code Processor is currently disabled',
            userMessage: 'This feature is currently unavailable. Please try again later.'
        });
    }
    
    // Delegate to the API service and ensure consistent response format
    return apiService.launchCodeProcessor()
        .then(response => {
            // Ensure we have a standardized response format
            return {
                success: true,
                message: response.message || 'Code Processor launched successfully!',
                ...response
            };
        });
};

/**
 * Validate form data and show notifications for errors
 * @param {Object} formData - Form data to validate
 * @param {Function} showNotification - Function to display notifications
 * @returns {boolean} Whether the form data is valid
 */
const validateFormData = (formData, showNotification) => {
    return validateFormWithNotifications(formData, showNotification);
};

export {
    generateProjectOverview,
    generateListItems,
    escapeHtml,
    submitContactForm,
    launchEcosystemSimulation,
    launchCodeProcessor,
    validateFormData,
    isValidEmail,
    isFeatureEnabled
};
