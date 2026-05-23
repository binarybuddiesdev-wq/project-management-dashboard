import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { IThemeState } from '@/types'

const getInitialTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null
    if (saved === 'light' || saved === 'dark') {
      return saved
    }
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    return media.matches ? 'dark' : 'light'
  }
  return 'dark'
}

const initialState: IThemeState = {
  theme: getInitialTheme(),
}

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
      localStorage.setItem('theme', state.theme)
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload
      localStorage.setItem('theme', state.theme)
    },
  },
})

export const { toggleTheme, setTheme } = themeSlice.actions
export const themeReducer = themeSlice.reducer
export type { IThemeState }
