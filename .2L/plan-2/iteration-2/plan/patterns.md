# Code Patterns & Conventions - Iteration 2

## Overview

This file provides **copy-pasteable code patterns** for enhancing student components and conducting comprehensive QA testing. All patterns reference the design system established in Iteration 1 (documented in `.2L/plan-2/iteration-1/plan/patterns.md`).

**Reference Files:**
- Iteration 1 patterns: `/home/ahiya/Ahiya/2L/Prod/StatViz/.2L/plan-2/iteration-1/plan/patterns.md`
- Design tokens: `/home/ahiya/Ahiya/2L/Prod/StatViz/app/globals.css`
- Tailwind config: `/home/ahiya/Ahiya/2L/Prod/StatViz/tailwind.config.ts`
- Logo component: `/home/ahiya/Ahiya/2L/Prod/StatViz/components/shared/Logo.tsx`
- Button variants: `/home/ahiya/Ahiya/2L/Prod/StatViz/components/ui/button.tsx`

---

## Student Component Enhancement Patterns

### Pattern 1: PasswordPromptForm Enhancement (Full Example)

**File:** `/home/ahiya/Ahiya/2L/Prod/StatViz/components/student/PasswordPromptForm.tsx`

**Current State:** Basic white card, no branding, minimal styling

**Enhanced Version:**

```tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Logo } from '@/components/shared/Logo'  // NEW IMPORT
import { cn } from '@/lib/utils'

// DO NOT MODIFY - Keep existing schema
const PasswordSchema = z.object({
  password: z.string().min(1, 'סיסמה נדרשת'),
})

type PasswordFormData = z.infer<typeof PasswordSchema>

interface PasswordPromptFormProps {
  projectId: string
  onSuccess: () => void
}

export function PasswordPromptForm({ projectId, onSuccess }: PasswordPromptFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(PasswordSchema),
  })

  async function onSubmit(data: PasswordFormData) {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/preview/${projectId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()

        // Handle rate limiting (429 status)
        if (response.status === 429) {
          setError('יותר מדי ניסיונות. נסה שוב בעוד שעה')
          setIsLoading(false)
          return
        }

        // Handle incorrect password
        setError(errorData.error || 'סיסמה שגויה')
        setIsLoading(false)
        return
      }

      // Success - trigger parent callback
      onSuccess()
    } catch (err) {
      setError('שגיאת רשת. אנא נסה שוב')
      setIsLoading(false)
    }
  }

  return (
    // ENHANCED: Add gradient background wrapper
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        {/* ENHANCED: Add Logo component for branding */}
        <Logo size="md" className="mb-6 mx-auto" />

        {/* ENHANCED: Enhanced card with shadow-xl */}
        <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-center mb-2 text-slate-900">
            גישה לפרויקט
          </h1>
          <p className="text-center text-slate-600 mb-6">
            הזן סיסמה לצפייה בפרויקט
          </p>

          {/* ENHANCED: Error message with better styling */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
              <p className="text-destructive text-sm text-center font-medium">
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" dir="rtl">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                סיסמה
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  placeholder="הזן סיסמה"
                  dir="ltr"  // LTR for password input
                  className={cn(
                    "pl-10 text-left transition-all",  // Add padding for icon
                    errors.password ? 'border-destructive focus-visible:ring-destructive' : ''
                  )}
                  disabled={isLoading}
                  autoComplete="current-password"
                  autoFocus  // Auto-focus on mount
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? 'הסתר סיסמה' : 'הצג סיסמה'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive text-right">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* ENHANCED: Use gradient button variant */}
            <Button
              type="submit"
              variant="gradient"  // CHANGED FROM: variant="default"
              size="lg"
              className="w-full min-h-[44px]"  // 44px touch target for mobile
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  מאמת סיסמה...
                </>
              ) : (
                'הצג פרויקט'
              )}
            </Button>
          </form>
        </div>

        {/* ENHANCED: Footer with helpful text */}
        <p className="text-center text-sm text-slate-600 mt-4">
          הסיסמה נשלחה אליך במייל
        </p>
      </div>
    </div>
  )
}
```

