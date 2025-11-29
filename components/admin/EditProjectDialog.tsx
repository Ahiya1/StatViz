'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { FileUploadZone } from './FileUploadZone'
import { useUpdateProject } from '@/lib/hooks/useUpdateProject'
import type { Project } from '@/lib/types/admin'

// Edit project form schema (Hebrew messages)
const EditProjectFormSchema = z.object({
  project_name: z.string()
    .min(1, 'שם הפרויקט נדרש')
    .max(500, 'שם הפרויקט ארוך מדי (מקסימום 500 תווים)')
    .regex(/[\u0590-\u05FF]/, 'שם הפרויקט חייב להכיל לפחות תו עברי אחד'),
  student_name: z.string()
    .min(1, 'שם הסטודנט נדרש')
    .max(255, 'שם הסטודנט ארוך מדי (מקסימום 255 תווים)'),
  student_email: z.string()
    .min(1, 'אימייל נדרש')
    .email('כתובת אימייל לא תקינה')
    .max(255, 'אימייל ארוך מדי'),
  research_topic: z.string()
    .min(1, 'נושא המחקר נדרש')
    .max(5000, 'נושא המחקר ארוך מדי (מקסימום 5000 תווים)'),
})

type EditProjectFormData = z.infer<typeof EditProjectFormSchema>

interface EditProjectDialogProps {
  project: Project
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function EditProjectDialog({
  project,
  open,
  onOpenChange,
  onSuccess,
}: EditProjectDialogProps) {
  const [docxFile, setDocxFile] = useState<File | null>(null)
  const [htmlFile, setHtmlFile] = useState<File | null>(null)
  const updateProject = useUpdateProject()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<EditProjectFormData>({
    resolver: zodResolver(EditProjectFormSchema),
    defaultValues: {
      project_name: project.projectName,
      student_name: project.studentName,
      student_email: project.studentEmail,
      research_topic: project.researchTopic || '',
    },
  })

  // Check if there are any changes (form fields or files)
  const hasChanges = isDirty || docxFile !== null || htmlFile !== null

  async function onSubmit(data: EditProjectFormData) {
    updateProject.mutate(
      {
        projectId: project.projectId,
        data: {
          projectName: data.project_name,
          studentName: data.student_name,
          studentEmail: data.student_email,
          researchTopic: data.research_topic,
          docxFile: docxFile,
          htmlFile: htmlFile,
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false)
          // Reset files
          setDocxFile(null)
          setHtmlFile(null)
          if (onSuccess) {
            onSuccess()
          }
        },
      }
    )
  }

  function handleClose(isOpen: boolean) {
    if (!isOpen) {
      // Reset form and files when closing
      reset({
        project_name: project.projectName,
        student_name: project.studentName,
        student_email: project.studentEmail,
        research_topic: project.researchTopic || '',
      })
      setDocxFile(null)
      setHtmlFile(null)
    }
    onOpenChange(isOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-right">
            עריכת פרויקט
          </DialogTitle>
          <DialogDescription className="text-right text-slate-600">
            עדכן את פרטי הפרויקט. ניתן גם להחליף את הקבצים (DOCX ו-HTML).
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" dir="rtl">
          {/* Project Name */}
          <div className="space-y-2">
            <Label htmlFor="edit_project_name" className="text-sm font-medium text-slate-700">
              שם הפרויקט
            </Label>
            <Input
              id="edit_project_name"
              {...register('project_name')}
              placeholder="הזן שם פרויקט בעברית"
              className={errors.project_name ? 'border-destructive focus-visible:ring-destructive' : ''}
              disabled={isSubmitting || updateProject.isPending}
            />
            {errors.project_name && (
              <p className="text-sm text-destructive">{errors.project_name.message}</p>
            )}
          </div>

          {/* Student Name */}
          <div className="space-y-2">
            <Label htmlFor="edit_student_name" className="text-sm font-medium text-slate-700">
              שם הסטודנט
            </Label>
            <Input
              id="edit_student_name"
              {...register('student_name')}
              placeholder="שם מלא של הסטודנט"
              className={errors.student_name ? 'border-destructive focus-visible:ring-destructive' : ''}
              disabled={isSubmitting || updateProject.isPending}
            />
            {errors.student_name && (
              <p className="text-sm text-destructive">{errors.student_name.message}</p>
            )}
          </div>

          {/* Student Email */}
          <div className="space-y-2">
            <Label htmlFor="edit_student_email" className="text-sm font-medium text-slate-700">
              אימייל סטודנט
            </Label>
            <Input
              id="edit_student_email"
              type="email"
              dir="ltr"
              className={`text-left ${errors.student_email ? 'border-destructive focus-visible:ring-destructive' : ''}`}
              {...register('student_email')}
              placeholder="student@example.com"
              disabled={isSubmitting || updateProject.isPending}
            />
            {errors.student_email && (
              <p className="text-sm text-destructive">{errors.student_email.message}</p>
            )}
          </div>

          {/* Research Topic */}
          <div className="space-y-2">
            <Label htmlFor="edit_research_topic" className="text-sm font-medium text-slate-700">
              נושא המחקר
            </Label>
            <Textarea
              id="edit_research_topic"
              {...register('research_topic')}
              placeholder="תאור קצר של נושא המחקר"
              rows={4}
              className={errors.research_topic ? 'border-destructive focus-visible:ring-destructive' : ''}
              disabled={isSubmitting || updateProject.isPending}
            />
            {errors.research_topic && (
              <p className="text-sm text-destructive">{errors.research_topic.message}</p>
            )}
          </div>

          {/* File Upload Section */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
              <p className="font-medium text-slate-700 mb-1">החלפת קבצים (אופציונלי)</p>
              <p>העלה קבצים חדשים רק אם ברצונך להחליף את הקבצים הקיימים.</p>
            </div>

            {/* DOCX File Upload */}
            <FileUploadZone
              label="קובץ DOCX (אופציונלי - יחליף את הקובץ הקיים)"
              accept={{
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
              }}
              onFileSelect={setDocxFile}
              selectedFile={docxFile}
            />

            {/* HTML File Upload */}
            <FileUploadZone
              label="קובץ HTML (אופציונלי - יחליף את הקובץ הקיים)"
              accept={{
                'text/html': ['.html'],
              }}
              onFileSelect={setHtmlFile}
              selectedFile={htmlFile}
            />
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleClose(false)}
              disabled={isSubmitting || updateProject.isPending}
              className="hover:bg-slate-50 transition-colors"
            >
              ביטול
            </Button>
            <Button
              type="submit"
              variant="gradient"
              disabled={isSubmitting || updateProject.isPending || !hasChanges}
              className="gap-2"
            >
              {updateProject.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  שומר...
                </>
              ) : (
                'שמור שינויים'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
