/**
 * HtmlIframe Component
 * Secure iframe wrapper for HTML report with loading states and error handling
 *
 * SECURITY CRITICAL:
 * - Sandbox: allow-scripts allow-same-origin (required for Plotly)
 * - No allow-forms, allow-popups, or allow-top-navigation
 * - Content served from session-validated API route
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'

interface HtmlIframeProps {
  projectId: string
}

export function HtmlIframe({ projectId }: HtmlIframeProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    // Timeout fallback if iframe doesn't load
    const timeout = setTimeout(() => {
      if (isLoading) {
        setHasError(true)
        setIsLoading(false)
      }
    }, 15000) // 15 second timeout

    return () => clearTimeout(timeout)
  }, [isLoading])

  function handleLoad() {
    setIsLoading(false)
    setHasError(false)
  }

  function handleError() {
    setIsLoading(false)
    setHasError(true)
  }

  function openInNewTab() {
    window.open(`/api/preview/${projectId}/html`, '_blank')
  }

  if (hasError) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px] p-8">
        <div className="text-center max-w-md">
          <p className="text-lg mb-4">לא ניתן להציג את הדוח בדפדפן</p>
          <p className="text-sm text-muted-foreground mb-6">
            ייתכן שהדוח גדול מדי או שיש בעיית רשת
          </p>
          <Button onClick={openInNewTab} size="lg" className="min-h-[44px]">
            פתח בחלון חדש
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full min-h-screen">
      {isLoading && (
        <div className="absolute inset-0 z-10 bg-white">
          <Skeleton className="w-full h-full" />
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-muted-foreground">טוען דוח...</p>
          </div>
        </div>
      )}

      <iframe
        ref={iframeRef}
        src={`/api/preview/${projectId}/html`}
        sandbox="allow-scripts allow-same-origin"
        className="w-full h-full min-h-screen border-0 lg:rounded-lg lg:border"
        title="Statistical Analysis Report"
        loading="lazy"
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  )
}
