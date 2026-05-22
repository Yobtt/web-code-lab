import { Code2, Sparkles } from 'lucide-react'
import { useEditorStore } from '../../stores/editorStore'
import { useTaskStore } from '../../stores/taskStore'

export default function Header() {
  const { isAiEnabled, toggleAi } = useEditorStore()
  const { getProgress } = useTaskStore()
  const progress = getProgress()

  return (
    <header className="h-14 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-between px-4 shadow-lg z-10 relative">
      {/* Logo & Title */}
      <div className="flex items-center gap-3">
        <div className="bg-white/20 p-1.5 rounded-lg">
          <Code2 size={22} />
        </div>
        <div>
          <h1 className="text-lg font-bold leading-tight">网页代码实验室</h1>
          <p className="text-xs text-white/70 leading-tight">初一学生编程入门</p>
        </div>
      </div>

      {/* Center: Progress */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-sm text-white/80">
            任务进度 ({progress}%)
          </span>
          <div className="w-32 h-2 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-400 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Right: AI Toggle */}
      <button
        onClick={toggleAi}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
          isAiEnabled
            ? 'bg-white/20 hover:bg-white/30'
            : 'bg-white/10 text-white/60 hover:bg-white/20'
        }`}
        title={isAiEnabled ? 'AI助手已开启' : 'AI助手已关闭'}
      >
        <Sparkles
          size={16}
          className={isAiEnabled ? 'text-yellow-300' : 'text-white/40'}
        />
        <span>AI助手</span>
      </button>
    </header>
  )
}
