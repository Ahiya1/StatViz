/**
 * ProjectMetadata Component
 * Display project information in a mobile-responsive header
 *
 * Features:
 * - Hebrew RTL layout
 * - Email displays in LTR (mixed content handling)
 * - Research topic truncates on mobile, full on desktop
 * - Responsive padding and typography
 */

import type { ProjectData } from '@/lib/types/student'

interface ProjectMetadataProps {
  project: {
    name: string
    student: { name: string; email: string }
    researchTopic: string
  }
}

export function ProjectMetadata({ project }: ProjectMetadataProps) {
  return (
    <header className="bg-white border-b p-4 lg:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Project name - Larger on desktop */}
        <h1 className="text-xl font-bold mb-2 lg:text-3xl lg:mb-3">
          {project.name}
        </h1>

        {/* Metadata - Stack on mobile, row on desktop */}
        <div className="space-y-1 text-sm lg:text-base lg:flex lg:gap-4 lg:space-y-0">
          <p className="text-muted-foreground">
            סטודנט: <span className="text-foreground">{project.student.name}</span>
          </p>

          <p className="text-muted-foreground" dir="ltr">
            <span className="text-left">{project.student.email}</span>
          </p>
        </div>

        {/* Research topic - Truncate on mobile */}
        {project.researchTopic && (
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2 lg:text-base lg:line-clamp-none">
            נושא: {project.researchTopic}
          </p>
        )}
      </div>
    </header>
  )
}
