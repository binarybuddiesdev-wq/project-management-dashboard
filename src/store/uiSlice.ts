import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { IUiState } from '@/types'

const getInitialSidebarCollapsed = (): boolean => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('sidebarCollapsed') === 'true'
  }
  return false
}

const initialState: IUiState = {
  sidebarCollapsed: getInitialSidebarCollapsed(),
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed
      localStorage.setItem('sidebarCollapsed', String(state.sidebarCollapsed))
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload
      localStorage.setItem('sidebarCollapsed', String(state.sidebarCollapsed))
    },
  },
})

export const { toggleSidebar, setSidebarCollapsed } = uiSlice.actions
export const uiReducer = uiSlice.reducer
