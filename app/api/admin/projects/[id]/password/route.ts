export const runtime = 'nodejs'
import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/auth/middleware'
import { prisma } from '@/lib/db/client'
import { generatePassword } from '@/lib/utils/password'
import bcrypt from 'bcryptjs'

/**
 * POST /api/admin/projects/[id]/password - Regenerate project password
 *
 * Generates a new random password for the project and updates the database.
 * Requires admin authentication.
 *
 * Response:
 * - 200: { success: true, data: { password: string } }
 * - 404: { success: false, error: { code: 'NOT_FOUND', message: 'Project not found' } }
 * - 500: { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to regenerate password' } }
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const authError = await requireAdminAuth(req)
    if (authError) return authError

    const projectId = params.id

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { projectId },
      select: { projectId: true, deletedAt: true }
    })

    if (!project || project.deletedAt) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Project not found'
          }
        },
        { status: 404 }
      )
    }

    // Generate new password
    const newPassword = generatePassword()
    const passwordHash = await bcrypt.hash(newPassword, 10)

    // Update project password
    await prisma.project.update({
      where: { projectId },
      data: { passwordHash }
    })

    return NextResponse.json({
      success: true,
      data: {
        password: newPassword
      }
    })

  } catch (error) {
    console.error(`POST /api/admin/projects/${params.id}/password error:`, error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to regenerate password'
        }
      },
      { status: 500 }
    )
  }
}
