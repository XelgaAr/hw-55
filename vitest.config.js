import { defineConfig } from 'vitest/config'
export default defineConfig({
  test: {
    environment: 'node',
    pool: 'threads',
    setupFiles: ['./vitest.setup.js'],
    include: ['src/**/*.test.js'],
    restoreMocks: true,
    fakeTimers: { toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'setImmediate', 'clearImmediate', 'Date', 'nextTick'] }
  }
})
