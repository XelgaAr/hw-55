const status = (message, error = false) => {
  const output = document.getElementById('message')
  output.textContent = message
  output.dataset.error = String(error)
}
const loadDemo = async () => {
  const response = await fetch('./demo.json')
  if (!response.ok) throw new Error(`Не удалось загрузить запись: HTTP ${response.status}`)
  const data = await response.json()
  document.getElementById('runtime').textContent = `Node.js ${data.node}`
  document.getElementById('stamp').textContent = `Сборка: ${data.generatedAt} · Среда: ${data.node}`
  document.getElementById('trace').textContent = data.logs.map(entry => `${entry.level === 'error' ? '[error] ' : ''}${entry.text}`).join('\n')
  return data
}
const showLoadError = error => {
  const output = document.getElementById('trace-error')
  output.hidden = false; output.textContent = error.message
  document.getElementById('trace').textContent = 'Запись недоступна. Пересоберите проект и обновите страницу.'
  document.getElementById('stamp').textContent = 'Нет данных о сборке'
}
const files = new Map()
const filename = document.getElementById('filename')
const content = document.getElementById('content')
const output = document.getElementById('file-output')
let read = null
for (const operation of ['write', 'read', 'remove']) document.getElementById(operation).addEventListener('click', () => {
  const name = filename.value.trim()
  if (!name || /[\\/\0]/.test(name)) { status('Укажите имя без пути и разделителей.', true); return }
  if (operation === 'write') { files.set(name, content.value); status(`В памяти сохранён ${name}. Файлов: ${files.size}.`); return }
  if (!files.has(name)) { status(`Файл ${name} отсутствует в памяти.`, true); read = null; output.textContent = '—'; return }
  if (operation === 'read') { read = { name, content: files.get(name) }; output.textContent = read.content; status(`Прочитан ${name}: ${read.content.length} символов.`); return }
  files.delete(name); read = null; output.textContent = '—'; status(`Из памяти удалён ${name}. Файлов: ${files.size}.`)
})
document.getElementById('download').addEventListener('click', () => {
  if (!read) { status('Сначала прочитайте файл из памяти.', true); return }
  const url = URL.createObjectURL(new Blob([read.content], { type: 'text/plain;charset=utf-8' }))
  const link = document.createElement('a'); link.href = url; link.download = read.name; link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
  status('Файл передан стандартному механизму загрузки браузера.')
})
loadDemo().catch(showLoadError)
