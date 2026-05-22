import { useState, useEffect, type RefObject } from 'react'
import { EditorView } from '@codemirror/view'
import { AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { useEditorStore } from '../../stores/editorStore'

interface Props {
  viewRef: RefObject<EditorView | null>
}

const typeConfig = {
  error: {
    icon: <AlertCircle size={14} />,
    bg: 'bg-red-50 border-red-200',
    text: 'text-red-700',
    iconColor: 'text-red-500',
  },
  warning: {
    icon: <AlertTriangle size={14} />,
    bg: 'bg-yellow-50 border-yellow-200',
    text: 'text-yellow-700',
    iconColor: 'text-yellow-500',
  },
  info: {
    icon: <Info size={14} />,
    bg: 'bg-blue-50 border-blue-200',
    text: 'text-blue-700',
    iconColor: 'text-blue-500',
  },
}

export default function AIPrompt({ viewRef: _viewRef }: Props) {
  const { aiHints, clearAiHints, currentFile } = useEditorStore()
  const [visible, setVisible] = useState(false)

  // Show hints when they arrive, auto-hide after 8 seconds
  useEffect(() => {
    if (aiHints.length > 0) {
      setVisible(true)
      const timer = setTimeout(() => {
        setVisible(false)
        setTimeout(clearAiHints, 300)
      }, 8000)
      return () => clearTimeout(timer)
    }
  }, [aiHints, clearAiHints])

  // Also hide when file changes
  useEffect(() => {
    setVisible(false)
    clearAiHints()
  }, [currentFile, clearAiHints])

  if (!visible || aiHints.length === 0) return null

  return (
    <div className="absolute bottom-3 left-3 right-3 space-y-2 z-10 pointer-events-none">
      {aiHints.map((hint, i) => {
        const config = typeConfig[hint.type] || typeConfig.info
        return (
          <div
            key={i}
            className={`${config.bg} border rounded-lg px-3 py-2 flex items-start gap-2 shadow-lg transition-all animate-in slide-in-from-bottom-2`}
            style={{
              animation: 'slideUp 0.3s ease-out',
            }}
          >
            <span className={`${config.iconColor} mt-0.5 flex-shrink-0`}>
              {config.icon}
            </span>
            <div className={`text-sm ${config.text}`}>
              <span className="text-xs text-gray-400 mr-1">
                第{hint.line}行:
              </span>
              {hint.message}
            </div>
          </div>
        )
      })}
    </div>
  )
}
