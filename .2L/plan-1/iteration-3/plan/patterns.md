# Code Patterns & Conventions - Iteration 3

## File Structure

```
app/
├── (admin)/                      # Existing - Admin panel routes
│   ├── admin/
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   └── dashboard/
│   └── layout.tsx
├── (student)/                    # NEW - Student routes
│   └── preview/
│       └── [projectId]/
│           ├── page.tsx          # Password prompt + viewer
│           └── loading.tsx       # Optional loading state
├── api/                          # Existing - No changes
│   ├── admin/
│   │   └── login/
│   └── preview/
│       └── [id]/
│           ├── verify/           # Password verification
│           ├── route.ts          # Project metadata
│           ├── html/             # HTML serving
│           └── download/         # DOCX download
├── layout.tsx                    # Root layout
└── globals.css                   # Global styles

components/
├── ui/                           # Existing - shadcn/ui
│   ├── button.tsx
│   ├── input.tsx
│   ├── label.tsx
│   └── skeleton.tsx
├── admin/                        # Existing - Admin components
│   ├── LoginForm.tsx
│   ├── ProjectForm.tsx
│   └── ProjectTable.tsx
└── student/                      # NEW - Student components
    ├── PasswordPromptForm.tsx    # Builder-1
    ├── ProjectViewer.tsx         # Builder-2
    ├── ProjectMetadata.tsx       # Builder-2
    ├── HtmlIframe.tsx            # Builder-2
    └── DownloadButton.tsx        # Builder-3

lib/
├── auth/                         # Existing - No changes
│   ├── project.ts                # verifyProjectPassword, verifyProjectToken
│   └── middleware.ts             # requireProjectAuth
├── hooks/                        # NEW - Student hooks
│   ├── useProjectAuth.ts         # Builder-1
│   └── useProject.ts             # Builder-2
├── types/
│   └── student.ts                # NEW - Student types
├── upload/
│   └── validator.ts              # ENHANCE - File size warnings
└── env.ts                        # Existing - No changes

middleware.ts                     # ENHANCE - CSP headers

prisma/
└── schema.prisma                 # Existing - No changes

docs/                             # NEW - Deployment docs
├── DEPLOYMENT.md                 # Builder-3
└── MOBILE_TESTING.md             # Builder-3
```

## Naming Conventions

**Files:**
- Components: PascalCase (`PasswordPromptForm.tsx`)
- Utilities: camelCase (`useProjectAuth.ts`)
- Types: camelCase (`student.ts`)
- Pages: lowercase (`page.tsx`, `layout.tsx`)

**Components:**
- React components: PascalCase (`ProjectViewer`)
- Hooks: camelCase with `use` prefix (`useProject`)

**Functions:**
- Functions: camelCase (`verifyProjectPassword`)
- Constants: SCREAMING_SNAKE_CASE (`MAX_FILE_SIZE`)

**Types:**
- Interfaces/Types: PascalCase (`ProjectData`, `SessionState`)
- Enums: PascalCase (`StorageType`)

## Authentication Pattern

### Client-Side Session Check

**When to use:** On page load, check if user has valid session

**Pattern:**
```typescript
// lib/hooks/useProjectAuth.ts
'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface SessionState {
  authenticated: boolean;
  loading: boolean;
  error: string | null;
}

export function useProjectAuth(projectId: string) {
  const [session, setSession] = useState<SessionState>({
    authenticated: false,
    loading: true,
    error: null,
  });
  const router = useRouter();

  useEffect(() => {
    checkSession();
  }, [projectId]);

  async function checkSession() {
    try {
      const response = await fetch(`/api/preview/${projectId}`);
      const data = await response.json();

      if (response.ok && data.success) {
        setSession({ authenticated: true, loading: false, error: null });
      } else if (response.status === 401) {
        setSession({ authenticated: false, loading: false, error: null });
      } else {
        setSession({
          authenticated: false,
          loading: false,
          error: data.error?.message || 'שגיאה בטעינת הפרויקט',
        });
      }
    } catch (error) {
      setSession({
        authenticated: false,
        loading: false,
        error: 'שגיאת רשת. אנא בדוק את החיבור לאינטרנט.',
      });
    }
  }

  return { session, refetchSession: checkSession };
}
```

