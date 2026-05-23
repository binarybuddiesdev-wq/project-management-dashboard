import { useDispatch, useSelector } from 'react-redux'
import { type RootState, toggleTheme, setTheme } from '@/store'
import { useEffect } from 'react'

export const useTheme = () => {
  const dispatch = useDispatch()
  const theme = useSelector((state: RootState) => state.theme.theme)

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  }, [theme])

  const toggle = () => {
    dispatch(toggleTheme())
  }

  const set = (newTheme: 'light' | 'dark') => {
    dispatch(setTheme(newTheme))
  }

  return { theme, toggleTheme: toggle, setTheme: set }
}
