/**
 * Build the complete HTML document for iframe preview
 * Supports navigation between pages via link clicks
 */
export function buildPreviewHTML(
  currentFile: string,
  allCode: Record<string, string>
): string {
  const code = allCode[currentFile] || ''
  return code
}

/**
 * Sanitize HTML for safe sandbox preview
 * Removes potentially dangerous constructs while preserving learning content
 */
export function sanitizeHTML(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '<!-- script removed for safety -->')
    .replace(/\bon\w+\s*=\s*"[^"]*"/gi, '')
    .replace(/\bon\w+\s*=\s*'[^']*'/gi, '')
}
