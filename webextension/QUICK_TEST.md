# Quick Extension Test Guide

## 🚀 Test the Extension Now

### Step 1: Load Extension in Firefox

1. Open Firefox
2. Type `about:debugging` in the address bar and press Enter
3. Click **"This Firefox"** in the left sidebar
4. Click **"Load Temporary Add-on..."**
5. Navigate to: `/Users/victorchukwuebukaugwu/Morphic/morphic/forkyy/forkyy/webextension`
6. Select **`manifest.json`**

### Step 2: Test the New Tab

1. Open a **new tab** (Ctrl+T / Cmd+T)
2. You should see the **"Forkyy Extension Test"** page
3. The page automatically tests:
   - ✅ Extension context
   - ✅ Browser APIs
   - ✅ Background script communication
   - ✅ Storage API
   - ✅ Tabs API

### Step 3: Try the Features

- **Create New Tab**: Creates a test tab at example.com
- **Refresh Tabs List**: Shows all open Firefox tabs
- **Test Storage**: Saves and retrieves test data

## ✅ What Should Work

- All status indicators show green checkmarks
- Tabs list displays all open tabs
- Create tab button opens new tabs
- Storage test saves/retrieves data

## 🔍 If Something Doesn't Work

1. **Check Browser Console**: Press Ctrl+Shift+K (Cmd+Option+K on Mac)
2. **Check Extension Status**: Go back to `about:debugging` and check for errors
3. **Reload Extension**: Click "Reload" button in `about:debugging`

## 📝 Files Created

- `webextension/newtab/test.html` - Test page
- `webextension/background/background.js` - Background service worker
- `webextension/manifest.json` - Extension manifest

## 🎯 Next Steps

Once the test page works, we can:
1. Fix remaining Next.js build errors
2. Integrate the full React app
3. Test complete UI functionality

