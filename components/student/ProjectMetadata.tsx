/**
 * ProjectMetadata Component
 * Display project information in a mobile-responsive header
 *
 * Features:
 * - Hebrew RTL layout
 * - Email displays in LTR (mixed content handling)
 * - Research topic truncates on mobile, full on desktop
 * - Responsive padding and typography
 * - Professional typography hierarchy (Iteration 2 enhancement)
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
    <header className="bg-white border-b p-4 lg:p-6 shadow-soft" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Project name - Enhanced typography scale */}
        <h1 className="text-xl font-bold mb-2 md:text-2xl lg:text-3xl lg:mb-3 text-slate-900">
          {project.name}
        </h1>

        {/* Metadata - Stack on mobile, row on desktop with improved spacing */}
        <div className="flex flex-col space-y-1 lg:flex-row lg:gap-6 lg:space-y-0">
          <p className="text-sm lg:text-base text-slate-600">
            סטודנט: <span className="text-slate-900 font-medium">{project.student.name}</span>
          </p>

          <p className="text-sm lg:text-base text-slate-600">
            {/* Email with LTR direction and monospace font for technical distinction */}
            <span dir="ltr" className="font-mono text-slate-700">{project.student.email}</span>
          </p>
        </div>

        {/* Research topic - Truncate on mobile */}
        {project.researchTopic && (
          <p className="text-sm text-slate-600 mt-3 lg:mt-4 line-clamp-2 lg:text-base lg:line-clamp-none max-w-3xl">
            נושא: {project.researchTopic}
          </p>
        )}
      </div>
    </header>
  )
}
