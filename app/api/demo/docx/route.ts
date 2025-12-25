export const runtime = 'nodejs'
import { NextResponse } from 'next/server'
import { SupabaseFileStorage } from '@/lib/storage'

/**
 * GET /api/demo/docx
 *
 * Serve demo DOCX report for download.
 * NO authentication required - public access for demonstration.
 *
 * Always fetches from Supabase Storage: projects/demo/report.docx
 * Returns DOCX file with proper Content-Type header for download.
 */
export async function GET() {
  try {
    const projectId = 'demo'

    // Demo always uses Supabase storage (files are hosted there)
    const supabaseStorage = new SupabaseFileStorage()

    // Download DOCX file from storage
    const docxBuffer = await supabaseStorage.download(projectId, 'report.docx')

    // Return DOCX with proper headers for download
    return new NextResponse(docxBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': 'attachment; filename="StatViz_demo_report.docx"',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      }
    })

  } catch (error) {
    console.error('GET /api/demo/docx error:', error)

    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const isNotFound = errorMessage.includes('not found') || errorMessage.includes('404') || errorMessage.includes('download failed')

    if (isNotFound) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Demo DOCX file not found'
          }
        },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while serving demo DOCX content'
        }
      },
      { status: 500 }
    )
  }
}
