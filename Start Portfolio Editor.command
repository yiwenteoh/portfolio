#!/bin/zsh
cd "$(dirname "$0")"
clear
echo "Starting Yiwen's Portfolio Editor…"
echo "Keep this window open while editing."
node tools/portfolio-editor/server.mjs
echo ""
echo "The editor stopped. Press any key to close."
read -k 1
