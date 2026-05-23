import { describe, it, expect, beforeEach } from 'vitest'
import { loginUser, signupUser, forgotPassword, getCurrentUser } from './auth.service'

describe('auth.service', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should call loginUser successfully', async () => {
    const response = await loginUser({
      email: 'john@example.com',
      password: 'password123',
    })
    console.log('DEBUG_RESPONSE:', response)

    expect(response.data).toBeDefined()
    expect(response.data?.user.email).toBe('john@example.com')
    expect(response.data?.token).toBe('mock-jwt-token-12345')
    expect(response.error).toBeUndefined()
  })

  it('should return error for loginUser on failure', async () => {
    const response = await loginUser({
      email: 'fail@example.com',
      password: 'password123',
    })

    expect(response.data).toBeUndefined()
    expect(response.error).toBe('Invalid email or password')
  })

  it('should call signupUser successfully', async () => {
    const response = await signupUser({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'password123',
    })

    expect(response.data).toBeDefined()
    expect(response.data?.user.name).toBe('Jane Doe')
    expect(response.error).toBeUndefined()
  })

  it('should call forgotPassword successfully', async () => {
    const response = await forgotPassword({
      email: 'john@example.com',
    })

    expect(response.data).toBeDefined()
    expect(response.data?.message).toBe('Password reset link sent to your email')
    expect(response.error).toBeUndefined()
  })

  it('should return error for forgotPassword on failure', async () => {
    const response = await forgotPassword({
      email: 'fail@example.com',
    })

    expect(response.data).toBeUndefined()
    expect(response.error).toBe('Email not found')
  })

  it('should call getCurrentUser successfully when token is set', async () => {
    localStorage.setItem('token', 'mock-jwt-token-12345')
    const response = await getCurrentUser()

    expect(response.data).toBeDefined()
    expect(response.data?.user.email).toBe('john@example.com')
    expect(response.error).toBeUndefined()
  })

  it('should return error for getCurrentUser when token is invalid', async () => {
    localStorage.setItem('token', 'invalid-token')
    const response = await getCurrentUser()

    expect(response.data).toBeUndefined()
    expect(response.error).toBe('Invalid token')
  })
})
