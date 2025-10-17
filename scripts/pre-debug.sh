#!/bin/bash

# Pre-debug script to ensure clean state
echo "🧹 Preparing for debugging session..."

# Kill any existing Node.js debug processes
echo "Stopping any existing debug processes..."
pkill -f "node.*--inspect" || true

# Wait a moment for processes to fully terminate
sleep 2

# Run the cleanup script
echo "Cleaning up debug ports..."
./scripts/cleanup-debug-ports.sh

echo "✅ Ready for debugging! You can now start your debug session."
echo ""
echo "Recommended configurations:"
echo "  - Debug Full Stack (Recommended) - Uses auto port selection"
echo "  - Debug Full Stack (Alternative) - Uses port 9232"
echo "  - Debug Server (Auto Port) - Server only with auto port"
echo ""
