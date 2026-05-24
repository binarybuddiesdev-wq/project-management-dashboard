import { describe, it, expect, beforeEach } from 'vitest'
import { http, HttpResponse } from 'msw'
import { getTasks, createTask, updateTask, deleteTask } from './tasks.service'
import type { ITaskFormData } from '@/types'
import { server } from '@/test/setup'

describe('tasks.service', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('token', 'mock-jwt-token-12345')
  })

  it('should fetch all tasks successfully', async () => {
    const response = await getTasks()
    expect(response.data).toBeDefined()
    expect(Array.isArray(response.data)).toBe(true)
    expect(response.data!.length).toBeGreaterThan(0)
    expect(response.error).toBeUndefined()
  })

  it('should create a new task', async () => {
    const newTask: ITaskFormData = {
      title: 'Test Task',
      description: 'A test task description',
      status: 'backlog',
      priority: 'high',
      dueDate: '2026-12-31',
      assignee: 'John Doe',
      labels: ['Test'],
    }
    const response = await createTask(newTask)
    expect(response.data).toBeDefined()
    expect(response.data!.title).toBe('Test Task')
    expect(response.data!.id).toBeDefined()
    expect(response.error).toBeUndefined()
  })

  it('should update an existing task', async () => {
    const response = await updateTask('t1', { title: 'Updated Title' })
    expect(response.data).toBeDefined()
    expect(response.data!.title).toBe('Updated Title')
    expect(response.error).toBeUndefined()
  })

  it('should delete a task', async () => {
    const response = await deleteTask('t1')
    expect(response.data).toBeDefined()
    expect(response.error).toBeUndefined()

    const listResponse = await getTasks()
    expect(listResponse.data!.find((t) => t.id === 't1')).toBeUndefined()
  })

  it('should return error when create fails', async () => {
    server.use(
      http.post('*/api/tasks', () => {
        return HttpResponse.json({ error: 'Creation failed' }, { status: 400 })
      })
    )
    const response = await createTask({
      title: 'Test',
      description: 'Desc',
      status: 'backlog',
      priority: 'low',
      dueDate: '2026-12-31',
      assignee: 'John Doe',
      labels: [],
    })
    expect(response.data).toBeUndefined()
    expect(response.error).toBeDefined()
  })

  it('should return error when update fails', async () => {
    const response = await updateTask('non-existent', { title: 'Nope' })
    expect(response.data).toBeUndefined()
    expect(response.error).toBeDefined()
  })

  it('should return error when delete fails', async () => {
    const response = await deleteTask('non-existent')
    expect(response.data).toBeUndefined()
    expect(response.error).toBeDefined()
  })
})
