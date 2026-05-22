import { create } from 'zustand'

export interface AIMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
}

interface AIState {
  messages: AIMessage[]
  isLoading: boolean
  lastCheckCode: string
  lastCheckTime: number
  addMessage: (msg: Omit<AIMessage, 'timestamp'>) => void
  setLoading: (loading: boolean) => void
  setLastCheck: (code: string) => void
  clearMessages: () => void
  canCheck: () => boolean
}

const CHECK_COOLDOWN = 6000 // 6 seconds

export const useAIStore = create<AIState>((set, get) => ({
  messages: [],
  isLoading: false,
  lastCheckCode: '',
  lastCheckTime: 0,

  addMessage: (msg) =>
    set((state) => ({
      messages: [...state.messages, { ...msg, timestamp: Date.now() }],
    })),

  setLoading: (loading) => set({ isLoading: loading }),

  setLastCheck: (code) =>
    set({ lastCheckCode: code, lastCheckTime: Date.now() }),

  clearMessages: () => set({ messages: [] }),

  canCheck: () => {
    const { lastCheckTime } = get()
    return Date.now() - lastCheckTime > CHECK_COOLDOWN
  },
}))
