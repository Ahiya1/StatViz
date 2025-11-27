# Code Patterns & Conventions - Iteration 1

## File Structure

```
/home/ahiya/Ahiya/2L/Prod/StatViz/
├── app/
│   ├── layout.tsx                         # Root layout (RTL, Rubik font)
│   ├── page.tsx                           # Landing page (already redesigned)
│   ├── globals.css                        # CSS variables, design tokens ← UPDATE
│   ├── (auth)/                            # Route group for admin auth
│   │   └── admin/
│   │       ├── layout.tsx                 # Centered auth card layout
│   │       ├── page.tsx                   # Admin login page ← ENHANCE
│   │       └── dashboard/
│   │           └── page.tsx               # Admin dashboard ← ENHANCE
│   └── api/                               # API routes (DO NOT MODIFY)
│       ├── admin/
│       └── preview/
├── components/
│   ├── ui/                                # shadcn/ui primitives
│   │   ├── button.tsx                     # ← ADD gradient variant
│   │   ├── input.tsx                      # ← ENHANCE focus states
│   │   ├── dialog.tsx                     # ← ADD backdrop blur
│   │   ├── label.tsx                      # ← Typography improvements
│   │   └── table.tsx                      # ← Hover effects, RTL
│   ├── admin/                             # Admin dashboard components
│   │   ├── DashboardHeader.tsx            # ← ADD gradient branding, logo
│   │   ├── DashboardShell.tsx             # ← Wrapper styling
│   │   ├── ProjectTable.tsx               # ← Enhanced table with shadows
│   │   ├── CreateProjectDialog.tsx        # ← Modal styling
│   │   ├── LoginForm.tsx                  # ← Form styling, gradient button
│   │   └── [more components]
│   └── shared/                            # Shared components ← CREATE
│       └── Logo.tsx                       # ← CREATE reusable logo
├── lib/
│   ├── hooks/                             # Custom hooks (DO NOT MODIFY)
│   ├── utils.ts                           # cn() utility (DO NOT MODIFY)
│   └── validation/                        # Zod schemas (DO NOT MODIFY)
└── tailwind.config.ts                     # ← EXTEND with gradients
```

## Naming Conventions

- **Components:** PascalCase (`DashboardHeader.tsx`, `LoginForm.tsx`, `Logo.tsx`)
- **Files:** camelCase (`useAuth.ts`, `formatDate.ts`)
- **Types:** PascalCase (`LoginFormData`, `Project`, `ButtonProps`)
- **Functions:** camelCase (`handleSubmit()`, `formatCurrency()`)
- **Constants:** SCREAMING_SNAKE_CASE (`MAX_FILE_SIZE`, `API_BASE_URL`)
- **CSS Classes:** kebab-case via Tailwind (`bg-gradient-primary`, `shadow-soft`)

## Design System Patterns

### Pattern 1: CSS Variables (Design Tokens)

**When to use:** All color, spacing, and shadow values throughout the application.

**Code example:**

```css
/* app/globals.css - UPDATE THESE VALUES */
@layer base {
  :root {
    /* Update existing primary colors to blue/indigo brand */
    --primary: 221 83% 53%;           /* blue-600 */
    --primary-foreground: 0 0% 100%;  /* white */

    /* Add new gradient tokens */
    --gradient-start: 221 83% 53%;    /* blue-600 */
    --gradient-end: 239 84% 67%;      /* indigo-600 */

    /* Keep existing shadcn/ui variables (unchanged) */
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --destructive: 0 84.2% 60.2%;
    --border: 214.3 31.8% 91.4%;
    --radius: 0.5rem;

    /* Add typography scale */
    --font-size-h1: 2.25rem;   /* 36px */
    --font-size-h2: 1.875rem;  /* 30px */
    --font-size-h3: 1.5rem;    /* 24px */
    --font-size-h4: 1.25rem;   /* 20px */
    --font-size-body: 1rem;    /* 16px */
    --font-size-small: 0.875rem; /* 14px */
  }
}

@layer utilities {
  /* Add custom gradient utilities */
  .gradient-text {
    @apply bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent;
  }

  .gradient-bg {
    @apply bg-gradient-to-r from-blue-600 to-indigo-600;
  }

  .backdrop-blur-soft {
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }
}
```

