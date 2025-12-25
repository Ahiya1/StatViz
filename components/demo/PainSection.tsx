'use client'

/**
 * PainSection Component
 * Displays SPSS/Word screenshots to highlight the "before" state
 * Uses intentionally gray/clinical design to contrast with the solution
 */

interface PainImageProps {
  src: string
  alt: string
  caption: string
}

function PainImage({ src: _src, alt, caption }: PainImageProps) {
  return (
    <div className="bg-slate-100 rounded-lg border border-slate-200 overflow-hidden">
      {/* Image container with placeholder styling */}
      <div className="relative aspect-[4/3] bg-slate-200">
        {/* Placeholder for actual SPSS/Word screenshots */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-4">
            <div className="w-16 h-16 mx-auto mb-3 bg-slate-300 rounded-lg flex items-center justify-center">
              <svg
                className="w-8 h-8 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p className="text-sm text-slate-500">{alt}</p>
          </div>
        </div>
        {/* Uncomment when actual images are added:
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
        />
        */}
      </div>
      {/* Caption */}
      <div className="p-3 bg-slate-50 border-t border-slate-200">
        <p className="text-sm text-slate-600 text-center">{caption}</p>
      </div>
    </div>
  )
}

export function PainSection() {
  const painImages: PainImageProps[] = [
    {
      src: '/demo/spss-correlation.webp',
      alt: 'SPSS Correlation Output',
      caption: 'טבלאות קורלציה מסובכות',
    },
    {
      src: '/demo/spss-regression.webp',
      alt: 'SPSS Regression Output',
      caption: 'פלט רגרסיה לא קריא',
    },
    {
      src: '/demo/messy-word-doc.webp',
      alt: 'Messy Word Document',
      caption: 'מסמך וורד לא מעוצב',
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-slate-50" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            מה הסטודנטים מקבלים היום?
          </h2>
          <p className="text-lg text-slate-600">
            פלטים לא קריאים, טבלאות מסובכות, ומסמכים שקשה להבין
          </p>
        </div>

        {/* 3-column grid on desktop, stack on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {painImages.map((image, index) => (
            <PainImage
              key={index}
              src={image.src}
              alt={image.alt}
              caption={image.caption}
            />
          ))}
        </div>

        {/* Pain emphasis text */}
        <div className="mt-12 text-center">
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            הסטודנטים מתקשים להבין את התוצאות, מבזבזים זמן על פרשנות,
            ומתסכלים מהפלטים הטכניים
          </p>
        </div>
      </div>
    </section>
  )
}

export default PainSection
