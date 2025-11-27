import { BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showText?: boolean
}

export function Logo({ size = 'md', className, showText = true }: LogoProps) {
  const sizes = {
    sm: {
      icon: 'h-6 w-6',
      container: 'h-8 w-8',
      text: 'text-lg',
    },
    md: {
      icon: 'h-6 w-6',
      container: 'h-10 w-10',
      text: 'text-2xl',
    },
    lg: {
      icon: 'h-8 w-8',
      container: 'h-14 w-14',
      text: 'text-3xl',
    },
  }

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className={cn(
        'rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center',
        sizes[size].container
      )}>
        <BarChart3 className={cn('text-white', sizes[size].icon)} />
      </div>
      {showText && (
        <div>
          <h1 className={cn(
            'font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent',
            sizes[size].text
          )}>
            StatViz
          </h1>
        </div>
      )}
    </div>
  )
}
