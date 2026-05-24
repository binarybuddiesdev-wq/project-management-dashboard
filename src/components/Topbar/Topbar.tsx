import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Bell, Search, Sun, Moon, LogOut, Menu } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { selectUnreadCount } from '@/store'
import type { ITopbarProps } from '@/types'

export const Topbar = (props: ITopbarProps) => {
  const { title, isCollapsed, onToggle, user, onLogout } = props
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const unreadCount = useSelector(selectUnreadCount)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const avatarUrl = user?.avatar || 'https://i.pravatar.cc/32?img=4'

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between shrink-0 select-none">
      <div className="flex items-center gap-4">
        {/* Toggle Sidebar Button (For mobile view / collapsed states) */}
        {isCollapsed && (
          <button
            onClick={onToggle}
            type="button"
            className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground cursor-pointer"
            aria-label="Expand sidebar"
          >
            <Menu className="h-4 w-4" />
          </button>
        )}
        <h2 className="font-semibold text-base text-foreground tracking-tight select-none">
          {title}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Input Mock */}
        <div className="relative md:block hidden w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search workspace..."
            className="w-full pl-9 pr-4 py-1.5 bg-accent/20 border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
          />
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          type="button"
          className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4 text-amber-400" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </button>

        {/* Notifications Icon with Badge */}
        <Link
          to="/notifications"
          className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground relative transition-colors cursor-pointer"
          aria-label={`Notifications: ${unreadCount} unread`}
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center ring-2 ring-card">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Link>

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            type="button"
            className="flex items-center gap-2 p-1 rounded-full hover:bg-accent cursor-pointer transition-all focus:outline-none"
            aria-expanded={dropdownOpen}
            aria-haspopup="menu"
            aria-label="User dropdown menu"
          >
            <img
              src={avatarUrl}
              alt={user?.name || 'User Profile'}
              className="h-8 w-8 rounded-full border border-border object-cover select-none"
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-lg py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 border-b border-border">
                <p className="text-xs font-semibold text-foreground truncate select-none">
                  {user?.name || 'Guest User'}
                </p>
                <p className="text-[10px] text-muted-foreground truncate select-none mt-0.5">
                  {user?.email || 'guest@example.com'}
                </p>
              </div>
              
              <button
                onClick={() => {
                  setDropdownOpen(false)
                  onLogout()
                }}
                type="button"
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/5 transition-all text-left cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
