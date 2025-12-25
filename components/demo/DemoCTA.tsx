'use client'

/**
 * DemoCTA Component
 * Call-to-action section for contacting via WhatsApp
 * Uses gradient background matching brand theme
 */

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface DemoCTAProps {
  /** WhatsApp phone number (without + or country code prefix in link) */
  whatsappNumber?: string
}

export function DemoCTA({
  whatsappNumber = '972587789019'
}: DemoCTAProps) {
  const whatsappUrl = `https://wa.me/${whatsappNumber}`
  const whatsappMessage = encodeURIComponent(
    'היי, ראיתי את הדמו של StatViz ואשמח לשמוע עוד על השירות!'
  )
  const whatsappUrlWithMessage = `${whatsappUrl}?text=${whatsappMessage}`

  return (
    <section className="py-16 md:py-24" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-12 md:p-16 text-center shadow-2xl relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-white rounded-full" />
              <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-white rounded-full" />
            </div>

            {/* Content */}
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                רוצה את זה עבור הלקוחות שלך?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
                הפוך את הפלטים הסטטיסטיים שלך לדוחות מקצועיים ומרשימים.
                הסטודנטים יקבלו חוויה טובה יותר, ואתה תחסוך זמן יקר.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href={whatsappUrlWithMessage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ size: 'lg' }),
                    'text-lg h-14 px-8 bg-white text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all min-w-[200px] flex items-center gap-2'
                  )}
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  שלח הודעה בוואטסאפ
                </a>

                <a
                  href="mailto:ahiya.butman@gmail.com"
                  className={cn(
                    buttonVariants({ size: 'lg', variant: 'outline' }),
                    'text-lg h-14 px-8 border-2 border-white/80 text-white bg-white/10 hover:bg-white/20 min-w-[200px] flex items-center'
                  )}
                >
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  שלח מייל
                </a>
              </div>

              {/* Trust indicators */}
              <div className="mt-10 pt-8 border-t border-white/20">
                <div className="flex flex-wrap justify-center gap-8 text-blue-100">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>ללא התחייבות</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>מענה מהיר</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    <span>אבטחה מלאה</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DemoCTA
