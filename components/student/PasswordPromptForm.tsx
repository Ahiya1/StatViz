/**
 * PasswordPromptForm Component
 *
 * Password entry form for student project access with:
 * - React Hook Form + Zod validation
 * - Password visibility toggle
 * - Touch-friendly mobile design (44px button)
 * - Hebrew error messages
 * - Loading states
 * - Rate limiting feedback
 */

'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const PasswordSchema = z.object({
  password: z.string()
    .min(1, 'נא להזין סיסמה')
    .max(100, 'סיסמה ארוכה מדי'),
})

type PasswordFormData = z.infer<typeof PasswordSchema>

interface PasswordPromptFormProps {
  projectId: string
  onSuccess: () => void
}

export function PasswordPromptForm({ projectId, onSuccess }: PasswordPromptFormProps) {
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(PasswordSchema),
  })

  async function onSubmit(data: PasswordFormData) {
    try {
      const response = await fetch(`/api/preview/${projectId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        toast.success('אימות הצליח!')
        onSuccess()
      } else if (response.status === 429) {
        toast.error('יותר מדי ניסיונות. נסה שוב בעוד שעה.')
        reset() // Clear password field
      } else {
        toast.error(result.error?.message || 'סיסמה שגויה. אנא נסה שוב.')
        reset() // Clear password field
      }
    } catch (error) {
      toast.error('שגיאת רשת. אנא בדוק את החיבור לאינטרנט.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-center mb-2">
            גישה לפרויקט
          </h1>
          <p className="text-sm text-muted-foreground text-center mb-6">
            הזן את הסיסמה שנשלחה אליך במייל
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="password">סיסמה</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className={`text-base ${errors.password ? 'border-destructive' : ''}`}
                  autoComplete="off"
                  disabled={isSubmitting}
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? 'הסתר סיסמה' : 'הצג סיסמה'}
                  tabIndex={-1}
                  disabled={isSubmitting}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full min-h-[44px]"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'מאמת...' : 'כניסה'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
