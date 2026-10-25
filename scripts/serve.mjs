import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { resolve, extname, sep } from 'node:path'
const args = process.argv.slice(2)
const portIndex = args.indexOf('--port')
const port = Number(portIndex < 0 ? 4173 : args[portIndex + 1])
const baseIndex = args.indexOf('--base')
const base = (baseIndex < 0 ? '' : args[baseIndex + 1])?.replace(/^\/+|\/+$/g, '')
if (base == null) throw new Error('Missing --base value.')
const prefix = base ? `/${base}/` : '/'
const root = resolve('dist')
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.txt': 'text/plain; charset=utf-8' }
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid --port value.')
try { await stat(resolve(root, 'index.html')) } catch { throw new Error('Run npm run build before starting the preview server.') }
const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname)
    if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405); response.end('Method not allowed'); return }
    if (prefix !== '/' && pathname === prefix.slice(0, -1)) { response.writeHead(308, { Location: prefix }); response.end(); return }
    if (!pathname.startsWith(prefix)) { response.writeHead(404); response.end('Not found'); return }
    const file = resolve(root, pathname.slice(prefix.length) || 'index.html')
    if (!file.startsWith(root + sep)) { response.writeHead(403); response.end('Forbidden'); return }
    const data = await readFile(file)
    response.writeHead(200, { 'Content-Type': types[extname(file)] ?? 'application/octet-stream', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' })
    response.end(request.method === 'HEAD' ? undefined : data)
  } catch (error) { response.writeHead(error.code === 'ENOENT' || error.code === 'EISDIR' ? 404 : 400); response.end('Resource unavailable') }
})
server.on('error', error => { console.error(error.message); process.exitCode = 1 })
server.listen(port, '127.0.0.1', () => console.log(`Preview: http://127.0.0.1:${port}${prefix}`))
