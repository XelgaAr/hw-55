import { inspect } from 'node:util'
export const capture = async run => {
  const logs = []
  const original = { log: console.log, error: console.error }
  for (const level of ['log', 'error']) console[level] = (...values) => logs.push({ level, text: values.map(value => typeof value === 'string' ? value : inspect(value, { depth: 2, colors: false })).join(' ') })
  try { return { generatedAt: new Date().toISOString(), node: process.version, result: await run(), logs } }
  finally { Object.assign(console, original) }
}
