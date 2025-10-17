#!/bin/bash

# Script to clean up Node.js debug ports
# Usage: ./scripts/cleanup-debug-ports.sh

echo "Cleaning up Node.js debug ports..."

# Common debug ports
PORTS=(9229 9230 9231 9232 9233)

for port in "${PORTS[@]}"; do
    echo "Checking port $port..."
    PID=$(lsof -ti:$port)
    if [ ! -z "$PID" ]; then
        echo "Killing process $PID on port $port"
        kill $PID
        sleep 1
        # Check if process is still running
        if kill -0 $PID 2>/dev/null; then
            echo "Force killing process $PID on port $port"
            kill -9 $PID
        fi
    else
        echo "Port $port is free"
    fi
done

echo "Debug port cleanup complete!"
echo "You can now start your debugger without port conflicts."
