import { mkdtemp, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { writeFileAsync, readFileAsync, deleteFileAsync } from '../src/main.js'
export const runDemo = async () => {
  const directory = await mkdtemp(join(tmpdir(), 'hw55-build-'))
  const file = join(directory, 'example.txt')
  try {
    const error = await writeFileAsync(file, 'Привіт, це тестовий файл! ✓')
    if (error) throw error
    const content = await readFileAsync(file)
    if (content === null) throw new Error('Read failed.')
    const deleted = await deleteFileAsync(file)
    if (deleted) throw deleted
    const missing = await readFileAsync(file)
    if (missing !== null) throw new Error('Deletion verification failed.')
    return { file: 'example.txt', content, deleted: true, missing }
  } finally { await rm(directory, { recursive: true, force: true }) }
}
