import type React from 'react'

export interface IDashboardStats {
  totalProjects: number
  totalProjectsChange: number
  totalTasks: number
  totalTasksChange: number
  completedTasks: number
  completedTasksChange: number
  teamMembers: number
  teamMembersChange: number
}

export interface IActivityData {
  date: string
  completed: number
  created: number
}

export interface ICompletionData {
  name: string
  value: number
  color: string
}

export interface IRecentProject {
  id: string
  name: string
  status: 'active' | 'completed' | 'on_hold'
  progress: number
  taskCount: number
  dueDate: string
}

export interface IRecentActivity {
  id: string
  userName: string
  userAvatar?: string
  action: string
  target: string
  timestamp: string
}

export interface IDashboardData {
  stats: IDashboardStats
  activity: IActivityData[]
  completion: ICompletionData[]
  recentProjects: IRecentProject[]
  recentActivities: IRecentActivity[]
}

export interface IStatsCardProps {
  title: string
  value: number | string
  change?: number
  icon?: React.ReactNode
  isLoading?: boolean
}

export interface IActivityChartProps {
  data?: IActivityData[]
  isLoading?: boolean
}

export interface ICompletionChartProps {
  data?: ICompletionData[]
  isLoading?: boolean
}

export interface IRecentProjectsProps {
  projects?: IRecentProject[]
  isLoading?: boolean
}

export interface IActivityFeedProps {
  activities?: IRecentActivity[]
  isLoading?: boolean
}

