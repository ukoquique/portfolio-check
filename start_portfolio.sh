#!/bin/bash

#==============================================================================
# Portfolio Website Startup Script
# This script handles the startup of the portfolio website, including:
# - Checking and killing existing processes on the configured port
# - Verifying dependencies are installed
# - Starting the Node.js server
#==============================================================================

# Configuration constants
readonly PORT=3001
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly LOG_PREFIX="[Portfolio]"

# Logging functions
log_info() {
    echo "${LOG_PREFIX} [INFO] $1"
}

log_error() {
    echo "${LOG_PREFIX} [ERROR] $1" >&2
}

# Error handling
set -e
trap 'log_error "Script interrupted. Cleaning up..."; exit 1' INT TERM

# Function to kill existing process on port
kill_existing_process() {
    local port=$1
    log_info "Checking for existing processes on port ${port}..."
    if command -v fuser &> /dev/null; then
        fuser -k "${port}/tcp" 2>/dev/null || true
    elif command -v lsof &> /dev/null; then
        kill $(lsof -t -i:"${port}") 2>/dev/null || true
    else
        log_error "Neither fuser nor lsof found. Cannot check for existing processes."
    fi
}

# Function to check dependencies
check_dependencies() {
    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed. Please install Node.js and npm first."
        exit 1
    fi
}

# Function to install node modules
install_dependencies() {
    if [ ! -d "node_modules" ]; then
        log_info "Installing dependencies..."
        if ! npm install; then
            log_error "Failed to install dependencies"
            exit 1
        fi
    fi
}

# Main execution
main() {
    # Change to the script directory
    if ! cd "${SCRIPT_DIR}"; then
        log_error "Failed to change to script directory"
        exit 1
    fi

    # Verify package.json exists
    if [ ! -f "package.json" ]; then
        log_error "package.json not found in ${SCRIPT_DIR}"
        exit 1
    fi

    # Check for npm
    check_dependencies
    
    # Install dependencies if needed
    install_dependencies

    # Kill existing process
    kill_existing_process "${PORT}"

    # Small delay to ensure port is released
    sleep 1

    # Start the server
    log_info "Starting Portfolio Website..."
    log_info "Once the server starts, open your browser and go to: http://localhost:${PORT}"
    if ! npm run start; then
        log_error "Failed to start server"
        exit 1
    fi
}

# Execute main function
main
