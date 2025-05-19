/**
 * Code Processor Launch Handler
 * This script handles the launching of the Code Processor Python application
 */

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const { logger } = require('../../server/utils/logger');

// Path to the Code Processor Python application
const CODE_PROCESSOR_PATH = '/root/CascadeProjects/CODES_JOIN/Ensayo_BOLTNEW/Ensayo-PYTHON/CodeProcessor_Py-';

/**
 * Handle the launch request for the Code Processor application
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 */
async function handleLaunch(req, res) {
    logger('info', 'Launching Code Processor Python application');
    
    // Check if the Code Processor path exists
    if (!fs.existsSync(CODE_PROCESSOR_PATH)) {
        logger('error', `Code Processor path does not exist: ${CODE_PROCESSOR_PATH}`);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ 
            success: false, 
            message: 'Code Processor path not found' 
        }));
    }
    
    // Path to the executable
    const executablePath = path.join(CODE_PROCESSOR_PATH, 'dist/CodeProcessor');
    
    // Check if the executable exists
    if (!fs.existsSync(executablePath)) {
        logger('error', `Code Processor executable not found: ${executablePath}`);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ 
            success: false, 
            message: 'Code Processor executable not found' 
        }));
    }
    
    // Make sure the executable has execute permissions
    try {
        fs.chmodSync(executablePath, '755'); // Make executable
    } catch (error) {
        logger('error', `Error setting executable permissions: ${error.message}`);
        // Continue anyway, it might already have the right permissions
    }
    
    // Execute the application
    logger('info', `Executing Code Processor: ${executablePath}`);
    const child = exec(executablePath, (error, stdout, stderr) => {
        if (error) {
            logger('error', `Error executing Code Processor: ${error.message}`);
            logger('error', `stderr: ${stderr}`);
            // We don't return here because the response has already been sent
        }
        logger('info', `stdout: ${stdout}`);
    });
    
    // Send response immediately, don't wait for the process to complete
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
        success: true, 
        message: 'Code Processor launched successfully!' 
    }));
}

module.exports = handleLaunch;
