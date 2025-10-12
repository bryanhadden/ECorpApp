# Deployment Guide

Complete guide for deploying the E Corp app to production for both iOS (App Store) and Android (Google Play Store).

## Table of Contents

- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [iOS Deployment](#ios-deployment)
- [Android Deployment](#android-deployment)
- [Post-Deployment](#post-deployment)
- [CI/CD Setup](#cicd-setup)

---

## Pre-Deployment Checklist

### Required Accounts

- [ ] **Apple Developer Account** ($99/year)
  - https://developer.apple.com/programs/
- [ ] **Google Play Developer Account** ($25 one-time)
  - https://play.google.com/console/signup

### Code Preparation

```bash
# 1. Update version numbers
# iOS: ios/ECorpApp/Info.plist
# Android: android/app/build.gradle

# 2. Run tests
npm test

# 3. Run linter
npm run lint

# 4. Type check
npx tsc --noEmit

# 5. Build verification
npm run ios -- --configuration Release
npm run android -- --variant=release
```

### App Store Assets

Prepare these before submission:

- **App Icon**: 1024x1024px (PNG, no transparency, no rounded corners)
- **Screenshots**:
  - iPhone: 6.7" (1290x2796) and 6.5" (1242x2688)
  - iPad: 12.9" (2048x2732)
  - Android: 16:9 ratio, at least 1080px on shortest side
- **Feature Graphic** (Android): 1024x500px
- **App Description**: Compelling description highlighting features
- **Keywords**: Relevant search terms
- **Privacy Policy URL**: Required for both stores
- **Support URL**: For user support

---

## iOS Deployment

### Step 1: Configure App in Xcode

```bash
cd /Users/Bryan/Documents/Projects/ECorpApp
open ios/ECorpApp.xcworkspace
```

1. **Select the project** in the navigator (ECorpApp)
2. **Select target** → ECorpApp
3. **General tab**:
   - Display Name: `E Corp`
   - Bundle Identifier: `com.ecorp.app` (must be unique)
   - Version: `1.0.0`
   - Build: `1`
4. **Signing & Capabilities**:
   - Team: Select your Apple Developer team
   - Automatically manage signing: ✅ (recommended)
   - Or manually select provisioning profiles

### Step 2: Update App Info

Edit `ios/ECorpApp/Info.plist`:

```xml
<key>CFBundleDisplayName</key>
<string>E Corp</string>
<key>CFBundleIdentifier</key>
<string>com.ecorp.app</string>
<key>CFBundleShortVersionString</key>
<string>1.0.0</string>
<key>CFBundleVersion</key>
<string>1</string>
```

### Step 3: Configure App Icon

1. Create an App Icon Set using:
   - [AppIcon.co](https://appicon.co/)
   - [MakeAppIcon](https://makeappicon.com/)
2. Replace icons in:
   ```
   ios/ECorpApp/Images.xcassets/AppIcon.appiconset/
   ```

### Step 4: Update Launch Screen

Edit `ios/ECorpApp/LaunchScreen.storyboard` or replace with custom screen.

### Step 5: Create App in App Store Connect

1. Go to [App Store Connect](https://appstoreconnect.apple.com/)
2. **My Apps** → **+** → **New App**
3. Fill in:
   - Platform: iOS
   - Name: E Corp
   - Primary Language: English
   - Bundle ID: com.ecorp.app (from Xcode)
   - SKU: ECORP001 (any unique identifier)
   - User Access: Full Access

### Step 6: Build for Release

```bash
# Clean build
cd ios
xcodebuild clean

# Method 1: Using Xcode (Recommended)
# 1. Select "Any iOS Device (arm64)" as target
# 2. Product → Archive
# 3. Wait for archive to complete
# 4. Organizer window opens automatically
# 5. Click "Distribute App"
# 6. Select "App Store Connect"
# 7. Click "Upload"

# Method 2: Command Line
xcodebuild -workspace ECorpApp.xcworkspace \
  -scheme ECorpApp \
  -configuration Release \
  -archivePath build/ECorpApp.xcarchive \
  archive

# Upload archive
xcodebuild -exportArchive \
  -archivePath build/ECorpApp.xcarchive \
  -exportPath build \
  -exportOptionsPlist ExportOptions.plist
```

### Step 7: Submit for Review

1. Go to App Store Connect → Your App
2. **App Information**:
   - Category: Business
   - Content Rights: Check if applicable
3. **Pricing and Availability**:
   - Price: Free (or set price)
   - Availability: Select countries
4. **App Privacy**:
   - Add privacy policy URL
   - Fill data collection questionnaire
5. **Version Information**:
   - Screenshots (required for all device sizes)
   - Promotional Text (optional)
   - Description
   - Keywords
   - Support URL
   - Marketing URL (optional)
   - Version: 1.0.0
   - Copyright
6. **Build**:
   - Click **+** next to Build
   - Select the uploaded build
   - Export compliance: Answer questions
7. **Submit for Review**:
   - Review app information
   - Click "Submit for Review"

### Review Process

- **Review Time**: Typically 24-48 hours
- **Status**: Check in App Store Connect
- **Common Rejections**:
  - Missing privacy policy
  - Incomplete app functionality
  - UI issues
  - Metadata doesn't match app

---

## Android Deployment

### Step 1: Generate Signing Key

```bash
cd android/app

# Generate keystore (do this once)
keytool -genkeypair -v \
  -storetype PKCS12 \
  -keystore ecorp-release.keystore \
  -alias ecorp-key-alias \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000

# You'll be prompted for:
# - Keystore password (save this securely!)
# - Key password (can be same as keystore)
# - Your name, organization, etc.
```

⚠️ **IMPORTANT**:

- Store `ecorp-release.keystore` securely
- Never commit to version control
- Back up in secure location
- If lost, you cannot update the app!

### Step 2: Configure Gradle

Create `android/gradle.properties` (add to .gitignore):

```properties
ECORP_UPLOAD_STORE_FILE=ecorp-release.keystore
ECORP_UPLOAD_KEY_ALIAS=ecorp-key-alias
ECORP_UPLOAD_STORE_PASSWORD=your_keystore_password
ECORP_UPLOAD_KEY_PASSWORD=your_key_password
```

Edit `android/app/build.gradle`:

```gradle
android {
    ...

    defaultConfig {
        applicationId "com.ecorp.app"  // Must be unique
        versionCode 1                   // Increment for each release
        versionName "1.0.0"            // Semantic version
        ...
    }

    signingConfigs {
        release {
            if (project.hasProperty('ECORP_UPLOAD_STORE_FILE')) {
                storeFile file(ECORP_UPLOAD_STORE_FILE)
                storePassword ECORP_UPLOAD_STORE_PASSWORD
                keyAlias ECORP_UPLOAD_KEY_ALIAS
                keyPassword ECORP_UPLOAD_KEY_PASSWORD
            }
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
        }
    }
}
```

### Step 3: Update App Information

Edit `android/app/src/main/AndroidManifest.xml`:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.ecorp.app">

    <application
        android:name=".MainApplication"
        android:label="E Corp"
        android:icon="@mipmap/ic_launcher"
        android:roundIcon="@mipmap/ic_launcher_round"
        ...
    </application>
</manifest>
```

### Step 4: Generate App Icons

1. Use [Android Asset Studio](https://romannurik.github.io/AndroidAssetStudio/)
2. Generate icons for all densities
3. Replace in:
   ```
   android/app/src/main/res/mipmap-*/
   ```

### Step 5: Build Release APK/AAB

```bash
cd /Users/Bryan/Documents/Projects/ECorpApp/android

# Clean build
./gradlew clean

# Build AAB (Android App Bundle - recommended for Play Store)
./gradlew bundleRelease

# Build APK (for testing or other stores)
./gradlew assembleRelease

# Output locations:
# AAB: android/app/build/outputs/bundle/release/app-release.aab
# APK: android/app/build/outputs/apk/release/app-release.apk
```

### Step 6: Test Release Build

```bash
# Install APK on connected device
adb install android/app/build/outputs/apk/release/app-release.apk

# Or test AAB with bundletool
bundletool build-apks --bundle=app-release.aab --output=app.apks
bundletool install-apks --apks=app.apks
```

### Step 7: Create App in Google Play Console

1. Go to [Google Play Console](https://play.google.com/console/)
2. **Create app**:
   - App name: E Corp
   - Default language: English (United States)
   - App or game: App
   - Free or paid: Free
   - Declarations: Accept all

### Step 8: Set Up App Content

1. **App Access**:

   - All functionality is available without restrictions

2. **Ads**:

   - Select if your app contains ads

3. **Content Rating**:

   - Complete questionnaire
   - Submit for rating

4. **Target Audience**:

   - Select age groups

5. **News App**: No (unless applicable)

6. **Data Safety**:
   - Declare data collection practices
   - Add privacy policy URL

### Step 9: Set Up Store Listing

**Main Store Listing**:

- App name: E Corp
- Short description (80 chars max)
- Full description (4000 chars max)
- App icon: 512x512px PNG
- Feature graphic: 1024x500px
- Screenshots: At least 2 (up to 8)
- Phone, 7" tablet, 10" tablet screenshots

**Categorization**:

- Category: Business
- Tags: Add relevant tags

**Contact Details**:

- Email
- Phone (optional)
- Website (optional)

### Step 10: Release Production

1. **Create Release**:
   - Go to Production → Create new release
   - Upload AAB file
   - Release name: 1.0.0
   - Release notes: Describe what's new
2. **Review Release**:
   - Check all warnings
   - Fix any issues
3. **Start Rollout**:
   - Select countries
   - Click "Start rollout to Production"
   - Optionally use staged rollout (5%, 10%, 20%, 50%, 100%)

### Review Process

- **Review Time**: Typically 1-3 days (can be longer for first submission)
- **Status**: Check in Google Play Console
- **Common Rejections**:
  - Missing privacy policy
  - Content rating issues
  - Permissions not explained
  - Deceptive behavior

---

## Post-Deployment

### Monitoring

**iOS - App Store Connect**:

- App Analytics
- Crash Reports
- Reviews and Ratings

**Android - Play Console**:

- Statistics
- Crashes & ANRs
- Reviews and Ratings

### App Updates

#### iOS Updates

```bash
# 1. Increment version
# CFBundleShortVersionString: 1.0.0 → 1.0.1
# CFBundleVersion: 1 → 2

# 2. Build and archive
# 3. Upload to App Store Connect
# 4. Create new version in App Store Connect
# 5. Add "What's New" text
# 6. Submit for review
```

#### Android Updates

```bash
# 1. Increment version in build.gradle
# versionCode: 1 → 2
# versionName: "1.0.0" → "1.0.1"

# 2. Build new AAB
./gradlew bundleRelease

# 3. Create new release in Play Console
# 4. Upload AAB
# 5. Add release notes
# 6. Submit
```

### Version Management

Follow [Semantic Versioning](https://semver.org/):

- **Major (1.x.x)**: Breaking changes, major features
- **Minor (x.1.x)**: New features, backward compatible
- **Patch (x.x.1)**: Bug fixes, minor improvements

### Hotfix Process

```bash
# 1. Create hotfix branch
git checkout -b hotfix/1.0.1

# 2. Fix critical bug
# 3. Update version numbers
# 4. Build and test
# 5. Submit to stores with expedited review request
# 6. Merge back to main
```

---

## CI/CD Setup

### GitHub Actions (Recommended)

Create `.github/workflows/ios-deploy.yml`:

```yaml
name: iOS Deploy

on:
  push:
    branches: [main]
    tags:
      - 'v*'

jobs:
  deploy-ios:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Install Pods
        run: |
          cd ios
          pod install

      - name: Build iOS
        run: |
          cd ios
          xcodebuild -workspace ECorpApp.xcworkspace \
            -scheme ECorpApp \
            -configuration Release \
            -archivePath build/ECorpApp.xcarchive \
            archive

      - name: Upload to TestFlight
        env:
          FASTLANE_USER: ${{ secrets.APPLE_ID }}
          FASTLANE_PASSWORD: ${{ secrets.APPLE_PASSWORD }}
        run: |
          cd ios
          fastlane pilot upload
```

Create `.github/workflows/android-deploy.yml`:

```yaml
name: Android Deploy

on:
  push:
    branches: [main]
    tags:
      - 'v*'

jobs:
  deploy-android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Setup Java
        uses: actions/setup-java@v3
        with:
          distribution: 'zulu'
          java-version: '17'

      - name: Install dependencies
        run: npm ci

      - name: Build Android
        run: |
          cd android
          ./gradlew bundleRelease
        env:
          ECORP_UPLOAD_STORE_FILE: ${{ secrets.KEYSTORE_FILE }}
          ECORP_UPLOAD_KEY_ALIAS: ${{ secrets.KEY_ALIAS }}
          ECORP_UPLOAD_STORE_PASSWORD: ${{ secrets.KEYSTORE_PASSWORD }}
          ECORP_UPLOAD_KEY_PASSWORD: ${{ secrets.KEY_PASSWORD }}

      - name: Upload to Play Store
        uses: r0adkll/upload-google-play@v1
        with:
          serviceAccountJsonPlainText: ${{ secrets.SERVICE_ACCOUNT_JSON }}
          packageName: com.ecorp.app
          releaseFiles: android/app/build/outputs/bundle/release/app-release.aab
          track: production
```

### Fastlane (Alternative)

Install Fastlane:

```bash
sudo gem install fastlane
```

Initialize:

```bash
cd ios
fastlane init

cd ../android
fastlane init
```

---

## Best Practices

### Pre-Release Testing

- [ ] Test on multiple iOS devices/simulators
- [ ] Test on multiple Android devices/emulators
- [ ] Test all user flows for all 5 roles
- [ ] Test offline behavior
- [ ] Test deep links (if applicable)
- [ ] Performance testing
- [ ] Memory leak testing

### App Store Optimization (ASO)

1. **Keywords**: Research and use relevant keywords
2. **Screenshots**: Show key features, use captions
3. **Description**: Clear, benefit-focused
4. **Ratings**: Encourage happy users to rate
5. **Reviews**: Respond to all reviews promptly

### Release Checklist

- [ ] Code reviewed and merged to main
- [ ] Version numbers updated
- [ ] Changelog updated
- [ ] Tests passing
- [ ] Lint checks passing
- [ ] Build successful
- [ ] Release notes written
- [ ] Screenshots updated (if UI changed)
- [ ] Privacy policy updated (if data handling changed)
- [ ] Marketing materials ready
- [ ] Support team informed

---

## Resources

### iOS

- [App Store Connect Help](https://developer.apple.com/help/app-store-connect/)
- [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [TestFlight Beta Testing](https://developer.apple.com/testflight/)

### Android

- [Google Play Console Help](https://support.google.com/googleplay/android-developer/)
- [Launch Checklist](https://developer.android.com/distribute/best-practices/launch/)
- [Pre-Launch Reports](https://developer.android.com/distribute/best-practices/develop/test-pre-launch-reports)

### Tools

- [Fastlane](https://fastlane.tools/) - Automation
- [AppIcon](https://appicon.co/) - Icon generator
- [Semantic Versioning](https://semver.org/) - Version guidelines

---

**Questions?** Contact the deployment team or refer to the official documentation.
