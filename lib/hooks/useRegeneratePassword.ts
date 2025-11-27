import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

interface RegeneratePasswordResponse {
  password: string
}

async function regeneratePassword(projectId: string): Promise<RegeneratePasswordResponse> {
  const response = await fetch(`/api/admin/projects/${projectId}/password`, {
    method: 'POST',
    credentials: 'include',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Failed to regenerate password')
  }

  const result = await response.json()
  return result.data
}

export function useRegeneratePassword() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: regeneratePassword,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'שגיאה ביצירת סיסמה חדשה')
    },
  })
}
