# Apple App Store Deployment Guide

This guide will walk you through deploying **E Corp - Electric Vehicle Excellence** to the Apple App Store.

## Prerequisites

### 1. Apple Developer Account

- **Enroll in Apple Developer Program**: https://developer.apple.com/programs/
- Cost: $99 USD/year
- Processing time: 24-48 hours
- You'll need this to submit apps to the App Store

### 2. Required Tools

- ✅ Xcode (already installed)
- ✅ React Native project (already set up)
- Fastlane (optional, for automation)

## Step-by-Step Deployment Process

### Phase 1: Prepare Your App

#### 1.1 Update App Information

Update `app.json`:

```json
{
  "name": "ECorpApp",
  "displayName": "E Corp EV",
  "version": "1.0.0",
  "description": "Electric Vehicle Excellence - Manage dealership operations, sales, service, and inventory"
}
```

#### 1.2 Set Bundle Identifier

In Xcode:

1. Open `ios/ECorpApp.xcworkspace`
2. Select the ECorpApp project in the navigator
3. Select the ECorpApp target
4. Change Bundle Identifier to: `com.yourcompany.ecorp` (replace `yourcompany` with your actual company name)

#### 1.3 Create App Icons

Required icon sizes for iOS:

- App Store: 1024x1024px (no transparency, no alpha channel)
- iPhone: Multiple sizes (handled by Xcode Asset Catalog)

**Quick Setup:**

1. Create a 1024x1024px app icon
2. Use https://www.appicon.co/ to generate all required sizes
3. Add to `ios/ECorpApp/Images.xcassets/AppIcon.appiconset/`

#### 1.4 Add Privacy Descriptions

Update `ios/ECorpApp/Info.plist` with user-facing descriptions:

- Camera usage (for barcode scanning)
- Location services (if needed)
- Already configured in your app ✅

### Phase 2: App Store Connect Setup

#### 2.1 Create App in App Store Connect

1. Go to https://appstoreconnect.apple.com
2. Click **My Apps** → **+** → **New App**
3. Fill in app information:
   - **Platform**: iOS
   - **Name**: E Corp EV (or your preferred name)
   - **Primary Language**: English
   - **Bundle ID**: Select the one you created
   - **SKU**: ecorp-ev-app (unique identifier)
   - **User Access**: Full Access

#### 2.2 Prepare App Store Listing

You'll need:

**Screenshots** (required for each device type):

- iPhone 6.9" Display (iPhone 16 Pro Max): 3 screenshots minimum
- iPhone 6.7" Display (iPhone 15 Pro Max): 3 screenshots minimum
- iPhone 6.5" Display: 3 screenshots minimum
- Optional: iPad Pro 12.9" screenshots

**App Information**:

- App Name: "E Corp - EV Excellence"
- Subtitle: "Manage Your Electric Vehicle Business"
- Description:

```
E Corp is the comprehensive solution for electric vehicle dealerships, providing seamless tools for:

• Warehouse Management - Scan and track EV parts inventory
• Sales Management - Close deals and manage customers
• Customer Service - Handle inquiries efficiently
• Service & Repairs - Manage mechanic workflows
• Executive Dashboard - View real-time analytics

Built specifically for the electric vehicle industry, E Corp streamlines operations across your entire dealership network.
```

- Keywords: "electric vehicle, EV, dealership, inventory, sales, service, automotive"
- Support URL: Your website
- Marketing URL: Your marketing site (optional)
- Privacy Policy URL: Required!

**Promotional Assets**:

- App Preview Video (optional but recommended)
- Marketing screenshots

### Phase 3: Code Signing & Certificates

#### 3.1 Create Certificates in Xcode (Automatic)

1. Open `ios/ECorpApp.xcworkspace` in Xcode
2. Select the ECorpApp target
3. Go to **Signing & Capabilities**
4. Check **Automatically manage signing**
5. Select your team from dropdown
6. Xcode will create certificates and provisioning profiles automatically

#### 3.2 Manual Certificate Setup (Advanced)

If automatic signing doesn't work:

1. Go to https://developer.apple.com/account/resources/certificates
2. Create **iOS Distribution** certificate
3. Create **App Store** provisioning profile
4. Download and install both
5. In Xcode, uncheck "Automatically manage signing"
6. Select your certificate and provisioning profile

