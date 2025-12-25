export const runtime = 'nodejs'
import { NextResponse } from 'next/server'
import { SupabaseFileStorage } from '@/lib/storage'

/**
 * GET /api/demo/html
 *
 * Serve demo HTML report content.
 * NO authentication required - public access for demonstration.
 *
 * Always fetches from Supabase Storage: projects/demo/report.html
 * (Demo files are stored in Supabase, regardless of STORAGE_TYPE setting)
 * Returns HTML file with proper Content-Type header for browser rendering.
 */
export async function GET() {
  try {
    const projectId = 'demo'

    // Demo always uses Supabase storage (files are hosted there)
    const supabaseStorage = new SupabaseFileStorage()

    // Download HTML file from storage
    const htmlBuffer = await supabaseStorage.download(projectId, 'report.html')

    // Return HTML with proper headers
    // Disable ALL caching (browser + Vercel CDN) to ensure updates show immediately
    return new NextResponse(htmlBuffer.toString('utf-8'), {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'CDN-Cache-Control': 'no-store',
        'Vercel-CDN-Cache-Control': 'no-store',
      }
    })

  } catch (error) {
    console.error('GET /api/demo/html error:', error)

    // Return a user-friendly fallback message if demo file not found
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const isNotFound = errorMessage.includes('not found') || errorMessage.includes('404') || errorMessage.includes('download failed')

    if (isNotFound) {
      return new NextResponse(
        `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>StatViz Demo - Coming Soon</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0;
      padding: 20px;
    }
    .container {
      text-align: center;
      max-width: 500px;
      padding: 40px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    }
    h1 {
      color: #1e40af;
      margin-bottom: 16px;
    }
    p {
      color: #64748b;
      line-height: 1.6;
    }
    a {
      color: #4f46e5;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>דמו בקרוב</h1>
    <p>דוח הדמו עדיין לא הועלה למערכת.</p>
    <p>בינתיים, ניתן <a href="/">לחזור לדף הבית</a>.</p>
  </div>
</body>
</html>`,
        {
          status: 200,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
          }
        }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while serving demo HTML content'
        }
      },
      { status: 500 }
    )
  }
}
