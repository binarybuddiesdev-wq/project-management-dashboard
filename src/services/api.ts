import ky from 'ky'

const getPrefix = (): string => {
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
    return 'http://localhost/api'
  }
  return '/api'
}

export const api = ky.create({
  prefix: getPrefix(),
  hooks: {
    beforeRequest: [
      (state) => {
        const token = localStorage.getItem('token')
        if (token) {
          state.request.headers.set('Authorization', `Bearer ${token}`)
        }
      },
    ],
  },
})

export const parseApiError = async (error: unknown, fallback: string): Promise<string> => {
  if (error && typeof error === 'object') {
    // Check if Ky has already pre-parsed the response body into error.data
    if ('data' in error) {
      const data = (error as { data: unknown }).data
      if (data && typeof data === 'object' && 'error' in data) {
        const potentialError = (data as { error: unknown }).error // Type assertion to check for error field
        if (typeof potentialError === 'string') {
          return potentialError
        }
      }
    }

    // Otherwise, check if the response body is available and hasn't been consumed yet
    if ('response' in error) {
      const response = (error as { response: unknown }).response
      if (
        response &&
        typeof response === 'object' &&
        'bodyUsed' in response &&
        !(response as { bodyUsed: boolean }).bodyUsed &&
        'json' in response &&
        typeof response.json === 'function'
      ) {
        try {
          const errorData: unknown = await (response as Response).json()
          if (errorData && typeof errorData === 'object' && 'error' in errorData) {
            const potentialError = (errorData as { error: unknown }).error // Type assertion to check for error field
            if (typeof potentialError === 'string') {
              return potentialError
            }
          }
        } catch {
          // Ignore and fall back to standard error parsing
        }
      }
    }
  }
  return error instanceof Error ? error.message : fallback
}


