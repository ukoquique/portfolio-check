const http = require('http');
const fs = require('fs').promises;
const path = require('path');
const url = require('url');
const config = require('./server/config');
const router = require('./server/router');
const { logger } = require('./server/utils/logger');
const { handleHttpError, NotFoundError, FileError } = require('./server/utils/errorHandler');

// MIME types for different file extensions
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.pdf': 'application/pdf',
    '.txt': 'text/plain',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'font/eot',
    '.otf': 'font/otf'
};

/**
 * Serves a static file
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @param {string} filePath - Path to the file to serve
 * @param {string} contentType - Content type of the file
 * @throws {NotFoundError} If the file is not found
 * @throws {FileError} If there is an error reading the file
 */
async function serveStaticFile(req, res, filePath, contentType) {
    try {
        const content = await fs.readFile(filePath);
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
    } catch (error) {
        if (error.code === 'ENOENT') {
            throw new NotFoundError(`Resource not found: ${req.url}`);
        } else {
            throw new FileError(`Error reading file: ${filePath}`, error.code);
        }
    }
}

/**
 * Process an HTTP request
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 */
const processRequest = async (req, res) => {
    const { pathname } = url.parse(req.url, true);
    logger('info', `${req.method} ${pathname}`);
    
    try {
        // Try to handle the request with the router
        if (await router.handleRequest(req, res, pathname)) return;
        
        // If the router didn't handle it, serve a static file
        const filePath = pathname === '/' ? config.paths.indexHtml : `${config.paths.public}${pathname}`;
        const contentType = MIME_TYPES[path.extname(filePath)] || config.defaultContentType;
        await serveStaticFile(req, res, filePath, contentType);
    } catch (error) {
        handleHttpError(error, res, logger);
    }
};

// Create and start the server
const server = http.createServer(processRequest);

// Handle server errors
server.on('error', (error) => {
    logger('error', `Server error: ${error.message}`);
    process.exit(1);
});

// Start the server
server.listen(config.port, config.host, () => {
    logger('info', `Server running at http://${config.host}:${config.port}/`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    logger('error', `Uncaught exception: ${error.message}`);
    logger('error', error.stack);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    logger('error', 'Unhandled promise rejection');
    logger('error', reason);
    process.exit(1);
});
