import { render } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { AppLayout } from './AppLayout'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { themeReducer } from '@/store/themeSlice'
import { authReducer } from '@/store/authSlice'
import { uiReducer } from '@/store/uiSlice'
import { MemoryRouter } from 'react-router-dom'

describe('AppLayout', () => {
  let store: ReturnType<typeof configureStore>

  beforeEach(() => {
    store = configureStore({
      reducer: {
        theme: themeReducer,
        auth: authReducer,
        ui: uiReducer,
      },
    })
  })

  it('renders children correctly', () => {
    const { getByText, getAllByText } = render(
      <Provider store={store}>
        <MemoryRouter>
          <AppLayout>
            <div>Test Child Content</div>
          </AppLayout>
        </MemoryRouter>
      </Provider>
    )

    expect(getByText('Test Child Content')).toBeInTheDocument()
    expect(getByText('Workspace')).toBeInTheDocument()
    expect(getAllByText('Dashboard')[0]).toBeInTheDocument()
  })
})
