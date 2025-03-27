#!/bin/bash

# Change to the portfolio directory
cd "$(dirname "$0")"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed. Please install Node.js and npm first."
    exit 1
fi

# Kill any existing process using port 3001
echo "Checking for existing processes on port 3001..."
if command -v fuser &> /dev/null; then
    fuser -k 3001/tcp 2>/dev/null || true
elif command -v lsof &> /dev/null; then
    # Alternative using lsof if fuser is not available
    kill $(lsof -t -i:3001) 2>/dev/null || true
fi

# Small delay to ensure port is released
sleep 1

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Start the server
echo "Starting Portfolio Website..."
echo "Once the server starts, open your browser and go to: http://localhost:3001"
npm run start
