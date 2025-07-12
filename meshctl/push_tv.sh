#!/usr/bin/env bash
# Push to TV via SSH or ADB
ssh tv@192.168.1.200 "mkdir -p ~/jetstreamin/agent_tv"
scp -r agent_tv/* tv@192.168.1.200:~/jetstreamin/agent_tv/
ssh tv@192.168.1.200 "sh ~/jetstreamin/agent_tv/install.sh"
