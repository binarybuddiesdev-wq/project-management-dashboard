import React from 'react'
import { useReducedMotion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  FolderKanban, 
  Settings, 
  Users, 
  ChevronLeft, 
  ChevronRight
} from 'lucide-react'
import type { ISidebarProps } from '@/types'

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Projects', path: '/projects', icon: FolderKanban },
  { label: 'Team', path: '/team', icon: Users },
  { label: 'Settings', path: '/settings', icon: Settings },
]

export const Sidebar = React.memo((props: ISidebarProps) => {
  const { isCollapsed, onToggle, user } = props
  const location = useLocation()
  const shouldReduceMotion = useReducedMotion()

  const avatarUrl = user?.avatar || 'https://i.pravatar.cc/32?img=4'

  const transitionClass = shouldReduceMotion ? 'transition-none' : 'transition-all duration-200 ease-in-out'

  return (
    <aside
      className={`fixed left-0 top-0 bottom-0 z-20 border-r border-border bg-card flex flex-col justify-between select-none overflow-hidden [transform:translateZ(0)] [will-change:transform] ${
        isCollapsed ? 'w-16' : 'w-[220px]'
      } ${transitionClass}`}
    >
      <div className="flex flex-col flex-1 h-full w-full justify-between overflow-hidden">
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Brand header */}
          <div className={`h-16 flex items-center border-b border-border px-4 ${
            isCollapsed ? 'justify-center' : 'justify-between'
          } ${transitionClass}`}>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white shadow-md select-none shrink-0">
                P
              </div>
              <span className={`inline-block font-semibold text-sm tracking-tight text-foreground whitespace-nowrap overflow-hidden ${
                isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[150px] opacity-100'
              } ${transitionClass}`}>
                {!isCollapsed && 'Workspace'}
              </span>
            </div>
            {!isCollapsed && (
              <button
                onClick={onToggle}
                type="button"
                className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
                aria-label="Collapse sidebar"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Navigation list */}
          <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.path
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center rounded-lg text-sm font-medium ${
                    isActive
                      ? 'bg-indigo-500/10 text-indigo-500'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  } ${isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2'} ${transitionClass}`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-indigo-500' : ''}`} />
                  <span className={`inline-block whitespace-nowrap overflow-hidden ${
                    isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[150px] opacity-100'
                  } ${transitionClass}`}>
                    {!isCollapsed && item.label}
                  </span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Footer Profile area */}
        <div className={`p-3 border-t border-border flex flex-col gap-2 ${
          isCollapsed ? 'items-center' : ''
        } ${transitionClass}`}>
          {isCollapsed ? (
            <button
              onClick={onToggle}
              type="button"
              className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground cursor-pointer mb-2"
              aria-label="Expand sidebar"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : null}

          <div className={`flex items-center ${
            isCollapsed 
              ? 'justify-center p-0 bg-transparent border-0' 
              : 'gap-3 px-2 py-1.5 rounded-lg bg-accent/20 border border-border/50'
          } ${transitionClass}`}>
            <img
              src={avatarUrl}
              alt={user?.name || 'User Avatar'}
              className="h-8 w-8 rounded-full border border-border object-cover shrink-0 select-none"
            />
            <div className={`flex flex-col min-w-0 overflow-hidden ${
              isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[150px] opacity-100'
            } ${transitionClass}`}>
              {!isCollapsed && (
                <>
                  <span className="text-xs font-semibold text-foreground truncate select-none">
                    {user?.name || 'Guest User'}
                  </span>
                  <span className="text-[10px] text-muted-foreground truncate select-none">
                    {user?.email || 'guest@example.com'}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
})
