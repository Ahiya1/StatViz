/**
 * ProjectViewer Component
 * Main container component that fetches project data and orchestrates layout
 *
 * Layout Structure:
 * - Header: ProjectMetadata
 * - Main: HtmlIframe (full height)
 * - Download button (mobile-optimized positioning)
 * - Professional loading and error states (Iteration 2 enhancement)
 */

'use client'

import { Loader2, AlertCircle } from 'lucide-react'
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

  // Professional loading state with gradient background
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-center text-slate-700 font-medium">טוען פרויקט...</p>
          <p className="text-center text-sm text-slate-500 mt-2">אנא המתן</p>
        </div>
      </div>
    )
  }

  // Professional error state with icon and gradient background
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">שגיאה בטעינת הפרויקט</h2>
          <p className="text-slate-600 mb-6">
            {error instanceof Error ? error.message : 'לא ניתן לטעון את הפרויקט כרגע'}
          </p>
          <Button
            onClick={() => window.location.reload()}
            variant="gradient"
            size="lg"
            className="w-full min-h-[44px]"
          >
            נסה שוב
          </Button>
        </div>
      </div>
    )
  }

  // No data error state
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">שגיאה בטעינת הפרויקט</h2>
          <p className="text-slate-600 mb-6">
            לא נמצאו נתונים עבור פרויקט זה
          </p>
          <Button
            onClick={() => window.location.reload()}
            variant="gradient"
            size="lg"
            className="w-full min-h-[44px]"
          >
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