### Phase 4: Build for Release

#### 4.1 Update Build Configuration

In Xcode:

1. Select **Product** → **Scheme** → **Edit Scheme**
2. Change **Build Configuration** to **Release**
3. Uncheck **Debug executable**

#### 4.2 Archive the App

1. Select **Generic iOS Device** (not simulator)
2. Select **Product** → **Archive**
3. Wait for archive to complete (5-15 minutes)
4. Xcode Organizer will open automatically

#### 4.3 Validate & Upload

In Xcode Organizer:

1. Click **Distribute App**
2. Select **App Store Connect**
3. Choose **Upload**
4. Select provisioning profile and certificate
5. Click **Validate** first (recommended)
6. Fix any issues shown
7. Click **Upload**
8. Wait for processing (10-30 minutes)

### Phase 5: Submit for Review

#### 5.1 Complete App Store Connect

1. Go to App Store Connect
2. Select your app
3. Add screenshots to all required device types
4. Fill in all required metadata
5. Add app description and keywords
6. Set pricing (free or paid)
7. Set availability (countries/regions)

#### 5.2 App Review Information

Provide:

- Contact Information (phone, email)
- Demo Account (if login is required)
  - Username: demo@ecorp.com
  - Password: Demo123!
  - Note: "Select any role on login screen to access demo"
- Notes: "This is a role-based app. Users select their role (Warehouse, Sales, Customer Service, Mechanic, or Executive) to access different workflows."

#### 5.3 Submit for Review

1. Click **Add for Review**
2. Answer export compliance questions
3. Submit app
4. Wait for review (1-3 days typically)

### Phase 6: Post-Submission

#### 6.1 Review Process

- Average review time: 24-48 hours
- Check email for updates
- Be ready to respond to reviewer questions

#### 6.2 Common Rejection Reasons

- Missing privacy policy
- App crashes or bugs
- Incomplete metadata
- Missing demo account credentials
- Privacy permission descriptions too vague

#### 6.3 After Approval

- App goes live automatically or on scheduled date
- Monitor crash reports in App Store Connect
- Respond to user reviews
- Plan for updates

## Quick Commands

### Install Production Dependencies

```bash
cd ios
pod install
cd ..
```

### Create Release Build

```bash
# Clean build
cd ios
xcodebuild clean -workspace ECorpApp.xcworkspace -scheme ECorpApp
cd ..

# Archive via Xcode (recommended)
# Product → Archive
```

### Using Fastlane (Optional - Advanced)

Install Fastlane:

```bash
brew install fastlane
cd ios
fastlane init
```

## Troubleshooting

### Issue: "No Bundle Identifier Found"

- Solution: Set bundle identifier in Xcode project settings

### Issue: "Code Signing Error"

- Solution: Go to Signing & Capabilities, enable automatic signing

### Issue: "Missing Compliance"

- Solution: Answer export compliance questions in App Store Connect

### Issue: "App Icon Missing"

- Solution: Add 1024x1024 icon to Assets.xcassets

### Issue: "Build Failed"

- Solution: Clean build folder (Cmd+Shift+K), rebuild

## Resources

- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [App Store Connect Help](https://developer.apple.com/help/app-store-connect/)
- [React Native iOS Guide](https://reactnative.dev/docs/publishing-to-app-store)

## Maintenance

### Releasing Updates

1. Increment version in Xcode:

   - Version: 1.0.0 → 1.0.1 (bug fixes)
   - Version: 1.0.0 → 1.1.0 (new features)
   - Version: 1.0.0 → 2.0.0 (major changes)

2. Archive and upload new build
3. Submit for review with "What's New" description

### Monitoring

- Check **App Analytics** in App Store Connect
- Monitor **Crash Reports**
- Read and respond to **User Reviews**
- Track **Sales and Trends**

## Next Steps

1. ☐ Enroll in Apple Developer Program
2. ☐ Create app icons (1024x1024px)
3. ☐ Set bundle identifier in Xcode
4. ☐ Take screenshots of all screens
5. ☐ Write privacy policy
6. ☐ Create app in App Store Connect
7. ☐ Archive app in Xcode
8. ☐ Upload to App Store Connect
9. ☐ Complete app metadata
10. ☐ Submit for review

Good luck with your App Store submission! 🚀
