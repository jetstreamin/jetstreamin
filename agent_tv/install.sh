#!/usr/bin/env bash
# Adjust path for AndroidTV or SSH target

apt-get update && apt-get install -y python3 ffmpeg sox git
pip3 install -r requirements.txt

mkdir -p ~/jetstreamin/agent_tv
cp -r . ~/jetstreamin/agent_tv/

nohup python3 ~/jetstreamin/agent_tv/main.py &
echo "Agent B (TV) started"
