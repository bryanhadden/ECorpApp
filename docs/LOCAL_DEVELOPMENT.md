# Local Development Setup Guide

This guide will help you set up the E Corp app for local development on both iOS and Android platforms.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Initial Setup](#initial-setup)
- [iOS Development](#ios-development)
- [Android Development](#android-development)
- [Running the App](#running-the-app)
- [Development Tips](#development-tips)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Common Requirements (Both Platforms)

1. **Node.js** (v20.19.4 or higher recommended)

   ```bash
   # Check your Node version
   node --version

   # Install via Homebrew (macOS)
   brew install node

   # Or download from: https://nodejs.org/
   ```

2. **Watchman** (for file watching)

   ```bash
   brew install watchman
   ```

3. **Git**

   ```bash
   # Check if installed
   git --version

   # Install via Homebrew
   brew install git
   ```

4. **Code Editor**
   - [VS Code](https://code.visualstudio.com/) (recommended)
   - Install React Native Tools extension
   - Install ESLint extension

---

## iOS Development

### Requirements

1. **macOS Required** - iOS development only works on macOS

2. **Xcode** (14.0 or later)

   ```bash
   # Install from Mac App Store
   # Or download from: https://developer.apple.com/xcode/

   # After installation, install Command Line Tools
   xcode-select --install
   ```

3. **CocoaPods** (dependency manager for iOS)

   ```bash
   # Install CocoaPods
   sudo gem install cocoapods

   # Verify installation
   pod --version
   ```

4. **Ruby** (2.7 or higher, comes with macOS)

   ```bash
   # Check version
   ruby --version

   # If needed, install via Homebrew
   brew install ruby
   ```

### iOS Setup Steps

1. **Clone and Install Dependencies**

   ```bash
   cd /path/to/ECorpApp
   npm install
   ```

2. **Install iOS Pods**

   ```bash
   cd ios

   # Optional: If using bundler
   bundle install

   # Install pods
   pod install

   # Or with bundler
   bundle exec pod install

   cd ..
   ```

3. **Open in Xcode (Optional)**

   ```bash
   open ios/ECorpApp.xcworkspace
   ```

   ⚠️ **Important**: Always open the `.xcworkspace` file, NOT the `.xcodeproj` file!

### iOS Simulators

```bash
# List available simulators
xcrun simctl list devices

# Create a new simulator (if needed)
xcrun simctl create "iPhone 15" com.apple.CoreSimulator.SimDeviceType.iPhone-15 com.apple.CoreSimulator.SimRuntime.iOS-17-0
```

---

## Android Development

### Requirements

1. **Java Development Kit (JDK 17)**

   ```bash
   # Install via Homebrew
   brew install openjdk@17

   # Add to your ~/.zshrc or ~/.bash_profile
   export JAVA_HOME=$(/usr/libexec/java_home -v 17)
   export PATH=$JAVA_HOME/bin:$PATH

   # Verify installation
   java -version
   ```

2. **Android Studio** (Latest version)

   - Download from: https://developer.android.com/studio
   - Install during setup:
     - Android SDK
     - Android SDK Platform
     - Android Virtual Device (AVD)

3. **Android SDK Setup**

   ```bash
   # Add to ~/.zshrc or ~/.bash_profile
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/tools/bin

   # Apply changes
   source ~/.zshrc  # or source ~/.bash_profile

   # Verify
   adb --version
   ```

4. **SDK Packages** (via Android Studio)
   - Open Android Studio
   - Go to: Preferences → Appearance & Behavior → System Settings → Android SDK
   - Install:
     - Android 13.0 (Tiramisu) - API Level 33
     - Android SDK Build-Tools
     - Android Emulator
     - Android SDK Platform-Tools

### Android Setup Steps

1. **Install Dependencies**

   ```bash
   cd /path/to/ECorpApp
   npm install
   ```

2. **Accept Android Licenses**

   ```bash
   sdkmanager --licenses
   ```

3. **Create Android Virtual Device (AVD)**
   - Open Android Studio
   - Tools → Device Manager
   - Create Device → Select a phone (e.g., Pixel 7)
   - Download a system image (e.g., API 33)
   - Finish setup

---

## Initial Setup

### 1. Clone and Install

```bash
# Navigate to project
cd /Users/Bryan/Documents/Projects/ECorpApp

# Install dependencies
npm install

# For iOS only
cd ios && pod install && cd ..
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```bash
# .env
NODE_ENV=development
API_URL=http://localhost:3000
```

### 3. Verify React Native Setup

```bash
# Run React Native Doctor (diagnoses environment issues)
npx react-native doctor

# This will check:
# - Node.js
# - Watchman
# - Xcode (iOS)
# - Android SDK
# - Android Studio
```

---

## Running the App

### Start Metro Bundler

Always start Metro first in a dedicated terminal:

```bash
# Terminal 1
cd /Users/Bryan/Documents/Projects/ECorpApp
npm start

# Or
npx react-native start

# To reset cache
npm start -- --reset-cache
```

### Run on iOS

```bash
# Terminal 2 (keep Metro running in Terminal 1)

# Run on default simulator
npm run ios

# Or
npx react-native run-ios

# Run on specific simulator
npx react-native run-ios --simulator="iPhone 15 Pro"

# Run on specific iOS version
npx react-native run-ios --simulator="iPhone 14" --udid="specific-udid"
```

### Run on Android

```bash
# Terminal 2 (keep Metro running in Terminal 1)

# Start emulator first (or connect physical device)
emulator -avd Pixel_7_API_33

# In another terminal, run the app
npm run android

# Or
npx react-native run-android

# Run on specific variant
npx react-native run-android --variant=debug
```

### Run on Physical Devices

#### iOS Physical Device

1. Connect iPhone via USB
2. Open `ios/ECorpApp.xcworkspace` in Xcode
3. Select your device from the device menu
4. Configure signing: Signing & Capabilities → Team → Select your Apple ID
5. Click Run (▶️) button

#### Android Physical Device

1. Enable Developer Options on Android device:
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times
2. Enable USB Debugging in Developer Options
3. Connect device via USB
4. Verify device is connected:
   ```bash
   adb devices
   ```
5. Run the app:
   ```bash
   npm run android
   ```

---

## Development Tips

### Hot Reload

- **Fast Refresh**: Automatically enabled
  - Saves → App updates
  - Preserves component state

### Debug Menu

**iOS Simulator:**

- Press `Cmd + D` to open debug menu

**Android Emulator:**

- Press `Cmd + M` (macOS) or `Ctrl + M` (Windows/Linux)

**Physical Device:**

- Shake the device

### Debug Options

1. **Reload**: `Cmd + R` (iOS) or `R + R` (Android)
2. **Open DevTools**: Select "Debug" from debug menu
3. **Element Inspector**: Select "Show Inspector"
4. **Performance Monitor**: Select "Perf Monitor"

### React Native Debugger

```bash
# Install standalone debugger
brew install --cask react-native-debugger

# Or download from:
# https://github.com/jhen0409/react-native-debugger

# Open it before starting the app
open "rndebugger://set-debugger-loc?host=localhost&port=8081"
```

### Flipper (Recommended)

Already included in React Native 0.82:

1. Download Flipper: https://fbflipper.com/
2. Start Flipper
3. Run your app
4. Flipper will automatically connect

Features:

- Network inspector
- Layout inspector
- Logs viewer
- React DevTools
- Redux DevTools

### TypeScript

```bash
# Type check without running the app
npx tsc --noEmit

# Watch mode
npx tsc --noEmit --watch
```

---

## Development Workflow

### Typical Development Session

```bash
# Terminal 1: Metro Bundler
cd /Users/Bryan/Documents/Projects/ECorpApp
npm start

# Terminal 2: iOS/Android
npm run ios
# or
npm run android

# Terminal 3: Type checking (optional)
npx tsc --noEmit --watch

# Terminal 4: Linting (optional)
npm run lint -- --watch
```

### Making Changes

1. Edit files in `src/`
2. Save the file
3. Fast Refresh automatically updates the app
4. Check for TypeScript errors in Terminal 3
5. Check for lint errors before committing

### Testing User Flows

The app has 5 different user roles. To test each:

1. Start on Login screen
2. Select a role
3. Explore the role-specific screens
4. Log out and try another role

**Roles to test:**

- Warehouse Worker → Scan parts, order parts
- Sales Person → Record sales
- Customer Service → Log inquiries
- Mechanic → Manage service tickets
- Executive → View analytics

---

## Troubleshooting

### Metro Bundler Issues

```bash
# Reset Metro cache
npm start -- --reset-cache

# Clean watchman
watchman watch-del-all

# Remove node_modules and reinstall
rm -rf node_modules
npm install
```

### iOS Build Issues

```bash
# Clean build folder
cd ios
rm -rf build
xcodebuild clean

# Reinstall pods
rm -rf Pods Podfile.lock
pod install

# Reset simulator
xcrun simctl erase all
```

### Android Build Issues

```bash
# Clean build
cd android
./gradlew clean

# Clean gradle cache
./gradlew cleanBuildCache

# If permission issues
chmod +x ./gradlew

# Back to root
cd ..

# Rebuild
npx react-native run-android
```

### Common Errors

#### "Command PhaseScriptExecution failed"

```bash
cd ios
pod deintegrate
pod install
cd ..
```

#### "Unable to boot simulator"

```bash
# Kill all simulators
killall Simulator

# Reset content
xcrun simctl erase all
```

#### "Could not connect to development server"

```bash
# Check Metro is running
# Check firewall isn't blocking port 8081

# Manually specify bundler port
npm start -- --port 8082
npx react-native run-ios --port 8082
```

#### "SDK location not found"

Create `android/local.properties`:

```
sdk.dir = /Users/YOUR_USERNAME/Library/Android/sdk
```

### Port Already in Use

```bash
# Find process using port 8081
lsof -i :8081

# Kill the process
kill -9 <PID>

# Or kill all Metro processes
killall node
```

---

## Useful Commands

```bash
# Check React Native info
npx react-native info

# Doctor (diagnose issues)
npx react-native doctor

# List iOS devices
xcrun simctl list devices

# List Android devices/emulators
adb devices
emulator -list-avds

# Reverse Android port (for API on localhost)
adb reverse tcp:8081 tcp:8081
adb reverse tcp:3000 tcp:3000

# View Android logs
adb logcat

# View iOS logs
xcrun simctl spawn booted log stream --level debug

# Install on all connected devices
npx react-native run-android --deviceId all
```

---

## Next Steps

- Read [DEPLOYMENT.md](./DEPLOYMENT.md) for production builds
- Check [../README.md](../README.md) for project overview
- Review the codebase structure in `src/`

---

## Resources

- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [React Native Environment Setup](https://reactnative.dev/docs/environment-setup)
- [Xcode Download](https://developer.apple.com/xcode/)
- [Android Studio Download](https://developer.android.com/studio)
- [Troubleshooting Guide](https://reactnative.dev/docs/troubleshooting)

---

**Need Help?** Open an issue in the repository or contact the dev team.