**Key Enhancements:**
1. Added Logo component import and usage (line 23, 64)
2. Added gradient background wrapper (line 62)
3. Enhanced card shadow from `shadow-lg` to `shadow-xl` (line 67)
4. Changed button to `variant="gradient"` (line 120)
5. Enhanced error message styling with background (line 77-83)
6. Added auto-focus to password input (line 102)
7. Added footer with helpful text (line 133)

---

### Pattern 2: ProjectViewer Loading & Error State Enhancement

**File:** `/home/ahiya/Ahiya/2L/Prod/StatViz/components/student/ProjectViewer.tsx`

**Current Loading State:**
```tsx
// CURRENT (Lines 28-33)
if (isLoading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="mr-2 text-muted-foreground">טוען פרויקט...</span>
    </div>
  )
}
```

**Enhanced Loading State:**
```tsx
// ENHANCED: Professional loading card with branding
import { Loader2 } from 'lucide-react'

if (isLoading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto mb-3" />
        <p className="text-center text-slate-700 font-medium">טוען פרויקט...</p>
        <p className="text-center text-sm text-slate-500 mt-2">אנא המתן</p>
      </div>
    </div>
  )
}
```

**Current Error State:**
```tsx
// CURRENT (Lines 36-48)
if (error) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <p className="text-destructive text-lg mb-4">
          {error instanceof Error ? error.message : 'שגיאה בטעינת הפרויקט'}
        </p>
        <Button onClick={() => window.location.reload()}>
          נסה שוב
        </Button>
      </div>
    </div>
  )
}
```

**Enhanced Error State:**
```tsx
// ENHANCED: Professional error card with icon
import { AlertCircle } from 'lucide-react'  // NEW IMPORT
import { Button } from '@/components/ui/button'

if (error) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md text-center">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">שגיאה בטעינת הפרויקט</h2>
        <p className="text-slate-600 mb-6">
          {error instanceof Error ? error.message : 'לא ניתן לטעון את הפרויקט כרגע'}
        </p>
        <Button
          onClick={() => window.location.reload()}
          variant="gradient"
          size="lg"
          className="w-full min-h-[44px]"
        >
          נסה שוב
        </Button>
      </div>
    </div>
  )
}
```

**Key Enhancements:**
1. Added gradient background to loading and error states
2. Wrapped content in professional white card with shadow-xl
3. Added AlertCircle icon to error state
4. Enhanced typography (heading + description)
5. Changed retry button to gradient variant
6. Made retry button full-width for mobile
7. Added 44px touch target for mobile accessibility

---

### Pattern 3: DownloadButton Gradient Enhancement

**File:** `/home/ahiya/Ahiya/2L/Prod/StatViz/components/student/DownloadButton.tsx`

**Current Implementation (Lines 67-90):**
```tsx
<Button
  variant="default"  // CHANGE THIS
  size="lg"
  onClick={handleDownload}
  disabled={isLoading}
  className="
    min-h-[44px]
    fixed bottom-6 left-6 right-6 z-50 shadow-lg
    md:absolute md:bottom-auto md:top-6 md:left-auto md:right-6 md:w-auto
  "
>
  {isLoading ? (
    <>
      <Loader2 className="ml-2 h-5 w-5 animate-spin" />
      מוריד...
    </>
  ) : (
    <>
      <Download className="ml-2 h-5 w-5" />
      הורד מסמך מלא
    </>
  )}
</Button>
```

**Enhanced Implementation:**
```tsx
<Button
  variant="gradient"  // CHANGED FROM: variant="default"
  size="lg"
  onClick={handleDownload}
  disabled={isLoading}
  className="
    min-h-[44px]
    fixed bottom-6 left-6 right-6 z-50 shadow-glow  // CHANGED: shadow-lg → shadow-glow
    md:absolute md:bottom-auto md:top-6 md:left-auto md:right-6 md:w-auto
    hover:shadow-xl  // Added enhanced hover shadow
    transition-all duration-200  // Smooth transitions
  "
>
  {isLoading ? (
    <>
      <Loader2 className="ml-2 h-5 w-5 animate-spin" />
      מוריד...
    </>
  ) : (
    <>
      <Download className="ml-2 h-5 w-5" />
      הורד מסמך מלא
    </>
  )}
</Button>
```

**Key Changes:**
1. Changed `variant="default"` to `variant="gradient"` (line 2)
2. Changed `shadow-lg` to `shadow-glow` for professional glow effect (line 7)
3. Added `hover:shadow-xl` for enhanced hover state (line 9)
4. Added `transition-all duration-200` for smooth transitions (line 10)

