import { describe, it, expect, beforeEach } from 'vitest'
import { http, HttpResponse } from 'msw'
import { getMembers, inviteMember, updateMember, removeMember } from './team.service'
import type { IMemberFormData } from '@/types'
import { server } from '@/test/setup'

describe('team.service', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('token', 'mock-jwt-token-12345')
  })

  it('should fetch all members successfully', async () => {
    const response = await getMembers()
    expect(response.data).toBeDefined()
    expect(Array.isArray(response.data)).toBe(true)
    expect(response.data!.length).toBeGreaterThan(0)
    expect(response.error).toBeUndefined()
  })

  it('should invite a new member', async () => {
    const newMember: IMemberFormData = {
      name: 'Test User',
      email: 'test@example.com',
      role: 'Developer',
      department: 'Engineering',
    }
    const response = await inviteMember(newMember)
    expect(response.data).toBeDefined()
    expect(response.data!.name).toBe('Test User')
    expect(response.data!.id).toBeDefined()
    expect(response.error).toBeUndefined()
  })

  it('should update an existing member', async () => {
    const response = await updateMember('m1', { name: 'Updated Name' })
    expect(response.data).toBeDefined()
    expect(response.data!.name).toBe('Updated Name')
    expect(response.error).toBeUndefined()
  })

  it('should remove a member', async () => {
    const response = await removeMember('m1')
    expect(response.data).toBeDefined()
    expect(response.error).toBeUndefined()

    const listResponse = await getMembers()
    expect(listResponse.data!.find((m) => m.id === 'm1')).toBeUndefined()
  })

  it('should return error when invite fails', async () => {
    server.use(
      http.post('*/api/team', () => {
        return HttpResponse.json({ error: 'Invitation failed' }, { status: 400 })
      })
    )
    const response = await inviteMember({
      name: 'Fail',
      email: 'fail@example.com',
      role: 'Dev',
      department: 'Eng',
    })
    expect(response.data).toBeUndefined()
    expect(response.error).toBeDefined()
  })

  it('should return error when update fails for non-existent member', async () => {
    const response = await updateMember('non-existent', { name: 'Nope' })
    expect(response.data).toBeUndefined()
    expect(response.error).toBeDefined()
  })

  it('should return error when remove fails for non-existent member', async () => {
    const response = await removeMember('non-existent')
    expect(response.data).toBeUndefined()
    expect(response.error).toBeDefined()
  })
})