**Key points:**
- Use HSL format for all colors (shadcn/ui standard)
- Update --primary to blue-600 for brand consistency
- Add custom utilities in @layer utilities (Tailwind will purge unused)
- Test color changes incrementally (update one variable, test components)

### Pattern 2: Gradient Utilities

**When to use:** Hero sections, CTA buttons, branding elements, feature cards.

**Code example:**

```tsx
// app/page.tsx - Reference from landing page (already implemented)
<div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
  {/* Background gradient for sections */}
</div>

<h1 className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
  StatViz {/* Gradient text */}
</h1>

<Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all">
  התחבר {/* Gradient button with hover effect */}
</Button>

{/* OR use custom utility class */}
<h1 className="gradient-text">
  StatViz
</h1>
```

**Key points:**
- Use `bg-gradient-to-r` for horizontal gradients (works correctly in RTL)
- Use `bg-gradient-to-br` for diagonal background gradients
- Always pair with hover effects: `hover:from-blue-700 hover:to-indigo-700`
- Combine with shadows for depth: `shadow-lg hover:shadow-xl`
- Use `bg-clip-text text-transparent` for gradient text

### Pattern 3: Tailwind Config Extensions

**When to use:** Define reusable gradient patterns, custom shadows.

**Code example:**

```typescript
// tailwind.config.ts - EXTEND existing config
import type { Config } from "tailwindcss"

const config = {
  // ... existing config
  theme: {
    extend: {
      colors: {
        // Keep existing shadcn/ui color tokens (DON'T DELETE)
        // Add new gradient tokens
        'gradient-start': 'hsl(221 83% 53%)', // blue-600
        'gradient-end': 'hsl(239 84% 67%)',   // indigo-600
      },
      backgroundImage: {
        // Add reusable gradient patterns
        'gradient-primary': 'linear-gradient(to right, hsl(221 83% 53%), hsl(239 84% 67%))',
        'gradient-hero': 'linear-gradient(to bottom right, hsl(210 40% 98%), hsl(221 83% 95%), hsl(239 84% 92%))',
      },
      boxShadow: {
        // Add custom shadow levels
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07)',
        'glow': '0 0 20px -5px rgba(59, 130, 246, 0.5)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
} satisfies Config

export default config
```

**Key points:**
- Extend, don't replace - keep all existing shadcn/ui colors
- Use HSL format for color consistency
- Add gradient utilities for common patterns
- Test in production build (Tailwind JIT may purge unused classes)

## Component Patterns

### Pattern 4: Button with Gradient Variant

**When to use:** Primary CTAs, admin dashboard actions, important buttons.

**Code example:**

```typescript
// components/ui/button.tsx - ADD gradient variant
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // ADD THIS NEW VARIANT
        gradient: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// ... rest of component unchanged
export { Button, buttonVariants }
```

**Usage:**

```tsx
// In any component
<Button variant="gradient" size="lg">
  התחבר למערכת
</Button>

// With icon
<Button variant="gradient" className="gap-2">
  <Plus className="h-4 w-4" />
  צור פרויקט חדש
</Button>
```

**Key points:**
- Add as new variant, DON'T modify existing variants
- Include text-white for readability on gradient
- Add shadow-lg and hover:shadow-xl for depth
- Use duration-200 for smooth transitions

### Pattern 5: Logo Component (Reusable Branding)

**When to use:** Admin header, landing page navigation, any branding element.

**Code example:**

