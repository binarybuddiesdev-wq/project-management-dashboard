import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { IStatsCardProps } from '@/types'

export const StatsCard = React.memo((props: IStatsCardProps) => {
  const { title, value, change, icon, isLoading } = props
  const shouldReduceMotion = useReducedMotion()

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm animate-pulse">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <div className="h-4 w-24 rounded bg-muted" />
          <div className="h-4 w-4 rounded-full bg-muted" />
        </div>
        <div className="pt-2">
          <div className="h-8 w-16 rounded bg-muted" />
          <div className="h-4 w-32 rounded bg-muted mt-2" />
        </div>
      </div>
    )
  }

  const isPositive = change !== undefined && change >= 0
  const formattedChange = change !== undefined 
    ? `${isPositive ? '+' : ''}${change}%` 
    : null

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow duration-200 [transform:translateZ(0)]"
    >
      <div className="flex items-center justify-between space-y-0 pb-2">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      <div className="pt-2">
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        {formattedChange && (
          <p className="text-xs mt-1">
            <span className={isPositive ? 'text-emerald-500 font-semibold' : 'text-rose-500 font-semibold'}>
              {formattedChange}
            </span>{' '}
            <span className="text-muted-foreground">vs last month</span>
          </p>
        )}
      </div>
    </motion.div>
  )
})
