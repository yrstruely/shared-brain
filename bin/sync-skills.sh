#!/bin/bash
# Sync framework skills to Claude Code global skills directory
# Run this after editing any .framework/skills/*.md file

SOURCE_DIR="$(cd "$(dirname "$0")/.." && pwd)/.framework/skills"
TARGET_DIR="$HOME/.claude/skills"

echo "Syncing framework skills to Claude Code..."
echo "Source: $SOURCE_DIR"
echo "Target: $TARGET_DIR"
echo ""

# Remove old skills
rm -f "$TARGET_DIR"/*.md

# Copy current skills
cp "$SOURCE_DIR"/*.md "$TARGET_DIR/"

# Verify count
SOURCE_COUNT=$(ls "$SOURCE_DIR"/*.md | wc -l)
TARGET_COUNT=$(ls "$TARGET_DIR"/*.md | wc -l)

echo "Done: $TARGET_COUNT skills synced"
echo ""
ls -1 "$TARGET_DIR"/*.md | xargs -n1 basename
