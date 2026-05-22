import { useState, useRef, useEffect } from 'react'
import { Sparkles, Send, Loader2, Bot, User } from 'lucide-react'
import { useAIStore } from '../../stores/aiStore'
import { useEditorStore } from '../../stores/editorStore'
import { callDeepSeek } from '../../services/deepseek'
import { useTaskStore } from '../../stores/taskStore'
import { taskPhases } from '../../data/tasks'

export default function AIChat() {
  const [input, setInput] = useState('')
  const [isCollapsed, setIsCollapsed] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const { messages, isLoading, setLoading, addMessage } = useAIStore()
  const { code, currentFile, isAiEnabled } = useEditorStore()
  const { completedTasks } = useTaskStore()

  const getCurrentTask = () => {
    for (const phase of taskPhases) {
      for (const task of phase.tasks) {
        if (!completedTasks.includes(task.id)) {
          return `${phase.title} - ${task.title}: ${task.description}`
        }
      }
    }
    return '所有任务已完成！自由创作中'
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || isLoading) return

    addMessage({ role: 'user', content: text })
    setInput('')
    setLoading(true)

    try {
      const currentTask = getCurrentTask()
      const currentCode = code[currentFile]

      const response = await callDeepSeek(
        `学生提问: ${text}\n\n当前代码:\n${currentCode}`,
        currentTask
      )

      addMessage({
        role: 'assistant',
        content: response.panelMessage || '请再详细描述你的问题，我来帮你！',
      })

      if (response.taskCompleted) {
        addMessage({
          role: 'assistant',
          content: `🎉 恭喜！${response.nextStep || '继续加油！'}`,
        })
      }
    } catch {
      addMessage({
        role: 'assistant',
        content: '抱歉，我正在思考中，请稍后再试~',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!isAiEnabled) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 text-sm p-4 text-center">
        AI助手已关闭，点击右上角按钮开启
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="h-10 bg-gradient-to-r from-indigo-500 to-purple-500 text-white flex items-center px-3 gap-2 text-sm font-medium flex-shrink-0"
      >
        <Sparkles size={16} className="text-yellow-300" />
        <span>AI 编程助教</span>
        <span className="ml-auto text-xs opacity-70">
          {isCollapsed ? '展开' : '收起'}
        </span>
      </button>

      {!isCollapsed && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 text-sm py-8">
                <Bot size={32} className="mx-auto mb-2 text-indigo-300" />
                <p>你好！我是你的编程助教 👋</p>
                <p className="text-xs mt-1">
                  写代码时我会自动给你提示
                  <br />
                  有不懂的也可以直接问我！
                </p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2 ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot size={14} className="text-indigo-500" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                    msg.role === 'user'
                      ? 'bg-indigo-500 text-white rounded-br-sm'
                      : 'bg-gray-100 text-gray-700 rounded-bl-sm'
                  }`}
                >
                  {msg.content}
                </div>
                {msg.role === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0 mt-1">
                    <User size={14} className="text-white" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <Bot size={14} className="text-indigo-500" />
                </div>
                <div className="bg-gray-100 rounded-lg rounded-bl-sm px-3 py-2">
                  <Loader2 size={16} className="animate-spin text-indigo-400" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-2">
            <div className="flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="向AI助教提问..."
                className="flex-1 resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
                rows={2}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="px-3 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
