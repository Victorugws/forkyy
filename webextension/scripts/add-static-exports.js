#!/usr/bin/env node

/**
 * Add static export configuration to all route files
 * This makes them compatible with Next.js static export
 */

const fs = require('fs')
const path = require('path')

function addStaticExportToRoutes(dir, rootDir) {
  if (!fs.existsSync(dir)) return
  
  const routeFiles = []
  function findRouteFiles(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name)
      if (entry.isDirectory()) {
        findRouteFiles(fullPath)
      } else if (entry.name === 'route.ts' || entry.name === 'route.js') {
        routeFiles.push(fullPath)
      }
    }
  }
  findRouteFiles(dir)
  
  for (const file of routeFiles) {
    let content = fs.readFileSync(file, 'utf8')
    let modified = false
    
    // Remove runtime = 'nodejs' as it's incompatible with static export
    if (content.includes("export const runtime = 'nodejs'")) {
      content = content.replace(/export const runtime = ['"]nodejs['"]\n?/g, '')
      modified = true
    }
    
    // Check if already has dynamic export
    if (!content.includes('export const dynamic')) {
      // Find the last import statement
      const lines = content.split('\n')
      let lastImportIndex = -1
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim().startsWith('import ')) {
          lastImportIndex = i
        }
      }
      
      // Insert after last import or at the beginning
      const insertIndex = lastImportIndex >= 0 ? lastImportIndex + 1 : 0
      
      // Check if it's a dynamic route (has [id] or similar)
      const isDynamicRoute = file.includes('[') && file.includes(']')
      const staticExports = ["export const dynamic = 'force-static'", "export const revalidate = false"]
      
      if (isDynamicRoute && !content.includes('generateStaticParams')) {
        staticExports.push('', '// Required for static export with dynamic routes', 'export function generateStaticParams() {', '  return []', '}')
      }
      
      lines.splice(insertIndex, 0, '', ...staticExports)
      content = lines.join('\n')
      modified = true
    }
    
    if (modified) {
      fs.writeFileSync(file, content)
      console.log(`Updated: ${path.relative(rootDir, file)}`)
    }
  }
}

const rootDir = path.resolve(__dirname, '../..')
addStaticExportToRoutes(path.join(rootDir, 'app/api'), rootDir)
addStaticExportToRoutes(path.join(rootDir, 'app/auth'), rootDir)

console.log('✅ Updated all route files for static export')