**Result:** Download button now matches admin section CTA buttons with gradient background and professional shadow effects.

---

### Pattern 4: ProjectMetadata Typography Enhancement

**File:** `/home/ahiya/Ahiya/2L/Prod/StatViz/components/student/ProjectMetadata.tsx`

**Current Implementation (Lines 24-51):**
```tsx
<header className="bg-white border-b p-4 lg:p-6" dir="rtl">
  <div className="max-w-7xl mx-auto">
    <h1 className="text-xl font-bold mb-2 lg:text-3xl lg:mb-3">
      {project.name}
    </h1>
    <div className="flex flex-col space-y-1 lg:flex-row lg:gap-4 lg:space-y-0">
      <p className="text-muted-foreground">
        סטודנט: <span className="text-foreground">{project.student.name}</span>
      </p>
      <p className="text-muted-foreground" dir="ltr">
        <span className="text-left">{project.student.email}</span>
      </p>
    </div>
  </div>
</header>
```

**Enhanced Implementation:**
```tsx
<header className="bg-white border-b p-4 lg:p-6 shadow-soft" dir="rtl">  {/* Added shadow-soft */}
  <div className="max-w-7xl mx-auto">
    {/* Enhanced: Added gradient text on desktop */}
    <h1 className="text-xl font-bold mb-2 md:text-2xl lg:text-3xl lg:mb-3 text-slate-900">
      {project.name}
    </h1>

    {/* Enhanced: Better typography hierarchy */}
    <div className="flex flex-col space-y-1 lg:flex-row lg:gap-6 lg:space-y-0">
      <p className="text-sm lg:text-base text-slate-600">
        סטודנט: <span className="text-slate-900 font-medium">{project.student.name}</span>
      </p>
      <p className="text-sm lg:text-base text-slate-600">
        {/* Enhanced: font-mono for email, better visual distinction */}
        <span dir="ltr" className="font-mono text-slate-700">{project.student.email}</span>
      </p>
    </div>

    {/* Optional: Add project description if exists */}
    {project.description && (
      <p className="text-sm text-slate-600 mt-3 lg:mt-4 max-w-3xl">
        {project.description}
      </p>
    )}
  </div>
</header>
```

**Key Enhancements:**
1. Added `shadow-soft` to header for subtle elevation (line 1)
2. Added intermediate `md:` breakpoint for better tablet typography (line 5)
3. Enhanced text color hierarchy: `text-slate-900` for emphasis, `text-slate-600` for secondary (lines 9, 11)
4. Added `font-medium` to student name for emphasis (line 10)
5. Added `font-mono` to email for technical field distinction (line 14)
6. Added optional project description display (lines 18-22)
7. Increased gap from `lg:gap-4` to `lg:gap-6` for better breathing room (line 9)

**Result:** Professional metadata header with clear visual hierarchy and improved readability.

---

## RTL Layout Patterns

### Pattern 5: Mixed RTL/LTR Content

**Use Case:** Hebrew labels with English/technical content (emails, passwords, URLs)

**Pattern:**
```tsx
{/* Hebrew text (RTL default) + LTR technical field */}
<div dir="rtl">
  <Label htmlFor="email">כתובת אימייל</Label>
  <Input
    id="email"
    type="email"
    dir="ltr"  // Force LTR for email input
    className="text-left"  // Left-align text
    placeholder="student@example.com"
  />
</div>

{/* Hebrew label + LTR password */}
<div dir="rtl">
  <Label htmlFor="password">סיסמה</Label>
  <Input
    id="password"
    type="password"
    dir="ltr"  // Force LTR for password
    className="text-left"  // Left-align text
    placeholder="••••••••"
  />
</div>

{/* Mixed content in metadata */}
<p className="text-muted-foreground">
  סטודנט: <span className="text-foreground">{hebrewName}</span>
</p>
<p className="text-muted-foreground">
  <span dir="ltr" className="font-mono text-sm">{email}</span>  {/* LTR email */}
</p>
```

**Key Points:**
- Default RTL for Hebrew content (inherited from root layout)
- Explicit `dir="ltr"` for technical fields (email, password, URL)
- Use `text-left` for LTR content alignment
- Use `font-mono` for technical fields (emails, codes)

