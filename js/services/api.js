/**
 * API Service
 * Centralizes all API calls in one place for better maintainability
 */

/**
 * Handles API errors consistently
 * @param {Response} response - Fetch API response
 * @returns {Promise} - Resolved with response JSON or rejected with error
 */
const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        error.status = response.status;
        error.data = errorData;
        throw error;
    }
    
    return response.json();
};

/**
 * API service object with methods for different API endpoints
 */
const apiService = {
    /**
     * Launches the ecosystem simulation
     * @returns {Promise} - Promise resolving to API response
     */
    launchEcosystemSimulation() {
        return fetch('/api/launch-ecosystem', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(handleResponse);
    },
    
    /**
     * Submits contact form data
     * @param {Object} formData - Form data object
     * @returns {Promise} - Promise resolving to API response
     */
    submitContactForm(formData) {
        // For now, this is a mock implementation
        // In a real application, this would be a real API call
        return new Promise((resolve, reject) => {
            // Validate form data
            if (!formData.name || !formData.email || !formData.message) {
                reject(new Error('Please fill in all required fields'));
                return;
            }
            
            // Simulate API call with setTimeout
            setTimeout(() => {
                resolve({ message: 'Your message has been sent successfully!' });
            }, 1000);
        });
    }
};

export default apiService;
