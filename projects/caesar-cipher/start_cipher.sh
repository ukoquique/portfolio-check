#!/bin/bash

# Ensure script is executable
# chmod +x start_cipher.sh

# Forcefully kill any process using port 8081
fuser -k 8081/tcp 2>/dev/null

# Path to the project directory
PROJECT_DIR="/root/CascadeProjects/PORTFOLIO/PORTFOLIO_windsurf/projects/caesar-cipher"

# Create temporary directory if it doesn't exist
mkdir -p /tmp/cipher_server

# Copy web files to temporary server directory
cp -r "$PROJECT_DIR"/* /tmp/cipher_server/

# Change to server directory and start Python HTTP server
cd /tmp/cipher_server && python3 -m http.server 8081 &

echo "Caesar Cipher server started at http://localhost:8081"
echo "You can access it at http://localhost:3001/projects/caesar-cipher/ through the portfolio"
