#!/bin/bash

# E Corp EV - Archive Script
# This script creates an archive for App Store submission

set -e

echo "🏗️  E Corp EV - Creating Archive"
echo "================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: Please run this script from the project root directory${NC}"
    exit 1
fi

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf ios/build
echo -e "${GREEN}✓ Cleaned${NC}"
echo ""

# Run pre-flight checks
echo "🔍 Running pre-flight checks..."
npm run type-check
npm run lint
echo -e "${GREEN}✓ All checks passed${NC}"
echo ""

# Archive
echo "📦 Creating archive (this may take 5-10 minutes)..."
echo ""

xcodebuild \
  -workspace ios/ECorpApp.xcworkspace \
  -scheme ECorpApp \
  -configuration Release \
  -archivePath ios/build/ECorpApp.xcarchive \
  -allowProvisioningUpdates \
  clean archive

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Archive created successfully!${NC}"
    echo ""
    echo "📍 Archive location: ios/build/ECorpApp.xcarchive"
    echo ""
    echo "Next steps:"
    echo "1. Open Xcode Organizer:"
    echo "   open -a Xcode ios/build/ECorpApp.xcarchive"
    echo ""
    echo "2. Click 'Distribute App'"
    echo "3. Select 'App Store Connect'"
    echo "4. Click 'Upload'"
    echo "5. Wait for processing (10-30 minutes)"
    echo ""
    echo -e "${GREEN}Good luck! 🚀${NC}"
else
    echo ""
    echo -e "${RED}❌ Archive failed${NC}"
    echo ""
    echo "Common fixes:"
    echo "1. Open Xcode: open ios/ECorpApp.xcworkspace"
    echo "2. Enable 'Automatically manage signing'"
    echo "3. Select your Team"
    echo "4. Try Product → Archive from Xcode"
    echo ""
    echo "See docs/FIX_ARCHIVE_BUILD.md for more help"
    exit 1
fi

