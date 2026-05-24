import { Provider } from 'react-redux'
import { QueryClientProvider } from '@tanstack/react-query'
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom'
import { store } from '@/store'
import { queryClient } from '@/services'
import { AppLayout, AuthLayout } from '@/layouts'
import { Dashboard, Login, Signup, ForgotPassword, ProjectsList, ProjectDetail, Kanban } from '@/pages'
import { ErrorBoundary, ProtectedRoute } from '@/components'
import { useEffect, useState, createContext, useContext } from 'react'
import { useAuth } from '@/hooks'

const AuthInitContext = createContext<{ isInitialized: boolean }>({
  isInitialized: false,
})

const useAuthInit = () => useContext(AuthInitContext)

const PublicRoute = (props: { children?: React.ReactNode }) => {
  const { children } = props
  const { isAuthenticated, isLoading } = useAuth()
  const { isInitialized } = useAuthInit()

  const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('token')

  if (isLoading || (hasToken && !isInitialized)) {
    return (
      <div className="min-h-screen w-screen flex items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <span className="text-sm font-medium text-muted-foreground select-none">Verifying session...</span>
        </div>
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return children ? <>{children}</> : <Outlet />
}

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    errorElement: (
      <div className="p-8 text-center text-destructive font-semibold">
        Route loading error.
      </div>
    ),
    children: [
      {
        path: '',
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'projects',
        element: <ProjectsList />,
      },
      {
        path: 'projects/:id',
        element: <ProjectDetail />,
      },
      {
        path: 'kanban',
        element: <Kanban />,
      },
    ],
  },
  {
    element: (
      <PublicRoute>
        <AuthLayout />
      </PublicRoute>
    ),
    children: [
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'signup',
        element: <Signup />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPassword />,
      },
    ],
  },
])

const AuthInitializer = (props: { children: React.ReactNode }) => {
  const { children } = props
  const { checkSession } = useAuth()
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    let isMounted = true
    const init = async () => {
      try {
        await checkSession()
      } catch {
        // Ignored
      } finally {
        if (isMounted) {
          setIsInitialized(true)
        }
      }
    }
    init()
    return () => {
      isMounted = false
    }
  }, [checkSession])

  return (
    <AuthInitContext.Provider value={{ isInitialized }}>
      {children}
    </AuthInitContext.Provider>
  )
}

export const App = () => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <AuthInitializer>
            <RouterProvider router={router} />
          </AuthInitializer>
        </QueryClientProvider>
      </Provider>
    </ErrorBoundary>
  )
}
