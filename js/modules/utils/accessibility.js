/**
 * Accessibility Module
 * Provides utilities for enhancing web accessibility
 */

import { isFeatureEnabled } from '../config/appConfig.js';
import { createError, handleError } from '../utils/errorHandler.js';

/**
 * Adds keyboard navigation to interactive elements
 * @param {HTMLElement} container - Container element to enhance
 */
export const enhanceKeyboardNavigation = (container = document) => {
    // Check if accessibility features are enabled
    if (!isFeatureEnabled('accessibilityFeatures')) {
        return;
    }
    
    try {
        // Enhance all interactive elements that might not be naturally focusable
        const interactiveElements = container.querySelectorAll('.project-card, .card-link:not(a), [role="button"]');
        
        interactiveElements.forEach(element => {
            // Skip elements that already have keyboard handlers
            if (element.getAttribute('data-keyboard-enhanced') === 'true') {
                return;
            }
            
            // Ensure the element is focusable
            if (!element.getAttribute('tabindex')) {
                element.setAttribute('tabindex', '0');
            }
            
            // Add keyboard event listener for Enter and Space keys
            element.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    element.click();
                }
            });
            
            // Mark as enhanced to avoid duplicate handlers
            element.setAttribute('data-keyboard-enhanced', 'true');
        });
    } catch (error) {
        handleError(createError('Error enhancing keyboard navigation', 'accessibility', 'error', error));
    }
};

/**
 * Adds ARIA attributes to improve screen reader support
 * @param {HTMLElement} container - Container element to enhance
 */
export const enhanceAriaAttributes = (container = document) => {
    // Check if accessibility features are enabled
    if (!isFeatureEnabled('accessibilityFeatures')) {
        return;
    }
    
    try {
        // Project cards
        const projectCards = container.querySelectorAll('.project-card');
        projectCards.forEach((card, index) => {
            const title = card.querySelector('.card-title');
            const titleText = title ? title.textContent : `Project ${index + 1}`;
            
            // Set appropriate ARIA attributes
            if (!card.getAttribute('aria-label')) {
                card.setAttribute('aria-label', `Project: ${titleText}`);
            }
            
            if (!card.getAttribute('role')) {
                card.setAttribute('role', 'article');
            }
        });
        
        // Navigation
        const nav = container.querySelector('nav');
        if (nav && !nav.getAttribute('aria-label')) {
            nav.setAttribute('aria-label', 'Main Navigation');
            nav.setAttribute('role', 'navigation');
        }
        
        // Sections
        const sections = container.querySelectorAll('section');
        sections.forEach(section => {
            const heading = section.querySelector('h2, h3');
            if (heading && !section.getAttribute('aria-labelledby')) {
                // Create an ID for the heading if it doesn't have one
                if (!heading.id) {
                    heading.id = `heading-${heading.textContent.toLowerCase().replace(/\s+/g, '-')}`;
                }
                
                section.setAttribute('aria-labelledby', heading.id);
            }
        });
        
        // Buttons and links
        const buttons = container.querySelectorAll('button, .card-link');
        buttons.forEach(button => {
            // Add aria-label if there's an icon but no text
            const hasIcon = button.querySelector('i, svg');
            const hasText = Array.from(button.childNodes).some(node => 
                node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== ''
            );
            
            if (hasIcon && !hasText && !button.getAttribute('aria-label')) {
                const iconClass = button.querySelector('i, svg').className;
                let label = '';
                
                if (iconClass.includes('github')) label = 'View Code on GitHub';
                else if (iconClass.includes('play')) label = 'Launch Demo';
                else if (iconClass.includes('info')) label = 'View Project Overview';
                else if (iconClass.includes('link')) label = 'Visit Project Website';
                else label = 'Project Action';
                
                button.setAttribute('aria-label', label);
            }
        });
    } catch (error) {
        handleError(createError('Error enhancing ARIA attributes', 'accessibility', 'error', error));
    }
};

/**
 * Manages focus for modal dialogs and other interactive elements
 * @param {HTMLElement} modalElement - The modal element
 * @param {HTMLElement} triggerElement - The element that triggered the modal
 */
export const setupFocusTrap = (modalElement, triggerElement) => {
    if (!modalElement) return null;
    
    try {
        // Find all focusable elements within the modal
        const focusableElements = modalElement.querySelectorAll(
            'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return null;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        // Set initial focus to the first focusable element
        firstElement.focus();
        
        // Create event handler for tab key
        const handleTabKey = (event) => {
            if (event.key !== 'Tab') return;
            
            // Shift + Tab
            if (event.shiftKey) {
                if (document.activeElement === firstElement) {
                    event.preventDefault();
                    lastElement.focus();
                }
            } 
            // Tab
            else {
                if (document.activeElement === lastElement) {
                    event.preventDefault();
                    firstElement.focus();
                }
            }
        };
        
        // Add event listener
        modalElement.addEventListener('keydown', handleTabKey);
        
        // Return cleanup function
        return {
            cleanup: () => {
                modalElement.removeEventListener('keydown', handleTabKey);
                
                // Return focus to the trigger element when modal closes
                if (triggerElement && typeof triggerElement.focus === 'function') {
                    triggerElement.focus();
                }
            },
            // Expose method to set focus to first element
            focusFirst: () => firstElement.focus()
        };
    } catch (error) {
        handleError(createError('Error setting up focus trap', 'accessibility', 'error', error));
        return null;
    }
};

/**
 * Initializes all accessibility enhancements
 * @param {HTMLElement} container - Container element to enhance
 */
export const initAccessibility = (container = document) => {
    // Check if accessibility features are enabled
    if (!isFeatureEnabled('accessibilityFeatures')) {
        return;
    }
    
    enhanceKeyboardNavigation(container);
    enhanceAriaAttributes(container);
    
    // Add skip to content link if it doesn't exist
    if (!document.querySelector('.skip-to-content')) {
        const skipLink = document.createElement('a');
        skipLink.className = 'skip-to-content';
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to content';
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Add id to main content if it doesn't exist
        const mainContent = document.querySelector('main');
        if (mainContent && !mainContent.id) {
            mainContent.id = 'main-content';
        }
    }
};

export default {
    enhanceKeyboardNavigation,
    enhanceAriaAttributes,
    setupFocusTrap,
    initAccessibility
};
