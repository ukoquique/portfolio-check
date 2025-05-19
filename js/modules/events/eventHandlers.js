/**
 * Event Handlers Module
 * Contains event handling functions for the application
 */

import { Modal } from '../ui/Modal.js';
import notificationSystem from '../utils/notifications.js';
import { notificationConfig } from '../config/appConfig.js';
import * as businessLogic from '../business/businessLogic.js';
import apiService from '../services/apiService.js';
import { getProjectConfig } from '../data/projectData.js';
import { createError, handleError } from '../utils/errorHandler.js';
import { setupFocusTrap } from '../utils/accessibility.js';
import { validateFormWithNotifications } from '../utils/validation.js';

/**
 * Handle project overview display
 * @param {string} projectKey - Project key
 * @param {HTMLElement} triggerElement - Element that triggered the modal
 * @throws {Error} If projectKey is invalid or project not found
 */
export const handleProjectOverview = (projectKey, triggerElement) => {
    if (!projectKey) {
        handleError(createError('Missing project key for project overview', 'validation', 'warning'));
        return;
    }

    try {
        const projectConfig = getProjectConfig(projectKey);
        
        if (!projectConfig) {
            handleError(createError(`Invalid project key: ${projectKey}`, 'validation', 'warning'));
            return;
        }

        // Generate content based on project type and capabilities
        const content = businessLogic.generateProjectOverview(projectKey);
        
        // Create and show the modal
        const modal = new Modal({
            title: projectConfig.title,
            content: content,
            onOpen: () => {
                // Setup focus trap for keyboard navigation
                const focusTrap = setupFocusTrap(modal.element, triggerElement);
                
                // Store focus trap in modal instance for cleanup
                if (focusTrap) {
                    modal.focusTrap = focusTrap;
                }
            },
            onClose: () => {
                // Clean up focus trap
                if (modal.focusTrap && modal.focusTrap.cleanup) {
                    modal.focusTrap.cleanup();
                }
            }
        });
        
        modal.open();
    } catch (error) {
        handleError(createError('Error showing project overview', 'ui', 'error', error));
    }
};

/**
 * Generic handler for launching applications
 * @param {string} appName - Name of the application to launch
 * @param {Function} launchFunction - Function to call to launch the application
 * @returns {Promise} Promise resolving to launch result
 */
export const handleAppLaunch = (appName, launchFunction) => {
    // Create an initial notification with the info type
    const notification = notificationSystem.show(
        `Launching ${appName}...`, 
        'info', 
        notificationConfig.types.info.icon
    );
    
    // Short delay to ensure UI updates before starting the launch process
    return new Promise(resolve => setTimeout(resolve, 100))
        .then(() => launchFunction())
        .then(data => {
            // Update notification with success message and icon
            notificationSystem.update(
                notification, 
                data.message || `${appName} launched successfully!`, 
                'success', 
                notificationConfig.types.success.icon
            );
            return data;
        })
        .catch(error => {
            const errorMessage = error.userMessage || error.message || `Error launching ${appName}`;
            // Update notification with error message and icon
            notificationSystem.update(
                notification, 
                errorMessage, 
                'error', 
                notificationConfig.types.error.icon
            );
            throw error;
        });
};

/**
 * Handle ecosystem simulation launch
 * @returns {Promise} Promise resolving to launch result
 */
export const launchEcosystemSimulation = () => {
    return handleAppLaunch('Ecosystem Simulation', businessLogic.launchEcosystemSimulation);
};

/**
 * Handle Code Processor application launch
 * @returns {Promise} Promise resolving to launch result
 */
export const launchCodeProcessor = () => {
    return handleAppLaunch('Code Processor for AI', businessLogic.launchCodeProcessor);
};

/**
 * Handle mobile menu toggle
 * @param {HTMLElement} navLinks - Navigation links container
 * @param {HTMLElement} hamburger - Hamburger menu button
 */
export const handleMobileMenuToggle = (navLinks, hamburger) => {
    if (!navLinks || !hamburger) {
        handleError(createError('Missing required elements for mobile menu toggle', 'dom', 'warning'));
        return;
    }

    try {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
        
        // Update ARIA attributes
        const isExpanded = navLinks.classList.contains('active');
        hamburger.setAttribute('aria-expanded', isExpanded);
        navLinks.setAttribute('aria-hidden', !isExpanded);
    } catch (error) {
        handleError(createError('Error toggling mobile menu', 'ui', 'error', error));
    }
};

/**
 * Handle mobile menu link clicks
 * @param {Object} elements - DOM elements
 */
export const handleMobileMenuLinks = (elements) => {
    if (!elements || !elements.navLinksAnchors) {
        handleError(createError('Missing required elements for mobile menu links', 'dom', 'warning'));
        return;
    }

    const cleanup = () => {
        if (elements.hamburger && elements.navLinks) {
            elements.hamburger.classList.remove('active');
            elements.navLinks.classList.remove('active');
            elements.hamburger.setAttribute('aria-expanded', 'false');
            elements.navLinks.setAttribute('aria-hidden', 'true');
        }
    };

    elements.navLinksAnchors.forEach(link => {
        link.addEventListener('click', cleanup);
    });

    // Return cleanup function
    return () => {
        elements.navLinksAnchors.forEach(link => {
            link.removeEventListener('click', cleanup);
        });
    };
};

/**
 * Handle smooth scrolling
 * @param {NodeList} anchors - Anchor elements
 * @returns {Function} Cleanup function to remove event listeners
 */
export const handleSmoothScrolling = (anchors) => {
    if (!anchors || !anchors.length) {
        handleError(createError('No anchor elements found for smooth scrolling', 'dom', 'warning'));
        return () => {};
    }

    const scrollHandler = function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    };

    anchors.forEach(anchor => {
        anchor.addEventListener('click', scrollHandler);
    });

    // Return cleanup function
    return () => {
        anchors.forEach(anchor => {
            anchor.removeEventListener('click', scrollHandler);
        });
    };
};

/**
 * Handle contact form submission
 * @param {HTMLElement} form - Contact form element
 * @param {Object} formElements - Form input elements
 * @returns {Function} Cleanup function to remove event listeners
 */
export const handleContactForm = (form, formElements) => {
    if (!form || !formElements) {
        handleError(createError('Missing required elements for contact form', 'dom', 'warning'));
        return () => {};
    }

    const submitHandler = function(e) {
        e.preventDefault();
        
        const formData = {
            name: formElements.name.value,
            email: formElements.email.value,
            subject: formElements.subject.value,
            message: formElements.message.value
        };
        
        // Validate form data
        if (!validateFormData(formData)) {
            return;
        }
        
        businessLogic.submitContactForm(formData)
            .then(message => {
                notificationSystem.show(
                    message,
                    'success'
                );
                form.reset();
            })
            .catch(error => {
                // Use the user-friendly message from our enhanced error objects
                const errorMessage = error.userMessage || error.message || 'An error occurred';
                notificationSystem.show(
                    errorMessage,
                    'error'
                );
            });
    };

    form.addEventListener('submit', submitHandler);

    // Return cleanup function
    return () => {
        form.removeEventListener('submit', submitHandler);
    };
};

/**
 * Validate form data
 * @param {Object} formData - Form data to validate
 * @returns {boolean} Whether the form data is valid
 */
export const validateFormData = (formData) => {
    // Use the centralized validation module with notification support
    return validateFormWithNotifications(formData, (message, type) => {
        notificationSystem.show(message, type);
    });
};
