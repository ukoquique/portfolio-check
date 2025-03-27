/**
 * DOM Utility Functions
 * Provides reusable DOM manipulation functions
 */

/**
 * Creates a DOM element with specified attributes
 * @param {string} tag - HTML tag name
 * @param {Object} options - Element options
 * @returns {HTMLElement} - The created element
 */
export function createElement(tag, options = {}) {
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
}

/**
 * Adds multiple event listeners to an element
 * @param {HTMLElement} element - Target element
 * @param {Object} events - Object with event types as keys and handlers as values
 */
export function addEventListeners(element, events) {
    if (!element || !events) return;
    
    Object.entries(events).forEach(([event, handler]) => {
        element.addEventListener(event, handler);
    });
}

/**
 * Safely query DOM elements and cache them
 * @param {Object} selectors - Object with keys as names and values as CSS selectors
 * @returns {Object} - Object with keys as names and values as DOM elements
 */
export function queryDomElements(selectors) {
    const elements = {};
    
    Object.entries(selectors).forEach(([name, selector]) => {
        if (selector.startsWith('#')) {
            elements[name] = document.getElementById(selector.substring(1));
        } else {
            elements[name] = document.querySelector(selector);
        }
    });
    
    return elements;
}

/**
 * Safely query multiple DOM elements and cache them
 * @param {Object} selectors - Object with keys as names and values as CSS selectors
 * @returns {Object} - Object with keys as names and values as NodeLists
 */
export function queryDomElementsAll(selectors) {
    const elements = {};
    
    Object.entries(selectors).forEach(([name, selector]) => {
        elements[name] = document.querySelectorAll(selector);
    });
    
    return elements;
}

/**
 * Setup IntersectionObserver for elements to animate on scroll
 * @param {NodeList|Array} elements - Elements to observe
 * @param {string} className - Class to add when element is visible
 * @param {Object} options - IntersectionObserver options
 */
export function setupScrollAnimation(elements, className = 'fade-in', options = { threshold: 0.1 }) {
    if (!elements || elements.length === 0) return;
    
    // Add CSS for animation if not already present
    if (!document.querySelector(`style[data-animation="${className}"]`)) {
        const style = document.createElement('style');
        style.setAttribute('data-animation', className);
        style.textContent = `
            .${className} {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add(className);
                observer.unobserve(entry.target);
            }
        });
    }, options);
    
    elements.forEach(el => {
        if (!el) return;
        
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
}

export default {
    createElement,
    addEventListeners,
    queryDomElements,
    queryDomElementsAll,
    setupScrollAnimation
};
