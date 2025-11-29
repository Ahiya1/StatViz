'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { Project, ProjectsListResponse } from '@/lib/types/admin'

export interface UpdateProjectData {
  projectName?: string
  studentName?: string
  studentEmail?: string
  researchTopic?: string
  docxFile?: File | null
  htmlFile?: File | null
}

interface UpdateProjectResponse {
  success: boolean
  data?: {
    project: Project
    htmlWarnings?: string[]
  }
  error?: {
    code: string
    message: string
  }
}

async function updateProject(
  projectId: string,
  data: UpdateProjectData
): Promise<{ project: Project; htmlWarnings?: string[] }> {
  // Use FormData to support file uploads
  const formData = new FormData()

  if (data.projectName) {
    formData.append('project_name', data.projectName)
  }
  if (data.studentName) {
    formData.append('student_name', data.studentName)
  }
  if (data.studentEmail) {
    formData.append('student_email', data.studentEmail)
  }
  if (data.researchTopic) {
    formData.append('research_topic', data.researchTopic)
  }
  if (data.docxFile) {
    formData.append('docx_file', data.docxFile)
  }
  if (data.htmlFile) {
    formData.append('html_file', data.htmlFile)
  }

  const response = await fetch(`/api/admin/projects/${projectId}`, {
    method: 'PUT',
    credentials: 'include',
    body: formData,
  })

  const result: UpdateProjectResponse = await response.json()

  if (!response.ok || !result.success || !result.data) {
    throw new Error(result.error?.message || 'Failed to update project')
  }

  return result.data
}

export function useUpdateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: UpdateProjectData }) =>
      updateProject(projectId, data),
    onMutate: async ({ projectId, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['projects'] })

      // Snapshot previous value
      const previousData = queryClient.getQueryData<ProjectsListResponse>(['projects'])

      // Optimistically update UI (only metadata, not files)
      queryClient.setQueryData<ProjectsListResponse>(['projects'], (old) => {
        if (!old) return old
        return {
          ...old,
          projects: old.projects.map((p: Project) =>
            p.projectId === projectId
              ? {
                  ...p,
                  ...(data.projectName && { projectName: data.projectName }),
                  ...(data.studentName && { studentName: data.studentName }),
                  ...(data.studentEmail && { studentEmail: data.studentEmail }),
                  ...(data.researchTopic && { researchTopic: data.researchTopic }),
                }
              : p
          ),
        }
      })

      return { previousData }
    },
    onError: (_error, _variables, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(['projects'], context.previousData)
      }
      toast.error('שגיאה בעדכון הפרויקט')
    },
    onSuccess: (result) => {
      toast.success('הפרויקט עודכן בהצלחה')

      // Show warnings if any
      if (result.htmlWarnings && result.htmlWarnings.length > 0) {
        result.htmlWarnings.forEach(warning => {
          toast.warning(warning, { duration: 5000 })
        })
      }
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}
