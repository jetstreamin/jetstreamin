# Jetstreamin Capsule v1.0

This repository contains the Jetstreamin dual-agent demo scaffold:

- Agent A: Samsung S24 (Termux)
- Agent B: Samsung TV (AndroidTV/Tizen/FireTV)
- Shared mesh link, TTS/STT modules
- CI/CD via GitHub Actions
- CLI deployment tools

## Setup

1. Clone this repo
2. Configure target device IPs and credentials in `meshctl/config.yaml`
3. Run `meshctl/test_local.sh` to verify environment
4. Push agents:
   - `meshctl/push_s24.sh`
   - `meshctl/push_tv.sh`
5. Agents auto-install and start

## Directory Overview
- `.github/workflows/deploy-mesh.yml`: CI/CD pipeline
- `agent_s24/`: Phone agent code and installer
- `agent_tv/`: TV agent code and installer
- `shared/`: Mesh communication and voice modules
- `meshctl/`: Local CLI for deployment and testing
- `dag/`: Persistent DAG trace log
