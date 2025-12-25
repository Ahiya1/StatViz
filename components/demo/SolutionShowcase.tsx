'use client'

/**
 * SolutionShowcase Component
 * Displays the beautiful HTML report output with luxury styling
 * Reuses pattern from HtmlIframe component
 */

import { useState, useEffect, useRef } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'

export function SolutionShowcase() {
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

  function openFullscreen() {
    window.open('/api/demo/html', '_blank')
  }

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-slate-50" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="inline-block mb-4 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            הפתרון
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            מה הסטודנטים מקבלים עם StatViz
          </h2>
          <p className="text-lg text-slate-600">
            דוחות מקצועיים, ברורים וקלים להבנה - בלחיצת כפתור
          </p>
        </div>

        {/* Report showcase container with luxury styling */}
        <div className="max-w-5xl mx-auto">
          <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            {/* Browser-like header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-100 border-b border-slate-200">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-white rounded-md px-3 py-1.5 text-sm text-slate-500 text-center border border-slate-200">
                  statviz.xyz/preview/demo-report
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={openFullscreen}
                className="text-slate-600 hover:text-slate-900"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                פתח במסך מלא
              </Button>
            </div>

            {/* Iframe container */}
            <div className="relative h-[500px] md:h-[600px]">
              {isLoading && (
                <div className="absolute inset-0 z-10 bg-white">
                  <Skeleton className="w-full h-full" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-white animate-pulse"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <p className="text-slate-600">טוען דוח לדוגמה...</p>
                    </div>
                  </div>
                </div>
              )}

              {hasError ? (
                <div className="flex items-center justify-center h-full p-8">
                  <div className="text-center max-w-md">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-slate-100 flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                    </div>
                    <p className="text-lg mb-4 text-slate-700">לא ניתן להציג את הדוח</p>
                    <p className="text-sm text-slate-500 mb-6">
                      ייתכן שהדוח לדוגמה עדיין לא הוגדר במערכת
                    </p>
                    <Button onClick={openFullscreen} variant="gradient">
                      נסה לפתוח בחלון חדש
                    </Button>
                  </div>
                </div>
              ) : (
                <iframe
                  ref={iframeRef}
                  src="/api/demo/html"
                  sandbox="allow-scripts allow-same-origin"
                  className="w-full h-full border-0"
                  title="Demo Statistical Analysis Report"
                  loading="lazy"
                  onLoad={handleLoad}
                  onError={handleError}
                />
              )}
            </div>
          </div>

          {/* Feature highlights below the showcase */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="text-center p-4">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-blue-100 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">גרפים אינטראקטיביים</h3>
              <p className="text-sm text-slate-600">ויזואליזציות מתקדמות עם Plotly</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-indigo-100 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">טבלאות מעוצבות</h3>
              <p className="text-sm text-slate-600">תוצאות ברורות וקריאות</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-purple-100 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">פרשנות מובנית</h3>
              <p className="text-sm text-slate-600">הסברים בעברית פשוטה</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SolutionShowcase
