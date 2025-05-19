/**
 * UI Components Module
 * 
 * This module provides optimized functions for creating and managing UI elements.
 * It implements a component-based approach with performance optimizations:
 * 
 * Key features:
 * - Small, focused functions with single responsibilities
 * - Performance-optimized rendering with DocumentFragment and batched operations
 * - Non-blocking UI with incremental rendering using requestAnimationFrame
 * - Shared IntersectionObserver instances for animations and lazy loading
 * - Consistent error handling with standardized error objects
 * - Feature flag integration for conditional feature enabling
 * 
 * @module ui/uiComponents
 */

import { getAllProjects, getProjectsByCategory } from '../data/projectData.js';
import { createLazyImage } from '../utils/lazyLoading.js';
import { createError, handleError } from '../utils/errorHandler.js';
import { isFeatureEnabled, animationConfig, featureFlags } from '../config/appConfig.js';

/**
 * Creates a DOM element with specified attributes
 * @param {string} tag - HTML tag name
 * @param {Object} options - Element options
 * @returns {HTMLElement} - The created element
 */
export const createElement = (tag, options = {}) => {
    const element = document.createElement(tag);
    
    if (options.className) element.className = options.className;
    if (options.textContent) element.textContent = options.textContent;
    if (options.innerHTML) element.innerHTML = options.innerHTML;
    if (options.attributes) {
        Object.entries(options.attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });
    }
    
    return element;
};

/**
 * Creates a card link or button element
 * @param {Object} options - Link options
 * @param {string} options.text - Link text
 * @param {string} options.icon - Font Awesome icon class
 * @param {string} options.href - Link URL (for anchor elements)
 * @param {boolean} options.isButton - Whether to create a button instead of an anchor
 * @param {Function} options.onClick - Click event handler (for buttons)
 * @returns {HTMLElement} - The created link or button element
 */
export const createCardLink = ({ href, onClick, icon, text, isButton }) => {
    // Input validation
    if (!text || !icon) {
        handleError(createError('Missing required parameters (text or icon)', 'validation', 'warning'));
        return null;
    }

    // Don't create link if href is null and there's no onClick handler
    if (!href && !onClick) {
        handleError(createError('No href or onClick handler provided', 'validation', 'warning'));
        return null;
    }

    // Create the appropriate element based on isButton flag
    const linkElement = isButton 
        ? createElement('button', { 
            className: 'card-link',
            attributes: { type: 'button' } // Add type attribute for buttons
        })
        : createElement('a', { 
            className: 'card-link',
            attributes: { 
                href: href || '#',
                ...(href && { target: '_blank', rel: 'noopener noreferrer' })
            }
        });

    // Add icon
    const iconElement = createElement('i', { 
        className: icon.includes('fa-') ? icon : `fas ${icon}`
    });
    linkElement.appendChild(iconElement);

    // Add text
    const textSpan = createElement('span', { textContent: text });
    linkElement.appendChild(textSpan);

    // Add click handler for buttons
    if (isButton && onClick && typeof onClick === 'function') {
        linkElement.addEventListener('click', onClick);
    }

    return linkElement;
};

/**
 * Creates a card image element
 * @param {Object} project - Project data
 * @returns {HTMLElement} - The image container element
 */
export const createCardImage = (project) => {
    if (!project) {
        handleError(createError('Missing project data for image creation', 'validation', 'warning'));
        return createElement('div', { className: 'card-image' });
    }
    
    try {
        // Create image container
        const imageContainer = createElement('div', { className: 'card-image' });
        
        // Create image element if image path is provided
        if (project.image) {
            // Create the image element based on whether lazy loading is enabled
            let img;
            
            if (isFeatureEnabled('lazyLoading')) {
                // Use lazy loading for images
                img = createLazyImage(
                    project.image,
                    `${project.title} screenshot`,
                    {
                        className: 'project-image',
                        width: 300,
                        height: 200,
                        placeholder: '/images/placeholder.svg'
                    }
                );
            } else {
                // Create regular image without lazy loading
                img = createElement('img', {
                    src: project.image,
                    alt: `${project.title} screenshot`,
                    className: 'project-image',
                    width: 300,
                    height: 200
                });
            }
            
            // Add error handling for image loading
            img.addEventListener('error', () => {
                handleError(createError(`Failed to load image: ${project.image}`, 'resource', 'warning'));
                imageContainer.classList.add('image-error');
                
                // Add fallback content
                const fallbackContent = createElement('div', {
                    className: 'image-fallback',
                    innerHTML: `<i class="fas fa-image"></i><span>Image not available</span>`
                });
                
                imageContainer.appendChild(fallbackContent);
            });
            
            // Append image to container
            imageContainer.appendChild(img);
        } else {
            // Create placeholder if no image is provided
            const placeholder = createElement('div', { 
                className: 'image-placeholder',
                innerHTML: '<i class="fas fa-image"></i><p>No image available</p>'
            });
            imageContainer.appendChild(placeholder);
        }
        
        return imageContainer;
    } catch (error) {
        handleError(createError('Error creating card image', 'ui', 'error', error));
        return createElement('div', { className: 'card-image image-error' });
    }
};

