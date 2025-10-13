# Fix Archive Build Issue

## Problem

Archive build fails with: "No profiles for 'com.bryan.ecorpapp' were found"

## Solution

### Option 1: Enable Automatic Signing in Xcode (RECOMMENDED)

1. Open Xcode:

```bash
open ios/ECorpApp.xcworkspace
```

2. In Xcode:

   - Click on **ECorpApp** project (blue icon at top)
   - Select **ECorpApp** target
   - Go to **Signing & Capabilities** tab
   - ✅ **CHECK** "Automatically manage signing" for BOTH:
     - Debug configuration
     - Release configuration
   - Select your **Team** from dropdown

3. Try archiving again:
   - Product → Archive

### Option 2: Use Command Line with Auto-Provisioning

If you prefer command line:

```bash
cd /Users/Bryan/Documents/Projects/ECorpApp

xcodebuild \
  -workspace ios/ECorpApp.xcworkspace \
  -scheme ECorpApp \
  -configuration Release \
  -archivePath ios/build/ECorpApp.xcarchive \
  -allowProvisioningUpdates \
  archive
```

### Option 3: Quick Fix Script

Run this script to archive with auto-provisioning:

```bash
#!/bin/bash
cd /Users/Bryan/Documents/Projects/ECorpApp

# Clean build
rm -rf ios/build

# Archive with auto-provisioning
xcodebuild \
  -workspace ios/ECorpApp.xcworkspace \
  -scheme ECorpApp \
  -configuration Release \
  -archivePath ios/build/ECorpApp.xcarchive \
  -allowProvisioningUpdates \
  clean archive

echo "✅ Archive created at: ios/build/ECorpApp.xcarchive"
echo "Now open Xcode Organizer to distribute the app"
```

## Why This Happens

- **Debug builds** use development signing (less strict)
- **Release/Archive builds** require App Store distribution signing
- Your bundle ID: `com.bryan.ecorpapp`
- Automatic signing was disabled or not configured for Release

## Verify Settings

Check your bundle identifier in Xcode:

- Project Settings → General → Identity
- Should be: `com.bryan.ecorpapp` (or change to your preferred ID)

## After Fixing

Once automatic signing is enabled:

1. Archive will work: Product → Archive
2. Xcode will automatically create certificates and profiles
3. You can then distribute to App Store Connect

## Common Issues

### "No Apple ID Found"

- Add your Apple ID: Xcode → Settings → Accounts
- Click "+" and sign in with your Apple Developer account

### "No Team Found"

- Make sure you're enrolled in Apple Developer Program ($99/year)
- Wait 24-48 hours after enrollment for team to be active

### "Agreement Needs to be Accepted"

- Go to https://developer.apple.com
- Sign in and accept any pending agreements
