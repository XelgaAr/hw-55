import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { writeFileAsync, readFileAsync, deleteFileAsync } from '../src/main.js'
const directory = await mkdtemp(join(tmpdir(), 'hw55-'))
const file = join(directory, 'example.txt')
try {
  const error = await writeFileAsync(file, 'Привіт, це тестовий файл! ✓')
  if (error) throw error
  if (await readFileAsync(file) === null) throw new Error('Не удалось прочитать созданный файл.')
  const deletion = await deleteFileAsync(file)
  if (deletion) throw deletion
  console.log('Проверка обработки отсутствующего файла:')
  await readFileAsync(file)
} finally { await rm(directory, { recursive: true, force: true }) }
