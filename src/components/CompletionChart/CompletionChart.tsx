import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { ICompletionChartProps } from '@/types'

const TOOLTIP_WRAPPER_STYLE = {
  opacity: 1,
  zIndex: 9999,
  backgroundColor: 'hsl(var(--popover))',
  borderRadius: '8px',
}

const CustomTooltip = React.memo((props: {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    payload: {
      color: string
    }
  }>
}) => {
  const { active, payload } = props

  if (!active || !payload || !payload.length) {
    return null
  }

  const data = payload[0]

  return (
    <div className="rounded-lg border border-border bg-popover opacity-100 shadow-md text-popover-foreground select-none min-w-[120px] p-3 relative z-50">
      <div className="flex items-center gap-2">
        <span
          className="h-2 w-2 rounded-full shrink-0"
          style={{ backgroundColor: data.payload.color }}
        />
        <span className="text-xs text-muted-foreground">{data.name}:</span>
        <span className="text-xs font-bold text-foreground ml-auto">{data.value}</span>
      </div>
    </div>
  )
})

export const CompletionChart = React.memo((props: ICompletionChartProps) => {
  const { data = [], isLoading } = props
  const shouldReduceMotion = useReducedMotion()

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm animate-pulse h-[350px] flex flex-col justify-between">
        <div className="space-y-2">
          <div className="h-4 w-48 rounded bg-muted" />
          <div className="h-3 w-32 rounded bg-muted" />
        </div>
        <div className="h-[220px] w-full rounded bg-muted animate-pulse" />
      </div>
    )
  }

  const isEmpty = data.length === 0 || data.every((d) => d.value === 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut', delay: 0.2 }}
      className="rounded-xl border border-border bg-card p-6 shadow-sm h-[350px] flex flex-col [transform:translateZ(0)]"
    >
      <div className="mb-4">
        <h3 className="text-base font-semibold text-foreground">Task Status</h3>
        <p className="text-xs text-muted-foreground">Current completion and progress distribution</p>
      </div>

      <div className="flex-1 w-full min-h-0 relative">
        {isEmpty ? (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
            No status data available.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="45%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={<CustomTooltip />}
                wrapperStyle={TOOLTIP_WRAPPER_STYLE}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={8} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  )
})
