import { create } from 'zustand'
import { taskPhases } from '../data/tasks'

interface TaskState {
  phases: typeof taskPhases
  completedTasks: string[]
  unlockedPhases: number[]
  toggleTask: (taskId: string) => void
  isTaskCompleted: (taskId: string) => boolean
  isPhaseUnlocked: (phaseId: number) => boolean
  getProgress: () => number
  resetTasks: () => void
}

export const useTaskStore = create<TaskState>((set, get) => ({
  phases: taskPhases,
  completedTasks: [],
  unlockedPhases: [1],

  toggleTask: (taskId) =>
    set((state) => {
      const isCompleted = state.completedTasks.includes(taskId)
      const newCompleted = isCompleted
        ? state.completedTasks.filter((id) => id !== taskId)
        : [...state.completedTasks, taskId]
      return { completedTasks: newCompleted }
    }),

  isTaskCompleted: (taskId) => get().completedTasks.includes(taskId),

  isPhaseUnlocked: (phaseId) => get().unlockedPhases.includes(phaseId),

  getProgress: () => {
    const totalTasks = taskPhases.reduce(
      (sum, phase) => sum + phase.tasks.length,
      0
    )
    const completed = get().completedTasks.length
    return totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0
  },

  resetTasks: () => set({ completedTasks: [], unlockedPhases: [1] }),
}))