/**
 * Creates a tags container with tag elements
 * @param {Array} tags - Array of tag strings
 * @returns {HTMLElement} - The tags container element
 */
export const createTagsContainer = (tags) => {
    if (!Array.isArray(tags) || tags.length === 0) {
        return createElement('div', { className: 'tags-container' });
    }
    
    try {
        const tagsContainer = createElement('div', { className: 'tags-container' });
        
        tags.forEach(tag => {
            if (typeof tag === 'string' && tag.trim()) {
                const tagElement = createElement('span', { 
                    className: 'tag',
                    textContent: tag.trim()
                });
                tagsContainer.appendChild(tagElement);
            }
        });
        
        return tagsContainer;
    } catch (error) {
        handleError(createError('Error creating tags container', 'ui', 'error', error));
        return createElement('div', { className: 'card-tags' });
    }
};

/**
 * Helper function to check if a project feature is enabled
 * @param {string} projectKey - Project key to check
 * @returns {boolean} - Whether the feature is enabled
 */
const isProjectFeatureEnabled = (projectKey) => {
    if (!projectKey) return true;
    
    const projectFeature = projectKey.toLowerCase().replace(/\s+/g, '');
    return isFeatureEnabled(projectFeature) || !featureFlags.hasOwnProperty(projectFeature);
};

/**
 * Creates an overview button for a project
 * @param {Object} project - Project data
 * @param {Object} handlers - Event handlers
 * @param {Function} addLink - Function to add link to container
 */
const createOverviewButton = (project, handlers, addLink) => {
    addLink({
        onClick: (event) => {
            if (handlers.handleProjectOverview && typeof handlers.handleProjectOverview === 'function') {
                try {
                    handlers.handleProjectOverview(project.key, event.currentTarget);
                } catch (error) {
                    handleError(createError(`Error handling overview for ${project.title}`, 'ui', 'error', error));
                }
            }
        },
        icon: 'fas fa-info-circle',
        text: 'Overview',
        isButton: true
    });
};

/**
 * Creates a demo link for a project if applicable
 * @param {Object} project - Project data
 * @param {Function} addLink - Function to add link to container
 */
const createDemoLink = (project, addLink) => {
    if (!project.capabilities || !project.capabilities.hasDemo || !project.capabilities.demoUrl) {
        return;
    }
    
    if (isProjectFeatureEnabled(project.key)) {
        addLink({
            href: project.capabilities.demoUrl,
            icon: 'fas fa-play-circle',
            text: 'Try Demo',
            isButton: false
        });
    }
};

/**
 * Creates a launch button for a project if applicable
 * @param {Object} project - Project data
 * @param {Object} handlers - Event handlers
 * @param {Function} addLink - Function to add link to container
 */
const createLaunchButton = (project, handlers, addLink) => {
    if (!project.capabilities || !project.capabilities.hasLaunch || !project.capabilities.launchHandler) {
        return;
    }
    
    const handlerName = project.capabilities.launchHandler;
    
    if (isProjectFeatureEnabled(project.key) && 
        handlers[handlerName] && typeof handlers[handlerName] === 'function') {
        addLink({
            onClick: () => handlers[handlerName](),
            icon: 'fas fa-play-circle',
            text: 'Launch Demo',
            isButton: true
        });
    }
};

/**
 * Creates a code link for a project if applicable
 * @param {Object} project - Project data
 * @param {Function} addLink - Function to add link to container
 */
