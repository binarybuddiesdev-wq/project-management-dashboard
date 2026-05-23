import { useDashboard } from '@/hooks'
import { StatsCard, ActivityChart, CompletionChart, RecentProjects, ActivityFeed } from '@/components'
import { FolderKanban, ListTodo, CheckCircle2, Users, AlertCircle, RotateCcw } from 'lucide-react'

export const Dashboard = () => {
  const { dashboardData, isLoading, isError, error, refetch } = useDashboard()

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] border border-dashed border-destructive/30 bg-destructive/5 rounded-xl p-8 text-center space-y-4 animate-in fade-in duration-300">
        <div className="rounded-full bg-destructive/10 p-3 text-destructive">
          <AlertCircle className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-foreground">Failed to load dashboard</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            {error || 'An unexpected error occurred while fetching dashboard statistics.'}
          </p>
        </div>
        <button
          onClick={() => {
            void refetch()
          }}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 shadow-sm transition-all duration-200 cursor-pointer active:scale-95 border-0"
        >
          <RotateCcw className="h-4 w-4" />
          Retry Request
        </button>
      </div>
    )
  }

  const stats = dashboardData?.stats
  const activity = dashboardData?.activity || []
  const completion = dashboardData?.completion || []
  const recentProjects = dashboardData?.recentProjects || []
  const recentActivities = dashboardData?.recentActivities || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back to your workspace overview.</p>
      </div>

      {/* Stats Cards Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Projects"
          value={stats?.totalProjects ?? 0}
          change={stats?.totalProjectsChange}
          icon={<FolderKanban className="h-4 w-4" />}
          isLoading={isLoading}
        />
        <StatsCard
          title="Active Tasks"
          value={stats?.totalTasks ?? 0}
          change={stats?.totalTasksChange}
          icon={<ListTodo className="h-4 w-4" />}
          isLoading={isLoading}
        />
        <StatsCard
          title="Completed Tasks"
          value={stats?.completedTasks ?? 0}
          change={stats?.completedTasksChange}
          icon={<CheckCircle2 className="h-4 w-4" />}
          isLoading={isLoading}
        />
        <StatsCard
          title="Team Members"
          value={stats?.teamMembers ?? 0}
          change={stats?.teamMembersChange}
          icon={<Users className="h-4 w-4" />}
          isLoading={isLoading}
        />
      </div>

      {/* Visual Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <ActivityChart data={activity} isLoading={isLoading} />
        <CompletionChart data={completion} isLoading={isLoading} />
      </div>

      {/* Recent Records Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentProjects projects={recentProjects} isLoading={isLoading} />
        </div>
        <div>
          <ActivityFeed activities={recentActivities} isLoading={isLoading} />
        </div>
      </div>
    </div>
  )
}