```tsx
// components/shared/Logo.tsx - CREATE THIS FILE
import { BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showText?: boolean
}

export function Logo({ size = 'md', className, showText = true }: LogoProps) {
  const sizes = {
    sm: {
      icon: 'h-6 w-6',
      container: 'h-8 w-8',
      text: 'text-lg',
    },
    md: {
      icon: 'h-6 w-6',
      container: 'h-10 w-10',
      text: 'text-2xl',
    },
    lg: {
      icon: 'h-8 w-8',
      container: 'h-14 w-14',
      text: 'text-3xl',
    },
  }

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className={cn(
        'rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center',
        sizes[size].container
      )}>
        <BarChart3 className={cn('text-white', sizes[size].icon)} />
      </div>
      {showText && (
        <div>
          <h1 className={cn(
            'font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent',
            sizes[size].text
          )}>
            StatViz
          </h1>
        </div>
      )}
    </div>
  )
}
```

**Usage:**

```tsx
// In DashboardHeader.tsx
import { Logo } from '@/components/shared/Logo'

export function DashboardHeader() {
  return (
    <header className="...">
      <Logo size="md" />
      {/* ... logout button */}
    </header>
  )
}

// In landing page navigation (optional, can use inline)
<Logo size="lg" />
```

**Key points:**
- Reusable across all pages (admin header, landing page)
- Size prop controls icon/text sizing
- showText prop allows icon-only mode
- Use cn() utility for className merging

### Pattern 6: Enhanced Form with Validation

**When to use:** Admin login, project creation, password prompts.

**Code example:**

```tsx
// components/admin/LoginForm.tsx - ENHANCE EXISTING FILE
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/lib/hooks/useAuth'

// DO NOT MODIFY - Keep existing schema
const LoginSchema = z.object({
  username: z.string().min(1, 'שם משתמש נדרש'),
  password: z.string().min(1, 'סיסמה נדרשת'),
})

type LoginFormData = z.infer<typeof LoginSchema>

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoading } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  })

  async function onSubmit(data: LoginFormData) {
    await login(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" dir="rtl">
      <div className="space-y-2">
        <Label htmlFor="username" className="text-sm font-medium text-slate-700">
          שם משתמש
        </Label>
        <Input
          id="username"
          type="text"
          {...register('username')}
          placeholder="הזן שם משתמש"
          className={cn(
            "transition-all",
            errors.username ? 'border-destructive focus-visible:ring-destructive' : ''
          )}
          disabled={isLoading}
          autoComplete="username"
        />
        {errors.username && (
          <p className="text-sm text-destructive flex items-center gap-1">
            {errors.username.message}
          </p>
        )}
      </div>

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
            className={cn(
              "transition-all pl-10", // Add padding for icon
              errors.password ? 'border-destructive focus-visible:ring-destructive' : ''
            )}
            disabled={isLoading}
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-destructive flex items-center gap-1">
            {errors.password.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        variant="gradient" // USE NEW GRADIENT VARIANT
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            מתחבר...
          </>
        ) : (
          'התחבר'
        )}
      </Button>
    </form>
  )
}
```

**Key points:**
- DO NOT modify Zod schemas (validation logic)
- DO enhance visual styling (borders, colors, spacing)
- Use gradient button variant for submit
- Add Loader2 icon during loading states
- Preserve Hebrew error messages
- Keep RTL dir attribute on form

### Pattern 7: Sticky Navigation with Backdrop Blur

**When to use:** Admin header, landing page navigation.

**Code example:**

```tsx
// components/admin/DashboardHeader.tsx - ENHANCE EXISTING FILE
'use client'

import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/hooks/useAuth'
import { Logo } from '@/components/shared/Logo'

export function DashboardHeader() {
  const { logout, isLoading } = useAuth()

  return (
    <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo with gradient branding */}
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <span className="text-slate-500 text-sm">
              • פאנל ניהול
            </span>
          </div>

          {/* Logout button */}
          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            disabled={isLoading}
            className="gap-2 hover:bg-slate-50 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            {isLoading ? 'מתנתק...' : 'התנתק'}
          </Button>
        </div>
      </div>
    </header>
  )
}
```

