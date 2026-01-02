import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { dirname, resolve, relative } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const redisStubPath = resolve(__dirname, 'stubs/redis-stub.ts')
const actionsStubPath = resolve(__dirname, 'stubs/actions-stub.ts')

// Plugin to replace server-only imports in source code
function replaceServerImports() {
  return {
    name: 'replace-server-imports',
    transform(code, id) {
      // Skip node_modules and already processed files
      if (id.includes('node_modules') || id.includes('stubs/')) return null
      
      let modified = false
      let newCode = code
      
      // Calculate relative path from current file to stub
      const getRelativePath = (filePath: string, stubPath: string) => {
        try {
          const rel = relative(dirname(filePath), stubPath)
          return rel.startsWith('.') ? rel : './' + rel
        } catch {
          return '../stubs/redis-stub'
        }
      }
      
      // Replace @/lib/redis/config imports
      const redisPattern = /from\s+['"]@\/lib\/redis\/config['"]/g
      if (redisPattern.test(code)) {
        const relPath = getRelativePath(id, redisStubPath).replace('redis-stub.ts', 'redis-stub')
        newCode = newCode.replace(redisPattern, `from '${relPath}'`)
        modified = true
      }
      
      // Replace @/lib/actions/chat imports
      const chatPattern = /from\s+['"]@\/lib\/actions\/chat['"]/g
      if (chatPattern.test(code)) {
        const relPath = getRelativePath(id, actionsStubPath).replace('actions-stub.ts', 'actions-stub')
        newCode = newCode.replace(chatPattern, `from '${relPath}'`)
        modified = true
      }
      
      // Replace @/lib/actions/tasks imports
      const tasksPattern = /from\s+['"]@\/lib\/actions\/tasks['"]/g
      if (tasksPattern.test(code)) {
        const relPath = getRelativePath(id, actionsStubPath).replace('actions-stub.ts', 'actions-stub')
        newCode = newCode.replace(tasksPattern, `from '${relPath}'`)
        modified = true
      }
      
      if (modified) {
        return { code: newCode, map: null }
      }
      return null
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), replaceServerImports()],
  build: {
    outDir: 'newtab/app',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'newtab/react-entry.tsx'),
      },
      output: {
        entryFileNames: 'main.js',
        chunkFileNames: 'chunk-[hash].js',
        assetFileNames: 'assets/[name].[ext]',
        format: 'es', // ES modules for extension
      },
      external: (id) => {
        // Exclude Node.js built-ins
        const nodeBuiltins = [
          'fs', 'path', 'os', 'crypto', 'stream', 'util', 'events', 
          'net', 'tls', 'http', 'https', 'url', 'querystring', 'buffer',
          'child_process', 'cluster', 'dgram', 'dns', 'module', 'readline',
          'repl', 'string_decoder', 'sys', 'timers', 'tty', 'vm', 'zlib'
        ]
        if (nodeBuiltins.includes(id) || id.startsWith('node:')) {
          return true
        }
        // Exclude Redis and server-only packages (but not our stubs)
        if ((id.includes('redis') || id.includes('@redis') || id.includes('ioredis') || id.includes('@upstash')) 
            && !id.includes('stubs')) {
          return true
        }
        return false
      },
    },
    // Ensure we build for browser extension
    target: 'esnext',
    minify: false, // Easier to debug initially
    sourcemap: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, '..'),
      // Redirect server-only modules to stubs (must use absolute paths)
      '@/lib/redis/config': redisStubPath,
      '@/lib/actions/chat': actionsStubPath,
      '@/lib/actions/tasks': actionsStubPath,
      // Direct package imports
      'redis': redisStubPath,
      '@redis/client': redisStubPath,
      '@upstash/redis': redisStubPath,
    },
  },
  // Exclude Node.js modules that won't work in browser
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env.EXTENSION_BUILD': JSON.stringify('true'),
  },
  optimizeDeps: {
    exclude: [
      'fs', 'path', 'os', 'crypto', 'stream', 'util', 'events', 
      'net', 'tls', 'http', 'https', 'url', 'querystring',
      'redis', '@redis/client', '@upstash/redis'
    ],
  },
})
