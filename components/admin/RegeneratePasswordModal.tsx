'use client'

import { useState } from 'react'
import { Check, Copy, KeyRound } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { copyToClipboard } from '@/lib/utils/clipboard'

interface RegeneratePasswordModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  password: string
  projectName: string
}

export function RegeneratePasswordModal({
  open,
  onOpenChange,
  password,
  projectName,
}: RegeneratePasswordModalProps) {
  const [copiedPassword, setCopiedPassword] = useState(false)

  function handleCopyPassword() {
    copyToClipboard(password)
    setCopiedPassword(true)
    setTimeout(() => setCopiedPassword(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-right">
            <KeyRound className="h-5 w-5 text-green-600" />
            סיסמה חדשה נוצרה
          </DialogTitle>
          <DialogDescription className="text-right">
            סיסמה חדשה נוצרה עבור: <strong>{projectName}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* New Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              הסיסמה החדשה
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={password}
                readOnly
                dir="ltr"
                className="flex-1 h-10 px-3 rounded-md border border-slate-300 bg-slate-50 font-mono text-left text-sm"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyPassword}
                className="gap-2"
              >
                {copiedPassword ? (
                  <>
                    <Check className="h-4 w-4 text-green-600" />
                    הועתק
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    העתק
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-sm text-amber-800 text-right">
              <strong>חשוב:</strong> שמור את הסיסמה במקום בטוח. הסיסמה הקודמת כבר לא תעבוד.
            </p>
          </div>

          {/* Close Button */}
          <div className="flex justify-end pt-2">
            <Button
              variant="gradient"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto"
            >
              סגור
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
