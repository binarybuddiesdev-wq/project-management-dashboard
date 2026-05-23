import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { motion, useReducedMotion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks'
import { Button } from '@/components/ui'
import { AlertCircle, Eye, EyeOff } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type ILoginFormInputs = z.infer<typeof loginSchema>

export const Login = () => {
  const { login, error, isLoading } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginFormInputs>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = useCallback(async (data: ILoginFormInputs) => {
    const success = await login(data)
    if (success) {
      navigate('/')
    }
  }, [login, navigate])

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 [transform:translateZ(0)]"
    >
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight select-none">Sign in</h2>
        <p className="text-muted-foreground text-sm select-none">
          Enter your email to sign in to your workspace.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-destructive/20 bg-destructive/5 text-destructive text-sm animate-in fade-in duration-200">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

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

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block select-none">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs text-primary hover:underline select-none"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              {...register('password')}
              className={`w-full pl-3 pr-10 py-2 rounded-lg border bg-background text-sm transition-all outline-none focus:ring-2 focus:ring-primary/20 ${
                errors.password ? 'border-destructive focus:border-destructive' : 'border-border focus:border-primary'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-destructive text-xs mt-1">{errors.password.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 text-white font-medium py-2 rounded-lg shadow-md cursor-pointer select-none transition-all"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground select-none">
        Don't have an account?{' '}
        <Link to="/signup" className="text-primary hover:underline font-medium">
          Create an account
        </Link>
      </p>
    </motion.div>
  )
}