---

### Pattern 6: RTL Gradient Direction Testing

**Issue:** CSS gradients may reverse direction in RTL mode

**Testing Method:**
```tsx
// Test gradient in browser DevTools
// 1. Open student password prompt page
// 2. Inspect gradient container
// 3. Verify visual appeal

// If gradient looks reversed/awkward, add explicit LTR direction:
<div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100" dir="ltr">
  {/* Content */}
</div>

// Or use Tailwind RTL-aware utilities:
<div className="bg-gradient-to-r from-blue-600 to-indigo-600 [direction:ltr]">
  {/* Gradient text */}
</div>
```

**Verification Checklist:**
- [ ] Gradient background displays smoothly (no harsh reversal)
- [ ] Blue-to-indigo transition is visually appealing
- [ ] Gradient matches admin section visual style
- [ ] No gradient "flipping" that looks awkward

**Note:** Tailwind CSS usually handles RTL gradients correctly. Only add explicit `dir="ltr"` or `[direction:ltr]` if visual issues detected.

---

## Mobile-First Responsive Patterns

### Pattern 7: Touch-Optimized Interactive Elements

**Minimum Touch Target:** 44px (Apple/Android guidelines)

**Pattern:**
```tsx
{/* Button with 44px minimum height */}
<Button
  size="lg"
  className="w-full min-h-[44px]"  // Minimum 44px for thumb tap
>
  לחץ כאן
</Button>

{/* Icon button with 44px minimum */}
<button
  className="min-h-[44px] min-w-[44px] flex items-center justify-center"
  aria-label="Close"
>
  <X className="h-5 w-5" />
</button>

{/* Input field with sufficient height */}
<Input
  className="min-h-[44px] text-base"  // 44px height, 16px text (prevents zoom on iOS)
  type="text"
/>
```

**Key Points:**
- Always use `min-h-[44px]` for interactive elements on mobile
- Use `text-base` (16px) or larger for inputs (prevents iOS auto-zoom)
- Full-width buttons on mobile: `w-full sm:w-auto`
- Stack buttons vertically on mobile: `flex flex-col sm:flex-row gap-4`

---

### Pattern 8: Mobile-First Download Button Positioning

**Use Case:** Fixed bottom on mobile (thumb-reachable), absolute top-right on desktop

**Pattern (Already Implemented in DownloadButton.tsx):**
```tsx
<Button
  variant="gradient"
  size="lg"
  className="
    min-h-[44px]

    // Mobile: Fixed at bottom, full-width, thumb-reachable
    fixed bottom-6 left-6 right-6 z-50 shadow-glow

    // Desktop: Absolute top-right, auto-width, non-intrusive
    md:absolute md:bottom-auto md:top-6 md:left-auto md:right-6 md:w-auto

    // Enhanced effects
    hover:shadow-xl transition-all duration-200
  "
>
  <Download className="ml-2 h-5 w-5" />
  הורד מסמך מלא
</Button>
```

**Rationale:**
- Mobile: Fixed at bottom ensures button is always visible and thumb-reachable
- Desktop: Absolute positioning keeps button accessible without blocking content
- `z-50` ensures button floats above iframe content
- Shadow effects enhance visual prominence

---

### Pattern 9: Responsive Typography Scale

**Use Case:** Optimal text size across devices

**Pattern:**
```tsx
{/* Heading: 3-tier scale (mobile → tablet → desktop) */}
<h1 className="text-xl md:text-2xl lg:text-3xl font-bold">
  כותרת ראשית
</h1>

{/* Subheading: 2-tier scale */}
<h2 className="text-lg lg:text-xl font-semibold">
  כותרת משנית
</h2>

{/* Body text: Base size with optional desktop increase */}
<p className="text-base lg:text-lg">
  טקסט גוף
</p>

{/* Small text: Consistent across devices */}
<p className="text-sm text-muted-foreground">
  טקסט עזר
</p>
```

**Breakpoints:**
- **Mobile (default)**: Base sizes (text-base = 16px)
- **Tablet (md:768px)**: Intermediate sizes (optional)
- **Desktop (lg:1024px)**: Larger sizes for better readability

---

### Pattern 10: Responsive Layout Containers

