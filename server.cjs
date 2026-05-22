const http = require('http')
const https = require('https')
const fs = require('fs')
const path = require('path')

const PORT = process.env.PORT || 8080
const API_KEY = process.env.DEEPSEEK_API_KEY || 'sk-e83db6ca030b47168639dc1cde218b07'
const DIST_DIR = path.join(__dirname, 'dist')

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
}

const server = http.createServer((req, res) => {
  // Proxy DeepSeek API requests
  if (req.url.startsWith('/api/deepseek/')) {
    const apiPath = req.url.replace('/api/deepseek', '')
    
    let body = ''
    req.on('data', chunk => { body += chunk })
    req.on('end', () => {
      const options = {
        hostname: 'api.deepseek.com',
        port: 443,
        path: apiPath,
        method: req.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Length': Buffer.byteLength(body),
        },
        timeout: 15000,
      }

      const proxyReq = https.request(options, (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers)
        proxyRes.pipe(res)
      })

      proxyReq.on('error', (err) => {
        console.error('[Proxy Error]', err.message)
        res.writeHead(502)
        res.end(JSON.stringify({ error: 'Proxy error' }))
      })

      proxyReq.on('timeout', () => {
        proxyReq.destroy()
        res.writeHead(504)
        res.end(JSON.stringify({ error: 'Timeout' }))
      })

      proxyReq.write(body)
      proxyReq.end()
    })
    return
  }

  // Serve static files from dist/
  let filePath = path.join(DIST_DIR, req.url === '/' ? 'index.html' : req.url)
  const ext = path.extname(filePath)
  
  fs.readFile(filePath, (err, data) => {
    if (err) {
      // SPA fallback: serve index.html for all non-file routes
      fs.readFile(path.join(DIST_DIR, 'index.html'), (err2, data2) => {
        if (err2) {
          res.writeHead(500)
          res.end('Server error')
          return
        }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
        res.end(data2)
      })
      return
    }
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' })
    res.end(data)
  })
})

server.listen(PORT, () => {
  console.log(`🚀 网页代码实验室已启动: http://localhost:${PORT}`)
  console.log(`📡 DeepSeek API 代理已就绪`)
  console.log(`⏹  按 Ctrl+C 停止服务`)
})
