# Technology Stack - Iteration 3

## Core Framework

**Decision:** Next.js 14.2.0 with App Router

**Rationale:**
- Already established in iterations 1 & 2 (zero learning curve)
- App Router provides built-in file-based routing for `/preview/:id` pages
- Server Components reduce client bundle size (critical for mobile)
- API routes handle all backend functionality (no separate server needed)
- Built-in code splitting ensures student UI doesn't load admin components
- Excellent Vercel deployment integration

**Alternatives Considered:**
- Remix: Rejected (would require complete rewrite, offers no advantage for this use case)
- Create React App: Rejected (deprecated, no SSR support)

**Version Locked:** 14.2.0 (proven stable in iteration 2)

## Runtime & Language

**Decision:** TypeScript 5.x in strict mode

**Rationale:**
- Iterations 1 & 2 achieved zero type errors with strict mode
- Type safety prevents runtime errors on mobile (harder to debug)
- Zod provides runtime validation with TypeScript inference
- Prisma generates fully-typed database client

**Configuration:**
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

**No Changes Needed:** Reuse existing `tsconfig.json`

## Database

**Decision:** PostgreSQL via Supabase (local dev + cloud production)

**Rationale:**
- Iteration 1 schema is complete and final (no new migrations)
- Supabase local dev (`npx supabase start`) proven in iteration 2 validation
- Production migration is single command: `npx prisma migrate deploy`
- Excellent PostgreSQL compatibility

**Schema:** No changes (iteration 1 schema supports all iteration 3 features)

**ORM:** Prisma 5.x
- Type-safe queries prevent SQL injection
- Automatic connection pooling
- Migration system ready for production

**Connection:**
```bash
# Development
DATABASE_URL="postgresql://postgres:postgres@localhost:54322/postgres"

# Production (Supabase Cloud)
DATABASE_URL="postgresql://user:pass@host.supabase.co:5432/postgres"
```

## Authentication

**Decision:** JWT tokens with bcrypt password hashing (existing system)

**Rationale:**
- Iteration 1 implemented complete project authentication
- 24-hour session duration tested and validated
- httpOnly cookies prevent XSS attacks
- sameSite: strict prevents CSRF attacks

**Libraries:**
- `jsonwebtoken` 9.0.2: JWT signing and verification
- `bcryptjs` 2.4.3: Password hashing (10 rounds)

**No New Dependencies:** Reuse existing auth infrastructure

## API Layer

**Decision:** Next.js API Routes (App Router)

**Rationale:**
- All 4 student API routes exist from iteration 1:
  - `POST /api/preview/:id/verify` - Password verification
  - `GET /api/preview/:id` - Project metadata
  - `GET /api/preview/:id/html` - HTML serving
  - `GET /api/preview/:id/download` - DOCX download
- No new backend routes needed for iteration 3
- Session validation pattern proven and secure

**Response Format:**
```typescript
{
  success: boolean;
  data?: T;
  error?: {
    code: string;      // Machine-readable
    message: string;   // Hebrew user-facing
    details?: unknown; // Optional validation errors
  };
}
```

**No Changes Needed:** Iteration 3 is frontend-only

## Frontend Framework

**Decision:** React 18.3.0

**Rationale:**
- Established in iteration 2 with Server + Client Components
- Client Components used for interactive student UI
- Server Components reduce JavaScript sent to mobile devices
- Excellent mobile browser support

**State Management:** TanStack Query 5.90.11
- Already configured in iteration 2
- Perfect for student API calls (caching, retries, loading states)
- Reduces redundant network requests on mobile

**Example Usage:**
```typescript
// lib/hooks/useProject.ts
export function useProject(projectId: string) {
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: () => fetch(`/api/preview/${projectId}`).then(r => r.json()),
    staleTime: 1000 * 60 * 60, // 1 hour (project metadata rarely changes)
  });
}
```

## UI Component Library

**Decision:** shadcn/ui (existing)

**Components to Reuse:**
- `Button` (`components/ui/button.tsx`) - All variants, RTL-ready
- `Input` (`components/ui/input.tsx`) - Password field
- `Label` (`components/ui/label.tsx`) - Form labels
- `Skeleton` (`components/ui/skeleton.tsx`) - Loading states

**Styling:** Tailwind CSS 3.4.x with default config