**Pattern:**
```tsx
{/* Full-width container with responsive padding */}
<div className="container mx-auto px-4 sm:px-6 lg:px-8">
  {/* Content */}
</div>

{/* Responsive grid: Stack on mobile, 2-col tablet, 3-col desktop */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>

{/* Responsive flex: Vertical mobile, horizontal desktop */}
<div className="flex flex-col sm:flex-row gap-4">
  <Button variant="gradient" className="w-full sm:w-auto">Primary</Button>
  <Button variant="outline" className="w-full sm:w-auto">Secondary</Button>
</div>
```

---

## QA Testing Patterns

### Pattern 11: Cross-Browser Testing Checklist

**Browsers to Test:**
1. Chrome 90+ (Primary)
2. Safari 14+ (iOS compatibility)
3. Firefox 88+ (Smoke test)
4. Edge 90+ (Smoke test)

**Test Matrix:**
```markdown
# Cross-Browser Testing Matrix

## Landing Page (/)
| Browser | Visual | Functional | Responsive | Status |
|---------|--------|------------|------------|--------|
| Chrome  | [ ]    | [ ]        | [ ]        | Pending|
| Safari  | [ ]    | [ ]        | [ ]        | Pending|
| Firefox | [ ]    | N/A        | [ ]        | Pending|
| Edge    | [ ]    | N/A        | [ ]        | Pending|

## Admin Login (/admin)
| Browser | Visual | Functional | Responsive | Status |
|---------|--------|------------|------------|--------|
| Chrome  | [ ]    | [ ]        | [ ]        | Pending|
| Safari  | [ ]    | [ ]        | [ ]        | Pending|
| Firefox | [ ]    | [ ]        | [ ]        | Pending|
| Edge    | [ ]    | [ ]        | [ ]        | Pending|

## Student Password (/preview/[id])
| Browser | Visual | Functional | Responsive | Status |
|---------|--------|------------|------------|--------|
| Chrome  | [ ]    | [ ]        | [ ]        | Pending|
| Safari  | [ ]    | [ ]        | [ ]        | Pending|
| Firefox | [ ]    | [ ]        | [ ]        | Pending|
| Edge    | [ ]    | [ ]        | [ ]        | Pending|
```

**Testing Steps:**

**Visual Testing:**
1. Open page in browser
2. Verify gradient backgrounds render correctly
3. Verify shadows and hover effects work
4. Verify typography is readable
5. Verify spacing and layout are correct
6. Take screenshot for documentation

**Functional Testing:**
1. Test login with correct credentials
2. Test login with incorrect credentials
3. Test password verification (student)
4. Test download functionality
5. Verify error messages display correctly
6. Verify loading states work

**Responsive Testing:**
1. Resize browser to 375px width (mobile)
2. Verify layout doesn't break
3. Verify touch targets are 44px minimum
4. Resize to 768px (tablet)
5. Verify layout adapts correctly
6. Resize to 1024px+ (desktop)
7. Verify layout uses full width appropriately

---

### Pattern 12: RTL Layout Verification Checklist

**Test Method:**
1. Open student pages in Chrome
2. Open DevTools > Elements tab
3. Verify `<html dir="rtl">` attribute
4. Inspect each component for RTL correctness

**Checklist:**

```markdown
# RTL Layout Verification

## PasswordPromptForm
- [ ] Hebrew text aligns to right
- [ ] Password input is LTR (dir="ltr")
- [ ] Eye/EyeOff icon positions correctly (left side)
- [ ] Error messages align to right
- [ ] Button text in Hebrew
- [ ] Gradient background displays correctly
- [ ] Logo component displays correctly

## ProjectMetadata
- [ ] Project name aligns to right
- [ ] Student name aligns to right
- [ ] Email displays LTR (dir="ltr" on email span)
- [ ] Email uses font-mono for distinction
- [ ] Mixed Hebrew/English content displays correctly
- [ ] Spacing is symmetrical

## ProjectViewer
- [ ] Loading text aligns to right (טוען פרויקט...)
- [ ] Error text aligns to right
- [ ] Retry button text in Hebrew
- [ ] Layout doesn't break with RTL

## DownloadButton
- [ ] Button text in Hebrew (הורד מסמך מלא)
- [ ] Download icon positions correctly (ml-2 for RTL spacing)
- [ ] Button width/positioning correct on mobile and desktop
```