**Usage:**
```typescript
// app/(student)/preview/[projectId]/page.tsx
'use client'

export default function PreviewPage({ params }: { params: { projectId: string } }) {
  const { session, refetchSession } = useProjectAuth(params.projectId);

  if (session.loading) {
    return <LoadingSkeleton />;
  }

  if (!session.authenticated) {
    return <PasswordPromptForm projectId={params.projectId} onSuccess={refetchSession} />;
  }

  return <ProjectViewer projectId={params.projectId} />;
}
```

### Password Verification

**When to use:** Student submits password to gain access

**Pattern:**
```typescript
// components/student/PasswordPromptForm.tsx
'use client'

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { toast } from 'sonner';

const PasswordSchema = z.object({
  password: z.string()
    .min(1, 'נא להזין סיסמה')
    .max(100, 'סיסמה ארוכה מדי'),
});

type PasswordFormData = z.infer<typeof PasswordSchema>;

interface PasswordPromptFormProps {
  projectId: string;
  onSuccess: () => void;
}

export function PasswordPromptForm({ projectId, onSuccess }: PasswordPromptFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(PasswordSchema),
  });

  async function onSubmit(data: PasswordFormData) {
    try {
      const response = await fetch(`/api/preview/${projectId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success('אימות הצליח!');
        onSuccess();
      } else if (response.status === 429) {
        toast.error('יותר מדי ניסיונות. נסה שוב בעוד שעה.');
      } else {
        toast.error(result.error?.message || 'סיסמה שגויה');
      }
    } catch (error) {
      toast.error('שגיאת רשת. אנא בדוק את החיבור לאינטרנט.');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-center mb-6">
            גישה לפרויקט
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="password">סיסמה</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className={`text-base ${errors.password ? 'border-destructive' : ''}`}
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? 'הסתר סיסמה' : 'הצג סיסמה'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full min-h-[44px]"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'מאמת...' : 'כניסה'}
            </Button>
          </form>

          <p className="text-sm text-muted-foreground text-center mt-4">
            הסיסמה נשלחה אליך במייל
          </p>
        </div>
      </div>
    </div>
  );
}
```

**Key Points:**
- Reuses `LoginForm.tsx` pattern from iteration 2
- React Hook Form + Zod validation
- Password show/hide toggle
- Touch-friendly button (44px minimum)
- Hebrew error messages
- Loading state during submission

## API Response Format

**Standard Structure:**
```typescript
// Successful response
{
  success: true,
  data: {
    // Response payload
  }
}

// Error response
{
  success: false,
  error: {
    code: string,      // Machine-readable error code
    message: string,   // Hebrew user-facing message
    details?: unknown  // Optional validation details
  }
}
```

**Error Codes:**
- `AUTH_REQUIRED` - No token provided
- `INVALID_TOKEN` - Token expired or invalid
- `SESSION_EXPIRED` - Session not found or expired
- `INVALID_PASSWORD` - Wrong password
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `VALIDATION_ERROR` - Zod validation failed
- `PROJECT_NOT_FOUND` - Project doesn't exist
- `INTERNAL_ERROR` - Unexpected error

**Usage Pattern:**
```typescript
// Client-side API call
async function fetchProject(projectId: string) {
  const response = await fetch(`/api/preview/${projectId}`);
  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error?.message || 'Failed to fetch project');
  }

  return data.data.project;
}
```

## Component Structure

### Mobile-First Responsive Component

**Pattern:**
```typescript
// components/student/ProjectViewer.tsx
'use client'

import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { ProjectMetadata } from './ProjectMetadata';
import { HtmlIframe } from './HtmlIframe';
import { DownloadButton } from './DownloadButton';

interface ProjectViewerProps {
  projectId: string;
}

