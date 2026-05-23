import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks'
import { Button } from '@/components/ui'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { useState, useCallback } from 'react'

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

type IForgotPasswordFormInputs = z.infer<typeof forgotPasswordSchema>

export const ForgotPassword = () => {
  const { requestPasswordReset, error, isLoading } = useAuth()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const shouldReduceMotion = useReducedMotion()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IForgotPasswordFormInputs>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = useCallback(async (data: IForgotPasswordFormInputs) => {
    setSuccessMessage(null)
    const msg = await requestPasswordReset(data.email)
    if (msg) {
      setSuccessMessage(msg)
    }
  }, [requestPasswordReset])

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 [transform:translateZ(0)]"
    >
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight select-none">Reset password</h2>
        <p className="text-muted-foreground text-sm select-none">
          Enter your email and we will send you a reset link.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-destructive/20 bg-destructive/5 text-destructive text-sm animate-in fade-in duration-200">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {successMessage ? (
        <div className="space-y-6">
          <div className="flex items-center gap-3 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-sm animate-in fade-in duration-200">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <Link to="/login" className="block">
            <Button className="w-full bg-accent text-accent-foreground hover:opacity-90 font-medium py-2 rounded-lg cursor-pointer select-none">
              Back to Sign In
            </Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block select-none">
              Email address
            </label>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              {...register('email')}
              className={`w-full px-3 py-2 rounded-lg border bg-background text-sm transition-all outline-none focus:ring-2 focus:ring-primary/20 ${
                errors.email ? 'border-destructive focus:border-destructive' : 'border-border focus:border-primary'
              }`}
            />
            {errors.email && (
              <p className="text-destructive text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 text-white font-medium py-2 rounded-lg shadow-md cursor-pointer select-none transition-all"
          >
            {isLoading ? 'Sending link...' : 'Send Reset Link'}
          </Button>

          <p className="text-center text-sm text-muted-foreground select-none">
            Remembered your password?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </form>
      )}
    </motion.div>
  )
}