**Common RTL Issues:**
- **Icon positioning**: Use `ml-2` (margin-left) in RTL, not `mr-2` (margin-right)
- **Text alignment**: Use `text-right` for Hebrew, `text-left` for LTR overrides
- **Flex direction**: `flex-row` reverses in RTL automatically
- **Gradients**: Verify visual appeal (may need `dir="ltr"` if reversed awkwardly)

---

### Pattern 13: Mobile Device Testing Protocol

**Required Devices:**
- **Minimum:** 1 real mobile device (iOS or Android)
- **Ideal:** 1 iOS device + 1 Android device

**Test Scenarios:**

```markdown
# Mobile Device Testing Checklist

## iOS Safari (iPhone)
### PasswordPromptForm
- [ ] Page loads correctly
- [ ] Logo displays with correct size
- [ ] Gradient background renders
- [ ] Password input tappable (44px height)
- [ ] Virtual keyboard doesn't obscure input
- [ ] Eye/EyeOff toggle works on tap
- [ ] Submit button tappable (44px height)
- [ ] Error message displays correctly
- [ ] Hebrew text renders correctly (Rubik font)

### ProjectViewer
- [ ] Loading state displays with spinner
- [ ] Project metadata readable
- [ ] Iframe scrolls smoothly (touch scrolling)
- [ ] Download button visible at bottom
- [ ] Download button tappable (44px height)
- [ ] Download button full-width on mobile
- [ ] Gradient styling displays correctly

## Chrome Android (Samsung/Pixel)
### PasswordPromptForm
- [ ] Same tests as iOS Safari
- [ ] Virtual keyboard behavior correct
- [ ] Touch targets adequate (44px minimum)

### ProjectViewer
- [ ] Same tests as iOS Safari
- [ ] Iframe rendering correct
- [ ] Download button positioning correct
```

**Testing Method:**
1. Open student password prompt on device: `http://<dev-ip>:3000/preview/<test-project-id>`
2. Enter password and verify authentication flow
3. View project and test iframe scrolling
4. Tap download button and verify download initiates
5. Test in portrait and landscape orientations
6. Test with different zoom levels

**If Real Devices Unavailable:**
- Use browser DevTools responsive mode as fallback
- Test at 375px width (iPhone SE)
- Test at 768px width (iPad)
- Note in validation report that physical devices were not available

---

### Pattern 14: Lighthouse Performance Audit

**How to Run Lighthouse:**
1. Open Chrome browser
2. Navigate to page to test
3. Open DevTools (F12)
4. Go to Lighthouse tab
5. Select "Performance" category
6. Choose "Desktop" mode
7. Click "Generate report"
8. Wait for audit to complete (~30 seconds)

**Pages to Audit:**
1. Landing page: `http://localhost:3000/`
2. Admin login: `http://localhost:3000/admin`
3. Admin dashboard: `http://localhost:3000/admin/dashboard`
4. Student password: `http://localhost:3000/preview/<test-project-id>`
5. Student viewer: `http://localhost:3000/preview/<test-project-id>/view`

**Performance Targets:**
- Performance score: >90
- First Contentful Paint (FCP): <1.8s
- Largest Contentful Paint (LCP): <2.5s
- Cumulative Layout Shift (CLS): <0.1
- Time to Interactive (TTI): <3.8s

**Result Documentation:**
```markdown
# Lighthouse Audit Results

## Landing Page (/)
- **Performance:** 95 / 100 ✓
- **FCP:** 1.2s (Target: <1.8s) ✓
- **LCP:** 1.8s (Target: <2.5s) ✓
- **CLS:** 0.05 (Target: <0.1) ✓
- **TTI:** 2.1s (Target: <3.8s) ✓
- **Total Load Time:** 1.5s ✓

## Admin Login (/admin)
- **Performance:** 93 / 100 ✓
- **FCP:** 1.4s ✓
- **LCP:** 2.1s ✓
- **CLS:** 0.02 ✓
- **TTI:** 2.8s ✓
- **Total Load Time:** 1.8s ✓

## Student Password (/preview/[id])
- **Performance:** 92 / 100 ✓
- **FCP:** 1.3s ✓
- **LCP:** 2.0s ✓
- **CLS:** 0.03 ✓
- **TTI:** 2.5s ✓
- **Total Load Time:** 1.7s ✓

## Notes
- All pages meet performance targets
- CSS bundle size: 38 KB (well under 100 KB target)
- No performance regressions detected
```