**Key points:**
- Use `bg-white/80` for semi-transparent background
- Add `backdrop-blur-md` for frosted glass effect
- Use `sticky top-0 z-50` for sticky behavior
- Add subtle shadow: `shadow-sm`
- Test performance (backdrop blur is GPU-intensive)

### Pattern 8: Modal with Backdrop Blur

**When to use:** CreateProjectDialog, SuccessModal, DeleteConfirmModal.

**Code example:**

```tsx
// components/admin/CreateProjectDialog.tsx - ENHANCE EXISTING FILE
'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ProjectForm } from './ProjectForm'

export function CreateProjectDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="gradient" size="lg" className="gap-2 shadow-lg">
          <Plus className="h-5 w-5" />
          צור פרויקט חדש
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[600px] backdrop-blur-sm"
        dir="rtl"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-right">
            יצירת פרויקט חדש
          </DialogTitle>
          <DialogDescription className="text-right text-slate-600">
            מלא את הפרטים ליצירת פרויקט סטטיסטי חדש
          </DialogDescription>
        </DialogHeader>
        <ProjectForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
```

**Enhance DialogOverlay in dialog.tsx:**

```tsx
// components/ui/dialog.tsx - ENHANCE DialogOverlay
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 backdrop-blur-sm", // ADD backdrop-blur-sm
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
```

**Key points:**
- Add `backdrop-blur-sm` to DialogOverlay for modern effect
- Use gradient button for trigger
- Set dir="rtl" on DialogContent
- Keep text-right for RTL alignment
- Test modal stacking (SuccessModal after CreateProjectDialog)

## RTL (Right-to-Left) Patterns

### Pattern 9: RTL Layout with Selective LTR Overrides

**When to use:** All Hebrew content (default RTL), technical fields (LTR override).

**Code example:**

```tsx
// Root layout already sets RTL - app/layout.tsx (DO NOT MODIFY)
<html lang="he" dir="rtl">
  {/* All content is RTL by default */}
</html>

// Form with mixed RTL/LTR content
<form dir="rtl" className="space-y-4">
  {/* Hebrew label - RTL (no override needed) */}
  <Label>כתובת אימייל</Label>

  {/* Email input - LTR override */}
  <Input
    type="email"
    dir="ltr"
    className="text-left" // Force left alignment for LTR content
    placeholder="student@example.com"
  />

  {/* Password - LTR override */}
  <Input
    type="password"
    dir="ltr"
    className="text-left"
    placeholder="••••••••"
  />

  {/* Hebrew text - RTL (default) */}
  <p className="text-right">טקסט בעברית</p>
</form>

// Table with mixed content
<Table dir="rtl">
  <TableHeader>
    <TableRow>
      <TableHead className="text-right">שם פרויקט</TableHead>
      <TableHead className="text-right">תיאור</TableHead>
      <TableHead className="text-left" dir="ltr">Email</TableHead> {/* LTR column */}
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell className="text-right">{project.name}</TableCell>
      <TableCell className="text-right">{project.description}</TableCell>
      <TableCell className="text-left" dir="ltr">{project.student_email}</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

**Key points:**
- Default to RTL (no dir attribute needed for Hebrew content)
- Add `dir="ltr"` for emails, passwords, URLs, technical codes
- Use `text-right` for Hebrew, `text-left` for LTR overrides
- Gradients work correctly in RTL (no manual reversal)
- Test all components in browser with RTL mode

## Responsive Design Patterns

### Pattern 10: Mobile-First Responsive Layout

**When to use:** All layouts, especially admin dashboard and forms.

**Code example:**

```tsx
// Admin dashboard container - mobile-first approach
<div className="container mx-auto px-4 sm:px-6 lg:px-8">
  {/* Content */}
</div>

// Responsive grid - stacks on mobile, 3 columns on desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
  <FeatureCard />
  <FeatureCard />
  <FeatureCard />
