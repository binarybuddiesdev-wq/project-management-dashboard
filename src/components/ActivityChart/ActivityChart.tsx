import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { IActivityChartProps } from '@/types'

// Static chart configuration objects declared outside components to prevent re-creation
const CHART_MARGIN = { top: 10, right: 10, left: -20, bottom: 0 }
const GRID_STROKE_DASHARRAY = "3 3"
const TOOLTIP_POSITION = { y: 0 }
const TOOLTIP_CURSOR = { fill: 'hsl(var(--muted)/0.15)' }
const TOOLTIP_WRAPPER_STYLE = {
  opacity: 1,
  zIndex: 9999,
  backgroundColor: 'hsl(var(--popover))',
  borderRadius: '8px'
}
const BAR_RADIUS: [number, number, number, number] = [4, 4, 0, 0]

const CustomTooltip = React.memo((props: {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    color: string
  }>
  label?: string
}) => {
  const { active, payload, label } = props

  if (!active || !payload || !payload.length) {
    return null
  }

  return (
    <div className="rounded-lg border border-border bg-popover opacity-100 shadow-md text-card-foreground select-none min-w-[120px] p-3 relative z-50">
      <p className="text-xs font-semibold text-foreground mb-1.5">{label}</p>
      <div className="space-y-1.5">
        {payload.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-muted-foreground">{item.name}:</span>
            <span className="text-xs font-bold text-foreground ml-auto">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
})

export const ActivityChart = React.memo((props: IActivityChartProps) => {
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

  const isEmpty = data.length === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
      className="rounded-xl border border-border bg-card p-6 shadow-sm h-[350px] flex flex-col [transform:translateZ(0)]"
    >
      <div className="mb-4">
        <h3 className="text-base font-semibold text-foreground">Task Activity</h3>
        <p className="text-xs text-muted-foreground">Daily task creation and completion overview</p>
      </div>

      <div className="flex-1 w-full min-h-0 relative">
        {isEmpty ? (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
            No activity data available.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={CHART_MARGIN}
            >
              <CartesianGrid strokeDasharray={GRID_STROKE_DASHARRAY} vertical={false} stroke="hsl(var(--border))" />
              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                content={<CustomTooltip />}
                position={TOOLTIP_POSITION}
                cursor={TOOLTIP_CURSOR}
                allowEscapeViewBox={{ x: true, y: true }}
                wrapperStyle={TOOLTIP_WRAPPER_STYLE}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} />
              <Bar
                name="Created"
                dataKey="created"
                fill="hsl(var(--primary))"
                radius={BAR_RADIUS}
              />
              <Bar
                name="Completed"
                dataKey="completed"
                fill="#10b981"
                radius={BAR_RADIUS}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  )
})