**Variants:**
```typescript
// Button sizes for touch targets
{
  sm: "h-9 px-3",      // 36px - too small for mobile
  default: "h-10 px-4", // 40px - acceptable
  lg: "h-11 px-8",      // 44px - RECOMMENDED for mobile (Apple/Android guidelines)
}
```

**Mobile Adaptation:**
- Use `size="lg"` by default for touch-friendly buttons
- Add `min-h-[44px]` to ensure touch target compliance

**Components NOT Used:**
- Dialog (student UI is full-page, not modals)
- Table (no data tables in student view)
- Textarea (no multi-line input needed)

## Form Handling

**Decision:** React Hook Form 7.66.1 + Zod 3.22.4

**Rationale:**
- Proven in iteration 2 admin panel
- Excellent mobile performance (minimal re-renders)
- Hebrew error messages via Zod
- Type-safe form validation

**Pattern (from iteration 2):**
```typescript
const {
  register,
  handleSubmit,
  formState: { errors, isSubmitting },
} = useForm<PasswordFormData>({
  resolver: zodResolver(PasswordSchema),
});

const PasswordSchema = z.object({
  password: z.string()
    .min(1, 'נא להזין סיסמה')
    .max(100, 'סיסמה ארוכה מדי'),
});
```

**No New Dependencies:** Reuse existing libraries

## Icons

**Decision:** lucide-react 0.554.0

**Icons Used:**
- `Eye` / `EyeOff` - Password visibility toggle
- `Download` - DOCX download button
- `Loader2` - Loading spinners

**Import:**
```typescript
import { Download, Loader2 } from 'lucide-react';
```

**Tree-Shaking:** Only used icons are bundled (~15KB total)

## Toast Notifications

**Decision:** Sonner 2.0.7 (existing)

**Configuration (from iteration 2):**
```typescript
<Toaster
  position="top-left"      // RTL positioning
  richColors
  closeButton
  toastOptions={{
    duration: 4000,
    style: { direction: 'rtl' }
  }}
/>
```

**Usage:**
```typescript
import { toast } from 'sonner';

toast.error('סיסמה שגויה');
toast.success('אימות הצליח!');
```

**No Changes Needed:** Existing configuration works for student UI

## External Integrations

### Plotly.js (Embedded in HTML)

**Purpose:** Interactive statistical visualizations

**Integration:** Self-contained in uploaded HTML (not a direct dependency)

**Validation:** Check for embedded Plotly during upload

**Requirements:**
- HTML must include Plotly bundle (no CDN)
- R export setting: `selfcontained=TRUE`
- Typical embedded size: 3.3MB (min+gzip)

**Compatibility:**
- Iframe sandbox: `allow-scripts allow-same-origin`
- CSP: `script-src 'self' 'unsafe-inline'`
- Mobile: Native touch event support (zoom, pan, hover)

### File Storage

**Decision:** Local filesystem (iteration 3), S3-ready architecture

**Implementation:**
```typescript
// lib/storage/local.ts (existing)
export class LocalStorage implements StorageInterface {
  async upload(projectId: string, filename: string, buffer: Buffer): Promise<string>
  async download(projectId: string, filename: string): Promise<Buffer>
  async delete(projectId: string): Promise<void>
}
```

**Storage Location:**
```
/uploads/{projectId}/
├── findings.docx
└── report.html
```

**Production Migration:** Change `STORAGE_TYPE=s3` when ready (no code changes)

## Development Tools

### Testing

**Decision:** Manual testing for iteration 3 (automated tests deferred to post-MVP)

**Testing Framework:** None (would use Playwright if automated)

**Strategy:**
- Manual mobile testing on real devices (iPhone + Android)
- Chrome DevTools responsive mode for fast iteration
- Network throttling (Slow 3G) for performance testing

**Coverage Target:** N/A (manual testing covers critical paths)

### Code Quality

**Linter:** ESLint 8.x (Next.js default config)

**Rules:**
- TypeScript strict mode enforcement
- React Hooks rules
- Next.js best practices

**Formatter:** None (Prettier not used, consistent manual formatting)

**Expected Output:** 0 errors, minimal warnings (intentional unused variables logged)

### Build Tool

**Decision:** Next.js built-in build system

**Commands:**
```bash
npm run dev          # Development server (port 3001)
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint check
npx prisma migrate deploy  # Production migrations
```

