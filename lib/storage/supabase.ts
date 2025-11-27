/**
 * Supabase Storage Implementation
 *
 * Uses Supabase Storage for file uploads in production (Vercel-compatible).
 * Files are stored in a bucket organized by project ID.
 *
 * Setup:
 * 1. Create a bucket called 'projects' in Supabase Storage
 * 2. Set bucket to Public (or use signed URLs)
 * 3. Configure environment variables: SUPABASE_URL, SUPABASE_SERVICE_KEY
 */

import { createClient } from '@supabase/supabase-js'
import { FileStorage } from './interface'

export class SupabaseFileStorage implements FileStorage {
  private supabase

  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
    }

    this.supabase = createClient(supabaseUrl, supabaseKey)
  }

  async upload(projectId: string, filename: string, buffer: Buffer): Promise<string> {
    const filePath = `${projectId}/${filename}`

    const { error } = await this.supabase.storage
      .from('projects')
      .upload(filePath, buffer, {
        contentType: filename.endsWith('.docx')
          ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          : 'text/html',
        upsert: true, // Overwrite if exists
      })

    if (error) {
      throw new Error(`Supabase upload failed: ${error.message}`)
    }

    return filePath
  }

  async download(projectId: string, filename: string): Promise<Buffer> {
    const filePath = `${projectId}/${filename}`

    const { data, error } = await this.supabase.storage
      .from('projects')
      .download(filePath)

    if (error) {
      throw new Error(`Supabase download failed: ${error.message}`)
    }

    // Convert Blob to Buffer
    const arrayBuffer = await data.arrayBuffer()
    return Buffer.from(arrayBuffer)
  }

  async delete(projectId: string, filename: string): Promise<void> {
    const filePath = `${projectId}/${filename}`

    const { error } = await this.supabase.storage
      .from('projects')
      .remove([filePath])

    if (error) {
      throw new Error(`Supabase delete failed: ${error.message}`)
    }
  }

  async deleteProject(projectId: string): Promise<void> {
    // List all files in the project folder
    const { data: files, error: listError } = await this.supabase.storage
      .from('projects')
      .list(projectId)

    if (listError) {
      throw new Error(`Failed to list files: ${listError.message}`)
    }

    if (!files || files.length === 0) {
      return // No files to delete
    }

    // Delete all files
    const filePaths = files.map((file) => `${projectId}/${file.name}`)
    const { error: deleteError } = await this.supabase.storage
      .from('projects')
      .remove(filePaths)

    if (deleteError) {
      throw new Error(`Failed to delete project files: ${deleteError.message}`)
    }
  }

  getUrl(projectId: string, filename: string): string {
    const filePath = `${projectId}/${filename}`

    // Get public URL (requires bucket to be public)
    const { data } = this.supabase.storage
      .from('projects')
      .getPublicUrl(filePath)

    return data.publicUrl
  }

  /**
   * Get a signed URL for private access (1 hour expiry)
   * Use this if your bucket is private
   */
  async getSignedUrl(projectId: string, filename: string, expiresIn = 3600): Promise<string> {
    const filePath = `${projectId}/${filename}`

    const { data, error } = await this.supabase.storage
      .from('projects')
      .createSignedUrl(filePath, expiresIn)

    if (error) {
      throw new Error(`Failed to create signed URL: ${error.message}`)
    }

    return data.signedUrl
  }
}
