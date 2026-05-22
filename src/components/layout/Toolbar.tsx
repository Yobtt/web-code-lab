import {
  Heading1,
  Pilcrow,
  Image,
  Link,
  WrapText,
  Palette,
  Type,
} from 'lucide-react'
import { useEditorStore } from '../../stores/editorStore'

interface Tool {
  icon: React.ReactNode
  label: string
  insert: string
}

const tools: Tool[] = [
  {
    icon: <Heading1 size={14} />,
    label: '标题',
    insert: '<h2>新标题</h2>',
  },
  {
    icon: <Pilcrow size={14} />,
    label: '段落',
    insert: '<p>在这里写内容</p>',
  },
  {
    icon: <Image size={14} />,
    label: '图片',
    insert: '<img src="https://placehold.co/400x200" alt="描述">',
  },
  {
    icon: <Link size={14} />,
    label: '链接',
    insert: '<a href="https://">链接文字</a>',
  },
  {
    icon: <WrapText size={14} />,
    label: '换行',
    insert: '<br>',
  },
  {
    icon: <Palette size={14} />,
    label: '颜色',
    insert: ' style="color: #333; background-color: #f0f0f0"',
  },
  {
    icon: <Type size={14} />,
    label: '样式',
    insert: ' style="font-size: 16px; font-family: 微软雅黑"',
  },
]

export default function Toolbar() {
  const { code, currentFile, setCode } = useEditorStore()

  const insertSnippet = (snippet: string) => {
    const currentCode = code[currentFile]
    setCode(currentCode + '\n' + snippet)
  }

  return (
    <div className="h-10 bg-white border-t border-gray-200 flex items-center px-3 gap-1 overflow-x-auto">
      <span className="text-xs text-gray-400 mr-1 flex-shrink-0">快捷插入:</span>
      {tools.map((tool) => (
        <button
          key={tool.label}
          onClick={() => insertSnippet(tool.insert)}
          className="flex items-center gap-1 px-2 py-1 rounded text-xs text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex-shrink-0"
          title={`插入 ${tool.label}`}
        >
          {tool.icon}
          <span>{tool.label}</span>
        </button>
      ))}
    </div>
  )
}
