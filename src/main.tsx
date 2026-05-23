import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App.tsx'

async function enableMocking(): Promise<unknown> {
  if (!import.meta.env.DEV) {
    return
  }
  const { worker } = await import('./services/mock/browser')
  if (worker) {
    return worker.start({
      onUnhandledRequest: 'bypass',
    })
  }
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
