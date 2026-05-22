import { create } from 'zustand'

export type FileName = 'index' | 'page1' | 'page2'

const defaultCode: Record<FileName, string> = {
  index: '',
  page1: '',
  page2: '',
}

export interface AIHint {
  line: number
  message: string
  type: 'error' | 'warning' | 'info'
}

interface EditorState {
  currentFile: FileName
  code: Record<FileName, string>
  cursorPosition: { line: number; col: number }
  aiHints: AIHint[]
  isAiEnabled: boolean
  setCurrentFile: (file: FileName) => void
  setCode: (code: string) => void
  setFileCode: (file: FileName, code: string) => void
  setCursorPosition: (line: number, col: number) => void
  setAiHints: (hints: AIHint[]) => void
  clearAiHints: () => void
  toggleAi: () => void
  resetAll: () => void
}

export const useEditorStore = create<EditorState>((set, get) => ({
  currentFile: 'index',
  code: { ...defaultCode },
  cursorPosition: { line: 1, col: 1 },
  aiHints: [],
  isAiEnabled: true,

  setCurrentFile: (file) => set({ currentFile: file }),

  setCode: (code) => {
    const file = get().currentFile
    set((state) => ({
      code: { ...state.code, [file]: code },
    }))
  },

  setFileCode: (file, code) =>
    set((state) => ({
      code: { ...state.code, [file]: code },
    })),

  setCursorPosition: (line, col) =>
    set({ cursorPosition: { line, col } }),

  setAiHints: (hints) => set({ aiHints: hints }),

  clearAiHints: () => set({ aiHints: [] }),

  toggleAi: () => set((state) => ({ isAiEnabled: !state.isAiEnabled })),

  resetAll: () =>
    set({
      currentFile: 'index',
      code: { ...defaultCode },
      cursorPosition: { line: 1, col: 1 },
      aiHints: [],
      isAiEnabled: true,
    }),
}))
