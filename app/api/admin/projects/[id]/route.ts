export const runtime = 'nodejs'
import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/auth/middleware'
import { prisma } from '@/lib/db/client'
import { fileStorage } from '@/lib/storage'
import { LocalFileStorage } from '@/lib/storage/local'
import { validateFileSize, validateHtmlSelfContained } from '@/lib/upload/validator'

/**
 * GET /api/admin/projects/[id] - Get project details
 *
 * Returns full project metadata for a specific project
 * Requires admin authentication
 *
 * Response:
 * {
 *   success: true,
 *   data: {
 *     project: {
 *       projectId: string,
 *       projectName: string,
 *       studentName: string,
 *       studentEmail: string,
 *       researchTopic: string,
 *       createdAt: string,
 *       createdBy: string,
 *       docxUrl: string,
 *       htmlUrl: string,
 *       viewCount: number,
 *       lastAccessed: string | null,
 *       deletedAt: string | null
 *     }
 *   }
 * }
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const authError = await requireAdminAuth(req)
    if (authError) return authError

    const projectId = params.id

    // Fetch project
    const project = await prisma.project.findUnique({
      where: { projectId }
    })

    // Check if project exists and is not deleted
    if (!project || project.deletedAt) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'PROJECT_NOT_FOUND',
            message: 'Project not found'
          }
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { project }
    })

  } catch (error) {
    console.error(`GET /api/admin/projects/${params.id} error:`, error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Internal server error'
        }
      },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/projects/[id] - Update project metadata and/or files
 *
 * Updates project metadata (name, student info, research topic) and optionally replaces files
 * Requires admin authentication
 *
 * Request (multipart/form-data):
 * - project_name?: string
 * - student_name?: string
 * - student_email?: string
 * - research_topic?: string
 * - docx_file?: File (optional - replaces existing DOCX)
 * - html_file?: File (optional - replaces existing HTML)
 *
 * Response:
 * {
 *   success: true,
 *   data: {
 *     project: { ...updated project data },
 *     htmlWarnings?: string[]
 *   }
 * }
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const authError = await requireAdminAuth(req)
    if (authError) return authError

    const projectId = params.id

    // Fetch project first to ensure it exists
    const project = await prisma.project.findUnique({
      where: { projectId }
    })

    if (!project || project.deletedAt) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'PROJECT_NOT_FOUND',
            message: 'Project not found'
          }
        },
        { status: 404 }
      )
    }

    // Parse multipart form data
    const formData = await req.formData()

    const projectName = formData.get('project_name') as string | null
    const studentName = formData.get('student_name') as string | null
    const studentEmail = formData.get('student_email') as string | null
    const researchTopic = formData.get('research_topic') as string | null
    const docxFile = formData.get('docx_file') as File | null
    const htmlFile = formData.get('html_file') as File | null

    // Build update data - only include fields that were provided
    const updateData: {
      projectName?: string
      studentName?: string
      studentEmail?: string
      researchTopic?: string
      docxUrl?: string
      htmlUrl?: string
    } = {}

    let htmlWarnings: string[] = []

    if (projectName !== null && projectName !== '') {
      if (projectName.trim().length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Project name must be a non-empty string'
            }
          },
          { status: 400 }
        )
      }
      updateData.projectName = projectName.trim()
    }

    if (studentName !== null && studentName !== '') {
      if (studentName.trim().length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Student name must be a non-empty string'
            }
          },
          { status: 400 }
        )
      }
      updateData.studentName = studentName.trim()
    }

    if (studentEmail !== null && studentEmail !== '') {
      if (!studentEmail.includes('@')) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Invalid email format'
            }
          },
          { status: 400 }
        )
      }
      updateData.studentEmail = studentEmail.trim()
    }

    if (researchTopic !== null && researchTopic !== '') {
      if (researchTopic.trim().length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Research topic must be a non-empty string'
            }
          },
          { status: 400 }
        )
      }
      updateData.researchTopic = researchTopic.trim()
    }

    // Handle DOCX file upload
    if (docxFile && docxFile.size > 0) {
      const docxBuffer = Buffer.from(await docxFile.arrayBuffer())

      // Validate file size
      try {
        validateFileSize(docxBuffer)
      } catch {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'FILE_VALIDATION_ERROR',
              message: 'DOCX file exceeds maximum size (50MB)'
            }
          },
          { status: 400 }
        )
      }

      // Delete old file and upload new one
      try {
        await fileStorage.delete(projectId, 'findings.docx')
      } catch {
        // Ignore - file may not exist
      }

      const docxUrl = await fileStorage.upload(projectId, 'findings.docx', docxBuffer)
      updateData.docxUrl = docxUrl
    }

    // Handle HTML file upload
    console.log(`[PUT ${projectId}] HTML file check:`, {
      hasFile: !!htmlFile,
      fileName: htmlFile?.name,
      fileSize: htmlFile?.size,
      fileType: htmlFile?.type,
    })

    if (htmlFile && htmlFile.size > 0) {
      console.log(`[PUT ${projectId}] Processing HTML file upload...`)
      const htmlBuffer = Buffer.from(await htmlFile.arrayBuffer())
      console.log(`[PUT ${projectId}] HTML buffer size:`, htmlBuffer.length)

      // Validate file size
      try {
        validateFileSize(htmlBuffer)
      } catch {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'FILE_VALIDATION_ERROR',
              message: 'HTML file exceeds maximum size (50MB)'
            }
          },
          { status: 400 }
        )
      }

      // Validate HTML content
      const htmlValidation = validateHtmlSelfContained(htmlBuffer.toString('utf-8'))
      htmlWarnings = htmlValidation.warnings

      // Delete old file and upload new one
      try {
        console.log(`[PUT ${projectId}] Deleting old HTML file...`)
        await fileStorage.delete(projectId, 'report.html')
        console.log(`[PUT ${projectId}] Old HTML file deleted`)
      } catch (deleteErr) {
        console.log(`[PUT ${projectId}] Delete failed (may not exist):`, deleteErr)
      }

      console.log(`[PUT ${projectId}] Uploading new HTML file...`)
      const htmlUrl = await fileStorage.upload(projectId, 'report.html', htmlBuffer)
      console.log(`[PUT ${projectId}] HTML uploaded successfully:`, htmlUrl)
      updateData.htmlUrl = htmlUrl
    }

    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'No valid fields provided for update'
          }
        },
        { status: 400 }
      )
    }

    // Update the project
    const updatedProject = await prisma.project.update({
      where: { projectId },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      data: {
        project: updatedProject,
        ...(htmlWarnings.length > 0 && { htmlWarnings })
      }
    })

  } catch (error) {
    console.error(`PUT /api/admin/projects/${params.id} error:`, error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to update project'
        }
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/projects/[id] - Delete project
 *
 * Soft deletes the project (sets deletedAt timestamp) and removes files from storage
 * Requires admin authentication
 *
 * Process:
 * 1. Soft delete database record (set deletedAt)
 * 2. Delete files from storage (findings.docx, report.html)
 * 3. Delete all project sessions (students can't access anymore)
 *
 * If file deletion fails, logs error but doesn't rollback DB
 * (files can be cleaned up manually)
 *
 * Response:
 * {
 *   success: true,
 *   data: {
 *     message: 'Project deleted successfully'
 *   }
 * }
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const authError = await requireAdminAuth(req)
    if (authError) return authError

    const projectId = params.id

    // Fetch project first to ensure it exists
    const project = await prisma.project.findUnique({
      where: { projectId }
    })

    if (!project || project.deletedAt) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'PROJECT_NOT_FOUND',
            message: 'Project not found or already deleted'
          }
        },
        { status: 404 }
      )
    }

    // Step 1: Soft delete database record
    await prisma.project.update({
      where: { projectId },
      data: { deletedAt: new Date() }
    })

    // Step 2: Delete project sessions (students can't access anymore)
    await prisma.projectSession.deleteMany({
      where: { projectId }
    })

    // Step 3: Delete files from storage
    // Use deleteProject method if available (LocalFileStorage), otherwise delete individual files
    try {
      if (fileStorage instanceof LocalFileStorage) {
        // Delete entire project directory (more efficient)
        await fileStorage.deleteProject(projectId)
      } else {
        // Delete individual files (S3 implementation)
        await fileStorage.delete(projectId, 'findings.docx')
        await fileStorage.delete(projectId, 'report.html')
      }
    } catch (fileError) {
      console.error(`File deletion error for project ${projectId}:`, fileError)
      // Log but don't fail - files can be cleaned up manually
      // The database record is already soft-deleted, which is the critical operation
    }

    return NextResponse.json({
      success: true,
      data: {
        message: 'Project deleted successfully'
      }
    })

  } catch (error) {
    console.error(`DELETE /api/admin/projects/${params.id} error:`, error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to delete project'
        }
      },
      { status: 500 }
    )
  }
}