**If Score <90:**
1. Check FCP/LCP/CLS individually (more important than composite score)
2. Investigate "Opportunities" section in Lighthouse report
3. If 85-89: Document but don't block deployment (still excellent)
4. If <85: Investigate potential issues (may indicate problem)

---

### Pattern 15: Bundle Size Verification

**How to Check CSS Bundle Size:**

```bash
# Build production bundle
npm run build

# Check output for CSS file sizes
# Look for lines like:
# .next/static/css/<hash>.css  38.2 kB

# Expected output:
# CSS bundle: 38 KB (within 100 KB target)
# JavaScript bundles: Optimized with tree-shaking
```

**Expected Bundle Sizes:**
- **CSS**: 36 KB (current) → 38 KB (after Iteration 2) → Target: <100 KB ✓
- **JS (Landing)**: ~99 KB (already optimized)
- **JS (Admin)**: ~316 KB (data-heavy, acceptable)
- **JS (Student)**: ~150 KB (React Query, form libraries)

**Thresholds:**
- CSS 38-45 KB: ✓ Acceptable (within budget)
- CSS 45-60 KB: ⚠️ Monitor (still within budget, trending up)
- CSS >60 KB: ❌ Investigate (may indicate duplicate utilities)

**If CSS Exceeds 45 KB:**
1. Run Tailwind production build with verbose mode
2. Check for duplicate utility classes
3. Verify unused CSS is being purged
4. Investigate custom CSS in globals.css (should be minimal)

---

### Pattern 16: Functional Regression Testing

**Purpose:** Ensure zero breaking changes to existing functionality

**Admin Workflows to Test:**

```markdown
# Admin Regression Testing

## Login Flow
- [ ] Navigate to /admin
- [ ] Enter correct username/password
- [ ] Verify redirect to /admin/dashboard
- [ ] Verify session persists (refresh page, should stay logged in)
- [ ] Logout
- [ ] Verify redirect to /admin login
- [ ] Try accessing /admin/dashboard (should redirect to login)

## Create Project Flow
- [ ] Login to admin dashboard
- [ ] Click "צור פרויקט חדש" button (gradient button)
- [ ] Fill project form (name, description, student email, password, upload file)
- [ ] Submit form
- [ ] Verify success modal appears
- [ ] Verify project appears in table
- [ ] Copy project link and password
- [ ] Close modal

## Delete Project Flow
- [ ] Find project in table
- [ ] Click delete button (trash icon)
- [ ] Confirm deletion in modal
- [ ] Verify project removed from table
- [ ] Verify success toast notification

## Update Password Flow
- [ ] Find project in table
- [ ] Click "עדכן סיסמה" button
- [ ] Enter new password in modal
- [ ] Submit
- [ ] Verify success notification
```

**Student Workflows to Test:**

```markdown
# Student Regression Testing

## Password Authentication Flow
- [ ] Navigate to /preview/<project-id>
- [ ] Verify password prompt displays (Logo, gradient background)
- [ ] Enter incorrect password
- [ ] Verify error message in Hebrew: "סיסמה שגויה"
- [ ] Enter correct password
- [ ] Verify smooth transition to project viewer

## Rate Limiting Flow
- [ ] Navigate to /preview/<project-id>
- [ ] Enter incorrect password 5 times
- [ ] Verify rate limit message: "יותר מדי ניסיונות. נסה שוב בעוד שעה"
- [ ] Verify submit button disabled or shows rate limit error

## Project Viewing Flow
- [ ] After successful password authentication
- [ ] Verify ProjectMetadata header displays (project name, student name, email)
- [ ] Verify HtmlIframe loads report content
- [ ] Verify iframe scrolls smoothly (touch scroll on mobile)
- [ ] Verify DownloadButton visible (gradient variant, shadow-glow)

## Download Flow
- [ ] Click "הורד מסמך מלא" button
- [ ] Verify loading state: "מוריד..." with spinner
- [ ] Verify DOCX file download initiates
- [ ] Verify download completes successfully
- [ ] Verify button returns to normal state after download

## Error State Flow
- [ ] Navigate to /preview/nonexistent-project-id
- [ ] Verify error state displays (AlertCircle icon, gradient background)
- [ ] Verify error message: "שגיאה בטעינת הפרויקט"
- [ ] Click "נסה שוב" button
- [ ] Verify page reloads
```

