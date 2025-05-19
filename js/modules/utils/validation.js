/**
 * Validation Module
 * Centralizes all validation logic for the application
 */

/**
 * Validates email format using a comprehensive regex pattern
 * @param {string} email - Email to validate
 * @returns {boolean} Whether the email is valid
 */
export const isValidEmail = (email) => {
    if (!email) return false;
    
    // RFC 5322 compliant email regex
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(String(email).toLowerCase());
};

/**
 * Validates form data
 * @param {Object} formData - Form data to validate
 * @returns {Object} Validation result { isValid, errors }
 */
export const validateFormData = (formData) => {
    const errors = {};
    
    // Check for required fields
    if (!formData.name || formData.name.trim() === '') {
        errors.name = 'Name is required';
    }
    
    if (!formData.email || formData.email.trim() === '') {
        errors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
        errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.message || formData.message.trim() === '') {
        errors.message = 'Message is required';
    } else if (formData.message.length < 10) {
        errors.message = 'Message must be at least 10 characters long';
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

/**
 * Validates form data and shows notifications for errors
 * @param {Object} formData - Form data to validate
 * @param {Function} showNotification - Function to display notifications
 * @returns {boolean} Whether the form data is valid
 */
export const validateFormWithNotifications = (formData, showNotification) => {
    const { isValid, errors } = validateFormData(formData);
    
    if (!isValid && showNotification) {
        // Show the first error as a notification
        const firstError = Object.values(errors)[0];
        showNotification(firstError, 'error');
    }
    
    return isValid;
};
