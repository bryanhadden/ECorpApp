# Upload Build to App Store from Xcode

## Complete Step-by-Step Guide

### Phase 1: Create Archive (Build)

#### Step 1: Prepare Xcode

1. **Open Xcode** (if not already open):

```bash
open ios/ECorpApp.xcworkspace
```

2. **Select Target Device:**
   - At the top of Xcode, next to the Play/Stop buttons
   - Click the device dropdown
   - Select **"Any iOS Device"** or **"Generic iOS Device"**
   - ⚠️ **DO NOT** select a simulator - archive only works with device targets

```
┌─────────────────────────────┐
│ ECorpApp > Generic iOS Device │ ← Click here and select this
└─────────────────────────────┘
```

#### Step 2: Create Archive

1. **Menu Bar** → **Product** → **Archive**

   Or use keyboard: `Cmd + Control + B` then Product → Archive

2. **Wait 5-15 minutes** for the build to complete

   - You'll see a progress bar at the top
   - Xcode is building your app in Release mode
   - This is normal - it takes longer than a regular build

3. **Organizer Opens Automatically**
   - When done, the "Organizer" window opens
   - You'll see your archive listed with date/time

```
Building...
━━━━━━━━━━━━━━━━━━━━━━ 45%
Compiling Swift files...
Linking...
Signing...
```

### Phase 2: Upload to App Store Connect

#### Step 3: Distribute Archive

In the **Organizer** window:

1. **Select Your Archive:**

   - It should be automatically selected (blue highlight)
   - Shows: "ECorpApp 1.0.0" with today's date

2. **Click "Distribute App"** button (blue button on right side)

3. **Select Destination:**
   - Choose: **"App Store Connect"**
   - Click **"Next"**

```
┌─────────────────────────────────┐
│ Select a method of distribution: │
│                                  │
│ ⦿ App Store Connect             │ ← Select this
│ ○ Ad Hoc                        │
│ ○ Enterprise                    │
│ ○ Development                   │
│                                  │
│         [Cancel]  [Next]         │
└─────────────────────────────────┘
```

#### Step 4: Upload Options

1. **Upload Method:**

   - Choose: **"Upload"** (recommended)
   - Click **"Next"**

   (Alternative: "Export" if you want to upload later with Transporter)

```
┌─────────────────────────────────┐
│ ⦿ Upload                        │ ← Select this
│   Upload your app to App Store  │
│   Connect for testing and       │
│   distribution                  │
│                                  │
│ ○ Export                        │
│                                  │
│         [Back]  [Next]           │
└─────────────────────────────────┘
```

#### Step 5: App Store Connect Distribution Options

1. **Select Options:**
   - ✅ **App Thinning:** None (or automatic)
   - ✅ **Rebuild from Bitcode:** Leave default
   - ✅ **Include symbols for your app:** ✅ Checked (recommended)
   - ✅ **Manage Version and Build Number:** Leave unchecked
2. Click **"Next"**

#### Step 6: Re-sign with Distribution Certificate

1. **Automatically manage signing:**
   - ✅ Should be checked by default
   - Xcode will automatically select the right certificate
2. **Or manually select:**
   - Certificate: Select your "iOS Distribution" certificate
   - Provisioning Profile: Select "App Store" profile
3. Click **"Next"**

#### Step 7: Review Archive

1. **Review Information:**

   - App Name: E Corp EV
   - Bundle ID: com.yourname.ecorp (your bundle ID)
   - Version: 1.0.0
   - Build: 1

2. **Check Everything Looks Correct**

3. Click **"Upload"**

```
┌─────────────────────────────────┐
│ Review ECorpApp.ipa contents    │
│                                  │
│ App: ECorpApp                   │
│ Bundle ID: com.yourname.ecorp   │
│ Version: 1.0.0                  │
│ Build: 1                        │
│                                  │
│         [Back]  [Upload]         │
└─────────────────────────────────┘
```

#### Step 8: Uploading

1. **Upload Progress:**

   - Shows progress bar
   - Takes 5-15 minutes depending on internet speed
   - Shows: "Uploading to App Store Connect..."

2. **Success!**
   - You'll see: "Upload Successful"
   - Click **"Done"**

```
━━━━━━━━━━━━━━━━━━━━━━━━ 100%
✅ Upload Successful

Your app has been uploaded to
App Store Connect. It will be
available for testing and
distribution in 10-30 minutes.

           [Done]
```

### Phase 3: Processing (Wait Time)

After upload:

1. **Apple Processing:**

   - Takes 10-30 minutes (sometimes up to 1 hour)
   - Apple is processing your build
   - You'll get an email when ready

2. **Check Status:**
   - Go to https://appstoreconnect.apple.com
   - My Apps → Your App → TestFlight tab
   - Wait for build to appear

## If Organizer Doesn't Open

### Manual Method:

