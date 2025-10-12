# App Store Screenshots Guide

## Overview

You need to take screenshots of your app for the App Store listing. This guide will help you capture the best screens.

## Required Screenshot Sizes

Apple requires screenshots for multiple device sizes:

### iPhone (Required)

- **iPhone 6.9" Display** (iPhone 16 Pro Max): 1320 x 2868 pixels
- **iPhone 6.7" Display** (iPhone 15 Pro Max): 1290 x 2796 pixels
- **iPhone 6.5" Display** (iPhone 11 Pro Max): 1242 x 2688 pixels

### iPad (Optional but Recommended)

- **iPad Pro 12.9"**: 2048 x 2732 pixels

## How to Take Screenshots

### Option 1: From iOS Simulator (Easiest)

1. Run the app in different simulators:

```bash
# iPhone 16 Pro Max
npx react-native run-ios --simulator="iPhone 16 Pro Max"

# iPhone 15 Pro Max
npx react-native run-ios --simulator="iPhone 15 Pro Max"
```

2. Take screenshots using:

   - **Keyboard**: `Cmd + S`
   - **Menu**: Device → Screenshot
   - Screenshots save to Desktop

3. Navigate through the app to capture key screens (see recommendations below)

### Option 2: From Physical Device

1. Connect iPhone to Mac
2. Open Xcode → Window → Devices and Simulators
3. Select your device
4. Click "Take Screenshot" button
5. Screenshots saved to Downloads folder

### Option 3: Using xcrun Command

```bash
# Start simulator
open -a Simulator

# Run your app
npm run ios

# Take screenshot
xcrun simctl io booted screenshot ~/Desktop/screenshot.png
```

## Recommended Screens to Capture

### 1. Login/Role Selection Screen ⭐ HERO IMAGE

- **What to show**: The beautiful role selection screen
- **Why**: First impression, shows app purpose
- **Tip**: This is your hero image - make it count!

### 2. Warehouse Dashboard

- **What to show**: Warehouse worker scanning parts
- **Why**: Shows inventory management features
- **What to capture**:
  - Recent scans list
  - Quick actions buttons
  - Parts inventory overview

### 3. Sales Dashboard

- **What to show**: Sales metrics and new sale form
- **Why**: Demonstrates sales management
- **What to capture**:
  - Sales statistics
  - Vehicle lineup
  - "Record New Sale" feature

### 4. Customer Service Dashboard

- **What to show**: Active tickets and inquiries
- **Why**: Shows customer support features
- **What to capture**:
  - Ticket list
  - Priority indicators
  - Customer information

### 5. Mechanic Dashboard

- **What to show**: Service tickets workflow
- **Why**: Highlights service management
- **What to capture**:
  - My active tickets
  - Available tickets
  - Common services list

### 6. Executive Dashboard (C-Suite)

- **What to show**: Analytics and charts
- **Why**: Demonstrates business intelligence
- **What to capture**:
  - Sales analytics
  - Dealership metrics
  - Revenue projections

## Screenshot Tips

### Do's ✅

- Use realistic demo data (already in mockData.ts)
- Capture in portrait orientation
- Show features in action
- Keep status bar visible (shows time, battery, signal)
- Ensure good contrast and readability
- Highlight key features with annotations (can add in App Store Connect)

### Don'ts ❌

- No placeholder text or "lorem ipsum"
- No empty states unless intentional
- No personal information
- No broken UI or bugs visible
- No simulator bezels (use clean screenshots)

## Editing Screenshots

### Tools

- **macOS Preview**: Basic editing, annotations
- **Figma**: Professional mockups with device frames
- **Sketch**: Professional mockups
- **Screenshots.pro**: Add device frames online

### Adding Device Frames (Optional)

Make your screenshots look professional by adding device frames:

1. Use https://screenshots.pro or similar
2. Upload your raw screenshots
3. Select device type (iPhone 15 Pro Max, etc.)
4. Download with frame

### Adding Text Overlays

Consider adding descriptive text to screenshots:

- "Scan & Track Inventory"
- "Close Deals Faster"
- "Manage Service Tickets"
- "Real-Time Analytics"

## Screenshot Naming Convention

Organize your screenshots:

```
screenshots/
  iphone-6.9/
    01-role-selection.png
    02-warehouse-dashboard.png
    03-sales-dashboard.png
    04-customer-service.png
    05-mechanic-dashboard.png
    06-executive-analytics.png
  iphone-6.7/
    (same structure)
  iphone-6.5/
    (same structure)
```

## Testing Your Screenshots

Before uploading:

1. View on actual device size to check readability
2. Ensure all text is legible
3. Check that colors look good
4. Verify no sensitive information visible
5. Confirm all screenshots are the correct dimensions

## App Preview Video (Optional)

Consider creating a 15-30 second video:

1. Show app launch
2. Role selection
3. Quick tour of each dashboard
4. Highlight key features
5. End with logo/tagline

**Tools**: QuickTime Screen Recording, iMovie, Final Cut Pro

## Quick Command to Generate All Screenshots

Create a screenshots directory:

```bash
mkdir -p screenshots/iphone-6.9
mkdir -p screenshots/iphone-6.7
mkdir -p screenshots/iphone-6.5
```

## Upload to App Store Connect

1. Go to App Store Connect
2. Select your app → App Store tab
3. Scroll to "App Store Screenshots"
4. Drag and drop screenshots for each device size
5. Arrange in desired order (first screenshot is the hero image)

## Best Practices Summary

1. **First screenshot is crucial** - Make it your best one (role selection screen)
2. **Show the app in use** - Not just static screens
3. **Tell a story** - Flow from one feature to the next
4. **Use real data** - Makes app look production-ready
5. **3-5 screenshots minimum** - Don't overwhelm, show the best

---

Need help? See the [App Store Screenshot Specifications](https://developer.apple.com/help/app-store-connect/reference/screenshot-specifications)
