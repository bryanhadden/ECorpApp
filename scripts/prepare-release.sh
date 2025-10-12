#!/bin/bash

# E Corp EV - App Store Release Preparation Script
# This script helps prepare your app for App Store submission

set -e

echo "🚀 E Corp EV - App Store Release Preparation"
echo "============================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: Please run this script from the project root directory${NC}"
    exit 1
fi

echo "📋 Checklist for App Store Submission"
echo "======================================"
echo ""

# 1. Check for app icons
echo "1️⃣  Checking app icons..."
if [ -f "ios/ECorpApp/Images.xcassets/AppIcon.appiconset/Contents.json" ]; then
    echo -e "${GREEN}✓ App icon assets found${NC}"
else
    echo -e "${YELLOW}⚠ App icons may be missing or incomplete${NC}"
    echo "   Please add a 1024x1024 app icon to ios/ECorpApp/Images.xcassets/"
fi
echo ""

# 2. Check version numbers
echo "2️⃣  Checking version information..."
VERSION=$(node -p "require('./app.json').version")
echo -e "${GREEN}✓ App version: $VERSION${NC}"
echo ""

# 3. Check privacy descriptions
echo "3️⃣  Checking privacy descriptions..."
if grep -q "NSCameraUsageDescription" ios/ECorpApp/Info.plist; then
    echo -e "${GREEN}✓ Camera usage description added${NC}"
else
    echo -e "${RED}✗ Camera usage description missing${NC}"
fi

if grep -q "NSLocationWhenInUseUsageDescription" ios/ECorpApp/Info.plist; then
    echo -e "${GREEN}✓ Location usage description added${NC}"
else
    echo -e "${RED}✗ Location usage description missing${NC}"
fi
echo ""

# 4. Check for required documentation
echo "4️⃣  Checking documentation..."
if [ -f "docs/PRIVACY_POLICY.md" ]; then
    echo -e "${GREEN}✓ Privacy policy found${NC}"
else
    echo -e "${YELLOW}⚠ Privacy policy not found${NC}"
fi

if [ -f "docs/APP_STORE_DEPLOYMENT.md" ]; then
    echo -e "${GREEN}✓ Deployment guide found${NC}"
else
    echo -e "${YELLOW}⚠ Deployment guide not found${NC}"
fi
echo ""

# 5. Run tests
echo "5️⃣  Running type checks..."
npm run type-check
echo -e "${GREEN}✓ TypeScript checks passed${NC}"
echo ""

echo "6️⃣  Running linter..."
npm run lint
echo -e "${GREEN}✓ Linting passed${NC}"
echo ""

# 7. Clean and prepare iOS build
echo "7️⃣  Cleaning iOS build..."
cd ios
rm -rf build
rm -rf Pods
echo -e "${GREEN}✓ iOS build cleaned${NC}"
echo ""

echo "8️⃣  Installing dependencies..."
pod install
echo -e "${GREEN}✓ CocoaPods dependencies installed${NC}"
cd ..
echo ""

# 9. Summary
echo "✅ Pre-Release Checklist Complete!"
echo "=================================="
echo ""
echo "Next Steps:"
echo "1. Open ios/ECorpApp.xcworkspace in Xcode"
echo "2. Set your Bundle Identifier (e.g., com.yourcompany.ecorp)"
echo "3. Configure Signing & Capabilities with your Apple Developer account"
echo "4. Select 'Generic iOS Device' or a connected device"
echo "5. Go to Product → Archive"
echo "6. Upload to App Store Connect"
echo ""
echo "📖 See docs/APP_STORE_DEPLOYMENT.md for detailed instructions"
echo ""
echo -e "${GREEN}Good luck with your submission! 🎉${NC}"

