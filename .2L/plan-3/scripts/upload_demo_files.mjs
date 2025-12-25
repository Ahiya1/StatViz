#!/usr/bin/env node
/**
 * Upload demo files to Supabase Storage
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const SUPABASE_URL = 'https://dlwjkdfwhzbpqoysfsjp.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsd2prZGZ3aHpicHFveXNmc2pwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDE4MDQ1MywiZXhwIjoyMDc5NzU2NDUzfQ.LE8NunWiROlB9JUDpxH9SYzIFsyawa8P_VJwE1Qecu0'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function uploadFile(localPath, remotePath, contentType) {
  console.log(`Uploading ${localPath} -> ${remotePath}`)

  const buffer = fs.readFileSync(localPath)

  const { data, error } = await supabase.storage
    .from('projects')
    .upload(remotePath, buffer, {
      contentType,
      upsert: true,
    })

  if (error) {
    console.error(`Error uploading ${remotePath}:`, error.message)
    throw error
  }

  console.log(`Uploaded successfully: ${remotePath}`)
  return data
}

async function main() {
  const scriptDir = path.dirname(new URL(import.meta.url).pathname)

  // Upload HTML report
  await uploadFile(
    path.join(scriptDir, 'demo_report.html'),
    'demo/report.html',
    'text/html; charset=utf-8'
  )

  // Upload DOCX report
  await uploadFile(
    path.join(scriptDir, 'demo_report.docx'),
    'demo/report.docx',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  )

  // Upload Excel dataset (optional, for download)
  await uploadFile(
    path.join(scriptDir, 'demo_dataset.xlsx'),
    'demo/dataset.xlsx',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  )

  console.log('\nAll files uploaded successfully!')
  console.log('\nPublic URLs:')
  console.log(`HTML: ${SUPABASE_URL}/storage/v1/object/public/projects/demo/report.html`)
  console.log(`DOCX: ${SUPABASE_URL}/storage/v1/object/public/projects/demo/report.docx`)
  console.log(`Excel: ${SUPABASE_URL}/storage/v1/object/public/projects/demo/dataset.xlsx`)
}

main().catch(console.error)
