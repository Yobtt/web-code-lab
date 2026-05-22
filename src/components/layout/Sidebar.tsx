import { CheckCircle2, Circle, ChevronRight } from 'lucide-react'
import { useEditorStore, type FileName } from '../../stores/editorStore'
import { useTaskStore } from '../../stores/taskStore'

const fileLabels: Record<FileName, string> = {
  index: '🏠 首页 (index.html)',
  page1: '📄 页面二 (page1.html)',
  page2: '📄 页面三 (page2.html)',
}

const fileIcons: Record<FileName, string> = {
  index: '🏠',
  page1: '📄',
  page2: '📄',
}

export default function Sidebar() {
  const { currentFile, setCurrentFile } = useEditorStore()
  const { phases, completedTasks, isPhaseUnlocked } = useTaskStore()

  const files: FileName[] = ['index', 'page1', 'page2']

  return (
    <aside className="w-56 bg-gray-50 border-r border-gray-200 flex flex-col h-full overflow-hidden">
      {/* File tabs */}
      <div className="p-3 border-b border-gray-200">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          文件列表
        </h3>
        <nav className="space-y-1">
          {files.map((file) => (
            <button
              key={file}
              onClick={() => setCurrentFile(file)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${
                currentFile === file
                  ? 'bg-indigo-100 text-indigo-700 font-medium shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="text-base">{fileIcons[file]}</span>
              <span className="truncate">{fileLabels[file].split(' (')[0]}</span>
              {currentFile === file && (
                <ChevronRight size={14} className="ml-auto text-indigo-400" />
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Task list */}
      <div className="flex-1 overflow-y-auto p-3">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          学习任务
        </h3>
        <div className="space-y-3">
          {phases.map((phase) => {
            const unlocked = isPhaseUnlocked(phase.id)
            const phaseCompleted = phase.tasks.every((t) =>
              completedTasks.includes(t.id)
            )
            const phaseInProgress = phase.tasks.some((t) =>
              completedTasks.includes(t.id)
            ) && !phaseCompleted

            return (
              <div
                key={phase.id}
                className={`rounded-lg p-2.5 transition-all ${
                  unlocked
                    ? 'bg-white border border-gray-200'
                    : 'bg-gray-100 opacity-60'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  {phaseCompleted ? (
                    <CheckCircle2 size={14} className="text-green-500 flex-shrink-0" />
                  ) : phaseInProgress ? (
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin flex-shrink-0" />
                  ) : (
                    <Circle size={14} className="text-gray-300 flex-shrink-0" />
                  )}
                  <span
                    className={`text-xs font-semibold ${
                      unlocked ? 'text-gray-800' : 'text-gray-400'
                    }`}
                  >
                    阶段{phase.id}
                  </span>
                </div>
                <p
                  className={`text-xs ${
                    unlocked ? 'text-gray-700' : 'text-gray-400'
                  }`}
                >
                  {phase.title}
                </p>
                {unlocked && (
                  <div className="mt-1.5 space-y-1">
                    {phase.tasks.map((task) => {
                      const completed = completedTasks.includes(task.id)
                      return (
                        <div
                          key={task.id}
                          className={`text-xs flex items-center gap-1.5 pl-1 ${
                            completed
                              ? 'text-green-600 line-through'
                              : 'text-gray-500'
                          }`}
                        >
                          {completed ? (
                            <CheckCircle2 size={10} className="text-green-500 flex-shrink-0" />
                          ) : (
                            <Circle size={10} className="text-gray-300 flex-shrink-0" />
                          )}
                          <span className="truncate">{task.title}</span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
