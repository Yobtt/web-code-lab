const SYSTEM_PROMPT = `你是一个友好的编程助教，正在指导初一学生（12-13岁）学习HTML网页制作。学生是编程零基础。

## 你的角色
- 用通俗易懂、鼓励性的语言指导学生
- 像耐心的老师一样，温和地指出错误并解释原因
- 不要直接给完整代码，而是给出引导性提示和示例片段

## 输出格式（严格按JSON返回）
{
  "hints": [
    {
      "line": 行号,
      "message": "提示内容（简短，20字以内）",
      "type": "error|warning|info"
    }
  ],
  "panelMessage": "面板中的引导消息（50-100字）",
  "taskCompleted": false,
  "nextStep": "下一步建议（可选）"
}

## 检测规则
1. 检查HTML标签是否完整闭合
2. 检查常见属性拼写错误（如 scr -> src, herf -> href）
3. 如果代码为空或很少，给出当前任务的第一步引导
4. 如果检测到当前任务的关键标签都存在且正确，设置 taskCompleted: true
5. 只给1-2条最重要的提示，不要过多

## 当前任务
{currentTask}

## 学生代码
{code}

请分析代码并返回JSON。`

export interface AIResponse {
  hints: Array<{
    line: number
    message: string
    type: 'error' | 'warning' | 'info'
  }>
  panelMessage: string
  taskCompleted: boolean
  nextStep?: string
}

export async function callDeepSeek(
  code: string,
  currentTask: string
): Promise<AIResponse> {
  const prompt = SYSTEM_PROMPT.replace('{currentTask}', currentTask).replace(
    '{code}',
    code.length > 4000 ? code.slice(0, 4000) + '\n...(代码过长已截断)' : code
  )

  // 开发环境用 Vite 代理，生产环境直接调 DeepSeek API
  const isDev = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  const apiUrl = isDev
    ? '/api/deepseek/chat/completions'
    : 'https://api.deepseek.com/chat/completions'
  const apiKey = isDev ? '' : 'sk-e83db6ca030b47168639dc1cde218b07'
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (!isDev) {
    headers['Authorization'] = `Bearer ${apiKey}`
  }

  try {
    console.log('[DeepSeek] Sending request, code length:', code.length)

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: 'deepseek-v4-flash',
        messages: [
          { role: 'system', content: '你是一个JSON输出机器人，必须严格按照JSON格式输出，不要输出其他内容。' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 600,
        response_format: { type: 'json_object' },
      }),
      signal: AbortSignal.timeout(8000),
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error')
      console.error('[DeepSeek] API error:', response.status, errorText)
      throw new Error(`API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log('[DeepSeek] Raw response:', JSON.stringify(data).slice(0, 200))

    const content = data.choices?.[0]?.message?.content || '{}'
    console.log('[DeepSeek] Content:', content)
    const parsed = JSON.parse(content)
    return parsed as AIResponse
  } catch (error) {
    console.error('[DeepSeek] Call failed:', error)
    return {
      hints: [],
      panelMessage:
        '我正在努力思考中...别着急，你可以先继续写代码，我马上就来帮你！',
      taskCompleted: false,
    }
  }
}
