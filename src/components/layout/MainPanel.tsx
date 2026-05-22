import { useRef, useState, useCallback, useEffect } from 'react'
import { GripVertical } from 'lucide-react'
import CodeEditor from '../editor/CodeEditor'
import LivePreview from '../preview/LivePreview'
import AIChat from '../assistant/AIChat'

export default function MainPanel() {
  const [editorWidth, setEditorWidth] = useState(50) // percentage
  const [rightPanelWidth, setRightPanelWidth] = useState(35) // percentage of right side for AI panel
  const containerRef = useRef<HTMLDivElement>(null)
  const isDraggingH = useRef(false)
  const isDraggingV = useRef(false)

  // Horizontal resize (editor <-> preview+chat)
  const handleHMouseDown = useCallback(() => {
    isDraggingH.current = true
  }, [])

  // Vertical resize (preview <-> chat)
  const handleVMouseDown = useCallback(() => {
    isDraggingV.current = true
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return

      if (isDraggingH.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const pct = Math.max(25, Math.min(75, (x / rect.width) * 100))
        setEditorWidth(pct)
      }

      if (isDraggingV.current) {
        // Find the right section element
        const rightSection = containerRef.current.querySelector(
          '[data-section="right"]'
        )
        if (!rightSection) return
        const rect = rightSection.getBoundingClientRect()
        const x = e.clientX - rect.left
        const pct = Math.max(15, Math.min(60, (x / rect.width) * 100))
        setRightPanelWidth(pct)
      }
    }

    const handleMouseUp = () => {
      isDraggingH.current = false
      isDraggingV.current = false
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  return (
    <div ref={containerRef} className="flex-1 flex overflow-hidden">
      {/* Editor Section */}
      <div style={{ width: `${editorWidth}%` }} className="h-full">
        <CodeEditor />
      </div>

      {/* Horizontal Resizer */}
      <div
        onMouseDown={handleHMouseDown}
        className="w-1.5 bg-gray-200 hover:bg-indigo-400 cursor-col-resize flex items-center justify-center transition-colors flex-shrink-0 group"
      >
        <GripVertical
          size={12}
          className="text-gray-400 group-hover:text-white transition-colors"
        />
      </div>

      {/* Right Section: Preview + AI Chat */}
      <div
        data-section="right"
        style={{ width: `${100 - editorWidth}%` }}
        className="h-full flex"
      >
        {/* Preview */}
        <div style={{ width: `${100 - rightPanelWidth}%` }} className="h-full">
          <LivePreview />
        </div>

        {/* Vertical Resizer */}
        <div
          onMouseDown={handleVMouseDown}
          className="w-1.5 bg-gray-200 hover:bg-purple-400 cursor-col-resize flex items-center justify-center transition-colors flex-shrink-0 group"
        >
          <GripVertical
            size={12}
            className="text-gray-400 group-hover:text-white transition-colors"
          />
        </div>

        {/* AI Chat Panel */}
        <div style={{ width: `${rightPanelWidth}%` }} className="h-full">
          <AIChat />
        </div>
      </div>
    </div>
  )
}
