/**
 * Student Preview Page
 *
 * Main entry point for students accessing projects.
 * Handles session check and conditional rendering:
 * - Loading state: Show spinner
 * - Error state: Show error message with retry
 * - Unauthenticated: Show password prompt
 * - Authenticated: Show project viewer
 */

'use client'

import dynamic from 'next/dynamic'
import { useProjectAuth } from '@/lib/hooks/useProjectAuth'
import { PasswordPromptForm } from '@/components/student/PasswordPromptForm'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function PreviewPage({ params }: { params: { projectId: string } }) {
  const { session, refetchSession } = useProjectAuth(params.projectId)

  if (session.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="mr-2 text-muted-foreground">טוען...</span>
      </div>
    )
  }

  if (session.error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <p className="text-destructive text-lg mb-4">{session.error}</p>
          <Button onClick={() => window.location.reload()}>נסה שוב</Button>
        </div>
      </div>
    )
  }

  if (!session.authenticated) {
    return (
      <PasswordPromptForm
        projectId={params.projectId}
        onSuccess={refetchSession}
      />
    )
  }

  // ProjectViewer handles authenticated state
  const ProjectViewer = dynamic(() => import('@/components/student/ProjectViewer').then(mod => ({ default: mod.ProjectViewer })), {
    ssr: false,
  })

  return <ProjectViewer projectId={params.projectId} />
}
