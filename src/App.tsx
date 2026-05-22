import { useEffect } from 'react'
import Header from './components/layout/Header'
import Sidebar from './components/layout/Sidebar'
import MainPanel from './components/layout/MainPanel'
import Toolbar from './components/layout/Toolbar'
import { useEditorStore } from './stores/editorStore'

// Load saved code from localStorage on mount
function useLoadSavedCode() {
  const { setFileCode } = useEditorStore()

  useEffect(() => {
    try {
      const saved = localStorage.getItem('web-code-lab-code')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.index) setFileCode('index', parsed.index)
        if (parsed.page1) setFileCode('page1', parsed.page1)
        if (parsed.page2) setFileCode('page2', parsed.page2)
      }
    } catch {
      // Ignore parse errors, use defaults
    }
  }, []) // Only run on mount
}

// Save code to localStorage on change
function useSaveCode() {
  const { code } = useEditorStore()

  useEffect(() => {
    try {
      localStorage.setItem('web-code-lab-code', JSON.stringify(code))
    } catch {
      // Ignore storage errors
    }
  }, [code])
}

export default function App() {
  useLoadSavedCode()
  useSaveCode()

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-900 overflow-hidden">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <MainPanel />
          <Toolbar />
        </div>
      </div>
    </div>
  )
}
