import React from 'react'
import { Search, X } from 'lucide-react'
import type { IProjectFiltersProps } from '@/types'

export const ProjectFilters = React.memo((props: IProjectFiltersProps) => {
  const { search, status, priority, onSearchChange, onStatusChange, onPriorityChange } = props

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
      <div className="relative flex-1 w-full sm:max-w-xs">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search projects..."
          className="w-full pl-9 pr-8 py-1.5 bg-accent/20 border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            type="button"
            className="absolute right-2 top-2 p-0.5 rounded text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className="w-full sm:w-auto px-3 py-1.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
        aria-label="Filter by status"
      >
        <option value="">All Statuses</option>
        <option value="active">Active</option>
        <option value="completed">Completed</option>
        <option value="on_hold">On Hold</option>
        <option value="cancelled">Cancelled</option>
      </select>

      <select
        value={priority}
        onChange={(e) => onPriorityChange(e.target.value)}
        className="w-full sm:w-auto px-3 py-1.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
        aria-label="Filter by priority"
      >
        <option value="">All Priorities</option>
        <option value="urgent">Urgent</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
    </div>
  )
})