const createCodeLink = (project, addLink) => {
    if (!project.capabilities || !project.capabilities.hasCode || !project.capabilities.codeUrl) {
        return;
    }
    
    addLink({
        href: project.capabilities.codeUrl,
        icon: 'fab fa-github',
        text: 'View Code',
        isButton: false
    });
};

/**
 * Creates a links container with project links
 * @param {Object} project - Project data object
 * @param {Object} handlers - Event handler functions
 * @returns {HTMLElement} - The links container element
 */
export const createProjectLinks = (project, handlers = {}) => {
    if (!project) {
        handleError(createError('Missing project data for links creation', 'validation', 'warning'));
        return createElement('div', { className: 'card-links' });
    }
    
    try {
        const linksContainer = createElement('div', { className: 'card-links' });
        
        // Helper function to add a link
        const addLink = (options) => {
            const link = createCardLink(options);
            if (link) linksContainer.appendChild(link);
        };

        // Add all applicable links
        createOverviewButton(project, handlers, addLink);
        createDemoLink(project, addLink);
        createLaunchButton(project, handlers, addLink);
        createCodeLink(project, addLink);

        return linksContainer;
    } catch (error) {
        handleError(createError('Error creating project links', 'ui', 'error', error));
        return createElement('div', { className: 'card-links' });
    }
};

/**
 * Creates the content section for a project card
 * @param {Object} project - Project data object
 * @returns {HTMLElement} - The content container element
 */
export const createCardContent = (project) => {
    if (!project) {
        handleError(createError('Missing project data for card content', 'validation', 'warning'));
        return createElement('div', { className: 'card-content' });
    }
    
    try {
        // Create content container
        const contentContainer = createElement('div', { className: 'card-content' });
        
        // Create description
        if (project.description) {
            const description = createElement('p', { 
                className: 'card-description',
                text: project.description
            });
            contentContainer.appendChild(description);
        }
        
        // Create tags container
        if (project.tags && Array.isArray(project.tags)) {
            const tagsContainer = createTagsContainer(project.tags);
            contentContainer.appendChild(tagsContainer);
        }
        
        return contentContainer;
    } catch (error) {
        handleError(createError('Error creating card content', 'ui', 'error', error));
        return createElement('div', { className: 'card-content' });
    }
};

/**
 * Creates the container for a project card
 * @param {Object} project - Project data
 * @returns {HTMLElement} - Card container element
 */
const createCardContainer = (project) => {
    return createElement('div', { 
        className: 'project-card',
        attributes: { 
            'data-project': project.key || project.title.toLowerCase().replace(/\s+/g, '-'),
            'tabindex': '0',
            'role': 'article',
            'aria-label': `Project: ${project.title}`
        }
    });
};

/**
 * Creates the title element for a project card
 * @param {string} title - Project title
 * @returns {HTMLElement} - Title element
 */
const createCardTitle = (title) => {
    return createElement('h3', { 
        className: 'card-title',
        textContent: title
    });
};

/**
 * Creates the description element for a project card
 * @param {string} description - Project description
 * @returns {HTMLElement|null} - Description element or null if no description
 */
const createCardDescription = (description) => {
    if (!description) return null;
    
    return createElement('p', { 
        className: 'card-description',
        textContent: description
    });
};

/**
 * Creates and populates the content container for a project card
 * @param {Object} project - Project data
 * @returns {HTMLElement} - Content container element
 */
const createCardContentContainer = (project) => {
    const contentContainer = createElement('div', { className: 'card-content' });
    
    // Add title
    const title = createCardTitle(project.title);
    contentContainer.appendChild(title);
    
    // Add description if available
    const description = createCardDescription(project.description);
    if (description) {
        contentContainer.appendChild(description);
    }
    
    // Add tags if available
    if (project.tags && Array.isArray(project.tags)) {
        const tagsContainer = createTagsContainer(project.tags);
        contentContainer.appendChild(tagsContainer);
    }
    
    return contentContainer;
};

/**
 * Creates a complete project card
 * @param {Object} project - Project data object
 * @param {Object} handlers - Event handler functions
 * @returns {HTMLElement} - The complete project card
 * @throws {Error} If project data is invalid
 */
