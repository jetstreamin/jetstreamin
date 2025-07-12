#!/data/data/com.termux/files/usr/bin/bash

# Install dependencies
pkg update -y && pkg install -y python ffmpeg sox git
pip install -r requirements.txt

# Copy files to app dir
mkdir -p ~/jetstreamin/agent_s24
cp -r . ~/jetstreamin/agent_s24/

# Start agent
nohup python3 ~/jetstreamin/agent_s24/main.py &
echo "Agent A (S24) started"
