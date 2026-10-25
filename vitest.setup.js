import { afterEach, beforeEach } from 'vitest'
let originalEnv
beforeEach(() => { originalEnv = process.env.NODE_ENV })
afterEach(() => {
  if (originalEnv === undefined) delete process.env.NODE_ENV
  else process.env.NODE_ENV = originalEnv
})
