'use client'

/**
 * Demo Page
 * Showcases the StatViz transformation from ugly SPSS output to beautiful reports
 * Designed to convert potential B2B customers (statisticians, tutors)
 */

import { BarChart3, ArrowLeft, FileSpreadsheet, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PainSection, BlackBoxAnimation, SolutionShowcase, DocxShowcase, DemoCTA } from '@/components/demo'

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  StatViz
                </h1>
                <p className="text-xs text-slate-600">דמו אינטראקטיבי</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => window.location.href = '/'}
            >
              <ArrowLeft className="h-4 w-4" />
              חזרה לאתר
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
              דמו אינטראקטיבי
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              ראה מה הסטודנטים שלך
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                מקבלים
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto">
              במקום פלטים יבשים ומסובכים מ-SPSS,
              הסטודנטים שלך יקבלו דוחות מעוצבים, ברורים ומקצועיים
            </p>

            {/* Scroll indicator */}
            <div className="flex flex-col items-center gap-2 animate-bounce">
              <span className="text-sm text-slate-500">גלול למטה לראות את ההבדל</span>
              <svg
                className="w-6 h-6 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Section - SPSS Screenshots */}
      <PainSection />

      {/* Input Preview Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              מה אתה מעלה למערכת?
            </h2>
            <p className="text-lg text-slate-600">
              קובץ אקסל עם הנתונים וההשערות שלך - זה הכל!
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Excel File */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                    <FileSpreadsheet className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">קובץ נתונים</h3>
                    <p className="text-sm text-slate-600">Excel / CSV</p>
                  </div>
                </div>
                {/* Sample Excel preview */}
                <div className="bg-white rounded-lg border border-green-200 overflow-hidden">
                  <div className="bg-green-100 px-4 py-2 border-b border-green-200">
                    <span className="text-sm text-green-700 font-medium">data.xlsx</span>
                  </div>
                  <div className="p-4 font-mono text-sm">
                    <table className="w-full text-right">
                      <thead>
                        <tr className="text-slate-500">
                          <th className="pb-2">ID</th>
                          <th className="pb-2">Age</th>
                          <th className="pb-2">Score</th>
                          <th className="pb-2">Group</th>
                        </tr>
                      </thead>
                      <tbody className="text-slate-700">
                        <tr><td>1</td><td>25</td><td>78</td><td>A</td></tr>
                        <tr><td>2</td><td>32</td><td>85</td><td>B</td></tr>
                        <tr><td>3</td><td>28</td><td>72</td><td>A</td></tr>
                        <tr className="text-slate-400"><td>...</td><td>...</td><td>...</td><td>...</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Hypotheses */}
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-8 border border-purple-200">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                    <FileText className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">השערות מחקר</h3>
                    <p className="text-sm text-slate-600">מה לבדוק?</p>
                  </div>
                </div>
                {/* Sample hypotheses */}
                <div className="bg-white rounded-lg border border-purple-200 overflow-hidden">
                  <div className="bg-purple-100 px-4 py-2 border-b border-purple-200">
                    <span className="text-sm text-purple-700 font-medium">hypotheses.txt</span>
                  </div>
                  <div className="p-4 space-y-3 text-sm text-slate-700">
                    <div className="flex gap-2">
                      <span className="text-purple-600 font-bold">H1:</span>
                      <span>קורלציה בין גיל לציון</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-purple-600 font-bold">H2:</span>
                      <span>הבדל בציון בין קבוצות</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-purple-600 font-bold">H3:</span>
                      <span>רגרסיה מרובה לניבוי</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Black Box Animation */}
      <BlackBoxAnimation />

      {/* Solution Showcase */}
      <SolutionShowcase />

      {/* DOCX Showcase */}
      <DocxShowcase />

      {/* CTA Section */}
      <DemoCTA />

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-slate-600">
            <p className="mb-2">&copy; 2024 StatViz. כל הזכויות שמורות.</p>
            <p className="text-sm">פלטפורמה מקצועית לניתוח נתונים סטטיסטיים</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
