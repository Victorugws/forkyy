# Testing the Forkyy Firefox Extension

## Quick Test Setup

Since the full Next.js build has some type errors, we've created a minimal test page to verify the extension infrastructure works.

## Steps to Test

### 1. Load the Extension in Firefox

1. Open Firefox
2. Navigate to `about:debugging`
3. Click "This Firefox" in the left sidebar
4. Click "Load Temporary Add-on..."
5. Navigate to the `webextension` folder
6. Select `manifest.json`

### 2. Test the New Tab Page

1. Open a new tab (Ctrl+T or Cmd+T)
2. You should see the "Forkyy Extension Test" page
3. The page will automatically check:
   - Extension context availability
   - Browser API availability
   - Background script communication
   - Storage API
   - Tabs API

### 3. Test Features

- **Create New Tab**: Click the button to create a test tab
- **Refresh Tabs List**: See all open tabs in Firefox
- **Test Storage**: Verify storage API is working

### 4. Check Background Script

Open the Browser Console (Ctrl+Shift+K) and check for any errors from the background script.

## Expected Results

✅ All status indicators should show green checkmarks
✅ Tabs list should display all open Firefox tabs
✅ Create tab button should open a new tab
✅ Storage test should save and retrieve data

## Troubleshooting

### Extension won't load
- Check `manifest.json` syntax
- Verify all referenced files exist
- Check Browser Console for errors

### Background script not working
- Check `background/background.js` exists
- Verify manifest permissions are correct
- Check Browser Console for errors

### APIs not available
- Verify extension is loaded (check `about:debugging`)
- Check manifest permissions include required APIs
- Ensure you're testing in a new tab (not a regular page)

## Next Steps

Once the test page works:
1. Fix remaining Next.js build errors
2. Integrate the React app
3. Test full UI functionality

