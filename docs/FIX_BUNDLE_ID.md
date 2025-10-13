# Fix Bundle Identifier & Code Signing

## The Problem

You're seeing:

```
No profiles for 'com.bryan.ecorpapp' were found
```

This happens because:

1. The bundle ID `com.bryan.ecorpapp` is just a placeholder
2. You need to use YOUR OWN bundle identifier
3. Automatic signing needs to be enabled

## Step-by-Step Fix

### Step 1: Open Xcode (ALREADY OPENED FOR YOU)

Xcode should now be open with your project.

### Step 2: Change Bundle Identifier

In Xcode:

1. **Click** on the blue **ECorpApp** project icon (top left of navigator)
2. **Select** the **ECorpApp** target (under "TARGETS")
3. **Click** the **General** tab
4. **Find** "Bundle Identifier" section

5. **Change** the Bundle Identifier from:

   ```
   com.bryan.ecorpapp
   ```

   To YOUR bundle ID (choose one of these formats):

   ```
   com.yourcompany.ecorp
   com.yourname.ecorp
   com.yourdomain.ecorp
   ```

   **Examples:**

   - `com.acme.ecorp`
   - `com.johndoe.ecorp`
   - `com.mycompany.ecorpev`

   **Rules:**

   - Use reverse domain notation
   - All lowercase
   - No spaces or special characters
   - Must be unique (nobody else can use the same one)

### Step 3: Enable Automatic Signing

Still in Xcode:

1. **Click** the **Signing & Capabilities** tab (next to General)

2. **For BOTH configurations** (you'll see two sections):
   - ✅ **CHECK** "Automatically manage signing"
3. **Select Team:**

   - Click the "Team" dropdown
   - Select your Apple ID / Developer account

   **If you don't see a team:**

   - Go to **Xcode** → **Settings** → **Accounts**
   - Click **+** to add your Apple ID
   - Sign in with your Apple Developer account

4. **Xcode will automatically:**
   - Create signing certificates
   - Generate provisioning profiles
   - Configure everything for you

### Step 4: Verify Settings

You should see:

- ✅ "Automatically manage signing" is checked
- ✅ Team is selected
- ✅ "Signing Certificate" shows a valid certificate
- ✅ "Provisioning Profile" shows "Xcode Managed Profile"
- ✅ No red error messages

### Step 5: Archive Again

Now try archiving:

**In Xcode:**

1. Make sure target is **Generic iOS Device** (top left)
2. Go to **Product** → **Archive**
3. Wait 5-10 minutes

**Or use terminal:**

```bash
npm run archive
```

## Troubleshooting

### "No Teams Available"

**Problem:** You don't see any teams in the dropdown

**Solution:**

1. Make sure you're enrolled in Apple Developer Program ($99/year)
2. Go to https://developer.apple.com/programs/
3. Complete enrollment
4. Wait 24-48 hours for approval
5. Add your Apple ID in Xcode Settings → Accounts

### "Failed to create provisioning profile"

**Problem:** Xcode can't create the profile

**Solutions:**

1. **Check Apple Developer Portal:**

   - Go to https://developer.apple.com/account/resources/identifiers
   - Make sure your bundle ID isn't already registered by someone else
   - If it is, choose a different bundle ID

2. **Check Internet Connection:**

   - Xcode needs internet to contact Apple servers
   - Make sure you're not behind a firewall

3. **Sign Out and Back In:**
   - Xcode → Settings → Accounts
   - Select your account → Sign Out
   - Sign back in

### "This bundle ID is not available"

**Problem:** Someone else is using that bundle ID

**Solution:**

- Choose a more unique bundle ID
- Use your actual domain: `com.yourdomain.ecorp`
- Or use your name: `com.yourfullname.ecorpapp`

### "Agreement Not Accepted"

**Problem:** You haven't accepted Apple's developer agreements

**Solution:**

1. Go to https://developer.apple.com
2. Sign in
3. Accept any pending agreements
4. Try again in Xcode

## Quick Commands

After fixing in Xcode:

```bash
# Test archive build
npm run archive

# Test release build on simulator
npm run ios:release

# Run pre-flight checks
npm run prepare-release
```

## Visual Guide

### What You Should See in Xcode:

```
┌─────────────────────────────────────────┐
│ Signing & Capabilities                  │
├─────────────────────────────────────────┤
│ ✅ Automatically manage signing         │
│                                         │
│ Team: Your Name (Developer)             │
│                                         │
│ Bundle Identifier: com.yourname.ecorp   │
│                                         │
│ Signing Certificate:                    │
│   Apple Development: your@email.com     │
│                                         │
│ Provisioning Profile:                   │
│   Xcode Managed Profile                 │
│                                         │
│ ✅ All signing settings are good        │
└─────────────────────────────────────────┘
```

### What's Wrong (Red Errors):

```
┌─────────────────────────────────────────┐
│ Signing & Capabilities                  │
├─────────────────────────────────────────┤
│ ⬜ Automatically manage signing         │
│                                         │
│ ❌ No provisioning profiles found       │
│ ❌ No signing certificate               │
│                                         │
│ Bundle Identifier: com.bryan.ecorpapp   │
└─────────────────────────────────────────┘
```

## Important Notes

### Bundle Identifier Rules

✅ **GOOD:**

- `com.mycompany.ecorp`
- `com.johndoe.ecorpev`
- `co.mycompany.ecorp`
- `io.mydomain.ecorp`

❌ **BAD:**

- `com.bryan.ecorpapp` (not your bundle ID)
- `com.apple.ecorp` (can't use apple)
- `ecorp` (must use reverse domain)
- `com.My Company.ecorp` (no spaces)
- `com.my-company.ecorp` (no hyphens in company name)

### What Happens When You Change It

- ✅ Xcode will create NEW certificates for your bundle ID
- ✅ You'll get a provisioning profile that matches
- ✅ Archive will work
- ⚠️ You must use the SAME bundle ID when submitting to App Store

### Remember This Bundle ID

Write down your bundle ID - you'll need it:

- When creating the app in App Store Connect
- For future updates
- For push notifications
- For app groups (if you add them later)

## Next Steps After Fixing

1. ✅ Bundle ID changed to YOUR bundle ID
2. ✅ Automatic signing enabled
3. ✅ Team selected
4. ✅ Archive successful
5. → Upload to App Store Connect
6. → Complete app listing
7. → Submit for review

---

**Current Status:** Xcode is open - follow the steps above to fix your bundle ID and signing! 🚀
