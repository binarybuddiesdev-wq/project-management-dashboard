import type { IUser } from './auth.types'

export interface ISidebarProps {
  isCollapsed: boolean
  onToggle: () => void
  user: IUser | null
}

export interface ITopbarProps {
  title: string
  isCollapsed: boolean
  onToggle: () => void
  user: IUser | null
  onLogout: () => void
}
