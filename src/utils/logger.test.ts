import { describe, it, expect } from 'vitest'
import { logger } from './logger'

describe('logger', () => {
  it('should be defined and export standard logging methods', () => {
    expect(logger).toBeDefined()
    expect(typeof logger.info).toBe('function')
    expect(typeof logger.error).toBe('function')
  })
})
