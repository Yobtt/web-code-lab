import { useCallback } from 'react'
import { useEditorStore } from '../stores/editorStore'
import { useAIStore } from '../stores/aiStore'
import { useTaskStore } from '../stores/taskStore'
import { callDeepSeek } from '../services/deepseek'
import { taskPhases } from '../data/tasks'
import { useDebounce } from './useDebounce'

export function useCodeHint() {
  const { code, currentFile, isAiEnabled, setAiHints } = useEditorStore()
  const { isLoading, setLoading, setLastCheck, canCheck, addMessage } =
    useAIStore()
  const { completedTasks, toggleTask } = useTaskStore()

  const getCurrentTaskDescription = useCallback(() => {
    for (const phase of taskPhases) {
      for (const task of phase.tasks) {
        if (!completedTasks.includes(task.id)) {
          return {
            taskDescription: `${phase.title} - ${task.title}: ${task.description}`,
            taskId: task.id,
          }
        }
      }
    }
    return {
      taskDescription: '所有任务已完成！你可以自由创作',
      taskId: '',
    }
  }, [completedTasks])

  const checkCode = useCallback(async () => {
    if (!isAiEnabled) {
      console.log('[AI Hint] AI is disabled, skipping')
      return
    }
    if (isLoading) {
      console.log('[AI Hint] Already loading, skipping')
      return
    }
    if (!canCheck()) {
      console.log('[AI Hint] Cooldown active, skipping')
      return
    }

    const currentCode = code[currentFile]
    if (!currentCode || currentCode.trim().length < 3) {
      console.log('[AI Hint] Code too short, skipping')
      return
    }

    console.log('[AI Hint] Calling DeepSeek API...')
    setLoading(true)
    setLastCheck(currentCode)

    try {
      const { taskDescription } = getCurrentTaskDescription()
      const response = await callDeepSeek(currentCode, taskDescription)

      console.log('[AI Hint] Response:', response)

      setAiHints(response.hints || [])

      if (response.panelMessage) {
        addMessage({
          role: 'assistant',
          content: response.panelMessage,
        })
      }

      if (response.taskCompleted) {
        const { taskId } = getCurrentTaskDescription()
        if (taskId && !completedTasks.includes(taskId)) {
          toggleTask(taskId)
          addMessage({
            role: 'assistant',
            content: `🎉 太棒了！你已经完成了这个任务！${response.nextStep ? '下一步：' + response.nextStep : '继续加油！'}`,
          })
        }
      }
    } catch (err) {
      console.error('[AI Hint] API call failed:', err)
    } finally {
      setLoading(false)
    }
  }, [
    code,
    currentFile,
    isAiEnabled,
    isLoading,
    canCheck,
    setLoading,
    setLastCheck,
    setAiHints,
    addMessage,
    getCurrentTaskDescription,
    completedTasks,
    toggleTask,
  ])

  const debouncedCheck = useDebounce(checkCode, 1500)

  return { checkCode, debouncedCheck, isLoading }
}
