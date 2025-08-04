#!/bin/bash
# Jetstreamin Cleanup Script

echo "🧹 Cleaning up Jetstreamin workspace..."

# Remove temporary files
find . -name "*.tmp" -delete
find . -name "*.log" -delete
find . -name "*backup*" -exec mv {} backups/ \;

# Organize directories
mkdir -p backups deployment docs scripts temp

# Clean node_modules if it exists
if [ -d "node_modules" ]; then
    echo "📦 Cleaning node_modules..."
    rm -rf node_modules
fi

# Show final structure
echo "✅ Cleanup complete!"
echo "📁 Directory structure:"
ls -la

echo "🌊 Jetstreamin workspace is now clean and organized!"
