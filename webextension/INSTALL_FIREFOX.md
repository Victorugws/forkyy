# Installing Firefox for Extension Testing

## Option 1: Install via Homebrew (Recommended)

If you have Homebrew installed:

```bash
brew install --cask firefox
```

Then open Firefox:
```bash
open -a Firefox
```

## Option 2: Download from Mozilla

1. Go to https://www.mozilla.org/firefox/
2. Click "Download Firefox"
3. Open the downloaded `.dmg` file
4. Drag Firefox to your Applications folder
5. Open Firefox from Applications

## Option 3: Install Firefox Developer Edition

For extension development, Firefox Developer Edition is recommended:

1. Go to https://www.mozilla.org/firefox/developer/
2. Download Firefox Developer Edition
3. Install it (it can coexist with regular Firefox)

## After Installation

1. Open Firefox
2. Go to `about:debugging`
3. Click "This Firefox"
4. Click "Load Temporary Add-on..."
5. Select `webextension/manifest.json`

## Verify Installation

Run this command to check if Firefox is installed:
```bash
ls -la /Applications/ | grep -i firefox
```

Or check the version:
```bash
/Applications/Firefox.app/Contents/MacOS/firefox --version
```