export function ProjectViewer({ projectId }: ProjectViewerProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const response = await fetch(`/api/preview/${projectId}`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || 'Failed to load project');
      }

      return result.data.project;
    },
    staleTime: 1000 * 60 * 60, // 1 hour (project data rarely changes)
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="mr-2 text-muted-foreground">טוען פרויקט...</span>
      </div>
    );
  }

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
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header - Mobile: compact, Desktop: spacious */}
      <ProjectMetadata project={data} />

      {/* Main content - Full viewport minus header */}
      <main className="flex-1 relative">
        <HtmlIframe projectId={projectId} />
      </main>

      {/* Download button - Mobile: fixed bottom, Desktop: top-right */}
      <DownloadButton projectId={projectId} projectName={data.name} />
    </div>
  );
}
```

**Key Points:**
- TanStack Query for data fetching (caching, loading states)
- Mobile-first layout (flexbox column)
- Hebrew loading/error messages
- Proper loading and error states

## Hebrew RTL Guidelines

### Global Configuration (Existing)

**Root layout:**
```typescript
// app/layout.tsx
import { Rubik } from 'next/font/google';

const rubik = Rubik({
  subsets: ['hebrew', 'latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-rubik',
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={rubik.variable}>
      <body className="font-sans">
        {children}
        <Toaster
          position="top-left"  // RTL positioning
          richColors
          closeButton
          toastOptions={{
            duration: 4000,
            style: { direction: 'rtl' }
          }}
        />
      </body>
    </html>
  );
}
```

### Mixed Content (Hebrew + English)

**Pattern:**
```typescript
// Email display (LTR within RTL context)
<div className="space-y-1">
  <p className="text-sm">סטודנט: {project.studentName}</p>
  <p className="text-sm" dir="ltr">
    <span className="text-muted-foreground">Email:</span>{' '}
    <span className="text-left">{project.studentEmail}</span>
  </p>
</div>
```

**Key Points:**
- Use `dir="ltr"` for email addresses
- Combine with `text-left` class
- Keep Hebrew text in default RTL

### Icon Positioning

**Pattern:**
```typescript
// Icon in RTL button (automatically positioned right)
<Button>
  <Download className="ml-2 h-5 w-5" />  {/* ml-2 becomes mr-2 in RTL */}
  הורד קובץ
</Button>

// Or use explicit logical properties
<Button>
  <Download className="me-2 h-5 w-5" />  {/* me = margin-inline-end */}
  הורד קובץ
</Button>
```

**Key Points:**
- Tailwind automatically flips `ml/mr` in RTL
- Use logical properties (`ms`, `me`) for explicit control

## Error Handling

### Client-Side Error Handling

**Pattern:**
```typescript
// components/student/HtmlIframe.tsx
'use client'

import { useState, useEffect, useRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

interface HtmlIframeProps {
  projectId: string;
}

export function HtmlIframe({ projectId }: HtmlIframeProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Timeout fallback if iframe doesn't load
    const timeout = setTimeout(() => {
      if (isLoading) {
        setHasError(true);
        setIsLoading(false);
      }
    }, 15000); // 15 second timeout

    return () => clearTimeout(timeout);
  }, [isLoading]);

  function handleLoad() {
    setIsLoading(false);
    setHasError(false);
  }

  function openInNewTab() {
    window.open(`/api/preview/${projectId}/html`, '_blank');
  }

  if (hasError) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center max-w-md">
          <p className="text-lg mb-4">לא ניתן להציג את הדוח בדפדפן</p>
          <p className="text-sm text-muted-foreground mb-6">
            ייתכן שהדוח גדול מדי או שיש בעיית רשת
          </p>
          <Button onClick={openInNewTab} size="lg">
            פתח בחלון חדש
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 z-10">
          <Skeleton className="w-full h-full" />
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-muted-foreground">טוען דוח...</p>
          </div>
        </div>
      )}

      <iframe
        ref={iframeRef}
        src={`/api/preview/${projectId}/html`}
        sandbox="allow-scripts allow-same-origin"
        className="w-full h-full border-0 lg:rounded-lg lg:border"
        title="Statistical Analysis Report"
        onLoad={handleLoad}
      />
    </div>
  );
}
```

**Key Points:**
- Loading skeleton while iframe loads
- 15-second timeout detection
- Fallback UI with "open in new tab" option
- Hebrew error messages

### Toast Notifications

**Pattern:**
```typescript
import { toast } from 'sonner';

