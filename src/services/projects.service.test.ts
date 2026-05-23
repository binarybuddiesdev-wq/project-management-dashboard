import { describe, it, expect, beforeEach } from 'vitest'
import { http, HttpResponse } from 'msw'
import { getProjects, getProject, createProject, updateProject, deleteProject } from './projects.service'
import type { IProjectFormData } from '@/types'
import { server } from '@/test/setup'

describe('projects.service', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('token', 'mock-jwt-token-12345')
  })

  it('should fetch all projects successfully', async () => {
    const response = await getProjects()
    expect(response.data).toBeDefined()
    expect(Array.isArray(response.data)).toBe(true)
    expect(response.data!.length).toBeGreaterThan(0)
    expect(response.error).toBeUndefined()
  })

  it('should filter projects by status', async () => {
    const response = await getProjects({ status: 'completed' })
    expect(response.data).toBeDefined()
    expect(response.data!.every((p) => p.status === 'completed')).toBe(true)
  })

  it('should filter projects by priority', async () => {
    const response = await getProjects({ priority: 'urgent' })
    expect(response.data).toBeDefined()
    expect(response.data!.every((p) => p.priority === 'urgent')).toBe(true)
  })

  it('should search projects by name', async () => {
    const response = await getProjects({ search: 'Brand' })
    expect(response.data).toBeDefined()
    expect(response.data!.length).toBeGreaterThan(0)
    expect(response.data![0].name.toLowerCase()).toContain('brand')
  })

  it('should fetch a single project by id', async () => {
    const response = await getProject('p1')
    expect(response.data).toBeDefined()
    expect(response.data!.id).toBe('p1')
    expect(response.data!.name).toBe('Brand Redesign')
    expect(response.error).toBeUndefined()
  })

  it('should return error for non-existent project', async () => {
    const response = await getProject('non-existent')
    expect(response.data).toBeUndefined()
    expect(response.error).toBeDefined()
  })

  it('should create a new project', async () => {
    const newProject: IProjectFormData = {
      name: 'Test Project',
      description: 'A test project',
      status: 'active',
      priority: 'high',
      dueDate: '2026-12-31',
      assignees: ['John Doe'],
    }
    const response = await createProject(newProject)
    expect(response.data).toBeDefined()
    expect(response.data!.name).toBe('Test Project')
    expect(response.data!.id).toBeDefined()
    expect(response.error).toBeUndefined()
  })

  it('should update an existing project', async () => {
    const response = await updateProject('p1', { name: 'Updated Name' })
    expect(response.data).toBeDefined()
    expect(response.data!.name).toBe('Updated Name')
    expect(response.error).toBeUndefined()
  })

  it('should delete a project', async () => {
    const response = await deleteProject('p1')
    expect(response.data).toBeDefined()
    expect(response.error).toBeUndefined()

    const listResponse = await getProjects()
    expect(listResponse.data!.find((p) => p.id === 'p1')).toBeUndefined()
  })

  it('should return error when create fails', async () => {
    server.use(
      http.post('*/api/projects', () => {
        return HttpResponse.json({ error: 'Creation failed' }, { status: 400 })
      })
    )
    const response = await createProject({ name: 'Test', description: 'Desc', status: 'active', priority: 'low', dueDate: '2026-12-31', assignees: ['A'] })
    expect(response.data).toBeUndefined()
    expect(response.error).toBeDefined()
  })

  it('should return error when update fails', async () => {
    const response = await updateProject('non-existent', { name: 'Nope' })
    expect(response.data).toBeUndefined()
    expect(response.error).toBeDefined()
  })

  it('should return error when delete fails', async () => {
    const response = await deleteProject('non-existent')
    expect(response.data).toBeUndefined()
    expect(response.error).toBeDefined()
  })
})
