import { cp, mkdir, rm, writeFile } from 'node:fs/promises'
import { capture } from './capture.mjs'
import { runDemo } from './demo-data.mjs'
const data = await capture(runDemo)
await rm('dist', { recursive: true, force: true })
await mkdir('dist', { recursive: true })
await cp('web', 'dist', { recursive: true })
await writeFile('dist/demo.json', JSON.stringify(data, null, 2))
await writeFile('dist/.nojekyll', '')
console.log(`Built dist/ using ${data.node}. Captured ${data.logs.length} real console entries.`)
