/**
 * useProject Hook
 * TanStack Query hook for fetching project metadata
 */

import { useQuery } from '@tanstack/react-query'
import type { ProjectData } from '@/lib/types/student'

export function useProject(projectId: string) {
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: async (): Promise<ProjectData> => {
      const response = await fetch(`/api/preview/${projectId}`)
      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || 'Failed to load project')
      }

      // Transform snake_case API response to camelCase
      const project = result.data.project
      return {
        id: project.id,
        name: project.name,
        student: {
          name: project.student.name,
          email: project.student.email,
        },
        researchTopic: project.research_topic || '',
        createdAt: project.created_at,
        viewCount: project.view_count,
        lastAccessed: project.last_accessed,
      }
    },
    staleTime: 1000 * 60 * 60, // 1 hour (project metadata rarely changes)
    gcTime: 1000 * 60 * 60 * 24, // 24 hours (keep in cache)
    retry: 1, // Only retry once on failure
  })
}
