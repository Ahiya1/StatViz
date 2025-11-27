'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardShell } from '@/components/admin/DashboardShell'
import { ProjectsContainer } from '@/components/admin/ProjectsContainer'
import { useAuth } from '@/lib/hooks/useAuth'
import { Loader2 } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">
            לוח הבקרה
          </h2>
          <p className="text-slate-600 mt-1">
            ניהול פרויקטים וצפייה בנתונים
          </p>
        </div>

        <ProjectsContainer />
      </div>
    </DashboardShell>
  )
}
