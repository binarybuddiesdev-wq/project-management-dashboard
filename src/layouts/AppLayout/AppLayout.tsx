import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '@/store'
import { toggleSidebar } from '@/store'
import { useAuth, useNotifications } from '@/hooks'
import { Sidebar, Topbar, Breadcrumb } from '@/components'

export interface IAppLayoutProps {
  children?: React.ReactNode
}

export const AppLayout = (props: IAppLayoutProps) => {
  const { children } = props
  const dispatch = useDispatch()
  const sidebarCollapsed = useSelector((state: RootState) => state.ui.sidebarCollapsed)
  const { user, logout } = useAuth()
  useNotifications()
  const location = useLocation()

  const handleToggleSidebar = React.useCallback(() => {
    dispatch(toggleSidebar())
  }, [])

  const pageTitle = React.useMemo((): string => {
    const path = location.pathname.split('/').filter(Boolean)[0]
    if (!path) return 'Dashboard'
    return path.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  }, [location.pathname])

  const memoizedContent = React.useMemo(() => {
    return children || <Outlet />
  }, [children, location.pathname])

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground transition-colors duration-200">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={handleToggleSidebar}
        user={user}
      />

      {/* Main Content Area */}
      <div 
        className={`flex-1 flex flex-col overflow-hidden transition-[padding-left] duration-300 ease-[0.25,0.1,0.25,1] [transform:translateZ(0)] ${
          sidebarCollapsed ? 'pl-16' : 'pl-[220px]'
        }`}
      >
        <Topbar
          title={pageTitle}
          isCollapsed={sidebarCollapsed}
          onToggle={handleToggleSidebar}
          user={user}
          onLogout={logout}
        />
        <Breadcrumb />

        {/* Content Outlet */}
        <main className="flex-1 overflow-auto p-8 bg-background">
          {memoizedContent}
        </main>
      </div>
    </div>
  )
}
