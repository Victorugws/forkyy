'use client'

import { useEffect, useRef } from 'react'
import { CustomDock } from '@/components/CustomDock'

// Import GrapesJS CSS
import 'grapesjs/dist/css/grapes.min.css'

export default function BuilderPage() {
  const editorRef = useRef<HTMLDivElement>(null)
  const grapesRef = useRef<any>(null)

  useEffect(() => {
    if (!editorRef.current || grapesRef.current) return

    // Import GrapesJS and preset dynamically
    import('grapesjs').then((grapesjsModule) => {
      import('grapesjs-preset-webpage').then((grapesjsPresetWebpageModule) => {
        // GrapesJS exports as default - try different access patterns
        const grapesjs = (grapesjsModule as any).default || grapesjsModule
        const grapesjsPresetWebpage = (grapesjsPresetWebpageModule as any).default || grapesjsPresetWebpageModule
        
        // Debug: log the module structure
        console.log('GrapesJS module:', grapesjsModule)
        console.log('GrapesJS:', grapesjs)
        console.log('Has init?', typeof grapesjs?.init)
        
        // Get the plugin name (usually 'gjs-preset-webpage')
        const pluginName = 'gjs-preset-webpage'
        
        // Get init function - try different access patterns
        const initFn = grapesjs?.init || (grapesjsModule as any).init || (grapesjsModule as any).default?.init
        
        if (typeof initFn !== 'function') {
          console.error('GrapesJS init function not found')
          return
        }
        
        // Initialize GrapesJS editor
        const editor = initFn({
        container: editorRef.current!,
        height: 'calc(100vh - 60px)',
        storageManager: {
          type: 'local',
          autosave: true,
          autoload: true,
          stepsBeforeSave: 1
        },
        plugins: [grapesjsPresetWebpage],
        pluginsOpts: {
          [pluginName]: {
            modalImportTitle: 'Import Template',
            modalImportLabel: '<div style="margin-bottom: 10px; font-size: 13px;">Paste here your HTML/CSS and click Import</div>',
            modalImportContent: (editor: any) => {
              return editor.getHtml() + '<style>' + editor.getCss() + '</style>'
            },
            filestackOpts: null,
            blocks: ['link-block', 'quote', 'text-basic'],
            block: {}
          }
        },
        deviceManager: {
          devices: [
            {
              name: 'Desktop',
              width: '',
            },
            {
              name: 'Tablet',
              width: '768px',
              widthMedia: '992px',
            },
            {
              name: 'Mobile',
              width: '320px',
              widthMedia: '768px',
            }
          ]
        },
        panels: {
          defaults: [
            {
              id: 'layers',
              el: '.panel__right',
              resizable: {
                maxDim: 350,
                minDim: 200,
                tc: 0,
                cl: 1,
                cr: 0,
                bc: 0,
                keyWidth: 'flex-basis',
              },
            },
            {
              id: 'panel-devices',
              el: '.panel__devices',
              buttons: [
                {
                  id: 'device-desktop',
                  label: 'D',
                  command: 'set-device-desktop',
                  active: true,
                  togglable: false,
                },
                {
                  id: 'device-tablet',
                  label: 'T',
                  command: 'set-device-tablet',
                  togglable: false,
                },
                {
                  id: 'device-mobile',
                  label: 'M',
                  command: 'set-device-mobile',
                  togglable: false,
                }
              ],
            },
            {
              id: 'panel-switcher',
              el: '.panel__switcher',
              buttons: [
                {
                  id: 'show-layers',
                  active: true,
                  label: 'Layers',
                  command: 'show-layers',
                  togglable: false,
                },
                {
                  id: 'show-style',
                  active: true,
                  label: 'Styles',
                  command: 'show-styles',
                  togglable: false,
                },
                {
                  id: 'show-traits',
                  active: true,
                  label: 'Settings',
                  command: 'show-traits',
                  togglable: false,
                }
              ],
            }
          ]
        },
        layerManager: {
          appendTo: '.layers-container'
        },
        styleManager: {
          appendTo: '.styles-container',
          sectors: [
            {
              name: 'Dimension',
              open: false,
              buildProps: ['width', 'min-height', 'padding'],
              properties: [
                {
                  type: 'integer',
                  name: 'The width',
                  property: 'width',
                  units: ['px', '%'],
                  defaults: 'auto',
                  min: 0,
                }
              ]
            },
            {
              name: 'Extra',
              open: false,
              buildProps: ['background-color', 'box-shadow', 'custom-prop'],
              properties: [
                {
                  id: 'custom-prop',
                  name: 'Custom Label',
                  property: 'font-size',
                  type: 'select',
                  defaults: '32px',
                  options: [
                    { value: '12px', name: 'Tiny' },
                    { value: '18px', name: 'Medium' },
                    { value: '32px', name: 'Big' },
                  ],
                }
              ]
            }
          ]
        },
        traitManager: {
          appendTo: '.traits-container',
        },
        selectorManager: {
          appendTo: '.styles-container',
          states: [{ name: 'hover', label: 'Hover' }, { name: 'active', label: 'Click' }, { name: 'nth-of-type(2n)', label: 'Even/Odd' }]
        },
        canvas: {
          styles: [
            'https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900',
            'https://fonts.googleapis.com/css?family=Material+Icons'
          ]
        }
      })

      grapesRef.current = editor

      // Add export buttons
      const exportButtons = document.createElement('div')
      exportButtons.className = 'export-buttons'
      exportButtons.style.cssText = 'position: absolute; top: 10px; right: 10px; z-index: 1000; display: flex; gap: 8px;'
      
      const exportHtmlBtn = document.createElement('button')
      exportHtmlBtn.textContent = 'Export HTML'
      exportHtmlBtn.className = 'px-3 py-1.5 text-sm bg-[#0e639c] hover:bg-[#1177bb] rounded text-white transition-colors'
      exportHtmlBtn.onclick = () => {
        const html = editor.getHtml()
        const css = editor.getCss()
        const blob = new Blob([`<!DOCTYPE html>\n<html>\n<head>\n<style>${css}</style>\n</head>\n<body>${html}</body>\n</html>`], { type: 'text/html' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'website.html'
        a.click()
        URL.revokeObjectURL(url)
      }

      const exportCodeBtn = document.createElement('button')
      exportCodeBtn.textContent = 'View Code'
      exportCodeBtn.className = 'px-3 py-1.5 text-sm bg-[#0e639c] hover:bg-[#1177bb] rounded text-white transition-colors'
      exportCodeBtn.onclick = () => {
        const html = editor.getHtml()
        const css = editor.getCss()
        const code = `<!-- HTML -->\n${html}\n\n<!-- CSS -->\n<style>\n${css}\n</style>`
        const newWindow = window.open()
        if (newWindow) {
          newWindow.document.write(`<pre style="padding: 20px; font-family: monospace; white-space: pre-wrap;">${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>`)
        }
      }

      exportButtons.appendChild(exportHtmlBtn)
      exportButtons.appendChild(exportCodeBtn)
      document.body.appendChild(exportButtons)

      return () => {
        if (grapesRef.current) {
          grapesRef.current.destroy()
          grapesRef.current = null
        }
        exportButtons.remove()
      }
      }).catch((error) => {
        console.error('Error loading GrapesJS preset:', error)
      })
    }).catch((error) => {
      console.error('Error loading GrapesJS:', error)
    })
  }, [])

  return (
    <div className="flex flex-col h-screen bg-[#ffffff]">
      <CustomDock />
      
      {/* Builder Toolbar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-white border-b border-gray-200 shadow-sm">
        <h1 className="text-lg font-semibold text-gray-800">Website Builder</h1>
        <div className="flex-1"></div>
        <div className="flex items-center gap-2">
          <div className="panel__devices"></div>
        </div>
      </div>

      {/* GrapesJS Editor Container */}
      <div className="flex-1 relative">
        <div className="absolute inset-0 flex">
          {/* Left Sidebar - Blocks */}
          <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
            <div className="gjs-blocks-c" style={{ minHeight: '100%' }}></div>
          </div>

          {/* Main Canvas Area */}
          <div className="flex-1 relative">
            <div className="panel__switcher absolute top-2 left-2 z-10 bg-white rounded shadow-lg p-1 flex gap-1"></div>
            <div ref={editorRef} className="w-full h-full"></div>
          </div>

          {/* Right Sidebar - Layers & Styles */}
          <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
            <div className="panel__right flex-1 overflow-y-auto">
              <div className="p-4">
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Layers</h3>
                  <div className="layers-container"></div>
                </div>
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Styles</h3>
                  <div className="styles-container"></div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Settings</h3>
                  <div className="traits-container"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .gjs-editor {
          min-height: 100%;
        }
        .gjs-cv-canvas {
          top: 0;
          width: 100%;
          height: 100%;
        }
        .gjs-block {
          width: 100%;
          padding: 10px;
          margin: 5px 0;
          border: 1px solid #ddd;
          border-radius: 4px;
          cursor: move;
          background: white;
        }
        .gjs-block:hover {
          background: #f0f0f0;
        }
        .panel__devices {
          display: flex;
          gap: 4px;
        }
        .panel__devices button {
          padding: 6px 12px;
          border: 1px solid #ddd;
          background: white;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }
        .panel__devices button.active {
          background: #0e639c;
          color: white;
        }
        .panel__switcher button {
          padding: 6px 12px;
          border: 1px solid #ddd;
          background: white;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }
        .panel__switcher button.active {
          background: #0e639c;
          color: white;
        }
      `}</style>
    </div>
  )
}

