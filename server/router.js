const fs = require('fs').promises;
const { logger } = require('./utils/logger');
const { handleHttpError, ValidationError } = require('./utils/errorHandler');

// Rate limiting implementation
class RateLimiter {
    constructor(limit, windowMs) {
        this.limit = limit;
        this.windowMs = windowMs;
        this.requests = new Map();
    }

    checkLimit(ip) {
        const now = Date.now();
        const userRequests = this.requests.get(ip) || [];
        
        // Remove old requests
        const recentRequests = userRequests.filter(time => now - time < this.windowMs);
        
        if (recentRequests.length >= this.limit) {
            return false;
        }
        
        recentRequests.push(now);
        this.requests.set(ip, recentRequests);
        return true;
    }
}

// Create rate limiter instance
const rateLimiter = new RateLimiter(100, 60000); // 100 requests per minute

class Router {
    constructor() {
        this.routes = new Map();
        this.middleware = [];
    }

    // Add middleware that runs before route handlers
    use(middleware) {
        this.middleware.push(middleware);
    }

    // Add route with optional middleware
    addRoute(path, method, handler, routeMiddleware = []) {
        const key = `${method}:${path}`;
        this.routes.set(key, {
            handler,
            middleware: routeMiddleware
        });
    }

    // Validate route parameters
    validateRouteParams(req, res, next) {
        // Add any route parameter validation logic here
        next();
    }

    // Execute middleware chain
    async executeMiddleware(req, res, middlewareChain) {
        let index = 0;
        const next = async () => {
            if (index < middlewareChain.length) {
                await middlewareChain[index++](req, res, next);
            }
        };
        await next();
    }

    async handleRequest(req, res, pathname) {
        const method = req.method;
        const key = `${method}:${pathname}`;
        
        const route = this.routes.get(key);
        
        if (!route) {
            return false;
        }

        try {
            // Execute global middleware
            await this.executeMiddleware(req, res, this.middleware);
            
            // Execute route-specific middleware
            await this.executeMiddleware(req, res, route.middleware);
            
            // Execute route handler
            await route.handler(req, res);
            return true;
        } catch (error) {
            handleHttpError(error, res, logger);
            return true;
        }
    }
}

const router = new Router();

// Add global middleware
router.use(async (req, res, next) => {
    logger('info', `Incoming request: ${req.method} ${req.url}`);
    next();
});

// Add CORS middleware
router.use(async (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    next();
});

// Add rate limiting middleware for API routes
router.use(async (req, res, next) => {
    if (req.url.startsWith('/api')) {
        const ip = req.socket.remoteAddress;
        if (!rateLimiter.checkLimit(ip)) {
            res.writeHead(429, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                error: 'Too many requests',
                message: 'Please try again later'
            }));
            return;
        }
    }
    next();
});

// Helper function to parse JSON request body
const parseJsonBody = (req) => {
    return new Promise((resolve, reject) => {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            if (!body) {
                resolve({});
                return;
            }
            
            try {
                const data = JSON.parse(body);
                resolve(data);
            } catch (error) {
                reject(new ValidationError('Invalid JSON body'));
            }
        });
        
        req.on('error', (error) => {
            reject(new ValidationError('Error reading request body'));
        });
    });
};

// Add ecosystem simulation route with middleware
router.addRoute('/api/launch-ecosystem', 'POST', async (req, res) => {
    logger('info', 'Handling API request: POST /api/launch-ecosystem');
    
    try {
        const body = await parseJsonBody(req);
        
        // Validate request body if needed
        if (body && typeof body === 'object') {
            // Log request details for debugging
            logger('debug', 'Ecosystem simulation request body:', { body });
        }
        
        const launchHandler = require('../projects/ecosystem-simulation/launch.js');
        await launchHandler(req, res);
    } catch (error) {
        logger('error', `Ecosystem simulation error: ${error.message}`, { stack: error.stack });
        throw new ValidationError('Failed to launch ecosystem simulation: ' + error.message);
    }
});

// Add Code Processor route with middleware
router.addRoute('/api/launch-code-processor', 'POST', async (req, res) => {
    logger('info', 'Handling API request: POST /api/launch-code-processor');
    
    try {
        const body = await parseJsonBody(req);
        
        // Validate request body if needed
        if (body && typeof body === 'object') {
            // Log request details for debugging
            logger('debug', 'Code Processor request body:', { body });
        }
        
        const launchHandler = require('../projects/code-processor/launch.js');
        await launchHandler(req, res);
    } catch (error) {
        logger('error', `Code Processor error: ${error.message}`, { stack: error.stack });
        throw new ValidationError('Failed to launch Code Processor: ' + error.message);
    }
});

module.exports = router;