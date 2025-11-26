/**
 * Student UI TypeScript Interfaces
 * Shared types for student-facing components
 */

export interface SessionState {
  authenticated: boolean
  loading: boolean
  error: string | null
}

export interface ProjectData {
  id: string
  name: string
  student: {
    name: string
    email: string
  }
  researchTopic: string
  createdAt: string
  viewCount: number
  lastAccessed: string | null
}

export interface PasswordFormData {
  password: string
}
