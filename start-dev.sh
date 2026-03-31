#!/bin/bash

# AI Canvas - Development Server Startup Script
# macOS / Linux

PORT=5173
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "=========================================="
echo "   AI Canvas - Development Server"
echo "=========================================="
echo ""

# Function to kill process on port
kill_port() {
  local port=$1
  if command -v lsof &> /dev/null; then
    # macOS
    local pid=$(lsof -ti :$port 2>/dev/null)
    if [ -n "$pid" ]; then
      echo "Port $port is in use by PID $pid. Killing process..."
      kill -9 $pid 2>/dev/null
      sleep 2
    fi
  elif command -v netstat &> /dev/null; then
    # Linux
    local pid=$(netstat -tlnp 2>/dev/null | grep :$port | awk '{print $7}' | cut -d'/' -f1)
    if [ -n "$pid" ]; then
      echo "Port $port is in use by PID $pid. Killing process..."
      kill -9 $pid 2>/dev/null
      sleep 2
    fi
  elif command -v ss &> /dev/null; then
    # Linux (alternative)
    local pid=$(ss -tlnp 2>/dev/null | grep :$port | awk '{print $7}' | cut -d'/' -f1)
    if [ -n "$pid" ]; then
      echo "Port $port is in use by PID $pid. Killing process..."
      kill -9 $pid 2>/dev/null
      sleep 2
    fi
  fi
}

# Check and kill process on port
kill_port $PORT

# Navigate to project directory
cd "$PROJECT_DIR"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "node_modules not found. Installing dependencies..."
  if command -v pnpm &> /dev/null; then
    pnpm install
  elif command -v npm &> /dev/null; then
    npm install
  else
    echo "Error: Neither pnpm nor npm found. Please install Node.js first."
    exit 1
  fi
fi

# Start development server
echo ""
echo "Starting development server..."
echo "Project directory: $PROJECT_DIR"
echo "Server will be available at: http://localhost:$PORT"
echo ""
echo "Press Ctrl+C to stop the server"
echo "=========================================="
echo ""

# Open browser after a short delay
(
  sleep 3
  if command -v open &> /dev/null; then
    # macOS
    open "http://localhost:$PORT"
  elif command -v xdg-open &> /dev/null; then
    # Linux
    xdg-open "http://localhost:$PORT"
  fi
) &

# Start the dev server
if command -v pnpm &> /dev/null; then
  exec pnpm dev
elif command -v npm &> /dev/null; then
  exec npm run dev
else
  echo "Error: Neither pnpm nor npm found."
  exit 1
fi
