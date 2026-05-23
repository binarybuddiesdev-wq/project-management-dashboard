import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = typeof window !== 'undefined' && typeof window.navigator !== 'undefined' && 'serviceWorker' in window.navigator
  ? setupWorker(...handlers)
  : null
