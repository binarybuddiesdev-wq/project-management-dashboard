import { useState, useCallback, useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Plus, Users, AlertCircle, RotateCcw, UserPlus } from 'lucide-react'
import { useMembers, useInviteMember, useRemoveMember } from '@/hooks'
import { MemberCard, InviteMemberModal } from '@/components'
import type { IMemberFormData } from '@/types'

export const TeamMembers = () => {
  const [modalOpen, setModalOpen] = useState(false)

  const { data: members = [], isLoading, isError, error, refetch } = useMembers()
  const inviteMutation = useInviteMember()
  const removeMutation = useRemoveMember()

  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: members.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 88,
    overscan: 5,
  })

  const handleInvite = useCallback(async (data: IMemberFormData) => {
    await inviteMutation.mutateAsync(data)
    setModalOpen(false)
  }, [inviteMutation])

  const handleRemove = useCallback(async (id: string) => {
    if (window.confirm('Are you sure you want to remove this member?')) {
      await removeMutation.mutateAsync(id)
    }
  }, [removeMutation])

  if (isError) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-destructive/30 bg-destructive/5 rounded-xl p-8 text-center space-y-4">
          <div className="rounded-full bg-destructive/10 p-3 text-destructive">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-foreground">Failed to load team</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              {(error instanceof Error ? error.message : String(error)) || 'An unexpected error occurred.'}
            </p>
          </div>
          <button
            onClick={() => { void refetch() }}
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 shadow-sm transition-all duration-200 cursor-pointer active:scale-95 border-0"
          >
            <RotateCcw className="h-4 w-4" />
            Retry Request
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Members</h1>
          <p className="text-muted-foreground">Manage your team members and their roles.</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:opacity-90 shadow-sm transition-all duration-200 cursor-pointer active:scale-95 border-0 shrink-0"
        >
          <UserPlus className="h-4 w-4" />
          Invite Member
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3 flex-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-card/60 animate-pulse">
              <div className="h-12 w-12 rounded-full bg-muted shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-1/3" />
                <div className="h-3 bg-muted rounded w-1/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : members.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-border/60 rounded-xl p-8 text-center">
          <div className="rounded-full bg-muted p-3 text-muted-foreground mb-4">
            <Users className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">No team members yet</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">Invite your first team member to get started.</p>
          <button
            onClick={() => setModalOpen(true)}
            type="button"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 shadow-sm transition-all cursor-pointer border-0"
          >
            <Plus className="h-4 w-4" />
            Invite Member
          </button>
        </div>
      ) : (
        <div ref={parentRef} className="flex-1 overflow-y-auto min-h-0 team-scroll">
          <div className="relative" style={{ height: `${virtualizer.getTotalSize()}px` }}>
            <div
              className="absolute left-0 right-0 top-0"
              style={{ transform: `translateY(${virtualizer.getVirtualItems()[0]?.start ?? 0}px)` }}
            >
              {virtualizer.getVirtualItems().map((virtualItem) => {
                const member = members[virtualItem.index]
                return (
                  <div
                    key={member.id}
                    data-index={virtualItem.index}
                    ref={virtualizer.measureElement}
                    className="py-1"
                  >
                    <MemberCard
                      member={member}
                      onDelete={handleRemove}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      <InviteMemberModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleInvite}
        isLoading={inviteMutation.isPending}
      />
    </div>
  )
}
