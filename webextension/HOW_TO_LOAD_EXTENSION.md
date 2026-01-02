# How to Load the Extension in Firefox

## Step-by-Step Instructions

### 1. Open Firefox Developer Edition
- It should already be open, or find it in Applications: **Firefox Developer Edition.app**

### 2. Access the Debugging Page

**Option A: Type in Address Bar**
1. Click on the address bar (or press Cmd+L)
2. Type exactly: `about:debugging`
3. Press Enter

**Option B: Use Menu**
1. Click the hamburger menu (☰) in the top right
2. Go to **More Tools** → **Web Developer Tools**
3. Look for **Debugging** or type `about:debugging` in the address bar

### 3. Load the Extension

Once you're on the `about:debugging` page:

1. **Click "This Firefox"** in the left sidebar (it should be selected by default)
2. **Click "Load Temporary Add-on..."** button (usually in the top right or center)
3. **Navigate to your extension folder:**
   ```
   /Users/victorchukwuebukaugwu/Morphic/morphic/forkyy/forkyy/webextension
   ```
4. **Select `manifest.json`** (not the folder, the file itself)
5. Click "Open"

### 4. Verify Extension Loaded

You should see:
- ✅ "Forkyy" listed under "Temporary Extensions"
- ✅ No error messages
- ✅ A "Remove" button next to it

### 5. Test the Extension

1. **Open a new tab** (Cmd+T or click the + button)
2. You should see the **"Forkyy Extension Test"** page instead of the default new tab
3. The test page will show status indicators for all APIs

## Troubleshooting

### Can't find about:debugging
- Make sure you're typing it in the **address bar** (not search bar)
- Type it exactly: `about:debugging` (no spaces, lowercase)
- Press Enter after typing

### Extension won't load
- Make sure you selected the **`manifest.json` file**, not the folder
- Check the Browser Console (Cmd+Shift+K) for error messages
- Verify the manifest.json file exists at the path shown above

### New tab still shows default page
- Make sure the extension loaded successfully (check about:debugging)
- Try reloading the extension (click "Reload" button)
- Close and reopen a new tab

## Visual Guide

```
Firefox Address Bar
┌─────────────────────────────────────┐
│ about:debugging                     │ ← Type this here
└─────────────────────────────────────┘
         ↓ Press Enter
         
about:debugging Page
┌─────────────────────────────────────┐
│ This Firefox  [Load Temporary...]   │ ← Click this button
│                                     │
│ Temporary Extensions:               │
│   Forkyy                            │ ← Should appear here
└─────────────────────────────────────┘
```

