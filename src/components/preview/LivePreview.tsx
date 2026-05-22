import { useRef, useEffect, useState, useCallback } from 'react'
import { Maximize2, Minimize2, RefreshCw } from 'lucide-react'
import { useEditorStore } from '../../stores/editorStore'
import { sanitizeHTML } from '../../utils/sandbox'
import { useDebounce } from '../../hooks/useDebounce'

export default function LivePreview() {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const { code, currentFile } = useEditorStore()
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [previewKey, setPreviewKey] = useState(0)

  const updatePreview = useCallback(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    const rawCode = code[currentFile] || ''
    const safeCode = sanitizeHTML(rawCode)

    const doc = iframe.contentDocument || iframe.contentWindow?.document
    if (doc) {
      doc.open()
      doc.write(safeCode)
      doc.close()
    }
  }, [code, currentFile])

  const debouncedUpdate = useDebounce(updatePreview, 300)

  useEffect(() => {
    debouncedUpdate()
  }, [code, currentFile, debouncedUpdate])

  // Force refresh when clicking refresh button
  const handleRefresh = () => {
    setPreviewKey((k) => k + 1)
    setTimeout(updatePreview, 50)
  }

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (iframeRef.current?.requestFullscreen) {
        iframeRef.current.requestFullscreen()
      }
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      }
    }
    setIsFullscreen(!isFullscreen)
  }

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFsChange)
    return () => document.removeEventListener('fullscreenchange', handleFsChange)
  }, [])

  return (
    <div className="flex flex-col h-full">
      {/* Preview header */}
      <div className="h-8 bg-gray-100 border-b border-gray-200 flex items-center justify-between px-3">
        <span className="text-xs text-gray-500 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
          实时预览
          {currentFile !== 'index' && (
            <span className="text-gray-400">
              - {currentFile === 'page1' ? 'page1.html' : 'page2.html'}
            </span>
          )}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={handleRefresh}
            className="p-1 rounded hover:bg-gray-200 text-gray-500 transition-colors"
            title="刷新预览"
          >
            <RefreshCw size={14} />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-1 rounded hover:bg-gray-200 text-gray-500 transition-colors"
            title={isFullscreen ? '退出全屏' : '全屏预览'}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      {/* Preview iframe */}
      <div className="flex-1 bg-white relative">
        <iframe
          key={previewKey}
          ref={iframeRef}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin"
          title="网页预览"
        />
        {/* Empty state overlay */}
        {(!code[currentFile] || code[currentFile].trim().length === 0) && (
          <div className="absolute inset-0 flex items-center justify-center bg-white pointer-events-none">
            <div className="text-center text-gray-300">
              <div className="text-4xl mb-3">👁️</div>
              <p className="text-sm">在左侧输入代码</p>
              <p className="text-xs mt-1">这里会实时显示效果</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
