import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'
import type { IInviteMemberModalProps, IMemberFormData } from '@/types'

const inviteSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.string().min(1, 'Role is required'),
  department: z.string().min(1, 'Department is required'),
})

const ROLES = ['Product Manager', 'Lead Engineer', 'Frontend Developer', 'Backend Developer', 'UX Designer', 'QA Engineer']
const DEPARTMENTS = ['Engineering', 'Design', 'Product', 'Quality', 'Marketing', 'Operations']

export const InviteMemberModal = (props: IInviteMemberModalProps) => {
  const { open, onClose, onSubmit, isLoading } = props
  const shouldReduceMotion = useReducedMotion()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IMemberFormData>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      name: '',
      email: '',
      role: '',
      department: '',
    },
  })

  useEffect(() => {
    if (open) {
      reset({ name: '', email: '', role: '', department: '' })
    }
  }, [open, reset])

  const handleFormSubmit = async (data: IMemberFormData) => {
    await onSubmit(data)
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95, y: shouldReduceMotion ? 0 : 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95, y: shouldReduceMotion ? 0 : 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl [transform:translateZ(0)]"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">Invite Member</h2>
              <button
                onClick={onClose}
                type="button"
                className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="name" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block select-none">Full Name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  {...register('name')}
                  className={`w-full px-3 py-2 rounded-lg border bg-background text-sm transition-all outline-none focus:ring-2 focus:ring-primary/20 ${errors.name ? 'border-destructive focus:border-destructive' : 'border-border focus:border-primary'}`}
                />
                {errors.name && <p className="text-destructive text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div className="space-y-1">
                <label htmlFor="email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block select-none">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  {...register('email')}
                  className={`w-full px-3 py-2 rounded-lg border bg-background text-sm transition-all outline-none focus:ring-2 focus:ring-primary/20 ${errors.email ? 'border-destructive focus:border-destructive' : 'border-border focus:border-primary'}`}
                />
                {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="role" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block select-none">Role</label>
                  <select
                    id="role"
                    {...register('role')}
                    className={`w-full px-3 py-2 rounded-lg border bg-background text-sm transition-all outline-none focus:ring-2 focus:ring-primary/20 ${errors.role ? 'border-destructive' : 'border-border'}`}
                  >
                    <option value="">Select role</option>
                    {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                  {errors.role && <p className="text-destructive text-xs mt-1">{errors.role.message}</p>}
                </div>

                <div className="space-y-1">
                  <label htmlFor="department" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block select-none">Department</label>
                  <select
                    id="department"
                    {...register('department')}
                    className={`w-full px-3 py-2 rounded-lg border bg-background text-sm transition-all outline-none focus:ring-2 focus:ring-primary/20 ${errors.department ? 'border-destructive' : 'border-border'}`}
                  >
                    <option value="">Select dept</option>
                    {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                  {errors.department && <p className="text-destructive text-xs mt-1">{errors.department.message}</p>}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium rounded-lg border border-border bg-background text-foreground hover:bg-accent transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:opacity-90 shadow-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Inviting...' : 'Invite Member'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
