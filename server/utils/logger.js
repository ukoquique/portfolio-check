/**
 * Enhanced logger utility with support for different output formats and severity levels
 * @param {string} level - Log level (debug, info, warn, error)
 * @param {string} message - Log message
 * @param {Object} [data] - Optional data to include in log
 */
function logger(level, message, data = null) {
    // Default to info level if invalid level provided
    if (!['debug', 'info', 'warn', 'error'].includes(level)) {
        level = 'info';
    }
    
    // Skip debug logs in production
    if (level === 'debug' && process.env.NODE_ENV === 'production') {
        return;
    }
    
    const timestamp = new Date().toISOString();
    const logData = data ? ` ${JSON.stringify(data, null, 2)}` : '';
    
    // Add color to console output based on level
    const colors = {
        debug: '\x1b[36m', // Cyan
        info: '\x1b[32m',  // Green
        warn: '\x1b[33m',  // Yellow
        error: '\x1b[31m'  // Red
    };
    
    const resetColor = '\x1b[0m';
    const colorCode = colors[level] || '';
    
    // Format: [TIMESTAMP] [LEVEL] MESSAGE {DATA}
    console[level === 'debug' ? 'log' : level](
        `${colorCode}[${timestamp}] [${level.toUpperCase()}] ${message}${resetColor}${logData}`
    );
    
    // TODO: In a production app, you might want to add file logging or external logging service here
}

module.exports = { logger };