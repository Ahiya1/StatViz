/**
 * useProjectAuth Hook
 *
 * Client-side hook for checking and managing project session state.
 * Checks if user has valid session on mount and provides refetch function.
 */

'use client'

import { useState, useEffect } from 'react'
import type { SessionState } from '@/lib/types/student'

export function useProjectAuth(projectId: string) {
  const [session, setSession] = useState<SessionState>({
    authenticated: false,
    loading: true,
    error: null,
  })

  useEffect(() => {
    checkSession()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId])

  async function checkSession() {
    try {
      const response = await fetch(`/api/preview/${projectId}`)
      const data = await response.json()

      if (response.ok && data.success) {
        setSession({ authenticated: true, loading: false, error: null })
      } else if (response.status === 401) {
        // Not authenticated - expected state, not an error
        setSession({ authenticated: false, loading: false, error: null })
      } else {
        // Other errors (404, 500, etc)
        setSession({
          authenticated: false,
          loading: false,
          error: data.error?.message || 'שגיאה בטעינת הפרויקט',
        })
      }
    } catch (error) {
      setSession({
        authenticated: false,
        loading: false,
        error: 'שגיאת רשת. אנא בדוק את החיבור לאינטרנט.',
      })
    }
  }

  return { session, refetchSession: checkSession }
}
