import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks'
import React from 'react'

export interface IProtectedRouteProps {
  children?: React.ReactNode
}

export const ProtectedRoute = (props: IProtectedRouteProps) => {
  const { children } = props
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen w-screen flex items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <span className="text-sm font-medium text-muted-foreground select-none">Verifying session...</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children ? <>{children}</> : <Outlet />
}