// Success
toast.success('אימות הצליח!');

// Error
toast.error('סיסמה שגויה');

// Warning
toast.warning('הקובץ גדול מדי. ייתכן טעינה איטית.');

// Info
toast.info('ההורדה תתחיל בקרוב');

// With duration
toast.error('שגיאת רשת', { duration: 6000 });

// With action
toast.error('הפגישה פגה תוקף', {
  action: {
    label: 'התחבר שוב',
    onClick: () => window.location.reload(),
  },
});
```

**Key Points:**
- Always use Hebrew messages
- RTL positioning configured globally
- 4-second default duration
- Use action buttons for recoverable errors

## Loading States

### Skeleton Pattern

**Pattern:**
```typescript
// components/student/LoadingSkeleton.tsx
import { Skeleton } from '@/components/ui/skeleton';

export function ProjectViewerSkeleton() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header skeleton */}
      <div className="border-b p-4 lg:p-6">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-48" />
      </div>

      {/* Content skeleton */}
      <div className="flex-1 p-4">
        <Skeleton className="w-full h-full min-h-[600px]" />
      </div>

      {/* Button skeleton */}
      <div className="p-4 lg:absolute lg:top-4 lg:right-4">
        <Skeleton className="h-11 w-full lg:w-40" />
      </div>
    </div>
  );
}
```

**Usage:**
```typescript
if (isLoading) {
  return <ProjectViewerSkeleton />;
}
```

### Spinner Pattern

**Pattern:**
```typescript
import { Loader2 } from 'lucide-react';

// Inline spinner
<Button disabled={isLoading}>
  {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
  {isLoading ? 'מוריד...' : 'הורד'}
</Button>

// Full-page spinner
<div className="min-h-screen flex items-center justify-center">
  <Loader2 className="h-8 w-8 animate-spin text-primary" />
  <span className="mr-2">טוען...</span>
</div>
```

## File Serving Pattern

### API Route (Existing - No Changes)

**Pattern (from iteration 1):**
```typescript
// app/api/preview/[id]/html/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyProjectToken } from '@/lib/auth/project';
import { prisma } from '@/lib/prisma';
import { fileStorage } from '@/lib/storage';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const projectId = params.id;

  // Verify session token
  const token = req.cookies.get('project_token')?.value;
  if (!token) {
    return NextResponse.json(
      {
        success: false,
        error: { code: 'AUTH_REQUIRED', message: 'נדרשת הזדהות' }
      },
      { status: 401 }
    );
  }

  const isValid = await verifyProjectToken(token, projectId);
  if (!isValid) {
    return NextResponse.json(
      {
        success: false,
        error: { code: 'SESSION_EXPIRED', message: 'הפגישה פגה תוקף' }
      },
      { status: 401 }
    );
  }

  // Check project exists
  const project = await prisma.project.findUnique({
    where: { projectId },
    select: { deletedAt: true }
  });

  if (!project || project.deletedAt) {
    return NextResponse.json(
      {
        success: false,
        error: { code: 'PROJECT_NOT_FOUND', message: 'פרויקט לא נמצא' }
      },
      { status: 404 }
    );
  }

  // Serve HTML file
  const htmlBuffer = await fileStorage.download(projectId, 'report.html');

  return new NextResponse(htmlBuffer.toString('utf-8'), {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'private, max-age=3600',
    }
  });
}
```

**Key Points:**
- Session validation before file access
- Soft delete check
- 1-hour private cache
- Hebrew error messages

### DOCX Download Pattern

**Pattern:**
```typescript
// app/api/preview/[id]/download/route.ts (existing)
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  // ... session validation (same as HTML route)

  // Fetch project name for filename
  const project = await prisma.project.findUnique({
    where: { projectId },
    select: { projectName: true, deletedAt: true }
  });

  // Download file
  const docxBuffer = await fileStorage.download(projectId, 'findings.docx');

  // Sanitize filename (Hebrew-safe)
  const sanitizedName = project.projectName
    .replace(/[^a-zA-Z0-9\u0590-\u05FF\s-]/g, '') // Keep Hebrew chars
    .replace(/\s+/g, '_')
    .substring(0, 50) || 'findings';

  const filename = `${sanitizedName}_findings.docx`;

  return new NextResponse(new Uint8Array(docxBuffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
      'Cache-Control': 'private, max-age=3600',
    }
  });
}
```

**Key Points:**
- Hebrew-safe filename sanitization (`\u0590-\u05FF`)
- URI encoding for Hebrew characters
- Force download (`attachment`)
- Proper MIME type

## Iframe Security

### Secure Iframe Implementation

**Pattern:**
```typescript
// components/student/HtmlIframe.tsx
<iframe
  src={`/api/preview/${projectId}/html`}
  sandbox="allow-scripts allow-same-origin"
  title="Statistical Analysis Report"
  className="w-full h-full border-0 lg:rounded-lg lg:border"
  loading="lazy"
  referrerPolicy="strict-origin-when-cross-origin"
