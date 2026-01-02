// Debug script loading
console.log('📄 HTML loaded')
const debug = document.getElementById('debug')

// Check if script loads
const script = document.createElement('script')
script.type = 'module'
script.src = 'app/main.js'
script.onload = () => {
  console.log('✅ Script loaded')
  if (debug) debug.textContent = 'Script loaded, waiting for React...'
}
script.onerror = (e) => {
  console.error('❌ Script failed to load', e)
  if (debug) debug.textContent = 'Script failed to load - check console'
}
document.head.appendChild(script)

// Check for errors after a delay
setTimeout(() => {
  if (debug && !document.getElementById('root')?.hasChildNodes()) {
    debug.textContent = 'No React content after 3s - check console for errors'
  }
}, 3000)

