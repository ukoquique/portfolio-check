import { notificationConfig } from './modules/config/appConfig.js';
import notificationSystem from './modules/utils/notifications.js';
import * as businessLogicModule from './modules/business/businessLogic.js';
import * as uiComponentsModule from './modules/ui/uiComponents.js';
import * as eventHandlersModule from './modules/events/eventHandlers.js';
import { initLazyLoading } from './modules/utils/lazyLoading.js';
import { setupGlobalErrorHandler } from './modules/utils/errorHandler.js';
import { initAccessibility } from './modules/utils/accessibility.js';

// Direct imports from modules - no need for compatibility wrappers

// ===== Initialization =====
document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements - comprehensive caching to avoid redundant queries
    const domElements = {
        // Navigation elements
        currentYear: document.getElementById('current-year'),
        hamburger: document.querySelector('.hamburger'),
        navLinks: document.querySelector('.nav-links'),
        navLinksAnchors: document.querySelectorAll('.nav-links a'),
        anchors: document.querySelectorAll('a[href^="#"]'),
        
        // Project grid elements
        projectsGrid: document.querySelector('.projects-grid'),
        commercialGrid: document.querySelector('.commercial-grid'),
        teamGrid: document.querySelector('.team-grid'),
        
        // Form elements - cache all form inputs to avoid redundant queries
        contactForm: document.getElementById('contactForm'),
        nameInput: document.getElementById('name'),
        emailInput: document.getElementById('email'),
        subjectInput: document.getElementById('subject'),
        messageInput: document.getElementById('message'),
        
        // Animation elements
        animatedElements: document.querySelectorAll('.section-title, .project-card')
    };
    
    // Setup global error handling
    setupGlobalErrorHandler((message, type) => {
        notificationSystem.show(message, type);
    });
    
    // Initialize all components
    initFooter(domElements);
    initNavigation(domElements);
    initProjects(domElements);
    initContactForm(domElements);
    initAnimations(domElements);
    
    // Initialize accessibility enhancements
    initAccessibility();
});

/**
 * Initialize footer content
 * @param {Object} domElements - Cached DOM elements
 */
function initFooter(domElements) {
    if (domElements.currentYear) {
        domElements.currentYear.textContent = new Date().getFullYear();
    }
}

/**
 * Initialize navigation components
 * @param {Object} domElements - Cached DOM elements
 */
function initNavigation(domElements) {
    // Mobile menu toggle
    domElements.hamburger.addEventListener('click', () => eventHandlersModule.handleMobileMenuToggle(domElements.navLinks, domElements.hamburger));
    eventHandlersModule.handleMobileMenuLinks(domElements);
    
    // Smooth scrolling
    initSmoothScroll(domElements.anchors);
}

/**
 * Initialize smooth scrolling for anchor links
 * @param {NodeList} anchors - Anchor elements
 */
function initSmoothScroll(anchors) {
    eventHandlersModule.handleSmoothScrolling(anchors);
}

/**
 * Initialize project sections
 * @param {Object} domElements - Cached DOM elements
 */
function initProjects(domElements) {
    // Create a handler registry with all available handlers
    const handlerRegistry = {
        // Core handlers
        handleProjectOverview: eventHandlersModule.handleProjectOverview,
        
        // Project-specific handlers
        launchEcosystemSimulation: eventHandlersModule.launchEcosystemSimulation,
        launchCodeProcessor: eventHandlersModule.launchCodeProcessor
        
        // New handlers can be added here without changing the UI components
    };
    
    // Populate project grids with the handler registry
    uiComponentsModule.populateProjectGrid(domElements.projectsGrid, 'codegymProjects', handlerRegistry);
    uiComponentsModule.populateProjectGrid(domElements.commercialGrid, 'commercialProjects', handlerRegistry);
    uiComponentsModule.populateProjectGrid(domElements.teamGrid, 'teamProjects', handlerRegistry);
    
    // Initialize lazy loading for images
    initLazyLoading();
}

/**
 * Initialize contact form
 * @param {Object} domElements - Cached DOM elements
 */
function initContactForm(domElements) {
    if (domElements.contactForm) {
        // Use cached DOM elements or query only if not already cached
        const formElements = {
            name: domElements.nameInput || document.getElementById('name'),
            email: domElements.emailInput || document.getElementById('email'),
            subject: domElements.subjectInput || document.getElementById('subject'),
            message: domElements.messageInput || document.getElementById('message')
        };
        
        // Cache these elements for future use if they weren't already cached
        if (!domElements.nameInput) domElements.nameInput = formElements.name;
        if (!domElements.emailInput) domElements.emailInput = formElements.email;
        if (!domElements.subjectInput) domElements.subjectInput = formElements.subject;
        if (!domElements.messageInput) domElements.messageInput = formElements.message;
        
        eventHandlersModule.handleContactForm(domElements.contactForm, formElements);
    }
}

/**
 * Initialize animations
 * @param {Object} domElements - Cached DOM elements
 */
function initAnimations(domElements) {
    uiComponentsModule.setupAnimations(domElements.animatedElements);
}



// Export the modules directly
export { businessLogicModule, uiComponentsModule, eventHandlersModule };
