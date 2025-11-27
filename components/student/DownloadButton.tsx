/**
 * DownloadButton Component
 *
 * Triggers DOCX download with mobile-optimized placement and loading feedback.
 *
 * Mobile: Fixed bottom bar (thumb-reachable)
 * Desktop: Absolute top-right positioning
 * Touch target: 44px minimum height (Apple/Android guidelines)
 * Gradient variant with shadow-glow effect (Iteration 2 enhancement)
 */

'use client'

import { Download, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useState } from 'react'

export interface DownloadButtonProps {
  projectId: string
  projectName: string
}

export function DownloadButton({ projectId, projectName }: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    setIsDownloading(true)

    try {
      const response = await fetch(`/api/preview/${projectId}/download`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || 'שגיאה בהורדת הקובץ')
      }

      // Get the blob and create download link
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url

      // Use project name for filename
      const sanitizedName = projectName
        .replace(/[^a-zA-Z0-9\u0590-\u05FF\s-]/g, '')
        .replace(/\s+/g, '_')
        .substring(0, 50) || 'findings'

      a.download = `${sanitizedName}_findings.docx`
      document.body.appendChild(a)
      a.click()

      // Cleanup
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      toast.success('הקובץ הורד בהצלחה')
    } catch (error) {
      console.error('Download error:', error)
      toast.error(error instanceof Error ? error.message : 'שגיאה בהורדת הקובץ. אנא נסה שוב')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Button
      onClick={handleDownload}
      disabled={isDownloading}
      variant="gradient"
      size="lg"
      className="
        min-h-[44px]
        fixed bottom-6 left-6 right-6 z-50 shadow-glow
        md:absolute md:bottom-auto md:top-6 md:left-auto md:right-6 md:w-auto
        hover:shadow-xl transition-all duration-200
      "
    >
      {isDownloading ? (
        <>
          <Loader2 className="ml-2 h-5 w-5 animate-spin" />
          מוריד...
        </>
      ) : (
        <>
          <Download className="ml-2 h-5 w-5" />
          הורד מסמך מלא
        </>
      )}
    </Button>
  )
}