/>
```

**Sandbox Attributes:**
- `allow-scripts` - Required for Plotly.js
- `allow-same-origin` - Required for Plotly DOM access
- **NOT included:** `allow-forms`, `allow-popups`, `allow-top-navigation`

### CSP Headers (Middleware Enhancement)

**Pattern:**
```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Tighten CSP for iframe content routes
  if (request.nextUrl.pathname.startsWith('/api/preview/')) {
    response.headers.set(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline'",  // Plotly requires inline
        "style-src 'self' 'unsafe-inline' data:",  // Plotly uses data URLs
        "img-src 'self' data: blob:",
        "connect-src 'self'",
        "frame-ancestors 'none'",  // Prevent embedding our iframes
      ].join('; ')
    );
  }

  return response;
}

export const config = {
  matcher: ['/api/preview/:path*'],
};
```

**Changes from Iteration 2:**
- **Removed:** `unsafe-eval` (not needed for Plotly)
- **Added:** `data:` for style-src (Plotly data URLs)
- **Added:** `blob:` for img-src (Plotly blob URLs)
- **Added:** `frame-ancestors 'none'` (prevent clickjacking)

## Mobile Optimization

### Viewport Configuration

**Pattern:**
```typescript
// app/layout.tsx
export const metadata: Metadata = {
  title: 'StatViz - פלטפורמת דוחות סטטיסטיים',
  description: 'פלטפורמה מאובטחת לצפייה בדוחות ניתוח סטטיסטיים',
  viewport: {
    width: 'device-width',
    initialScale: 1.0,
    maximumScale: 5.0,  // Allow zoom for accessibility
  },
};
```

**Or as meta tag:**
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
```

### Touch-Friendly Components

**Pattern:**
```typescript
// components/student/DownloadButton.tsx
'use client'

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface DownloadButtonProps {
  projectId: string;
  projectName: string;
}

export function DownloadButton({ projectId, projectName }: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  async function handleDownload() {
    setIsDownloading(true);
    toast.info('ההורדה מתחילה...');

    try {
      // Trigger download via window.location (simpler than fetch for binary files)
      window.location.href = `/api/preview/${projectId}/download`;

      // Toast success after delay (download started)
      setTimeout(() => {
        toast.success('הקובץ הורד בהצלחה');
        setIsDownloading(false);
      }, 1000);
    } catch (error) {
      toast.error('שגיאה בהורדת הקובץ');
      setIsDownloading(false);
    }
  }

  return (
    <Button
      size="lg"
      onClick={handleDownload}
      disabled={isDownloading}
      className="
        min-h-[44px]
        fixed bottom-4 left-4 right-4 z-50 shadow-lg
        lg:relative lg:bottom-0 lg:left-0 lg:right-0 lg:w-auto
        lg:absolute lg:top-4 lg:right-4
      "
    >
      {isDownloading ? (
        <>
          <Loader2 className="ml-2 h-5 w-5 animate-spin" />
          מוריד...
        </>
      ) : (
        <>
          <Download className="ml-2 h-5 w-5" />
          הורד את המסמך המלא
        </>
      )}
    </Button>
  );
}
```

