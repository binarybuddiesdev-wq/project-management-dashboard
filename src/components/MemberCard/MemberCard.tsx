import { useState } from 'react'
import { motion } from 'framer-motion'
import { Edit2, Trash2, Mail, Building2, BadgeCheck } from 'lucide-react'
import type { IMemberCardProps } from '@/types'

const ROLE_COLORS: Record<string, string> = {
  'Product Manager': 'bg-violet-500/10 text-violet-500',
  'Lead Engineer': 'bg-blue-500/10 text-blue-500',
  'Frontend Developer': 'bg-cyan-500/10 text-cyan-500',
  'Backend Developer': 'bg-emerald-500/10 text-emerald-500',
  'UX Designer': 'bg-pink-500/10 text-pink-500',
  'QA Engineer': 'bg-amber-500/10 text-amber-500',
}

const getRoleColor = (role: string): string => {
  return ROLE_COLORS[role] || 'bg-secondary text-secondary-foreground'
}

const getInitials = (name: string): string => {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

export const MemberCard = (props: IMemberCardProps) => {
  const { member, onEdit, onDelete } = props
  const [imgError, setImgError] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="group relative flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-card hover:border-border hover:shadow-sm transition-all duration-200"
    >
      <div className="relative shrink-0">
        {imgError ? (
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
            {getInitials(member.name)}
          </div>
        ) : (
          <img
            src={member.avatar}
            alt={member.name}
            className="h-12 w-12 rounded-full border border-border object-cover"
            onError={() => setImgError(true)}
          />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-semibold text-foreground truncate">{member.name}</h4>
          <BadgeCheck className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
        </div>
        <div className="flex items-center gap-3 mt-1">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${getRoleColor(member.role)}`}>
            {member.role}
          </span>
        </div>
        <div className="flex items-center gap-4 mt-1.5">
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Mail className="h-3 w-3" />
            {member.email}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Building2 className="h-3 w-3" />
            {member.department}
          </span>
        </div>
      </div>

      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {onEdit && (
          <button
            onClick={() => onEdit(member)}
            type="button"
            className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label={`Edit ${member.name}`}
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(member.id)}
            type="button"
            className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
            aria-label={`Remove ${member.name}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </motion.div>
  )
}
