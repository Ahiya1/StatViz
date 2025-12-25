'use client'

/**
 * DocxShowcase Component
 * Displays a preview/download section for the Word document output
 */

import { FileText, Download, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function DocxShowcase() {
  function handleDownload() {
    window.open('/api/demo/docx', '_blank')
  }

  return (
    <section className="py-16 md:py-24 bg-white" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="inline-block mb-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            גם מסמך וורד
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            מסמך Word מוכן להגשה
          </h2>
          <p className="text-lg text-slate-600">
            בנוסף לדוח האינטראקטיבי, הסטודנטים מקבלים מסמך Word מעוצב ומוכן להגשה
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Document Preview */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Word-like header */}
                <div className="bg-[#2b579a] px-4 py-2 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-white" />
                  <span className="text-white text-sm font-medium">demo_report.docx</span>
                </div>

                {/* Document content preview */}
                <div className="p-6 space-y-4 text-right" dir="rtl">
                  <h3 className="text-xl font-bold text-slate-900 text-center">דוח ניתוח סטטיסטי</h3>
                  <p className="text-sm text-slate-500 text-center">
                    הקשר בין שימוש ברשתות חברתיות לבין דימוי גוף ודיכאון
                  </p>

                  <hr className="border-slate-200" />

                  <div>
                    <h4 className="font-semibold text-slate-800 mb-2">רקע המחקר</h4>
                    <p className="text-sm text-slate-600 line-clamp-2">
                      מחקר זה בחן את הקשר בין שימוש ברשתות חברתיות, דימוי גוף ודיכאון בקרב מתבגרים בישראל...
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-800 mb-2">תיאור המדגם</h4>
                    <p className="text-sm text-slate-600 line-clamp-2">
                      במחקר השתתפו 180 מתבגרים (90 בנים, 90 בנות) בגילאי 13-18...
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded p-3">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-slate-500">
                          <th className="text-right pb-1">משתנה</th>
                          <th className="text-center pb-1">M</th>
                          <th className="text-center pb-1">SD</th>
                        </tr>
                      </thead>
                      <tbody className="text-slate-700">
                        <tr>
                          <td>שימוש ברשתות</td>
                          <td className="text-center">3.24</td>
                          <td className="text-center">0.89</td>
                        </tr>
                        <tr>
                          <td>דימוי גוף</td>
                          <td className="text-center">3.12</td>
                          <td className="text-center">0.76</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="text-center pt-2">
                    <span className="text-xs text-slate-400">...המשך המסמך...</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Features and Download */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">מעוצב ב-APA</h4>
                    <p className="text-sm text-slate-600">עיצוב מקצועי לפי כללי ה-APA להגשה אקדמית</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">טבלאות מוכנות</h4>
                    <p className="text-sm text-slate-600">כל הטבלאות מעוצבות ומוכנות להעתקה</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">פרשנות מובנית</h4>
                    <p className="text-sm text-slate-600">כל תוצאה כוללת הסבר והמלצה לפרשנות</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">תמיכה בעברית</h4>
                    <p className="text-sm text-slate-600">כיוון טקסט נכון ותמיכה מלאה בעברית</p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleDownload}
                size="lg"
                className="w-full gap-2 bg-[#2b579a] hover:bg-[#1e3f6f]"
              >
                <Download className="h-5 w-5" />
                הורד מסמך לדוגמה
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DocxShowcase
