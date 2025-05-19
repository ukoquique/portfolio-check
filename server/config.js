/**
 * Server configuration
 * Centralizes all server configuration settings
 */
const path = require('path');

// Base directory for the application
const BASE_DIR = path.resolve(__dirname, '..');

// Environment settings
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
    // Server configuration
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || 3001,
    
    // Environment settings
    isProduction,
    
    // File paths
    paths: {
        public: BASE_DIR,
        indexHtml: path.join(BASE_DIR, 'index.html'),
        js: path.join(BASE_DIR, 'js'),
        css: path.join(BASE_DIR, 'css'),
        images: path.join(BASE_DIR, 'images'),
        projects: path.join(BASE_DIR, 'projects')
    },
    
    // Default content type
    defaultContentType: 'application/octet-stream',
    
    // Logging settings
    logging: {
        level: isProduction ? 'info' : 'debug',
        format: isProduction ? 'json' : 'pretty'
    },

    // Cache settings
    cache: {
        enabled: isProduction,
        ttl: 5 * 60 * 1000, // 5 minutes
        maxSize: 50 // Maximum number of files to cache
    },

    MIME_TYPES: {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon'
    }
};
