/**
 * Application Configuration Module
 * Centralizes all application configuration in one place
 */

/**
 * Feature Flags
 * Enable or disable features without code changes
 */
export const featureFlags = {
    // Core features
    lazyLoading: true,
    animations: true,
    accessibilityFeatures: true,
    errorReporting: true,
    
    // Project features
    ecosystemSimulation: true,
    caesarCipher: true,
    codeProcessor: true,
    
    // UI features
    darkMode: false,  // Future feature
    highContrastMode: false, // Future feature
    
    // Development features
    debugMode: false,
    performanceMetrics: false
};

/**
 * Animation configuration
 */
export const animationConfig = {
    // Intersection Observer options for animations
    observerOptions: {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    },
    // Animation classes
    classes: {
        visible: 'visible',
        hidden: 'hidden',
        fadeIn: 'fade-in',
        slideUp: 'slide-up'
    },
    // Animation delays in milliseconds
    delays: {
        initial: 100,
        staggered: 150
    }
};

/**
 * UI configuration
 */
export const uiConfig = {
    // Mobile breakpoint in pixels
    mobileBreakpoint: 768,
    // Scroll behavior
    scrollBehavior: 'smooth',
    // Scroll offset in pixels (for fixed header)
    scrollOffset: 80,
    // Modal animation duration in milliseconds
    modalAnimationDuration: 300,
    // Card animation delay increment in milliseconds
    cardAnimationDelay: 100
};

/**
 * Notification configuration
 */
export const notificationConfig = {
    // Duration in milliseconds
    duration: 3000,
    // Maximum number of notifications to show at once
    maxNotifications: 3,
    // Position
    position: 'top-right',
    // Notification types
    types: {
        success: {
            icon: 'fas fa-check-circle',
            color: '#4CAF50'
        },
        error: {
            icon: 'fas fa-exclamation-circle',
            color: '#F44336'
        },
        info: {
            icon: 'fas fa-info-circle',
            color: '#2196F3'
        },
        warning: {
            icon: 'fas fa-exclamation-triangle',
            color: '#FF9800'
        }
    }
};

/**
 * Form configuration
 */
export const formConfig = {
    // Form validation messages
    validationMessages: {
        required: 'This field is required',
        email: 'Please enter a valid email address',
        minLength: (length) => `Please enter at least ${length} characters`,
        maxLength: (length) => `Please enter no more than ${length} characters`
    },
    // Form submission settings
    submission: {
        debounceTime: 500, // Debounce time in milliseconds
        redirectDelay: 2000 // Redirect delay after successful submission in milliseconds
    }
};

/**
 * Project configuration
 */
export const projectConfig = {
    // Project grid settings
    grid: {
        columns: {
            mobile: 1,
            tablet: 2,
            desktop: 3
        },
        gap: '20px'
    },
    // Project card settings
    card: {
        aspectRatio: '16/9',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }
};

/**
 * Application paths
 */
export const pathConfig = {
    // Base paths
    base: '/',
    api: '/api',
    images: '/images',
    // Page paths
    pages: {
        home: '/',
        about: '/about',
        projects: '/projects',
        contact: '/contact'
    }
};

/**
 * Get the complete application configuration
 * @returns {Object} Complete application configuration
 */
export const getAppConfig = () => {
    return {
        features: featureFlags,
        animation: animationConfig,
        ui: uiConfig,
        notification: notificationConfig,
        form: formConfig,
        project: projectConfig,
        path: pathConfig
    };
};

/**
 * Check if a feature is enabled
 * @param {string} featureName - Name of the feature to check
 * @returns {boolean} - Whether the feature is enabled
 */
export const isFeatureEnabled = (featureName) => {
    if (!featureName || typeof featureName !== 'string') {
        console.warn('isFeatureEnabled: Invalid feature name');
        return false;
    }
    
    return featureFlags[featureName] === true;
};

export default getAppConfig;
