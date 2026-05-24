import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getMembers, inviteMember, updateMember, removeMember } from '@/services'
import type { IMember, IMemberFormData } from '@/types'

const TEAM_QUERY_KEY = ['team'] as const

export const useMembers = () => {
  return useQuery({
    queryKey: TEAM_QUERY_KEY,
    queryFn: async () => {
      const response = await getMembers()
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data as IMember[]
    },
    retry: false,
  })
}

export const useInviteMember = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: IMemberFormData) => {
      const response = await inviteMember(data)
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data as IMember
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEAM_QUERY_KEY })
    },
  })
}

export const useUpdateMember = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<IMemberFormData> }) => {
      const response = await updateMember(id, data)
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data as IMember
    },
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: TEAM_QUERY_KEY })
      const previous = queryClient.getQueriesData<IMember[]>({ queryKey: TEAM_QUERY_KEY })

      queryClient.setQueriesData<IMember[]>({ queryKey: TEAM_QUERY_KEY }, (old) => {
        if (!old) return old
        return old.map((m) => (m.id === id ? { ...m, ...data } : m))
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
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TEAM_QUERY_KEY })
    },
  })
}

export const useRemoveMember = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await removeMember(id)
      if (response.error) {
        throw new Error(response.error)
      }
      return id
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: TEAM_QUERY_KEY })
      const previous = queryClient.getQueriesData<IMember[]>({ queryKey: TEAM_QUERY_KEY })

      queryClient.setQueriesData<IMember[]>({ queryKey: TEAM_QUERY_KEY }, (old) => {
        if (!old) return old
        return old.filter((m) => m.id !== id)
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
      queryClient.invalidateQueries({ queryKey: TEAM_QUERY_KEY })
    },
  })
}
