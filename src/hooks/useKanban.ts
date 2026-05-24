import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getTasks, createTask, updateTask, deleteTask } from '@/services'
import type { ITask, ITaskFormData } from '@/types'

const TASKS_QUERY_KEY = ['tasks'] as const

export const useTasks = () => {
  return useQuery({
    queryKey: TASKS_QUERY_KEY,
    queryFn: async () => {
      const response = await getTasks()
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data as ITask[]
    },
    retry: false,
  })
}

export const useCreateTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: ITaskFormData) => {
      const response = await createTask(data)
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data as ITask
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY })
    },
  })
}

export const useUpdateTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ITaskFormData> }) => {
      const response = await updateTask(id, data)
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data as ITask
    },
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: TASKS_QUERY_KEY })
      const previous = queryClient.getQueryData<ITask[]>(TASKS_QUERY_KEY)

      queryClient.setQueryData<ITask[]>(TASKS_QUERY_KEY, (old) => {
        if (!old) return old
        return old.map((t) => (t.id === id ? { ...t, ...data } : t))
      })

      return { previous }
    },
    onError: (_err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(TASKS_QUERY_KEY, context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY })
    },
  })
}

export const useDeleteTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteTask(id)
      if (response.error) {
        throw new Error(response.error)
      }
      return id
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: TASKS_QUERY_KEY })
      const previous = queryClient.getQueryData<ITask[]>(TASKS_QUERY_KEY)

      queryClient.setQueryData<ITask[]>(TASKS_QUERY_KEY, (old) => {
        if (!old) return old
        return old.filter((t) => t.id !== id)
      })

      return { previous }
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(TASKS_QUERY_KEY, context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY })
    },
  })
}
