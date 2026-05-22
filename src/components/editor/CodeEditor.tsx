import { useEffect, useRef, useCallback } from 'react'
import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightSpecialChars, drawSelection, rectangularSelection, placeholder } from '@codemirror/view'
import { EditorState, Compartment } from '@codemirror/state'
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands'
import { html } from '@codemirror/lang-html'
import { syntaxHighlighting, defaultHighlightStyle, bracketMatching, foldGutter, indentOnInput } from '@codemirror/language'
import { closeBrackets, autocompletion } from '@codemirror/autocomplete'
import { lintGutter } from '@codemirror/lint'
import { oneDark } from '@codemirror/theme-one-dark'
import { Loader2 } from 'lucide-react'
import { useEditorStore } from '../../stores/editorStore'
import { useAIStore } from '../../stores/aiStore'
import { useCodeHint } from '../../hooks/useCodeHint'
import AIPrompt from './AIPrompt'

export default function CodeEditor() {
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const { code, currentFile, setCode, setCursorPosition, isAiEnabled } = useEditorStore()
  const { isLoading } = useAIStore()
  const { debouncedCheck } = useCodeHint()

  const onUpdate = useCallback(
    (update: any) => {
      if (update.docChanged) {
        const newCode = update.state.doc.toString()
        setCode(newCode)
        debouncedCheck()

        // Update cursor position
        const pos = update.state.selection.main.head
        const line = update.state.doc.lineAt(pos)
        setCursorPosition(line.number, pos - line.from + 1)
      }
    },
    [setCode, setCursorPosition, debouncedCheck]
  )

  useEffect(() => {
    if (!editorRef.current) return

    const themeCompartment = new Compartment()

    const state = EditorState.create({
      doc: code[currentFile],
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        highlightSpecialChars(),
        drawSelection(),
        rectangularSelection(),
        history(),
        foldGutter(),
        indentOnInput(),
        bracketMatching(),
        closeBrackets(),
        autocompletion(),
        lintGutter(),
        html(),
        placeholder('从这里开始编写你的HTML代码...'),
        syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
        keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
        themeCompartment.of(oneDark),
        EditorView.updateListener.of(onUpdate),
        EditorView.theme({
          '&': { height: '100%', fontSize: '14px' },
          '.cm-scroller': { overflow: 'auto' },
          '.cm-gutters': { borderRight: '1px solid #333' },
          '.cm-activeLineGutter': { backgroundColor: '#2a2a3a' },
        }),
      ],
    })

    const view = new EditorView({
      state,
      parent: editorRef.current,
    })

    viewRef.current = view

    return () => {
      view.destroy()
      viewRef.current = null
    }
  }, []) // Only mount once

  // Sync file changes to editor
  useEffect(() => {
    const view = viewRef.current
    if (!view) return

    const currentDoc = view.state.doc.toString()
    const targetCode = code[currentFile]

    if (currentDoc !== targetCode) {
      view.dispatch({
        changes: {
          from: 0,
          to: currentDoc.length,
          insert: targetCode,
        },
      })
    }
  }, [currentFile, code])

  return (
    <div className="flex flex-col h-full">
      {/* File name bar */}
      <div className="h-8 bg-gray-800 text-gray-300 flex items-center px-3 text-xs border-b border-gray-700">
        <span className="text-indigo-400 mr-2">📝</span>
        {currentFile === 'index'
          ? 'index.html'
          : currentFile === 'page1'
          ? 'page1.html'
          : 'page2.html'}
        <span className="ml-auto flex items-center gap-2">
          {isAiEnabled && isLoading && (
            <span className="flex items-center gap-1 text-yellow-400">
              <Loader2 size={12} className="animate-spin" />
              AI分析中...
            </span>
          )}
          <span className="text-gray-500">HTML</span>
        </span>
      </div>

      {/* CodeMirror container */}
      <div className="flex-1 relative overflow-hidden">
        <div ref={editorRef} className="h-full" />
        <AIPrompt viewRef={viewRef} />
      </div>
    </div>
  )
}