**Key Points:**
- `min-h-[44px]` - Touch target compliance
- Fixed bottom on mobile (thumb-reachable)
- Absolute top-right on desktop
- Loading state with spinner
- Hebrew feedback toasts

### Responsive Layout Pattern

**Pattern:**
```typescript
// components/student/ProjectMetadata.tsx
interface ProjectMetadataProps {
  project: {
    name: string;
    student: { name: string; email: string };
    researchTopic: string;
  };
}

export function ProjectMetadata({ project }: ProjectMetadataProps) {
  return (
    <header className="
      bg-white border-b
      p-4 lg:p-6
    ">
      <div className="max-w-6xl mx-auto">
        {/* Project name - Larger on desktop */}
        <h1 className="
          text-xl font-bold mb-2
          lg:text-3xl lg:mb-3
        ">
          {project.name}
        </h1>

        {/* Metadata - Stack on mobile, row on desktop */}
        <div className="
          space-y-1
          text-sm
          lg:text-base lg:flex lg:gap-4 lg:space-y-0
        ">
          <p className="text-muted-foreground">
            סטודנט: <span className="text-foreground">{project.student.name}</span>
          </p>

          <p className="text-muted-foreground" dir="ltr">
            <span className="text-left">{project.student.email}</span>
          </p>
        </div>

        {/* Research topic - Truncate on mobile */}
        <p className="
          text-sm text-muted-foreground mt-2
          line-clamp-2
          lg:text-base lg:line-clamp-none
        ">
          נושא: {project.researchTopic}
        </p>
      </div>
    </header>
  );
}
```

**Key Points:**
- Mobile-first design (base styles for mobile)
- Progressive enhancement with `lg:` prefixes
- Compact on mobile, spacious on desktop
- Text truncation on mobile (`line-clamp-2`)

## Import Order Convention

**Pattern:**
```typescript
// 1. React and Next.js imports
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 2. External libraries
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

// 3. UI components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

// 4. Custom components
import { ProjectMetadata } from '@/components/student/ProjectMetadata';
import { HtmlIframe } from '@/components/student/HtmlIframe';

// 5. Utilities and hooks
import { useProjectAuth } from '@/lib/hooks/useProjectAuth';
import { cn } from '@/lib/utils';

// 6. Types
import type { ProjectData } from '@/lib/types/student';

// 7. Icons (last)
import { Download, Loader2, Eye, EyeOff } from 'lucide-react';
```

## Code Quality Standards

### TypeScript Standards

**Always:**
- Use explicit return types for functions
- Use `interface` for props, `type` for unions
- Enable strict mode
- Avoid `any` (use `unknown` if necessary)

**Example:**
```typescript
// Good
interface ProjectViewerProps {
  projectId: string;
}

export function ProjectViewer({ projectId }: ProjectViewerProps): JSX.Element {
  // ...
}

// Bad
export function ProjectViewer({ projectId }: any) {
  // ...
}
```

### React Best Practices

**Client Components:**
- Always add `'use client'` directive
- Use hooks (useState, useEffect, etc.)
- Keep components focused (single responsibility)

**Server Components:**
- No `'use client'` directive
- No hooks
- Async components allowed
- Better performance (less JavaScript to client)

### Error Boundaries