1. **Open Organizer Manually:**

   - Menu: **Window** → **Organizer**
   - Or keyboard: `Cmd + Shift + Option + O`

2. **Select Archives Tab:**

   - Should be selected by default
   - Shows all your archives

3. **Continue from Step 3 above**

## Common Issues & Solutions

### Issue: "Archive Greyed Out"

**Problem:** Product → Archive is greyed out

**Solution:**

- Make sure you selected "Generic iOS Device" (not a simulator)
- Clean build: Product → Clean Build Folder (Cmd + Shift + K)
- Try again

### Issue: "No Accounts in Xcode"

**Problem:** Can't upload, no team/account found

**Solution:**

1. Xcode → Settings → Accounts
2. Click **"+"** button
3. Sign in with Apple ID (your developer account)
4. Close and try upload again

### Issue: "Invalid Bundle ID"

**Problem:** Bundle ID not recognized

**Solution:**

1. Your bundle ID must match what's in App Store Connect
2. Go create the app first in App Store Connect
3. Use the EXACT same bundle ID

### Issue: "Missing Compliance"

**Problem:** Export compliance error

**Solution:**

- You'll answer this in App Store Connect later
- For now, select "None" or answer the questions
- Most apps select "No" for encryption

### Issue: "Failed to Upload"

**Problem:** Upload fails or times out

**Solutions:**

1. **Check Internet:** Need stable connection
2. **Try Again:** Sometimes Apple servers are busy
3. **Use Transporter App:** Alternative upload method
   - Download from Mac App Store
   - Export IPA from Xcode
   - Upload via Transporter

## Alternative: Upload via Terminal

If Xcode upload isn't working:

```bash
# First, archive
npm run archive

# Then use xcrun to upload
xcrun altool --upload-app \
  --type ios \
  --file "ios/build/ECorpApp.xcarchive" \
  --apiKey YOUR_API_KEY \
  --apiIssuer YOUR_ISSUER_ID
```

(You'd need to generate API keys from App Store Connect)

## Alternative: Use Transporter App

1. **In Xcode:** Choose "Export" instead of "Upload"
2. **Download Transporter:** https://apps.apple.com/us/app/transporter/id1450874784
3. **Open Transporter**
4. **Drag your .ipa file** into Transporter
5. **Click Deliver**

## Quick Checklist

Before archiving:

- [ ] Bundle ID is set (com.yourname.ecorp)
- [ ] Automatic signing enabled
- [ ] Team selected
- [ ] Generic iOS Device selected (not simulator)
- [ ] Version number set (1.0.0)

During archive:

- [ ] Archive completes successfully
- [ ] Organizer opens
- [ ] Archive appears in list

During upload:

- [ ] Selected "App Store Connect"
- [ ] Selected "Upload"
- [ ] Upload completes (green checkmark)

After upload:

- [ ] Wait 10-30 minutes
- [ ] Check App Store Connect
- [ ] Build appears in TestFlight
- [ ] Ready to submit for review

## What Happens Next?

1. **Immediately after upload:**

   - Build is uploaded ✅
   - You can close Xcode

2. **10-30 minutes later:**

   - Email: "Build processed"
   - Build appears in App Store Connect
   - Can view in TestFlight tab

3. **You need to:**
   - Go to App Store Connect
   - Add screenshots
   - Complete app information
   - Submit for review

## Complete Flow Diagram

```
┌─────────────────────────────────────────────┐
│ 1. Xcode → Product → Archive                │
│    (5-15 min)                               │
└──────────────────┬──────────────────────────┘
                   ↓
┌─────────────────────────────────────────────┐
│ 2. Organizer → Distribute App               │
│    → App Store Connect                      │
└──────────────────┬──────────────────────────┘
                   ↓
┌─────────────────────────────────────────────┐
│ 3. Upload → Select Options → Upload         │
│    (5-15 min)                               │
└──────────────────┬──────────────────────────┘
                   ↓
┌─────────────────────────────────────────────┐
│ 4. ✅ Upload Successful                     │
│    Wait for email                           │
└──────────────────┬──────────────────────────┘
                   ↓
┌─────────────────────────────────────────────┐
│ 5. Apple Processing                         │
│    (10-30 min)                              │
└──────────────────┬──────────────────────────┘
                   ↓
┌─────────────────────────────────────────────┐
│ 6. Build Ready in App Store Connect         │
│    → Complete listing → Submit for review   │
└─────────────────────────────────────────────┘
```

## Tips for Success

✅ **DO:**

- Use a stable internet connection
- Archive during off-peak hours (morning/early afternoon)
- Keep Xcode and macOS updated
- Double-check bundle ID matches App Store Connect

❌ **DON'T:**

- Select a simulator (archive won't work)
- Close Xcode during upload
- Switch WiFi networks during upload
- Interrupt the archive process

---

**Ready?** Go to Xcode → Product → Archive and follow the steps! 🚀
