'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { CustomDock } from '@/components/CustomDock'

// Dynamically import Monaco Editor (client-side only)
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

export default function IDEPage() {
  const editorRef = useRef<any>(null)
  const [currentFile, setCurrentFile] = useState<string | null>(null)
  const [code, setCode] = useState('// Welcome to your Browser IDE\n// Start coding here...\n\nconsole.log("Hello, World!");')
  const [language, setLanguage] = useState('javascript')

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor
  }

  const handleNewFile = () => {
    setCode('// New file\n')
    setCurrentFile(null)
    setLanguage('javascript')
  }

  const handleSave = async () => {
    if (!editorRef.current) return

    const content = editorRef.current.getValue()
    
    // In Electron, we can use the file system
    if (typeof window !== 'undefined' && (window as any).electron?.saveFile) {
      try {
        const result = await (window as any).electron.saveFile(content, currentFile)
        if (result) {
          setCurrentFile(result.path)
          alert('File saved successfully!')
        }
      } catch (error) {
        console.error('Error saving file:', error)
        alert('Error saving file')
      }
    } else {
      // Fallback: download as file
      const blob = new Blob([content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = currentFile || 'code.js'
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const handleOpenFile = async () => {
    // In Electron, we can use the file system
    if (typeof window !== 'undefined' && (window as any).electron?.openFile) {
      try {
        const result = await (window as any).electron.openFile()
        if (result) {
          setCode(result.content)
          setCurrentFile(result.path)
          
          // Detect language from file extension
          const ext = result.path.split('.').pop()?.toLowerCase()
          const languageMap: Record<string, string> = {
            'js': 'javascript',
            'ts': 'typescript',
            'jsx': 'javascript',
            'tsx': 'typescript',
            'py': 'python',
            'html': 'html',
            'css': 'css',
            'json': 'json',
            'md': 'markdown',
            'go': 'go',
            'rs': 'rust',
            'java': 'java',
            'cpp': 'cpp',
            'c': 'c'
          }
          setLanguage(languageMap[ext || ''] || 'plaintext')
        }
      } catch (error) {
        console.error('Error opening file:', error)
      }
    } else {
      alert('File system access requires Electron')
    }
  }

  return (
    <div className="flex flex-col h-screen bg-[#1e1e1e] text-white">
      <CustomDock />
      
      {/* IDE Toolbar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-[#252526] border-b border-[#3e3e42]">
        <button
          onClick={handleNewFile}
          className="px-3 py-1.5 text-sm bg-[#0e639c] hover:bg-[#1177bb] rounded text-white transition-colors"
        >
          New File
        </button>
        <button
          onClick={handleOpenFile}
          className="px-3 py-1.5 text-sm bg-[#0e639c] hover:bg-[#1177bb] rounded text-white transition-colors"
        >
          Open File
        </button>
        <button
          onClick={handleSave}
          className="px-3 py-1.5 text-sm bg-[#0e639c] hover:bg-[#1177bb] rounded text-white transition-colors"
        >
          Save
        </button>
        {currentFile && (
          <span className="ml-4 text-xs text-gray-400 truncate max-w-xs">
            {currentFile}
          </span>
        )}
      </div>

      {/* Monaco Editor Container */}
      <div className="flex-1" style={{ height: 'calc(100vh - 60px)' }}>
        <MonacoEditor
          height="100%"
          language={language}
          value={code}
          onChange={(value) => setCode(value || '')}
          theme="vs-dark"
          onMount={handleEditorDidMount}
          options={{
            fontSize: 14,
            minimap: { enabled: true },
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            tabSize: 2,
            insertSpaces: true,
            automaticLayout: true
          }}
        />
      </div>
    </div>
  )
}

