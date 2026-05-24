import type { IThemeState } from './theme.types'
import type { IAuthState } from './auth.types'
import type { IUiState } from './ui.types'
import type { INotificationState } from './notifications.types'

export interface IRootState {
  theme: IThemeState
  auth: IAuthState
  ui: IUiState
  notifications: INotificationState
}
