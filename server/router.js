const { logger } = require('./utils/logger');
const { handleHttpError, ValidationError } = require('./utils/errorHandler');
const url = require('url');

class Router {
    constructor() {
        this.routes = new Map();
    }

    addRoute(path, method, handler) {
        const key = `${method}:${path}`;
        this.routes.set(key, handler);
    }

    async handleRequest(req, res, pathname) {
        const method = req.method;
        const key = `${method}:${pathname}`;
        
        const handler = this.routes.get(key);
        
        if (!handler) {
            return false;
        }

        try {
            await handler(req, res);
            return true;
        } catch (error) {
            // Use the centralized error handler
            handleHttpError(error, res, logger);
            return true;
        }
    }
}

const router = new Router();

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

// Add ecosystem simulation route
router.addRoute('/api/launch-ecosystem', 'POST', async (req, res) => {
    logger('info', 'Handling API request: POST /api/launch-ecosystem');
    
    try {
        // Parse request body if needed
        const body = await parseJsonBody(req);
        
        // Launch the ecosystem simulation
        const launchHandler = require('../projects/ecosystem-simulation/launch.js');
        await launchHandler(req, res);
    } catch (error) {
        throw new ValidationError('Failed to launch ecosystem simulation: ' + error.message);
    }
});

module.exports = router;