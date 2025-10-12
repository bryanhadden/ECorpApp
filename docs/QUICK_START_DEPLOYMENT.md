# Quick Start: Deploy to App Store

## 🚀 Fast Track (30 minutes to submission)

### Prerequisites (Do Once)

1. **Apple Developer Account** - $99/year → https://developer.apple.com/programs/
2. Wait 24-48 hours for approval

### Step 1: Prepare App (5 minutes)

```bash
# Run the preparation script
npm run prepare-release

# Create screenshot folders
npm run screenshots
```

### Step 2: Open Xcode (2 minutes)

```bash
# Open the workspace
open ios/ECorpApp.xcworkspace
```

In Xcode:

1. Click on **ECorpApp** project (blue icon at top)
2. Select **ECorpApp** target
3. Under **Signing & Capabilities**:
   - ✅ Check "Automatically manage signing"
   - Select your **Team** (your Apple Developer account)
   - Change **Bundle Identifier** to: `com.yourcompany.ecorp`

### Step 3: Add App Icon (5 minutes)

**Quick Method:**

1. Create a 1024x1024 PNG icon (no transparency)
2. Go to https://www.appicon.co/
3. Upload your icon → Generate
4. Download the iOS set
5. In Xcode: Open `ios/ECorpApp/Images.xcassets/AppIcon.appiconset/`
6. Drag all generated icons into the AppIcon slots

### Step 4: Archive App (10 minutes)

In Xcode:

1. At the top, select target: **Generic iOS Device**
2. Menu: **Product** → **Archive**
3. Wait 5-10 minutes for build
4. Organizer window opens automatically

### Step 5: Upload to App Store (5 minutes)

In Xcode Organizer:

1. Click **Distribute App**
2. Select **App Store Connect**
3. Click **Upload**
4. Select your signing certificate (auto-selected if you used automatic signing)
5. Click **Upload**
6. Wait 5-10 minutes for processing

### Step 6: App Store Connect (10 minutes)

1. Go to https://appstoreconnect.apple.com
2. Click **My Apps** → **+** → **New App**
3. Fill in:

   - Platform: **iOS**
   - Name: **E Corp EV** (or your choice)
   - Language: **English**
   - Bundle ID: Select the one you created
   - SKU: `ecorp-ev-app`

4. Take screenshots:

```bash
# Run on different simulators and press Cmd+S
npx react-native run-ios --simulator="iPhone 16 Pro Max"
# Navigate app, take 3-5 screenshots
```

5. Complete App Information:

   - **Description**: (see APP_STORE_DEPLOYMENT.md)
   - **Keywords**: electric vehicle, EV, dealership, inventory, sales
   - **Support URL**: Your website
   - **Privacy Policy URL**: Host docs/PRIVACY_POLICY.md on your site

6. Upload Screenshots:

   - Drag screenshots to App Store Connect
   - Need at least 3 per device size

7. Pricing: Select **Free** (or set price)

8. Submit for Review:
   - Add demo account info:
     - Email: demo@ecorp.com
     - Password: Demo123!
     - Notes: "Select any role to access demo"
   - Click **Submit for Review**

### Step 7: Wait for Review (1-3 days)

Apple will review and either:

- ✅ **Approve** - App goes live!
- ⚠️ **Request changes** - Fix and resubmit

## Quick Commands Reference

```bash
# Validate everything is ready
npm run prepare-release

# Test release build
npm run ios:release

# Create screenshot folders
npm run screenshots

# Run type checking
npm run type-check

# Run linting
npm run lint
```

## Common Issues & Quick Fixes

### "No Apple Developer Account"

- Sign up at https://developer.apple.com/programs/
- Wait 24-48 hours for approval

### "Code Signing Error"

- In Xcode: Enable "Automatically manage signing"
- Select your team from dropdown

### "Missing App Icon"

- Use https://www.appicon.co/ to generate all sizes
- Must be 1024x1024 PNG with no transparency

### "Export Compliance"

- In App Store Connect, answer "No" if you're not using encryption
- Or answer "Yes" and select exemptions

### "Missing Privacy Policy"

- Host `docs/PRIVACY_POLICY.md` on your website
- Add URL in App Store Connect

## Need More Details?

See comprehensive guides:

- 📱 **Full Guide**: `docs/APP_STORE_DEPLOYMENT.md`
- 📸 **Screenshots**: `docs/SCREENSHOTS_GUIDE.md`
- 🔒 **Privacy Policy**: `docs/PRIVACY_POLICY.md`

## Success Checklist

- [ ] Apple Developer account active ($99/year)
- [ ] Bundle identifier set (com.yourcompany.ecorp)
- [ ] App icons added (1024x1024)
- [ ] Signing & capabilities configured
- [ ] App archived successfully
- [ ] Upload to App Store Connect complete
- [ ] Screenshots added (3-5 per device)
- [ ] App description written
- [ ] Privacy policy URL added
- [ ] Demo account credentials provided
- [ ] Submitted for review

## After Approval

1. **Monitor**: Check App Store Connect for downloads and reviews
2. **Respond**: Reply to user reviews
3. **Update**: Plan regular updates with new features
4. **Analytics**: Track usage in App Store Connect

---

**Estimated Total Time**: 30-60 minutes (plus review wait time)

Good luck! 🎉 Your app will be in the App Store soon!
