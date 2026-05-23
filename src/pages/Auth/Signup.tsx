import { useState, useCallback, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { motion, useReducedMotion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks'
import { Button } from '@/components/ui'
import { AlertCircle, Eye, EyeOff } from 'lucide-react'

const signupSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Password confirmation must be at least 8 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ['confirmPassword'],
  })

type ISignupFormInputs = z.infer<typeof signupSchema>

const getPasswordStrength = (password: string) => {
  if (!password) {
    return { score: 0, label: '', color: 'bg-muted', textColor: 'text-muted-foreground' }
  }

  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  let label = ''
  let color = 'bg-muted'
  let textColor = 'text-muted-foreground'

  switch (score) {
    case 1:
      label = 'Weak'
      color = 'bg-red-500'
      textColor = 'text-red-500'
      break
    case 2:
      label = 'Fair'
      color = 'bg-yellow-500'
      textColor = 'text-yellow-500'
      break
    case 3:
      label = 'Good'
      color = 'bg-orange-500'
      textColor = 'text-orange-500'
      break
    case 4:
      label = 'Strong'
      color = 'bg-green-500'
      textColor = 'text-green-500'
      break
    default:
      label = 'Weak'
      color = 'bg-red-500'
      textColor = 'text-red-500'
      break
  }

  return { score, label, color, textColor }
}

export const Signup = () => {
  const { signup, error, isLoading } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ISignupFormInputs>({
    resolver: zodResolver(signupSchema),
  })

  const passwordValue = watch('password') || ''
  const strength = useMemo(() => getPasswordStrength(passwordValue), [passwordValue])

  const onSubmit = useCallback(async (data: ISignupFormInputs) => {
    const { name, email, password } = data
    const success = await signup({ name, email, password })
    if (success) {
      navigate('/')
    }
  }, [signup, navigate])

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 [transform:translateZ(0)]"
    >
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight select-none">Create account</h2>
        <p className="text-muted-foreground text-sm select-none">
          Get started with your team workspace today.
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
          <label htmlFor="name" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block select-none">
            Full name
          </label>
          <input
            id="name"
            type="text"
            placeholder="John Doe"
            {...register('name')}
            className={`w-full px-3 py-2 rounded-lg border bg-background text-sm transition-all outline-none focus:ring-2 focus:ring-primary/20 ${
              errors.name ? 'border-destructive focus:border-destructive' : 'border-border focus:border-primary'
            }`}
          />
          {errors.name && (
            <p className="text-destructive text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

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
          <label htmlFor="password" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block select-none">
            Password
          </label>
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

          {/* Password Strength Indicator */}
          {passwordValue && (
            <div className="pt-1.5 space-y-1">
              <div className="flex gap-1.5 h-1 w-full">
                {[1, 2, 3, 4].map((index) => {
                  const isFilled = index <= strength.score
                  return (
                    <div key={index} className="flex-1 bg-border rounded-full overflow-hidden h-full">
                      <motion.div
                        initial={{ width: '0%' }}
                        animate={{ width: isFilled ? '100%' : '0%' }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className={`h-full ${strength.color}`}
                      />
                    </div>
                  )
                })}
              </div>
              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span>Password strength</span>
                <span className={`font-semibold ${strength.textColor}`}>
                  {strength.label}
                </span>
              </div>
            </div>
          )}

          {errors.password && (
            <p className="text-destructive text-xs mt-1">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="confirmPassword" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block select-none">
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              {...register('confirmPassword')}
              className={`w-full pl-3 pr-10 py-2 rounded-lg border bg-background text-sm transition-all outline-none focus:ring-2 focus:ring-primary/20 ${
                errors.confirmPassword ? 'border-destructive focus:border-destructive' : 'border-border focus:border-primary'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-destructive text-xs mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 text-white font-medium py-2 rounded-lg shadow-md cursor-pointer select-none transition-all"
        >
          {isLoading ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground select-none">
        Already have an account?{' '}
        <Link to="/login" className="text-primary hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </motion.div>
  )
}
