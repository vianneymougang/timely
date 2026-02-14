#!/bin/bash

# Lighthouse CI Runner for Timely Frontend
# This script runs Lighthouse CI tests on the Angular application

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
FRONTEND_DIR="$PROJECT_ROOT/timely-frontend"
LIGHTHOUSE_DIR="$SCRIPT_DIR/.."

echo "=================================================="
echo "Timely Frontend - Lighthouse CI Performance Tests"
echo "=================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Lighthouse CI is installed
if ! command -v lhci &> /dev/null; then
    echo -e "${YELLOW}Lighthouse CI not found. Installing...${NC}"
    npm install -g @lhci/cli@0.13.x
fi

# Navigate to frontend directory
cd "$FRONTEND_DIR"

echo -e "${GREEN}1. Installing frontend dependencies...${NC}"
if [ ! -d "node_modules" ]; then
    npm install
fi

echo ""
echo -e "${GREEN}2. Building frontend for production...${NC}"
npm run build

echo ""
echo -e "${GREEN}3. Starting production server...${NC}"
# Kill any existing server on port 4200
lsof -ti:4200 | xargs kill -9 2>/dev/null || true

# Start the server in the background
npx http-server dist/timely-frontend/browser -p 4200 --silent &
SERVER_PID=$!
echo "Server started with PID: $SERVER_PID"

# Wait for server to be ready
echo "Waiting for server to be ready..."
sleep 5

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}Cleaning up...${NC}"
    kill $SERVER_PID 2>/dev/null || true
    lsof -ti:4200 | xargs kill -9 2>/dev/null || true
}
trap cleanup EXIT

echo ""
echo -e "${GREEN}4. Running Lighthouse CI tests...${NC}"
cd "$LIGHTHOUSE_DIR"

# Run Lighthouse CI
LHCI_BUILD_CONTEXT__CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "main") \
lhci autorun --config=lighthouserc.json

echo ""
echo -e "${GREEN}=================================================="
echo "Lighthouse CI tests completed!"
echo "=================================================="
echo ""
echo "Results saved to: $LIGHTHOUSE_DIR/.lighthouseci/"
echo ""
echo "To view detailed reports, run:"
echo "  lhci server --config=lighthouserc.json"
echo ""
