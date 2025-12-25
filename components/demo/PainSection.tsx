'use client'

/**
 * PainSection Component
 * Displays SPSS/Word screenshots to highlight the "before" state
 * Uses intentionally gray/clinical design to contrast with the solution
 */

import Image from 'next/image'

interface PainImageProps {
  src: string
  alt: string
  caption: string
}

function PainImage({ src, alt, caption }: PainImageProps) {
  return (
    <div className="bg-slate-100 rounded-lg border-2 border-slate-300 overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      {/* Image container */}
      <div className="relative aspect-[4/3] bg-slate-200">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain p-2"
        />
        {/* Overlay for "ugly" effect */}
        <div className="absolute inset-0 bg-slate-400/5" />
      </div>
      {/* Caption */}
      <div className="p-3 bg-slate-200 border-t-2 border-slate-300">
        <p className="text-sm text-slate-700 text-center font-medium">{caption}</p>
      </div>
    </div>
  )
}

export function PainSection() {
  const painImages: PainImageProps[] = [
    {
      src: '/demo/spss-correlation.svg',
      alt: 'SPSS Correlation Output',
      caption: 'טבלאות קורלציה מסובכות',
    },
    {
      src: '/demo/spss-regression.svg',
      alt: 'SPSS Regression Output',
      caption: 'פלט רגרסיה לא קריא',
    },
    {
      src: '/demo/messy-word-doc.svg',
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
