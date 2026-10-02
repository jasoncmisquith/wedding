#!/bin/bash
# Local development launcher
echo "=================================================="
echo "💍 Wedding Website Local Server Launcher"
echo "=================================================="

if command -v docker &> /dev/null && docker info &> /dev/null; then
    echo "🐳 Docker is running. Starting container on http://localhost:3000 ..."
    docker compose up
else
    echo "⚡ Launching instant local preview on http://localhost:3000 ..."
    echo "   (Open http://localhost:3000 in your browser)"
    echo "   Press Ctrl+C to stop."
    cd public && python3 -m http.server 3000
fi