export const createProjectCard = (project, handlers = {}) => {
    // Input validation
    if (!project || !project.title) {
        const error = createError('Invalid project data', 'validation', 'error');
        handleError(error);
        throw error;
    }
    
    try {
        // Create main components
        const card = createCardContainer(project);
        const imageElement = createCardImage(project);
        const contentContainer = createCardContentContainer(project);
        const linksElement = createProjectLinks(project, handlers);
        
        // Assemble the card
        card.appendChild(imageElement);
        card.appendChild(contentContainer);
        card.appendChild(linksElement);
        
        return card;
    } catch (error) {
        const standardError = handleError(createError('Error creating project card', 'ui', 'error', error));
        throw standardError;
    }
};

/**
 * Retrieves projects based on category
 * @param {string} category - Project category
 * @returns {Array} - Array of projects
 */
const getProjectsForGrid = (category) => {
    return category ? getProjectsByCategory(category) : getAllProjects();
};

/**
 * Validates if projects array is valid and not empty
 * @param {Array} projects - Array of projects
 * @param {string} category - Category name for error message
 * @param {HTMLElement} container - Container to show message if invalid
 * @returns {boolean} - Whether projects are valid
 */
const validateProjects = (projects, category, container) => {
    if (!Array.isArray(projects) || projects.length === 0) {
        handleError(createError(`No projects found for category: ${category}`, 'data', 'warning'));
        container.innerHTML = '<div class="no-projects">No projects to display</div>';
        return false;
    }
    return true;
};

/**
 * Creates and appends project cards to container
 * @param {HTMLElement} container - Container element
 * @param {Array} projects - Array of projects
 * @param {Object} handlers - Event handlers
 */
const appendProjectCards = (container, projects, handlers) => {
    // Clear existing content
    container.innerHTML = '';
    
    // Use document fragment for better performance
    const fragment = document.createDocumentFragment();
    
    // Process projects in batches to avoid blocking the main thread
    const batchSize = 5;
    const totalProjects = projects.length;
    
    // Function to process a batch of projects
    const processBatch = (startIndex) => {
        // Calculate end index for this batch
        const endIndex = Math.min(startIndex + batchSize, totalProjects);
        
        // Process this batch
        for (let i = startIndex; i < endIndex; i++) {
            try {
                const project = projects[i];
                const card = createProjectCard(project, handlers);
                fragment.appendChild(card);
            } catch (error) {
                handleError(createError(`Error creating card for project ${projects[i].title}`, 'ui', 'error', error));
            }
        }
        
        // If this is the last batch, append the fragment to the container
        if (endIndex === totalProjects) {
            container.appendChild(fragment);
            return;
        }
        
        // Schedule the next batch using requestAnimationFrame for better UI responsiveness
        requestAnimationFrame(() => {
            processBatch(endIndex);
        });
    };
    
    // Start processing the first batch
    processBatch(0);
};

/**
 * Populates a grid container with project cards
 * @param {HTMLElement} container - Grid container element
 * @param {string} category - Project category (codegymProjects, commercialProjects, teamProjects)
 * @param {Object} handlers - Event handler functions
 * @throws {Error} If container is invalid
 */
export const populateProjectGrid = (container, category, handlers = {}) => {
    // Input validation
    if (!container || !(container instanceof HTMLElement)) {
        const error = createError('Invalid container element', 'validation', 'error');
        handleError(error);
        throw error;
    }
    
    try {
        // Get projects and validate
        const projects = getProjectsForGrid(category);
        
        if (!validateProjects(projects, category, container)) {
            return;
        }
        
        // Create and append project cards
        appendProjectCards(container, projects, handlers);
    } catch (error) {
        handleError(createError('Error populating project grid', 'ui', 'error', error));
        container.innerHTML = '<div class="error-message">Error loading projects</div>';
    }
};

// Shared IntersectionObserver instance for lazy loading
let sharedLazyLoadObserver = null;

/**
 * Sets up lazy loading for project cards
 * @param {HTMLElement} container - Grid container element
 */