**Pattern:**
```typescript
// app/(student)/preview/[projectId]/error.tsx
'use client'

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Preview page error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold mb-4">משהו השתבש</h2>
        <p className="text-muted-foreground mb-6">
          אירעה שגיאה בטעינת הפרויקט. אנא נסה שוב.
        </p>
        <Button onClick={reset} size="lg">
          נסה שוב
        </Button>
      </div>
    </div>
  );
}
```

## Performance Patterns

### Lazy Loading

**Pattern:**
```typescript
import dynamic from 'next/dynamic';

// Lazy load heavy components
const HtmlIframe = dynamic(() => import('@/components/student/HtmlIframe'), {
  loading: () => <Skeleton className="w-full h-full min-h-[600px]" />,
  ssr: false,  // Don't render on server (client-only)
});
```

### Memoization

**Pattern:**
```typescript
import { useMemo } from 'react';

function ProjectViewer({ projectId }: ProjectViewerProps) {
  const downloadUrl = useMemo(
    () => `/api/preview/${projectId}/download`,
    [projectId]
  );

  // Use downloadUrl...
}
```

### Query Caching

**Pattern:**
```typescript
// lib/hooks/useProject.ts
export function useProject(projectId: string) {
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const response = await fetch(`/api/preview/${projectId}`);
      const result = await response.json();
      if (!response.ok) throw new Error(result.error?.message);
      return result.data.project;
    },
    staleTime: 1000 * 60 * 60,  // 1 hour (project metadata rarely changes)
    cacheTime: 1000 * 60 * 60 * 24,  // 24 hours (keep in cache)
    retry: 1,  // Only retry once on failure
  });
}
```

## Security Patterns

### Session Validation (Existing)

**Pattern:**
```typescript
// lib/auth/project.ts (existing, no changes)
export async function verifyProjectToken(
  token: string,
  projectId: string
): Promise<boolean> {
  try {
    // Verify JWT signature
    const decoded = jwt.verify(token, env.JWT_SECRET) as {
      type: string;
      projectId: string;
    };

    // Check token is for correct project
    if (decoded.projectId !== projectId) {
      return false;
    }

    // Check database session exists and not expired
    const session = await prisma.projectSession.findUnique({
      where: { token }
    });

    if (!session || session.expiresAt < new Date()) {
      // Cleanup expired session
      if (session) {
        await prisma.projectSession.delete({ where: { token } });
      }
      return false;
    }

    return true;
  } catch (error) {
    console.error('Token verification failed:', error);
    return false;
  }
}
```

### Input Sanitization

**Pattern:**
```typescript
// lib/upload/validator.ts (enhance for iteration 3)
export function validateHtmlFileSize(buffer: Buffer): ValidationResult {
  const sizeMB = buffer.length / 1024 / 1024;

  if (sizeMB > 10) {
    return {
      isValid: false,
      error: 'קובץ HTML גדול מדי (מקסימום 10MB)',
    };
  }

  if (sizeMB > 5) {
    return {
      isValid: true,
      warning: `קובץ גדול (${sizeMB.toFixed(1)}MB) - עשוי לטעון לאט במובייל`,
    };
  }

  return { isValid: true };
}

export function validateHtmlSelfContained(html: string): ValidationResult {
  const errors: string[] = [];

  // Check for external CSS
  const externalCss = html.match(/<link[^>]+href=["']https?:\/\//gi);
  if (externalCss && externalCss.length > 0) {
    errors.push('הקובץ מכיל CSS חיצוני - חייב להיות עצמאי');
  }

  // Check for external JS
  const externalJs = html.match(/<script[^>]+src=["']https?:\/\//gi);
  if (externalJs && externalJs.length > 0) {
    errors.push('הקובץ מכיל JavaScript חיצוני - חייב להיות עצמאי');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
```

**Key Points:**
- Strengthen validation to ERROR on external resources
- File size warnings for mobile performance
- Hebrew error messages

---

**Patterns Status:** COMPLETE
**Coverage:** All major operations (auth, API, UI, mobile, security)
**Ready for:** Builder implementation
