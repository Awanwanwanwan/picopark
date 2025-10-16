const http = require('http')
const fs = require('fs')
const path = require('path')

const root = __dirname
const port = process.env.PORT || 8080

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0]
  let filePath = path.join(root, urlPath)
  if (urlPath === '/' || urlPath === '') filePath = path.join(root, 'index.html')
  fs.stat(filePath, (err, stat) => {
    if (err) {
      res.writeHead(404)
      return res.end('Not Found')
    }
    if (stat.isDirectory()) {
      filePath = path.join(filePath, 'index.html')
    }
    fs.readFile(filePath, (err2, data) => {
      if (err2) { res.writeHead(500); return res.end('Server Error') }
      const ext = path.extname(filePath)
      res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' })
      res.end(data)
    })
  })
})

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})