export const setupLazyLoading = (container = document) => {
    // Check if lazy loading feature is enabled
    if (!isFeatureEnabled('lazyLoading')) {
        // If disabled, load all images immediately but in batches for better performance
        const allLazyImages = document.querySelectorAll('img[data-src]');
        
        if (allLazyImages.length === 0) return;
        
        // Process images in batches to avoid blocking the main thread
        const batchSize = 10;
        const totalImages = allLazyImages.length;
        
        const processBatch = (startIndex) => {
            // Use requestIdleCallback if available, otherwise use setTimeout
            const scheduleNext = window.requestIdleCallback || setTimeout;
            
            scheduleNext(() => {
                const endIndex = Math.min(startIndex + batchSize, totalImages);
                
                for (let i = startIndex; i < endIndex; i++) {
                    const img = allLazyImages[i];
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        delete img.dataset.src;
                    }
                }
                
                // Process next batch if there are more images
                if (endIndex < totalImages) {
                    processBatch(endIndex);
                }
            });
        };
        
        // Start processing the first batch
        processBatch(0);
        return;
    }
    
    try {
        // Get all lazy images in the container
        const lazyImages = container.querySelectorAll('img[data-src]');
        
        if (lazyImages.length === 0) {
            return;
        }
        
        // Create a shared observer if it doesn't exist
        if (!sharedLazyLoadObserver) {
            sharedLazyLoadObserver = new IntersectionObserver((entries) => {
                // Process entries in batches for better performance
                const len = entries.length;
                
                for (let i = 0; i < len; i++) {
                    const entry = entries[i];
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const src = img.dataset.src;
                        
                        if (src) {
                            // Preload the image
                            const preloadImg = new Image();
                            preloadImg.onload = () => {
                                requestAnimationFrame(() => {
                                    img.src = src;
                                    img.classList.add('loaded');
                                    delete img.dataset.src;
                                });
                            };
                            preloadImg.src = src;
                            
                            // Stop observing
                            sharedLazyLoadObserver.unobserve(img);
                        }
                    }
                }
            }, {
                rootMargin: '200px 0px',
                threshold: 0.01
            });
        }
        
        // Observe all lazy images
        const len = lazyImages.length;
        for (let i = 0; i < len; i++) {
            sharedLazyLoadObserver.observe(lazyImages[i]);
        }
    } catch (error) {
        handleError(createError('Error setting up lazy loading', 'ui', 'error', error));
        
        // Fallback for browsers that don't support IntersectionObserver
        const allLazyImages = document.querySelectorAll('img[data-src]');
        const len = allLazyImages.length;
        
        for (let i = 0; i < len; i++) {
            const img = allLazyImages[i];
            if (img.dataset.src) {
                img.src = img.dataset.src;
                delete img.dataset.src;
            }
        }
    }
};

// Shared IntersectionObserver instance for animations
let sharedAnimationObserver = null;

/**
 * Setup animation for elements
 * @param {NodeList|Array} elements - Elements to animate
 * @throws {Error} If elements is invalid
 */
export const setupAnimations = (elements) => {
    // Check if animations feature is enabled
    if (!isFeatureEnabled('animations')) {
        // If disabled, immediately show all elements without animation
        if (elements && elements.length > 0) {
            // Use a more efficient loop for large collections
            const len = elements.length;
            for (let i = 0; i < len; i++) {
                const element = elements[i];
                element.classList.add('animate');
                element.style.opacity = '1';
            }
        }
        return;
    }
    
    if (!elements || elements.length === 0) {
        handleError(createError('No elements to animate', 'ui', 'warning'));
        return;
    }
    
    try {
        // Create a shared observer if it doesn't exist
        if (!sharedAnimationObserver) {
            sharedAnimationObserver = new IntersectionObserver((entries) => {
                // Use a more efficient loop for large collections
                const len = entries.length;
                for (let i = 0; i < len; i++) {
                    const entry = entries[i];
                    if (entry.isIntersecting) {
                        // Use requestAnimationFrame for smoother animations
                        requestAnimationFrame(() => {
                            entry.target.classList.add('animate');
                        });
                        sharedAnimationObserver.unobserve(entry.target);
                    }
                }
            }, {
                // Use configuration from animationConfig
                threshold: animationConfig.observerOptions.threshold,
                rootMargin: animationConfig.observerOptions.rootMargin
            });
        }
        
        // Use a more efficient loop for large collections
        const len = elements.length;
        for (let i = 0; i < len; i++) {
            sharedAnimationObserver.observe(elements[i]);
        }
    } catch (error) {
        handleError(createError('Error setting up animations', 'ui', 'error', error));
        
        // Fallback for browsers that don't support IntersectionObserver
        const len = elements.length;
        for (let i = 0; i < len; i++) {
            elements[i].classList.add('animate');
        }
    }
};
