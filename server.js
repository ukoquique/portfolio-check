const http = require('http');
const fs = require('fs').promises;
const config = require('./server/config');
const router = require('./server/router');
const { logger } = require('./server/utils/logger');
const { handleHttpError, NotFoundError, FileError } = require('./server/utils/errorHandler');

// Cache for frequently accessed files
const fileCache = new Map();

/**
 * Manages the file cache using an LRU-like approach
 * Removes least recently accessed items when cache reaches maximum size
 */
function manageCache(filePath, content, lastModified) {
    // If cache is at capacity, find and remove least recently accessed entries
    if (fileCache.size >= config.cache.maxSize) {
        // Find the entry with the oldest access timestamp
        let oldestTimestamp = Date.now();
        let oldestKey = null;
        
        for (const [key, entry] of fileCache.entries()) {
            if (entry.lastAccessed < oldestTimestamp) {
                oldestTimestamp = entry.lastAccessed;
                oldestKey = key;
            }
        }
        
        if (oldestKey) {
            logger('debug', `Removing least recently used cache entry: ${oldestKey}`);
            fileCache.delete(oldestKey);
        }
    }
    
    // Add new entry with current timestamp
    fileCache.set(filePath, {
        content,
        timestamp: Date.now(),      // When the file was cached
        lastAccessed: Date.now(),  // When the file was last accessed
        lastModified               // File's last modified date
    });
}

/**
 * Serves a static file with caching
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @param {string} filePath - Path to the file to serve
 * @param {string} contentType - Content type of the file
 * @throws {NotFoundError} If the file is not found
 * @throws {FileError} If there is an error reading the file
 */
async function serveStaticFile(req, res, filePath, contentType) {
    try {
        // Check if file exists
        await fs.access(filePath).catch(error => {
            if (error.code === 'ENOENT') {
                logger('warn', `File not found: ${filePath}`);
                throw new NotFoundError(`Resource not found: ${req.url}`);
            }
            throw new FileError(`Error accessing file: ${filePath}`, error.code);
        });

        // Check cache first if caching is enabled
        if (config.cache.enabled) {
            const cached = fileCache.get(filePath);
            if (cached && Date.now() - cached.timestamp < config.cache.ttl) {
                // Update last accessed time for LRU tracking
                cached.lastAccessed = Date.now();
                fileCache.set(filePath, cached);
                
                logger('info', `Serving cached file: ${filePath}`);
                res.writeHead(200, {
                    'Content-Type': contentType,
                    'Cache-Control': 'public, max-age=300',
                    'Last-Modified': cached.lastModified
                });
                res.end(cached.content, 'utf-8');
                return;
            }
        }

        // Read and cache the file
        const content = await fs.readFile(filePath);
        const stats = await fs.stat(filePath);
        const lastModified = stats.mtime.toUTCString();

        if (config.cache.enabled) {
            manageCache(filePath, content, lastModified);
        }

        logger('info', `Serving file: ${filePath} (${contentType})`);
        res.writeHead(200, {
            'Content-Type': contentType,
            'Cache-Control': config.cache.enabled ? 'public, max-age=300' : 'no-cache',
            'Last-Modified': lastModified
        });
        res.end(content, 'utf-8');
    } catch (error) {
        // Handle specific error types
        if (error instanceof NotFoundError || error instanceof FileError) {
            throw error; // Rethrow custom errors to be handled by handleHttpError
        }
        
        // Convert unknown errors to FileError with context
        logger('error', `Error serving file ${filePath}: ${error.message}`);
        throw new FileError(`Error serving file: ${filePath}`, 'FILE_SERVE_ERROR');
    }
}

/**
 * Process an HTTP request
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 */
const processRequest = async (req, res) => {
    const url = require('url');
    const path = require('path');
    const { pathname } = url.parse(req.url, true);
    logger('info', `${req.method} ${pathname}`);
    
    try {
        // Try to handle the request with the router
        if (await router.handleRequest(req, res, pathname)) return;
        
        // If the router didn't handle it, serve a static file
        const filePath = pathname === '/' 
            ? config.paths.indexHtml 
            : path.join(config.paths.public, pathname);
        const contentType = config.MIME_TYPES[path.extname(filePath)] || config.defaultContentType;
        await serveStaticFile(req, res, filePath, contentType);
    } catch (error) {
        handleHttpError(error, res, logger);
    }
};

// Create and start the server
const server = http.createServer(processRequest);

// Unified error handler for server-level errors (not HTTP requests)
const handleServerError = (error, context = 'Server') => {
    // Create a structured error object
    const errorData = {
        context,
        timestamp: new Date().toISOString(),
        type: error.code || 'UNKNOWN_ERROR'
    };
    
    // Add stack trace in development
    if (process.env.NODE_ENV !== 'production') {
        errorData.stack = error.stack;
    }
    
    logger('error', `${context} error: ${error.message}`, errorData);
    
    // In production, we might want to attempt recovery instead of exiting
    if (process.env.NODE_ENV === 'production') {
        // Log the error but don't exit in production
        logger('error', 'Server continuing despite error');
    } else {
        // In development, exit to make errors obvious
        process.exit(1);
    }
};

// Handle server errors
server.on('error', (error) => handleServerError(error, 'Server'));

// Start the server
server.listen(config.port, config.host, () => {
    logger('info', `Server running in ${config.isProduction ? 'production' : 'development'} mode at http://${config.host}:${config.port}/`);
});

// Handle uncaught exceptions and unhandled rejections
process.on('uncaughtException', (error) => handleServerError(error, 'Uncaught Exception'));
process.on('unhandledRejection', (reason) => handleServerError(reason, 'Unhandled Rejection'));