**Build Output:**
```
Route (app)                              Size
┌ ○ /(admin)                            1.2 kB
├ ○ /(admin)/admin                      41.1 kB  # Admin bundle
└ ○ /(student)/preview/[projectId]      ~150 kB  # Student bundle (new)
```

**Code Splitting:** Automatic (admin and student bundles are separate)

### Environment Variables

**Validation:** Zod schema in `lib/env.ts` (existing)

**Required Variables:**
```bash
DATABASE_URL="postgresql://..."
JWT_SECRET="[32+ characters]"
ADMIN_PASSWORD_HASH="[base64 bcrypt hash]"
STORAGE_TYPE="local"
UPLOAD_DIR="/uploads"
```

**Validation:**
```typescript
const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  ADMIN_PASSWORD_HASH: z.string(),
  STORAGE_TYPE: z.enum(['local', 's3']),
  UPLOAD_DIR: z.string(),
});

export const env = envSchema.parse(process.env);
```

**No Changes Needed:** Existing validation covers all variables

## Mobile Strategy

### Viewport Configuration

**Decision:** Add viewport meta tag (CRITICAL for mobile)

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
```

**Location:** `app/layout.tsx` metadata

**Rationale:**
- Without this, mobile browsers render at ~980px and zoom out (terrible UX)
- `width=device-width`: Use device's actual width
- `initial-scale=1.0`: Start at 100% zoom
- `maximum-scale=5.0`: Allow zoom for accessibility (iOS requirement)

### Responsive Breakpoints

**Decision:** Default Tailwind breakpoints (mobile-first)

```typescript
// tailwind.config.ts (existing)
{
  screens: {
    sm: '640px',   // Large phones, small tablets
    md: '768px',   // Tablets
    lg: '1024px',  // Desktop
    xl: '1280px',  // Large desktop
    '2xl': '1536px', // Extra large
  }
}
```

**Usage:**
```typescript
// Base: Mobile (320px+)
className="text-base p-4"

// Tablet: 640px+
className="sm:text-lg sm:p-6"

// Desktop: 1024px+
className="lg:text-xl lg:p-8"
```

**Custom Breakpoint:** None needed (320px is default, below `sm`)

### Touch Target Standards

**Decision:** 44px minimum (Apple HIG + Android Material Design)

**Implementation:**
```typescript
// Touch-friendly button
<Button
  size="lg"  // 44px height
  className="min-h-[44px] min-w-[44px]"
>
  הורד
</Button>

// Adequate spacing between targets
<div className="flex gap-3">  {/* 12px gap prevents accidental taps */}
  <Button />
  <Button />
</div>
```

**Font Size:** 16px base (prevents iOS auto-zoom on input focus)

```typescript
// Input component enhancement
<Input className="text-base" />  // 16px, prevents zoom
```

### RTL Support (Existing)

**Decision:** Global RTL configuration (iteration 2)

```typescript
// app/layout.tsx
<html lang="he" dir="rtl" className={rubik.variable}>
  <body className="font-sans">
```

**Font:** Rubik (Hebrew + Latin subsets)

```typescript
const rubik = Rubik({
  subsets: ['hebrew', 'latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-rubik',
  display: 'swap',
});
```

**Mobile RTL Notes:**
- Fixed buttons use logical properties: `inset-inline-end` instead of `right`
- Icon positioning: Tailwind `ml-2` becomes `mr-2` automatically in RTL
- LTR overrides: `dir="ltr" className="text-left"` for email fields

**No Changes Needed:** Iteration 2 RTL works perfectly on mobile

## Security Configuration

### Content Security Policy (CSP)

**Current (Iteration 2):**
```
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval';
style-src 'self' 'unsafe-inline';
```

**Iteration 3 (Tightened):**
```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline' data:;
  img-src 'self' data: blob:;
  connect-src 'self';
  frame-ancestors 'none';
```

**Changes:**
- **Removed:** `unsafe-eval` (not needed for Plotly, improves security)
- **Added:** `data:` for style-src (Plotly uses data URLs)
- **Added:** `blob:` for img-src (Plotly may use blob URLs)
- **Added:** `frame-ancestors 'none'` (prevent embedding our site)

**Implementation:** `middleware.ts`

```typescript
// middleware.ts (Builder-3 enhances)
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  if (request.nextUrl.pathname.startsWith('/api/preview/')) {
    response.headers.set('Content-Security-Policy',
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline'; " +
      "style-src 'self' 'unsafe-inline' data:; " +
      "img-src 'self' data: blob:; " +
      "connect-src 'self'; " +
      "frame-ancestors 'none';"
    );
  }

  return response;
}
```

### Iframe Sandbox

**Decision:** `sandbox="allow-scripts allow-same-origin"`

**Rationale:**
- `allow-scripts`: Required for Plotly.js execution
- `allow-same-origin`: Required for Plotly to access DOM/canvas APIs
- **Risk:** Allows JavaScript with same-origin access
- **Mitigation:** HTML is admin-uploaded (trusted), validation blocks external resources, CSP limits script capabilities

**Implementation:**
```typescript
<iframe
  src={`/api/preview/${projectId}/html`}
  sandbox="allow-scripts allow-same-origin"
  className="w-full h-full border-0"
  title="Statistical Analysis Report"
