#!/usr/bin/env node

/**
 * Build script for Firefox WebExtension
 * 
 * 1. Builds Next.js app as static export
 * 2. Copies files to extension directories
 * 3. Prepares manifest and entry files
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const ROOT_DIR = path.resolve(__dirname, '../..')
const EXTENSION_DIR = path.resolve(__dirname, '..')
const NEWTAB_APP_DIR = path.join(EXTENSION_DIR, 'newtab/app')
const SIDEBAR_APP_DIR = path.join(EXTENSION_DIR, 'sidebar/app')

console.log('🔨 Building Firefox WebExtension...\n')

// Step 0: Add static exports to route files
console.log('📝 Adding static export configuration to route files...')
process.chdir(ROOT_DIR)
try {
  execSync('node webextension/scripts/add-static-exports.js', { stdio: 'inherit' })
} catch (error) {
  console.warn('⚠️  Could not add static exports (this is okay if routes already have them)')
}

// Step 1: Build Next.js as static export
console.log('\n📦 Building Next.js app (static export)...')

// Set environment variable for extension build
process.env.EXTENSION_BUILD = 'true'

// Use extension-specific Next.js config
const extensionConfigPath = path.join(ROOT_DIR, 'next.config.extension.mjs')
const originalNextConfig = path.join(ROOT_DIR, 'next.config.mjs')

// Temporarily swap config if extension config exists
let configSwapped = false
if (fs.existsSync(extensionConfigPath)) {
  if (fs.existsSync(originalNextConfig)) {
    fs.copyFileSync(originalNextConfig, path.join(ROOT_DIR, 'next.config.mjs.backup'))
  }
  fs.copyFileSync(extensionConfigPath, originalNextConfig)
  configSwapped = true
}

try {
  // Build Next.js with extension flag
  execSync('npm run build', { stdio: 'inherit', env: { ...process.env, EXTENSION_BUILD: 'true' } })
  
  // Build output directory
  const outDir = path.join(ROOT_DIR, 'out')
  
  if (!fs.existsSync(outDir)) {
    throw new Error('Next.js build output not found. Did the build succeed?')
  }

  // Step 2: Copy to extension directories
  console.log('\n📁 Copying files to extension directories...')
  
  // Create directories
  fs.mkdirSync(NEWTAB_APP_DIR, { recursive: true })
  fs.mkdirSync(SIDEBAR_APP_DIR, { recursive: true })
  
  // Copy built files
  copyDir(outDir, NEWTAB_APP_DIR)
  copyDir(outDir, SIDEBAR_APP_DIR)
  
  console.log('✅ Build complete!')
  console.log('\n📝 Next steps:')
  console.log('1. Load extension in Firefox:')
  console.log('   - Open about:debugging')
  console.log('   - Click "This Firefox"')
  console.log('   - Click "Load Temporary Add-on"')
  console.log('   - Select webextension/manifest.json')
  console.log('\n2. Or use web-ext for development:')
  console.log('   npm install -g web-ext')
  console.log('   web-ext run --source-dir webextension')
  
} catch (error) {
  console.error('❌ Build failed:', error.message)
  process.exit(1)
} finally {
  // Restore original Next.js config if we swapped it
  if (configSwapped) {
    const backupPath = path.join(ROOT_DIR, 'next.config.mjs.backup')
    if (fs.existsSync(backupPath)) {
      fs.copyFileSync(backupPath, originalNextConfig)
      fs.unlinkSync(backupPath)
    }
  }
}

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true })
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true })
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

