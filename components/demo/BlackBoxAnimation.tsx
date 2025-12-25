'use client'

/**
 * BlackBoxAnimation Component
 * CSS-only gradient wave animation representing data processing
 * Creates a smooth transition between "before" and "after" sections
 */

export function BlackBoxAnimation() {
  return (
    <section
      className="relative h-[30vh] md:h-[40vh] overflow-hidden"
      dir="rtl"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
        {/* Animated wave overlay */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.4), transparent)',
            animation: 'wave 3s ease-in-out infinite',
          }}
        />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.5), transparent)',
            animation: 'wave 3s ease-in-out infinite 0.5s',
          }}
        />
        <div
          className="absolute inset-0 opacity-15"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.5), transparent)',
            animation: 'wave 3s ease-in-out infinite 1s',
          }}
        />
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full opacity-60 animate-pulse" />
        <div className="absolute top-1/2 left-1/3 w-1.5 h-1.5 bg-indigo-400 rounded-full opacity-50 animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-purple-400 rounded-full opacity-40 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/3 left-1/2 w-1 h-1 bg-blue-300 rounded-full opacity-70 animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-indigo-300 rounded-full opacity-50 animate-pulse" style={{ animationDelay: '0.8s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
        {/* Processing icon */}
        <div className="mb-6">
          <div className="relative">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-2xl">
              <svg
                className="w-8 h-8 md:w-10 md:h-10 text-white animate-spin"
                style={{ animationDuration: '3s' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 blur-xl opacity-50 -z-10 scale-150" />
          </div>
        </div>

        {/* Processing message */}
        <p className="text-xl md:text-2xl text-white font-medium text-center max-w-xl">
          מעובד באמצעות מערכת הניתוח הסטטיסטי שלנו
        </p>

        {/* Animated dots */}
        <div className="flex gap-1 mt-4">
          <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
          <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>

      {/* CSS animation keyframes */}
      <style jsx>{`
        @keyframes wave {
          0%, 100% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </section>
  )
}

export default BlackBoxAnimation
