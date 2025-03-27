/**
 * Ecosystem Simulation Launch Handler
 * This script handles the launching of the Ecosystem Simulation Java application
 */

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const { logger } = require('../../server/utils/logger');

// Path to the ecosystem simulation project
const ECOSYSTEM_PATH = '/root/CascadeProjects/ISLA/ecosystem-simulation-';

/**
 * Handle the launch request for the ecosystem simulation
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 */
async function handleLaunch(req, res) {
    logger('info', 'Launching ecosystem simulation');
    
    // Check if the ecosystem simulation path exists
    if (!fs.existsSync(ECOSYSTEM_PATH)) {
        logger('error', `Ecosystem simulation path does not exist: ${ECOSYSTEM_PATH}`);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ 
            success: false, 
            message: 'Ecosystem simulation path not found' 
        }));
    }
    
    // Path to the build and run script
    const scriptPath = path.join(ECOSYSTEM_PATH, 'run.sh');
    
    // Create the run script if it doesn't exist
    if (!fs.existsSync(scriptPath)) {
        logger('info', `Creating run script at: ${scriptPath}`);
        
        const scriptContent = `#!/bin/bash
cd "${ECOSYSTEM_PATH}"
mvn clean compile assembly:single
java -jar target/ecosystem-simulation-1.0-SNAPSHOT-jar-with-dependencies.jar
`;
        
        try {
            fs.writeFileSync(scriptPath, scriptContent);
            fs.chmodSync(scriptPath, '755'); // Make executable
        } catch (error) {
            logger('error', `Error creating run script: ${error.message}`);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ 
                success: false, 
                message: 'Error creating run script' 
            }));
        }
    }
    
    // Execute the script
    logger('info', `Executing script: ${scriptPath}`);
    const child = exec(scriptPath, (error, stdout, stderr) => {
        if (error) {
            logger('error', `Error executing script: ${error.message}`);
            logger('error', `stderr: ${stderr}`);
            // We don't return here because the response has already been sent
        }
        logger('info', `stdout: ${stdout}`);
    });
    
    // Send response immediately, don't wait for the process to complete
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
        success: true, 
        message: 'Ecosystem Simulation launched successfully!' 
    }));
}

module.exports = handleLaunch;
