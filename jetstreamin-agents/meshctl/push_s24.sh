#!/usr/bin/env bash
# Push to Samsung S24 via ADB
adb connect 192.168.1.100:5555
adb push agent_s24/ /sdcard/Download/jetstreamin/agent_s24
adb shell 'sh /sdcard/Download/jetstreamin/agent_s24/install.sh'