**Acceptance Criteria:**
- All admin workflows function identically to before Iteration 2
- All student workflows function identically to before Iteration 2
- **Zero functional regressions** - only UI enhancements, no logic changes
- Error handling works correctly
- Loading states work correctly
- Success notifications work correctly

---

### Pattern 17: Smooth Scroll Behavior (Landing Page)

**File:** `/home/ahiya/Ahiya/2L/Prod/StatViz/app/globals.css`

**Add to globals.css:**
```css
/* Add smooth scroll behavior globally */
@layer base {
  html {
    scroll-behavior: smooth;
  }
}
```

**Alternative (Scoped to Landing Page):**
If you prefer scoped smooth scroll only on landing page:

```tsx
// app/page.tsx - Add to client component
'use client'

import { useEffect } from 'react'

export default function LandingPage() {
  useEffect(() => {
    // Enable smooth scroll for this page
    document.documentElement.style.scrollBehavior = 'smooth'

    // Cleanup on unmount
    return () => {
      document.documentElement.style.scrollBehavior = 'auto'
    }
  }, [])

  // ... rest of component
}
```

**Testing Smooth Scroll:**
1. Navigate to landing page
2. Click "למד עוד" button (if it links to #features)
3. Verify page scrolls smoothly (not instant jump)
4. Test in Chrome, Safari, Firefox

**Note:** Most modern browsers support `scroll-behavior: smooth` natively. No JavaScript needed for basic functionality.

---

## Import Order Convention

**Standard import order for all enhanced components:**

```typescript
// 1. React and Next.js imports
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// 2. Third-party libraries
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// 3. lucide-react icons (alphabetical)
import { AlertCircle, Download, Eye, EyeOff, Loader2 } from 'lucide-react'

// 4. UI components (shadcn/ui) (alphabetical)
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// 5. Shared components
import { Logo } from '@/components/shared/Logo'

// 6. Feature components (if any)
import { ProjectForm } from '@/components/admin/ProjectForm'

// 7. Hooks
import { useProject } from '@/lib/hooks/useProject'
import { useProjectAuth } from '@/lib/hooks/useProjectAuth'

// 8. Utils and types
import { cn } from '@/lib/utils'
import type { Project } from '@/types'
```

---

## Component Quality Checklist

**Before marking component complete, verify:**

- [ ] All imports organized by convention
- [ ] TypeScript types defined for all props
- [ ] Component uses proper semantic HTML
- [ ] Accessibility attributes added (aria-label, alt, htmlFor)
- [ ] RTL layout correct (Hebrew text aligns right, LTR overrides where needed)
- [ ] Responsive design tested (375px, 768px, 1024px)
- [ ] Touch targets minimum 44px on mobile
- [ ] Hover states work on desktop
- [ ] Loading states show spinner + text
- [ ] Error states show icon + message + retry button
- [ ] Gradient backgrounds applied consistently
- [ ] Logo component integrated (where appropriate)
- [ ] Button gradient variant used for primary CTAs
- [ ] Shadows applied (shadow-soft, shadow-glow, shadow-xl)
- [ ] Typography scale follows mobile → tablet → desktop progression
- [ ] Spacing uses Tailwind utilities (no custom CSS)
- [ ] Component functionality unchanged (zero logic modifications)
- [ ] Manual testing completed (functional flow works)

---

## Summary

All patterns in this file are **production-ready and copy-pasteable**. Builders should:

1. **Reference Iteration 1 patterns** for foundational design system usage
2. **Apply patterns consistently** across all student components
3. **Test each pattern** after implementation (RTL, responsive, cross-browser)
4. **Document any deviations** from patterns in code comments
5. **Use QA checklist patterns** for comprehensive validation

**Key Principles:**
- Reuse established design system (Logo, gradients, shadows, typography)
- Preserve all existing functionality (zero logic changes)
- Enhance UI only (professional styling, better UX)
- Test thoroughly (cross-browser, RTL, mobile devices)
- Document all findings in validation report
