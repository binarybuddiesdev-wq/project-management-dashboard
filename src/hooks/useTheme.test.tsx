import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { useTheme } from './useTheme'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { themeReducer } from '@/store/themeSlice'
import React from 'react'

describe('useTheme hook', () => {
  let store: ReturnType<typeof configureStore>

  beforeEach(() => {
    store = configureStore({
      reducer: {
        theme: themeReducer,
      },
    })
  })

  it('should initialize with initial theme', () => {
    const wrapper = (props: { children: React.ReactNode }) => {
      const { children } = props
      return <Provider store={store}>{children}</Provider>
    }

    const { result } = renderHook(() => useTheme(), { wrapper })
    expect(result.current.theme).toBe('dark')
  })

  it('should toggle theme state and update DOM classList', () => {
    const wrapper = (props: { children: React.ReactNode }) => {
      const { children } = props
      return <Provider store={store}>{children}</Provider>
    }

    const { result } = renderHook(() => useTheme(), { wrapper })
    
    act(() => {
      result.current.toggleTheme()
    })

    expect(result.current.theme).toBe('light')
    expect(window.document.documentElement.classList.contains('light')).toBe(true)
  })

  it('should set theme state and update DOM classList', () => {
    const wrapper = (props: { children: React.ReactNode }) => {
      const { children } = props
      return <Provider store={store}>{children}</Provider>
    }

    const { result } = renderHook(() => useTheme(), { wrapper })
    
    act(() => {
      result.current.setTheme('dark')
    })

    expect(result.current.theme).toBe('dark')
    expect(window.document.documentElement.classList.contains('dark')).toBe(true)
  })
})
