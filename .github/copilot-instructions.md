# Copilot Instructions for skate.church

## Project Overview

**skate.church** appears to be a faith-based community platform with skating/action sports elements. This project is currently in early development stages.

## Architecture & Structure

*This section will be updated as the codebase develops.*

### Core Components
- **Jetstreamin Runtime**: Autonomous agent platform (`~/jetstreamin/neta_runtime`)
- **NETA**: Executive authority for operations oversight
- **ATM**: Automated Thought Machine for context processing
- **Multimedia Pipeline**: FFmpeg-based sermon/content generation
- **Distribution**: Auto-share via termux-share integration

### Technology Stack
- **Platform**: Android (Termux) and cloud infrastructure
- **Media Processing**: FFmpeg (Android-compatible builds)
- **Runtime**: Jetstreamin autonomous agent platform
- **Audio**: Voice synthesis integration (sermon_voice.mp3)
- **Video**: Portrait format (720x1280) optimized for mobile sharing

## Development Workflows

### Getting Started
```bash
# Clone and setup (commands to be updated)
git clone [repository-url]
cd skate.church
# Setup commands TBD
```

### Multimedia Content Creation

#### Sermon Video Generation (Android/Termux Compatible)
Create synchronized sermon videos with text overlays using FFmpeg:

```bash
cd ~/jetstreamin/neta_runtime && ffmpeg -y \
-f lavfi -i color=c=black:s=720x1280:d=36 \
-i sermon_voice.mp3 \
-vf "drawtext=fontfile=/system/fonts/Roboto-Regular.ttf:text='A reading from the Book of Mullen.':enable='between(t,0,4)':x=(w-text_w)/2:y=(h-text_h)/2:fontsize=56:fontcolor=white:shadowcolor=black@0.7:shadowx=2:shadowy=2:line_spacing=12" \
-c:v libx264 -pix_fmt yuv420p -c:a aac -shortest sermon_sync.mp4 \
&& termux-share sermon_sync.mp4
```

**Key Android/Termux Considerations:**
- Use `shadowx`/`shadowy` instead of `shadoww` (desktop-only)
- Font path: `/system/fonts/Roboto-Regular.ttf` 
- Multi-line text via `$'text\nmore text'` syntax
- Auto-share with `termux-share` for distribution

### Building & Testing
*Build and test commands to be documented*

### Deployment
*Deployment process to be documented*

## Coding Conventions

### General Principles
- Follow established patterns as they emerge
- Maintain consistency with community/faith-focused naming
- Consider accessibility for diverse user base

### File Organization
- **Runtime Directory**: `~/jetstreamin/neta_runtime` for active operations
- **Media Assets**: Audio files (e.g., `sermon_voice.mp3`) in runtime directory
- **Output**: Generated videos auto-shared via termux-share
- **Logs**: Comprehensive audit trails for autonomous operations

### Naming Conventions
- Consider faith-positive and inclusive terminology
- Use clear, descriptive names for skating/community features
- Maintain professional standards appropriate for religious community

## Key Integration Points

*External services and APIs to be documented*

## Debugging & Troubleshooting

### FFmpeg Android/Termux Issues
- **Shadow effects**: Use `shadowx`/`shadowy` instead of `shadoww` (desktop-only flag)
- **Font paths**: Always use `/system/fonts/` for Android system fonts
- **Multi-line text**: Use `$'line1\nline2'` syntax for proper newline handling
- **Timing drift**: Adjust `between(t,START,END)` windows by ±0.5 seconds for sync issues
- **Audio sync**: Use `-shortest` flag to prevent video/audio length mismatches

## Project-Specific Notes

- This is a community-focused platform combining faith and skating culture
- Consider accessibility and inclusivity in all development decisions
- Maintain appropriate content standards for religious community context

---

*This file should be updated regularly as the project architecture and conventions become established.*