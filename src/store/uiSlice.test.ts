import { describe, it, expect, beforeEach } from 'vitest'
import { uiReducer, toggleSidebar, setSidebarCollapsed } from './uiSlice'
import type { IUiState } from '@/types'

describe('uiSlice', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should return initial state', () => {
    const state = uiReducer(undefined, { type: 'unknown' })
    expect(state.sidebarCollapsed).toBe(false)
  })

  it('should toggle sidebarCollapsed status', () => {
    const initialState: IUiState = { sidebarCollapsed: false }
    
    // Toggle to true
    let state = uiReducer(initialState, toggleSidebar())
    expect(state.sidebarCollapsed).toBe(true)
    expect(localStorage.getItem('sidebarCollapsed')).toBe('true')

    // Toggle back to false
    state = uiReducer(state, toggleSidebar())
    expect(state.sidebarCollapsed).toBe(false)
    expect(localStorage.getItem('sidebarCollapsed')).toBe('false')
  })

  it('should set sidebarCollapsed status explicitly', () => {
    const initialState: IUiState = { sidebarCollapsed: false }

    const state = uiReducer(initialState, setSidebarCollapsed(true))
    expect(state.sidebarCollapsed).toBe(true)
    expect(localStorage.getItem('sidebarCollapsed')).toBe('true')
  })
})
