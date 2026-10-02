#!/bin/bash
# -------------------------------------------------------------
# Wedding Website Local Server Launcher (Bulletproof)
# -------------------------------------------------------------

# Add common Docker paths to PATH if missing
export PATH="/Applications/Docker.app/Contents/Resources/bin:/usr/local/bin:/opt/homebrew/bin:$PATH"

echo "=================================================="
echo "💍 Wedding Website Local Server"
echo "=================================================="

# Check if port 3000 is already active and serving
if lsof -i :3000 &> /dev/null; then
    echo "✅ Website is already running and active on http://localhost:3000 !"
    echo "   Opening in your default browser..."
    open "http://localhost:3000"
    exit 0
fi

# If Docker is available, start via Docker Compose
if command -v docker &> /dev/null && docker info &> /dev/null; then
    echo "🐳 Docker is running. Starting container on http://localhost:3000 ..."
    open "http://localhost:3000" 2>/dev/null &
    docker compose up
    exit 0
fi

# Fallback: Launch native Python server
PORT=3000
if lsof -i :$PORT &> /dev/null; then
    PORT=3001
fi

echo "⚡ Starting local preview on http://localhost:$PORT ..."
echo "   (Press Ctrl+C to stop)"
open "http://localhost:$PORT" 2>/dev/null &
cd public && python3 -m http.server $PORT
