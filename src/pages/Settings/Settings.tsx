import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useSelector } from 'react-redux'
import { Sun, Moon, Save, Lock, User, Mail, Camera } from 'lucide-react'
import { useTheme } from '@/hooks'
import { useSettings } from '@/hooks'
import type { RootState } from '@/store'
import type { IProfileFormData, IPasswordFormData } from '@/types'
import { useState } from 'react'

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  avatar: z.string().url('Must be a valid URL').or(z.literal('')),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const SettingsPage = () => {
  const user = useSelector((state: RootState) => state.auth.user)
  const { theme, toggleTheme } = useTheme()
  const { updateProfile, changePassword } = useSettings()

  const [profileSuccess, setProfileSuccess] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)

  const profileForm = useForm<IProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      avatar: user?.avatar || '',
    },
  })

  const passwordForm = useForm<IPasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const onProfileSubmit = async (data: IProfileFormData) => {
    try {
      setProfileSuccess(false)
      await updateProfile(data)
      setProfileSuccess(true)
      setTimeout(() => setProfileSuccess(false), 3000)
    } catch (err) {
      profileForm.setError('root', { message: err instanceof Error ? err.message : 'Failed to update profile' })
    }
  }

  const onPasswordSubmit = async (data: IPasswordFormData) => {
    try {
      setPasswordSuccess(false)
      await changePassword(data)
      setPasswordSuccess(true)
      passwordForm.reset()
      setTimeout(() => setPasswordSuccess(false), 3000)
    } catch (err) {
      passwordForm.setError('root', { message: err instanceof Error ? err.message : 'Failed to change password' })
    }
  }

  return (
    <div className="flex flex-col h-full gap-6 settings-scroll overflow-y-auto min-h-0">
      <div className="shrink-0">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your profile, password, and preferences.</p>
      </div>

      {/* Profile Section */}
      <section className="rounded-xl border border-border/50 bg-card p-6 space-y-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
            <User className="h-4 w-4" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">Profile</h2>
        </div>

        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                {user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'U'}
              </div>
              <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-background border border-border">
                <Camera className="h-3 w-3 text-muted-foreground" />
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="profile-name" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block select-none">Name</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                id="profile-name"
                type="text"
                {...profileForm.register('name')}
                className={`w-full pl-9 pr-3 py-2 rounded-lg border bg-background text-sm transition-all outline-none focus:ring-2 focus:ring-primary/20 ${profileForm.formState.errors.name ? 'border-destructive' : 'border-border focus:border-primary'}`}
              />
            </div>
            {profileForm.formState.errors.name && <p className="text-destructive text-xs mt-1">{profileForm.formState.errors.name.message}</p>}
          </div>

          <div className="space-y-1">
            <label htmlFor="profile-email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block select-none">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                id="profile-email"
                type="email"
                {...profileForm.register('email')}
                className={`w-full pl-9 pr-3 py-2 rounded-lg border bg-background text-sm transition-all outline-none focus:ring-2 focus:ring-primary/20 ${profileForm.formState.errors.email ? 'border-destructive' : 'border-border focus:border-primary'}`}
              />
            </div>
            {profileForm.formState.errors.email && <p className="text-destructive text-xs mt-1">{profileForm.formState.errors.email.message}</p>}
          </div>

          <div className="space-y-1">
            <label htmlFor="profile-avatar" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block select-none">Avatar URL</label>
            <div className="relative">
              <Camera className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                id="profile-avatar"
                type="url"
                placeholder="https://example.com/avatar.jpg"
                {...profileForm.register('avatar')}
                className={`w-full pl-9 pr-3 py-2 rounded-lg border bg-background text-sm transition-all outline-none focus:ring-2 focus:ring-primary/20 ${profileForm.formState.errors.avatar ? 'border-destructive' : 'border-border focus:border-primary'}`}
              />
            </div>
            {profileForm.formState.errors.avatar && <p className="text-destructive text-xs mt-1">{profileForm.formState.errors.avatar.message}</p>}
          </div>

          {profileForm.formState.errors.root && (
            <p className="text-destructive text-xs">{profileForm.formState.errors.root.message}</p>
          )}
          {profileSuccess && (
            <p className="text-emerald-500 text-xs font-medium">Profile updated successfully.</p>
          )}

          <button
            type="submit"
            disabled={profileForm.formState.isSubmitting}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:opacity-90 shadow-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border-0"
          >
            <Save className="h-4 w-4" />
            {profileForm.formState.isSubmitting ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </section>

      {/* Password Section */}
      <section className="rounded-xl border border-border/50 bg-card p-6 space-y-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
            <Lock className="h-4 w-4" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">Password</h2>
        </div>

        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="current-password" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block select-none">Current Password</label>
            <input
              id="current-password"
              type="password"
              {...passwordForm.register('currentPassword')}
              className={`w-full px-3 py-2 rounded-lg border bg-background text-sm transition-all outline-none focus:ring-2 focus:ring-primary/20 ${passwordForm.formState.errors.currentPassword ? 'border-destructive' : 'border-border focus:border-primary'}`}
            />
            {passwordForm.formState.errors.currentPassword && <p className="text-destructive text-xs mt-1">{passwordForm.formState.errors.currentPassword.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="new-password" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block select-none">New Password</label>
              <input
                id="new-password"
                type="password"
                {...passwordForm.register('newPassword')}
                className={`w-full px-3 py-2 rounded-lg border bg-background text-sm transition-all outline-none focus:ring-2 focus:ring-primary/20 ${passwordForm.formState.errors.newPassword ? 'border-destructive' : 'border-border focus:border-primary'}`}
              />
              {passwordForm.formState.errors.newPassword && <p className="text-destructive text-xs mt-1">{passwordForm.formState.errors.newPassword.message}</p>}
            </div>

            <div className="space-y-1">
              <label htmlFor="confirm-password" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block select-none">Confirm Password</label>
              <input
                id="confirm-password"
                type="password"
                {...passwordForm.register('confirmPassword')}
                className={`w-full px-3 py-2 rounded-lg border bg-background text-sm transition-all outline-none focus:ring-2 focus:ring-primary/20 ${passwordForm.formState.errors.confirmPassword ? 'border-destructive' : 'border-border focus:border-primary'}`}
              />
              {passwordForm.formState.errors.confirmPassword && <p className="text-destructive text-xs mt-1">{passwordForm.formState.errors.confirmPassword.message}</p>}
            </div>
          </div>

          {passwordForm.formState.errors.root && (
            <p className="text-destructive text-xs">{passwordForm.formState.errors.root.message}</p>
          )}
          {passwordSuccess && (
            <p className="text-emerald-500 text-xs font-medium">Password changed successfully.</p>
          )}

          <button
            type="submit"
            disabled={passwordForm.formState.isSubmitting}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90 shadow-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border-0"
          >
            <Lock className="h-4 w-4" />
            {passwordForm.formState.isSubmitting ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </section>

      {/* Theme Section */}
      <section className="rounded-xl border border-border/50 bg-card p-6 space-y-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
            {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </div>
          <h2 className="text-lg font-semibold text-foreground">Theme</h2>
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg bg-accent/20 border border-border/50">
          <div>
            <p className="text-sm font-medium text-foreground">Appearance</p>
            <p className="text-xs text-muted-foreground mt-0.5">Switch between dark and light mode.</p>
          </div>
          <button
            onClick={toggleTheme}
            type="button"
            className="p-2 rounded-lg bg-background border border-border hover:bg-accent transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 text-amber-400" />
            ) : (
              <Moon className="h-5 w-5 text-slate-700" />
            )}
          </button>
        </div>
      </section>
    </div>
  )
}
