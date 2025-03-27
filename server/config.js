/**
 * Server configuration
 * Centralizes all server configuration settings
 */
const path = require('path');

// Base directory for the application
const BASE_DIR = path.resolve(__dirname, '..');

module.exports = {
    // Server configuration
    host: 'localhost',
    port: 3001,
    
    // Default content type
    defaultContentType: 'application/octet-stream',
    
    // File paths
    paths: {
        public: BASE_DIR,
        indexHtml: path.join(BASE_DIR, 'index.html'),
        js: path.join(BASE_DIR, 'js'),
        css: path.join(BASE_DIR, 'css'),
        images: path.join(BASE_DIR, 'images'),
        projects: path.join(BASE_DIR, 'projects')
    },
    
    // Environment settings
    environment: process.env.NODE_ENV || 'development',
    
    // Logging settings
    logging: {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        format: process.env.NODE_ENV === 'production' ? 'json' : 'pretty'
    }
};
