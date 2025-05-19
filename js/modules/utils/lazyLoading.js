/**
 * Lazy Loading Utility Module
 * 
 * This module provides optimized functions for lazy loading images and other resources.
 * It implements performance best practices including:
 * - Shared IntersectionObserver instances for better memory usage
 * - Image preloading to prevent visual jumps
 * - Placeholder image caching for faster initial rendering
 * - Efficient memory management by cleaning up data attributes
 * - Fallback mechanisms for browsers without IntersectionObserver support
 * 
 * @module utils/lazyLoading
 */

// Shared IntersectionObserver instance for better performance
let sharedImageObserver = null;

/**
 * Initializes lazy loading for images with the data-src attribute
 * Uses IntersectionObserver API for better performance
 */
export const initLazyLoading = () => {
    // Check if IntersectionObserver is supported
    if ('IntersectionObserver' in window) {
        // Create a single shared observer instance if it doesn't exist
        if (!sharedImageObserver) {
            sharedImageObserver = new IntersectionObserver((entries, observer) => {
                // Process all entries in a single batch for better performance
                for (let i = 0; i < entries.length; i++) {
                    const entry = entries[i];
                    
                    // Only load images that are visible in the viewport
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        
                        // Replace the src with the data-src
                        const dataSrc = img.dataset.src;
                        if (dataSrc) {
                            // Preload the image
                            const preloadImg = new Image();
                            preloadImg.onload = () => {
                                img.src = dataSrc;
                                img.classList.add('loaded');
                            };
                            preloadImg.src = dataSrc;
                            
                            // Clean up data attributes to free memory
                            delete img.dataset.src;
                            
                            // Stop observing the image after loading
                            observer.unobserve(img);
                        }
                    }
                }
            }, {
                // Start loading when image is 300px from viewport for better perceived performance
                rootMargin: '300px 0px',
                threshold: 0.01
            });
        }
        
        // Select all images with data-src attribute
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        // Use a more efficient loop for large collections
        if (lazyImages.length > 0) {
            for (let i = 0; i < lazyImages.length; i++) {
                sharedImageObserver.observe(lazyImages[i]);
            }
        }
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        let lazyLoadThrottleTimeout = null;
        
        const lazyLoad = () => {
            if (lazyLoadThrottleTimeout) {
                clearTimeout(lazyLoadThrottleTimeout);
            }
            
            lazyLoadThrottleTimeout = setTimeout(() => {
                const scrollTop = window.scrollY;
                const viewportHeight = window.innerHeight;
                const lazyImages = document.querySelectorAll('img[data-src]');
                
                let hasRemainingImages = false;
                
                for (let i = 0; i < lazyImages.length; i++) {
                    const img = lazyImages[i];
                    if (img.offsetTop < viewportHeight + scrollTop) {
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        delete img.dataset.src;
                    } else {
                        hasRemainingImages = true;
                    }
                }
                
                if (!hasRemainingImages) {
                    document.removeEventListener('scroll', lazyLoad);
                    window.removeEventListener('resize', lazyLoad);
                    window.removeEventListener('orientationChange', lazyLoad);
                }
            }, 20); // Reduced throttle time for better responsiveness
        };
        
        // Add event listeners for fallback
        document.addEventListener('scroll', lazyLoad);
        window.addEventListener('resize', lazyLoad);
        window.addEventListener('orientationChange', lazyLoad);
        
        // Initial load
        lazyLoad();
    }
};

// Optimized tiny SVG placeholder (smaller and more efficient)
const PLACEHOLDER_SVG = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';

// Reusable placeholder images cache for common dimensions
const placeholderCache = new Map();

/**
 * Gets a cached placeholder image or creates a new one
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {string} - Placeholder image URL
 */
const getPlaceholder = (width, height) => {
    // If no dimensions specified, use the minimal SVG
    if (!width || !height) return PLACEHOLDER_SVG;
    
    // Create a cache key based on dimensions
    const key = `${width}x${height}`;
    
    // Check if we have a cached placeholder
    if (placeholderCache.has(key)) {
        return placeholderCache.get(key);
    }
    
    // Create a new placeholder with the correct aspect ratio
    const placeholder = `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"%3E%3Crect width="100%" height="100%" fill="%23f0f0f0"%3E%3C/rect%3E%3C/svg%3E`;
    
    // Cache it for future use
    placeholderCache.set(key, placeholder);
    
    return placeholder;
};

/**
 * Creates an image element with lazy loading
 * @param {string} src - Image source URL
 * @param {string} alt - Alt text for the image
 * @param {Object} options - Additional options for the image
 * @returns {HTMLImageElement} - The created image element
 */
export const createLazyImage = (src, alt, options = {}) => {
    // Create image with a single DOM operation
    const img = new Image();
    
    // Set alt text immediately for accessibility
    img.alt = alt || '';
    
    // Set width and height if provided to prevent layout shifts
    if (options.width) img.width = options.width;
    if (options.height) img.height = options.height;
    
    // Set classes if provided
    if (options.className) img.className = options.className;
    
    // Get an appropriate placeholder based on dimensions
    img.src = options.placeholder || getPlaceholder(options.width, options.height);
    
    // Set the actual image source in data-src
    img.dataset.src = src;
    
    // Add loading="lazy" for browsers that support native lazy loading
    img.loading = 'lazy';
    
    return img;
};
