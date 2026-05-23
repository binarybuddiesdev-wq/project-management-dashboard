import type { IThemeState } from './theme.types'
import type { IAuthState } from './auth.types'
import type { IUiState } from './ui.types'

export interface IRootState {
  theme: IThemeState
  auth: IAuthState
  ui: IUiState
}