</div>

// Responsive text sizing
<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
  כותרת ראשית
</h1>

// Responsive button layout - stack on mobile, side-by-side on tablet+
<div className="flex flex-col sm:flex-row gap-4">
  <Button variant="gradient" className="w-full sm:w-auto">
    פעולה ראשית
  </Button>
  <Button variant="outline" className="w-full sm:w-auto">
    פעולה משנית
  </Button>
</div>

// Touch-optimized button (mobile)
<Button
  size="lg"
  className="w-full min-h-[44px]" // 44px minimum for touch targets
>
  לחץ כאן
</Button>
```

**Breakpoints:**
- **Default (mobile):** 320px-640px - Stack vertically, full-width buttons
- **sm:** 640px+ - Side-by-side buttons, tighter spacing
- **md:** 768px+ - Multi-column grids, larger text
- **lg:** 1024px+ - Max-width containers, desktop spacing

**Key points:**
- Build mobile layout first, enhance for larger screens
- Use `w-full sm:w-auto` pattern for responsive buttons
- Minimum 44px height for touch targets
- Test at 375px (iPhone SE), 768px (tablet), 1024px (desktop)

## State Management Patterns

### Pattern 11: React Query for Server State

**When to use:** Fetching admin projects, student project data.

**Code example:**

```typescript
// lib/hooks/useProjects.ts - EXISTING FILE (DO NOT MODIFY LOGIC)
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// Fetch all projects (admin dashboard)
export function useProjects() {
  return useQuery({
    queryKey: ['admin', 'projects'],
    queryFn: async () => {
      const response = await fetch('/api/admin/projects', { credentials: 'include' })
      if (!response.ok) throw new Error('Failed to fetch projects')
      return response.json()
    },
    staleTime: 60000, // 1 minute
  })
}

// Delete project mutation
export function useDeleteProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (projectId: string) => {
      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!response.ok) throw new Error('Failed to delete project')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'projects'] })
    },
  })
}
```

**Usage in components (ONLY enhance UI, not logic):**

```tsx
// components/admin/ProjectsContainer.tsx
'use client'

import { useProjects } from '@/lib/hooks/useProjects'
import { ProjectTable } from './ProjectTable'
import { Loader2 } from 'lucide-react'

export function ProjectsContainer() {
  const { data: projects, isLoading, error } = useProjects()

  // ENHANCE: Better loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="mr-3 text-slate-600">טוען פרויקטים...</span>
      </div>
    )
  }

  // ENHANCE: Better error state
  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
        <p className="text-destructive font-medium">שגיאה בטעינת פרויקטים</p>
        <p className="text-sm text-slate-600 mt-2">{error.message}</p>
      </div>
    )
  }

  return <ProjectTable projects={projects} />
}
```

**Key points:**
- DO NOT modify React Query logic (queryKey, queryFn, mutations)
- DO enhance loading/error UI components
- Use Loader2 icon with animate-spin for loading states
- Show clear error messages in Hebrew

## Testing Patterns

### Pattern 12: Manual Testing Checklist

**When to use:** After completing each component, before marking builder task complete.

**Authentication Testing:**

```bash
# Admin Authentication Flow
1. Navigate to /admin
2. Enter correct username/password → Should redirect to /admin/dashboard
3. Enter incorrect username/password → Should show Hebrew error message
4. Verify session persists (refresh page, should stay logged in)
5. Click logout → Should redirect to /admin login
6. Verify logout cleared session (try /admin/dashboard, should redirect to login)
```

**Form Validation Testing:**

```bash
# Test all error states
1. Submit form with empty fields → Should show "נדרש" errors in Hebrew
2. Submit form with invalid email → Should show email format error
3. Verify error borders are red (border-destructive)
4. Verify error text is visible and readable
5. Verify RTL alignment of error messages
```

**Responsive Design Testing:**

```bash
# Chrome DevTools responsive mode
1. Test at 375px width (mobile) → Should stack vertically, buttons full-width
2. Test at 768px width (tablet) → Should show 2-column grids
3. Test at 1024px width (desktop) → Should show 3-column grids
4. Verify touch targets are minimum 44px height
5. Test hover states work on desktop
```

**RTL Layout Testing:**

```bash
# Browser DevTools RTL verification
1. Open Chrome DevTools → Elements tab
2. Find <html dir="rtl"> in DOM
3. Verify Hebrew text aligns to right
4. Verify gradients render correctly
5. Verify icons position correctly (no manual flipping)
6. Test mixed RTL/LTR content (Hebrew labels + English emails)
```

**Key points:**
- Test after each component modification
- Use Chrome DevTools for responsive testing
- Verify RTL layout with Hebrew text
- Test authentication flows end-to-end

## Import Order Convention

**Standard import order for all components:**

```typescript
// 1. React and Next.js imports
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// 2. Third-party libraries
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// 3. lucide-react icons
import { Plus, Loader2, Eye, EyeOff } from 'lucide-react'

