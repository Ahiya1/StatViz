export const runtime = 'nodejs'
import { NextResponse } from 'next/server'
import { SupabaseFileStorage } from '@/lib/storage'

/**
 * GET /api/demo/download
 *
 * Download demo DOCX findings file.
 * NO authentication required - public access for demonstration.
 *
 * Always fetches from Supabase Storage: projects/demo/findings.docx
 * (Demo files are stored in Supabase, regardless of STORAGE_TYPE setting)
 * Returns DOCX file with attachment headers to trigger browser download.
 */
export async function GET() {
  try {
    const projectId = 'demo'

    // Demo always uses Supabase storage (files are hosted there)
    const supabaseStorage = new SupabaseFileStorage()

    // Download DOCX file from storage
    const docxBuffer = await supabaseStorage.download(projectId, 'findings.docx')

    // Return DOCX with download headers (convert Buffer to Uint8Array)
    return new NextResponse(new Uint8Array(docxBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': 'attachment; filename="demo-findings.docx"',
        'Cache-Control': 'private, max-age=3600', // Cache for 1 hour
      }
    })

  } catch (error) {
    console.error('GET /api/demo/download error:', error)

    // Check if file not found
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const isNotFound = errorMessage.includes('not found') || errorMessage.includes('404') || errorMessage.includes('download failed')

    if (isNotFound) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FILE_NOT_FOUND',
            message: 'Demo file not available yet'
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
          message: 'An error occurred while downloading demo file'
        }
      },
      { status: 500 }
    )
  }
}
