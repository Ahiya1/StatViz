/**
 * Project Viewer Page
 * /preview/:projectId/view
 *
 * Main viewing page for authenticated students.
 * This page is accessed after successful password authentication.
 *
 * Security:
 * - Session validation handled by useProjectAuth hook
 * - Redirects to password prompt if session expired
 */

'use client'

import { ProjectViewer } from '@/components/student/ProjectViewer'

interface ViewPageProps {
  params: {
    projectId: string
  }
}

export default function ViewPage({ params }: ViewPageProps) {
  return <ProjectViewer projectId={params.projectId} />
}
