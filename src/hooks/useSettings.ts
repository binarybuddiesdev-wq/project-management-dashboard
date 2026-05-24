import { useDispatch } from 'react-redux'
import { authSuccess } from '@/store'
import type { IProfileFormData, IPasswordFormData } from '@/types'

export const useSettings = () => {
  const dispatch = useDispatch()

  const updateProfile = async (data: IProfileFormData): Promise<void> => {
    const userStr = localStorage.getItem('user')
    if (!userStr) {
      throw new Error('No user found')
    }
    const user = JSON.parse(userStr) as { id: string; name: string; email: string; avatar?: string }
    const updatedUser = {
      ...user,
      name: data.name,
      email: data.email,
      avatar: data.avatar || user.avatar,
    }
    localStorage.setItem('user', JSON.stringify(updatedUser))
    localStorage.setItem('token', localStorage.getItem('token') || '')

    const registeredUsersStr = localStorage.getItem('registered_users')
    if (registeredUsersStr) {
      const users = JSON.parse(registeredUsersStr) as Record<string, string>[]
      const userIndex = users.findIndex((u) => u.email === user.email)
      if (userIndex !== -1) {
        users[userIndex].name = data.name
        users[userIndex].email = data.email
        localStorage.setItem('registered_users', JSON.stringify(users))
      }
    }

    dispatch(authSuccess({ user: updatedUser, token: localStorage.getItem('token') || '' }))
  }

  const changePassword = async (data: IPasswordFormData): Promise<void> => {
    const registeredUsersStr = localStorage.getItem('registered_users')
    if (!registeredUsersStr) {
      throw new Error('No users found')
    }
    const users = JSON.parse(registeredUsersStr) as Record<string, string>[]
    const userStr = localStorage.getItem('user')
    if (!userStr) {
      throw new Error('No user logged in')
    }
    const currentUser = JSON.parse(userStr) as { email: string }
    const userIndex = users.findIndex((u) => u.email === currentUser.email)
    if (userIndex === -1) {
      throw new Error('User not found')
    }
    if (users[userIndex].password !== data.currentPassword) {
      throw new Error('Current password is incorrect')
    }
    users[userIndex].password = data.newPassword
    localStorage.setItem('registered_users', JSON.stringify(users))
  }

  return { updateProfile, changePassword }
}
