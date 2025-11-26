/**
 * ProjectViewer Component
 * Main container component that fetches project data and orchestrates layout
 *
 * Layout Structure:
 * - Header: ProjectMetadata
 * - Main: HtmlIframe (full height)
 * - Download button placeholder for Builder-3
 */

'use client'

import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useProject } from '@/lib/hooks/useProject'
import { ProjectMetadata } from './ProjectMetadata'
import { HtmlIframe } from './HtmlIframe'
import { DownloadButton } from './DownloadButton'

interface ProjectViewerProps {
  projectId: string
}

export function ProjectViewer({ projectId }: ProjectViewerProps) {
  const { data, isLoading, error } = useProject(projectId)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="mr-2 text-muted-foreground">טוען פרויקט...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-destructive text-lg mb-4">
            {error instanceof Error ? error.message : 'שגיאה בטעינת הפרויקט'}
          </p>
          <Button onClick={() => window.location.reload()}>
            נסה שוב
          </Button>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-destructive text-lg mb-4">
            לא נמצאו נתונים עבור פרויקט זה
          </p>
          <Button onClick={() => window.location.reload()}>
            נסה שוב
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header - Mobile: compact, Desktop: spacious */}
      <ProjectMetadata project={data} />

      {/* Main content - Full viewport minus header */}
      <main className="flex-1 relative">
        <HtmlIframe projectId={projectId} />
      </main>

      {/* Download button - Fixed bottom on mobile, absolute top-right on desktop */}
      <DownloadButton projectId={projectId} projectName={data.name} />
    </div>
  )
}
