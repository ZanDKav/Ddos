#!/bin/bash

echo "ZANDKAV-AI DDOS TELEGRAM BOT"
echo "=============================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "[!] Node.js not found! Installing..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
fi

# Install dependencies
echo "[+] Installing dependencies..."
npm install

# Check Termux
if [[ "$TERMUX_VERSION" ]]; then
    echo "[+] Termux detected! Optimizing..."
    export NODE_OPTIONS="--max-old-space-size=512"
fi

# Start Bot
echo "[+] Starting Telegram Bot..."
node bot.js
