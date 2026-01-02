/**
 * Load React App in Extension Context
 * This script loads the React app for the extension
 */

console.log('🚀 Loading Forkyy React App...')

// Check for React (wait a bit for scripts to load)
setTimeout(() => {
  if (typeof React === 'undefined' || typeof ReactDOM === 'undefined') {
    console.error('❌ React not loaded')
    document.body.innerHTML = `
      <div style="padding: 2rem; text-align: center; font-family: system-ui;">
        <h1>React Not Loaded</h1>
        <p>Failed to load React libraries. Check console for errors.</p>
        <p style="margin-top: 1rem; font-size: 0.9rem; color: #666;">
          React: ${typeof React}<br>
          ReactDOM: ${typeof ReactDOM}
        </p>
      </div>
    `
    return
  }
  
  initializeApp()
}, 100)

function initializeApp() {

// Check extension context
if (typeof browser === 'undefined' || !browser.runtime || !browser.runtime.id) {
  console.error('❌ Extension context not available')
  document.body.innerHTML = `
    <div style="padding: 2rem; text-align: center; font-family: system-ui;">
      <h1>Extension Context Required</h1>
      <p>This page must be loaded as a Firefox extension.</p>
    </div>
  `
} else {
  console.log('✅ Extension context detected:', browser.runtime.id)
  console.log('✅ React available:', typeof React !== 'undefined')
  
  // Simple React component for the extension
  const { useState, useEffect } = React
  
  function ExtensionApp() {
    const [tabs, setTabs] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
      async function loadTabs() {
        try {
          const response = await browser.runtime.sendMessage({ action: 'getTabs', query: {} })
          if (response && response.success) {
            setTabs(response.data || [])
          } else {
            setError(response?.error || 'Failed to load tabs')
          }
        } catch (err) {
          console.error('Error loading tabs:', err)
          setError(err.message)
        } finally {
          setLoading(false)
        }
      }
      
      loadTabs()
    }, [])

    const handleCreateTab = async () => {
      try {
        const response = await browser.runtime.sendMessage({
          action: 'createTab',
          url: 'https://example.com',
          active: false
        })
        if (response && response.success) {
          // Reload tabs
          const tabsResponse = await browser.runtime.sendMessage({ action: 'getTabs', query: {} })
          if (tabsResponse && tabsResponse.success) {
            setTabs(tabsResponse.data || [])
          }
        } else {
          alert('Failed to create tab: ' + (response?.error || 'Unknown error'))
        }
      } catch (err) {
        console.error('Error creating tab:', err)
        alert('Error: ' + err.message)
      }
    }

    const handleSwitchTab = async (tabId) => {
      try {
        const response = await browser.runtime.sendMessage({
          action: 'switchTab',
          tabId: tabId
        })
        if (response && response.success) {
          // Reload tabs to update active state
          const tabsResponse = await browser.runtime.sendMessage({ action: 'getTabs', query: {} })
          if (tabsResponse && tabsResponse.success) {
            setTabs(tabsResponse.data || [])
          }
        }
      } catch (err) {
        console.error('Error switching tab:', err)
      }
    }

    if (loading) {
      return React.createElement('div', {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontFamily: 'system-ui'
        }
      }, [
        React.createElement('div', { key: 'loading', style: { textAlign: 'center' } }, [
          React.createElement('div', {
            key: 'spinner',
            style: {
              width: '48px',
              height: '48px',
              border: '4px solid rgba(255,255,255,0.3)',
              borderTopColor: 'white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }
          }),
          React.createElement('p', { key: 'text' }, 'Loading Forkyy...')
        ])
      ])
    }

    if (error) {
      return React.createElement('div', {
        style: {
          padding: '2rem',
          textAlign: 'center',
          color: 'white',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          minHeight: '100vh',
          fontFamily: 'system-ui'
        }
      }, [
        React.createElement('h1', { key: 'title' }, 'Error'),
        React.createElement('p', { key: 'message' }, error)
      ])
    }

    return React.createElement('div', {
      style: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontFamily: 'system-ui',
        padding: '2rem'
      }
    }, [
      React.createElement('style', {
        key: 'styles',
        dangerouslySetInnerHTML: {
          __html: `
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
            .tab-item {
              transition: all 0.2s;
            }
            .tab-item:hover {
              background: rgba(255,255,255,0.15) !important;
              transform: translateY(-2px);
            }
            .button {
              transition: all 0.2s;
            }
            .button:hover {
              background: rgba(255,255,255,0.3) !important;
              transform: scale(1.05);
            }
          `
        }
      }),
      React.createElement('div', {
        key: 'container',
        style: { maxWidth: '1200px', margin: '0 auto' }
      }, [
        React.createElement('header', {
          key: 'header',
          style: { textAlign: 'center', marginBottom: '3rem' }
        }, [
          React.createElement('h1', {
            key: 'title',
            style: { fontSize: '4rem', marginBottom: '1rem', fontWeight: 700 }
          }, '🚀 Forkyy'),
          React.createElement('p', {
            key: 'subtitle',
            style: { fontSize: '1.5rem', opacity: 0.9 }
          }, 'AI-Powered Browser Control Center')
        ]),
        React.createElement('div', {
          key: 'tabs-card',
          style: {
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '1rem',
            padding: '2rem',
            marginBottom: '2rem'
          }
        }, [
          React.createElement('h2', {
            key: 'tabs-title',
            style: { marginBottom: '1.5rem', fontSize: '1.5rem' }
          }, `Open Tabs (${tabs.length})`),
          React.createElement('div', {
            key: 'tabs-list',
            style: { display: 'grid', gap: '1rem' }
          }, tabs.map(tab => 
            React.createElement('div', {
              key: tab.id,
              className: 'tab-item',
              onClick: () => handleSwitchTab(tab.id),
              style: {
                background: 'rgba(255,255,255,0.1)',
                padding: '1rem',
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer'
              }
            }, [
              React.createElement('div', {
                key: 'content',
                style: { flex: 1 }
              }, [
                React.createElement('div', {
                  key: 'title',
                  style: { fontWeight: 600, marginBottom: '0.25rem' }
                }, tab.title || 'Untitled'),
                React.createElement('div', {
                  key: 'url',
                  style: { fontSize: '0.9rem', opacity: 0.8 }
                }, tab.url || '')
              ]),
              tab.active && React.createElement('span', {
                key: 'active',
                style: {
                  background: 'rgba(255,255,255,0.2)',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '0.25rem',
                  fontSize: '0.875rem'
                }
              }, 'Active')
            ])
          ))
        ]),
        React.createElement('div', {
          key: 'actions',
          style: { textAlign: 'center' }
        }, [
          React.createElement('button', {
            key: 'create-tab',
            className: 'button',
            onClick: handleCreateTab,
            style: {
              background: 'rgba(255,255,255,0.2)',
              border: '2px solid white',
              color: 'white',
              padding: '0.75rem 2rem',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              cursor: 'pointer',
              margin: '0.5rem'
            }
          }, 'Create New Tab')
        ])
      ])
    ])
  }

  // Initialize React app
  const root = document.getElementById('root')
  if (root) {
    // Use React 18 API (createRoot) or fallback to React 17 (render)
    if (ReactDOM.createRoot) {
      const reactRoot = ReactDOM.createRoot(root)
      reactRoot.render(React.createElement(ExtensionApp))
      console.log('✅ React app rendered successfully (React 18+)')
    } else if (ReactDOM.render) {
      ReactDOM.render(React.createElement(ExtensionApp), root)
      console.log('✅ React app rendered successfully (React 17)')
    } else {
      console.error('❌ ReactDOM.createRoot and ReactDOM.render not available')
    }
  } else {
    console.error('❌ Root element not found')
  }
} // end initializeApp
