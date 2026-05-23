import { describe, it, expect, beforeEach } from 'vitest'
import { themeReducer, toggleTheme, setTheme, type IThemeState } from './themeSlice'

describe('themeSlice', () => {
  let initialState: IThemeState

  beforeEach(() => {
    initialState = { theme: 'dark' }
  })

  it('should handle toggleTheme from dark to light', () => {
    const nextState = themeReducer(initialState, toggleTheme())
    expect(nextState.theme).toBe('light')
  })

  it('should handle toggleTheme from light to dark', () => {
    const state: IThemeState = { theme: 'light' }
    const nextState = themeReducer(state, toggleTheme())
    expect(nextState.theme).toBe('dark')
  })

  it('should handle setTheme', () => {
    const nextState = themeReducer(initialState, setTheme('light'))
    expect(nextState.theme).toBe('light')
  })
})