// 4. UI components (shadcn/ui)
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent } from '@/components/ui/dialog'

// 5. Feature components
import { ProjectForm } from '@/components/admin/ProjectForm'
import { Logo } from '@/components/shared/Logo'

// 6. Hooks
import { useAuth } from '@/lib/hooks/useAuth'
import { useProjects } from '@/lib/hooks/useProjects'

// 7. Utils and types
import { cn } from '@/lib/utils'
import type { Project } from '@/types'
```

## Code Quality Standards

**TypeScript Strictness:**
- Always type component props with interfaces
- Use `type` for simple unions, `interface` for objects
- Avoid `any` - use `unknown` if type is truly unknown
- Use Zod for runtime validation, TypeScript for compile-time types

**Component Structure:**
```tsx
// 1. Imports
// 2. Types/Interfaces
// 3. Component function
// 4. Event handlers (if any)
// 5. Return JSX
// 6. Export
```

**CSS Class Organization:**
```tsx
// Order: Layout → Sizing → Spacing → Colors → Typography → Effects
<div className="flex items-center gap-4 w-full h-10 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md shadow-lg hover:shadow-xl transition-all">
```

## Performance Patterns

**Optimize Bundle Size:**
- Import icons individually: `import { Plus } from 'lucide-react'` (not `import * as Icons`)
- Use Tailwind utilities (no custom CSS files)
- Avoid unnecessary client components (use server components when possible)

**Optimize Animations:**
- Use transform/opacity for animations (GPU-accelerated)
- Avoid animating layout properties (width, height, top, left)
- Keep transitions under 300ms duration

**Example:**
```tsx
// GOOD - GPU-accelerated
<div className="transition-all duration-200 hover:scale-105 hover:opacity-90">

// BAD - Layout thrashing
<div className="transition-all duration-200 hover:w-[200px] hover:h-[200px]">
```

## Security Patterns

**Password Visibility Toggle:**
```tsx
const [showPassword, setShowPassword] = useState(false)

<Input
  type={showPassword ? 'text' : 'password'}
  autoComplete="current-password"
/>
<button onClick={() => setShowPassword(!showPassword)}>
  {showPassword ? <EyeOff /> : <Eye />}
</button>
```

**Secure Form Submission:**
```tsx
// Always use credentials: 'include' for authenticated requests
fetch('/api/admin/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include', // Include cookies
  body: JSON.stringify(data),
})
```

**Key points:**
- Never log sensitive data (passwords, tokens)
- Use httpOnly cookies for sessions (already configured)
- Validate on both client (Zod) and server (DO NOT MODIFY server validation)

---

**Remember:**
- Follow these patterns consistently for all components
- Test each pattern in RTL mode
- Verify responsive behavior at all breakpoints
- DO NOT modify validation logic or authentication flows
- Only enhance visual styling and user experience