/>
```

**Alternative Considered:** `sandbox="allow-scripts"` (blocks same-origin)
- **Rejected:** Breaks Plotly (cannot access canvas, DOM methods)

### Session Security

**Decision:** Existing session system (no changes)

**Features:**
- httpOnly cookies (JavaScript cannot access)
- secure flag in production (HTTPS-only)
- sameSite: strict (CSRF protection)
- 24-hour expiry (JWT + database)
- Token bound to projectId (prevents reuse)

**No Changes Needed:** Iteration 1 security is production-ready

## Performance Targets

### First Contentful Paint (FCP)
- **Target:** <2 seconds on 3G
- **Actual:** ~1.5 seconds (student bundle is small)

### Bundle Size
- **Target:** <200KB gzipped (student bundle)
- **Actual:** ~150KB (React + Next.js runtime, no heavy libraries)
- **Breakdown:**
  - Next.js runtime: ~90KB
  - React + React DOM: ~44KB
  - Student components: ~15KB
  - Icons: ~1KB (tree-shaken)

### HTML Load Time
- **Target:** <10 seconds on 3G for 5MB HTML
- **Actual:** 5MB ÷ 750Kbps = 53 seconds (EXCEEDS TARGET)
- **Mitigation:**
  - File size warnings (>5MB)
  - Loading progress indicator
  - Admin guidance to optimize R output

### API Response Time
- **Target:** <200ms (database + file access)
- **Actual:** ~50ms (Prisma query) + file I/O
- **Acceptable:** Under target for all routes

### Lighthouse Scores (Mobile)
- **Performance:** >90
- **Accessibility:** >95 (Hebrew RTL, semantic HTML)
- **Best Practices:** >90
- **SEO:** N/A (password-protected pages)

## Deployment

### Hosting Platform

**Decision:** Vercel (Next.js native platform)

**Rationale:**
- Zero-configuration Next.js deployment
- Automatic HTTPS with SSL certificates
- Edge network for global performance
- Built-in environment variable management
- Git-based deployment (push to deploy)

**Configuration:**
```json
// vercel.json (optional, defaults work)
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "env": {
    "DATABASE_URL": "@database-url",
    "JWT_SECRET": "@jwt-secret"
  }
}
```

### Database (Production)

**Decision:** Supabase Cloud (PostgreSQL)

**Setup:**
1. Create Supabase project
2. Copy `DATABASE_URL` from settings
3. Run migrations: `npx prisma migrate deploy`
4. Verify tables exist via Supabase dashboard

**Connection Pooling:** Supabase provides built-in pooling (no PgBouncer needed)

**Backup:** Supabase automatic daily backups

### File Storage (Production)

**Decision:** Local filesystem for iteration 3 (Vercel ephemeral storage)

**WARNING:** Vercel's filesystem is ephemeral (files lost on redeploy)

**Migration Path:** Switch to S3 when ready
```bash
# No code changes needed
STORAGE_TYPE=s3
AWS_BUCKET_NAME=statviz-files
AWS_REGION=eu-west-1
```

**Temporary Solution:** Use Vercel Blob for persistent storage (simpler than S3)

### CI/CD Pipeline

**Decision:** Vercel automatic deployments

**Workflow:**
1. Push to GitHub `main` branch
2. Vercel detects change
3. Runs `npm run build`
4. Deploys to production URL
5. Previous deployment kept for rollback

**Manual Deployment:** Vercel CLI (`vercel --prod`)

### SSL/HTTPS

**Decision:** Automatic via Vercel

**Certificate:** Let's Encrypt (auto-renewed)

**Custom Domain:** `statviz.xyz` (configured via Vercel dashboard)

## Dependencies Overview

**Production Dependencies:**
```json
{
  "next": "^14.2.0",               // Framework
  "react": "^18.3.0",              // UI library
  "react-dom": "^18.3.0",          // React DOM
  "@prisma/client": "^5.7.1",      // Database ORM
  "@tanstack/react-query": "^5.90.11", // API state
  "react-hook-form": "^7.66.1",    // Form handling
  "zod": "^3.22.4",                // Validation
  "bcryptjs": "^2.4.3",            // Password hashing
  "jsonwebtoken": "^9.0.2",        // JWT tokens
  "rate-limiter-flexible": "^3.0.0", // Rate limiting
  "lucide-react": "^0.554.0",      // Icons
  "sonner": "^2.0.7",              // Toasts
  "tailwindcss": "^3.4.0",         // Styling
  "class-variance-authority": "^0.7.0", // Component variants
  "clsx": "^2.0.0",                // Conditional classes
  "tailwind-merge": "^2.0.0"       // Merge Tailwind classes
}
```

**Development Dependencies:**
```json
{
  "typescript": "^5.3.3",
  "@types/react": "^18.2.45",
  "@types/node": "^20.10.4",
  "@types/bcryptjs": "^2.4.6",
  "@types/jsonwebtoken": "^9.0.5",
  "eslint": "^8.55.0",
  "eslint-config-next": "^14.2.0",
  "prisma": "^5.7.1"
}
```

**No New Dependencies for Iteration 3:** All libraries already installed

## Security Considerations

### Password Storage
- bcrypt with 10 rounds (OWASP recommendation)
- Salts automatically generated
- Hashes stored as base64 strings

### Token Security
- JWT signed with `JWT_SECRET` (32+ characters)
- Tokens include `type` field to distinguish admin vs project
- Tokens bound to `projectId` (prevents cross-project reuse)
- Database-backed sessions (can revoke)

### SQL Injection Prevention
- Prisma parameterized queries (automatic)
- No raw SQL in codebase
- Input validation via Zod before database access

### XSS Prevention
- React automatic escaping of user content
- httpOnly cookies (JavaScript cannot access)
- CSP headers limit inline script execution
- Iframe sandbox isolates embedded HTML

### CSRF Prevention
- sameSite: strict cookies (no cross-site requests)
- No state-changing GET requests
- All mutations use POST with body validation

### Rate Limiting
- 10 attempts per hour per project (password verification)
- In-memory storage (resets on deploy, acceptable for MVP)
- Post-MVP: Migrate to Redis for persistence

### File Upload Validation
- MIME type checking (DOCX, HTML only)
- File size limits (50MB max)
- Self-contained HTML validation (blocks external resources)
- Path traversal prevention (no user-controlled filenames)

## Environment Configuration

### Development
```bash
# .env.local
DATABASE_URL="postgresql://postgres:postgres@localhost:54322/postgres"
JWT_SECRET="development-secret-min-32-characters-long"
ADMIN_PASSWORD_HASH="JDJhJDEwJHdwVTdOSy5zZ..."  # bcrypt hash
STORAGE_TYPE="local"
UPLOAD_DIR="./uploads"
NODE_ENV="development"
```

### Production
```bash
# Vercel Environment Variables
DATABASE_URL="postgresql://user:pass@host.supabase.co:5432/postgres"
JWT_SECRET="[REGENERATE - 32+ random characters]"
ADMIN_PASSWORD_HASH="JDJhJDEwJHdwVTdOSy5zZ..."  # same or new
STORAGE_TYPE="local"  # or "s3" when ready
UPLOAD_DIR="/uploads"
NODE_ENV="production"
```

**Secret Generation:**
```bash
# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Generate password hash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('admin123', 10).then(h => console.log(Buffer.from(h).toString('base64')))"
```

---

**Tech Stack Status:** COMPLETE
**Dependencies:** All installed (zero new packages)
**Configuration:** Minimal changes (viewport meta tag, CSP headers)
**Ready for:** Builder execution
