import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getProjects, getProject, createProject, updateProject, deleteProject } from '@/services'
import type { IProject, IProjectFormData } from '@/types'

const PROJECTS_QUERY_KEY = ['projects'] as const

export const useProjects = (params?: { status?: string; priority?: string; search?: string }) => {
  return useQuery({
    queryKey: [...PROJECTS_QUERY_KEY, params],
    queryFn: async () => {
      const response = await getProjects(params)
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data as IProject[]
    },
    retry: false,
  })
}

export const useProject = (id: string) => {
  return useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      const response = await getProject(id)
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data as IProject
    },
    enabled: !!id,
    retry: false,
  })
}

export const useCreateProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: IProjectFormData) => {
      const response = await createProject(data)
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data as IProject
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY })
    },
  })
}

export const useUpdateProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<IProjectFormData> }) => {
      const response = await updateProject(id, data)
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data as IProject
    },
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: PROJECTS_QUERY_KEY })
      const previous = queryClient.getQueriesData<IProject[]>({ queryKey: PROJECTS_QUERY_KEY })

      queryClient.setQueriesData<IProject[]>({ queryKey: PROJECTS_QUERY_KEY }, (old) => {
        if (!old) return old
        return old.map((p) => (p.id === id ? { ...p, ...data } : p))
      })

      queryClient.setQueryData<IProject>(['project', id], (old) => {
        if (!old) return old
        return { ...old, ...data }
      })

      return { previous }
    },
    onError: (_err, _variables, context) => {
      if (context?.previous) {
        for (const [key, data] of context.previous) {
          queryClient.setQueryData(key, data)
        }
      }
    },
    onSettled: (_data, _err, { id }) => {
      queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ['project', id] })
    },
  })
}

export const useDeleteProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteProject(id)
      if (response.error) {
        throw new Error(response.error)
      }
      return id
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: PROJECTS_QUERY_KEY })
      const previous = queryClient.getQueriesData<IProject[]>({ queryKey: PROJECTS_QUERY_KEY })

      queryClient.setQueriesData<IProject[]>({ queryKey: PROJECTS_QUERY_KEY }, (old) => {
        if (!old) return old
        return old.filter((p) => p.id !== id)
      })

      return { previous }
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        for (const [key, data] of context.previous) {
          queryClient.setQueryData(key, data)
        }
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY })
    },
  })
}
