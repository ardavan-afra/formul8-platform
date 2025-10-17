#!/bin/bash

# Script to start Chrome with debugging enabled
# Usage: ./scripts/start-chrome-debug.sh

echo "🚀 Starting Chrome with debugging enabled..."

# Kill any existing Chrome processes with debugging
echo "Stopping any existing Chrome debug processes..."
pkill -f "chrome.*remote-debugging-port" || true

# Wait a moment
sleep 2

# Start Chrome with debugging enabled
echo "Starting Chrome with remote debugging on port 9222..."
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --remote-debugging-port=9222 \
  --disable-web-security \
  --disable-features=VizDisplayCompositor \
  --no-first-run \
  --no-default-browser-check \
  --user-data-dir=/tmp/chrome-debug-profile \
  http://localhost:3000 &

echo "✅ Chrome started with debugging enabled!"
echo ""
echo "You can now:"
echo "1. Use 'Attach to Chrome' configuration in VS Code"
echo "2. Or manually navigate to http://localhost:3000 in the opened Chrome window"
echo "3. Set breakpoints in VS Code and they should work"
echo ""
echo "To stop Chrome debugging, run: pkill -f 'chrome.*remote-debugging-port'"
