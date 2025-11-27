# Technology Stack - Iteration 1

## Core Framework

**Decision:** Next.js 14.2.33 (App Router)

**Rationale:**
- Already implemented and working perfectly in plan-1
- App Router provides clean route groups for admin/student separation
- Server components reduce bundle size for dashboard-heavy app
- Built-in API routes eliminate need for separate backend
- TypeScript support is first-class and mature
- Vercel deployment is seamless with automatic optimizations

**Alternatives Considered:**
- **Next.js 15:** Not chosen - introduces breaking changes outside UI redesign scope
- **Remix:** Not chosen - would require complete rewrite, current architecture works well
- **Vite + React Router:** Not chosen - no SSR benefits, more complex deployment

**Implementation Notes:**
- Continue using App Router (app/ directory)
- Maintain route groups: (auth) for admin, (student) for student pages
- Keep existing middleware for security headers and HTTPS enforcement
- No framework changes needed for this iteration

## Styling System

**Decision:** Tailwind CSS 3.4.4 (JIT mode)

**Rationale:**
- Already configured with shadcn/ui integration
- JIT mode provides all gradient/shadow utilities without bloat
- Excellent RTL support via `dir` attribute (no manual CSS needed)
- Utility-first approach keeps styling co-located with components
- PostCSS + autoprefixer ensures browser compatibility
- Current bundle: 30KB, target: <100KB (plenty of headroom)

**Alternatives Considered:**
- **Tailwind CSS 4:** Not chosen - still in beta, not stable for production
- **CSS Modules:** Not chosen - breaks existing shadcn/ui patterns
- **Styled Components:** Not chosen - increases bundle size, conflicts with Tailwind

**Configuration Enhancements:**
```typescript
// tailwind.config.ts extensions
theme: {
  extend: {
    colors: {
      'gradient-start': 'hsl(221 83% 53%)', // blue-600
      'gradient-end': 'hsl(239 84% 67%)',   // indigo-600
    },
    backgroundImage: {
      'gradient-primary': 'linear-gradient(to right, var(--gradient-start), var(--gradient-end))',
    },
    boxShadow: {
      'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07)',
    }
  }
}
```

**CSS Variables Strategy:**
Update globals.css with brand colors:
```css
:root {
  --primary: 221 83% 53%;           /* blue-600 */
  --primary-foreground: 0 0% 100%;  /* white */
  --gradient-start: 221 83% 53%;
  --gradient-end: 239 84% 67%;
}
```

## UI Component Library

**Decision:** shadcn/ui (Radix UI + Tailwind CSS)

**Rationale:**
- Already integrated with 7 components (Button, Dialog, Input, Label, Table, Textarea, Skeleton)
- Headless UI primitives from Radix provide accessibility out of the box
- Customizable with Tailwind classes (no vendor lock-in)
- Copy-paste components (no npm bloat, tree-shakeable)
- Dialog animations built-in (fade-in, zoom, slide)
- Class-variance-authority (CVA) enables flexible component variants

**Currently Installed Components:**
1. button.tsx - Will add gradient variant
2. dialog.tsx - Will add backdrop blur to overlay
3. input.tsx - Will enhance focus states
4. label.tsx - Typography improvements
5. table.tsx - Hover effects, RTL alignment
6. textarea.tsx - Enhanced styling
7. skeleton.tsx - Keep existing pulse animation

**Enhancement Pattern:**
```typescript
// Add gradient variant to button.tsx
const buttonVariants = cva(
  "base-classes...",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90", // Keep existing
        gradient: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all" // Add new
      }
    }
  }
)
```

**Alternatives Considered:**
- **Material UI:** Not chosen - heavy bundle, conflicts with Tailwind
- **Chakra UI:** Not chosen - different design system, requires migration
- **Ant Design:** Not chosen - opinionated styling, harder to customize

## Form Handling

**Decision:** React Hook Form 7.66.1 + Zod 3.23.8

**Rationale:**
- Already in use across all forms (admin login, project creation, password prompt)
- Type-safe validation with Zod schemas
- Hebrew error messages already implemented
- Minimal re-renders (better performance than controlled forms)
- Easy integration with shadcn/ui Input component
- @hookform/resolvers provides seamless Zod integration

**Usage Pattern (DO NOT MODIFY):**
```typescript
const schema = z.object({
  password: z.string().min(1, 'נא להזין סיסמה')
})

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema)
})
```

**Enhancement Strategy:**
- Only modify visual styling (border colors, error text colors)
- Preserve all Zod validation schemas
- Keep all Hebrew error messages
- Do NOT change form field names or onSubmit handlers

**Alternatives Considered:**
- **Formik:** Not chosen - already using react-hook-form, no benefit to switching
- **Native HTML forms:** Not chosen - no TypeScript validation, more boilerplate

## State Management

**Decision:** React Query 5.90.11 (for server state) + React Hooks (for UI state)

**Rationale:**
- React Query handles all data fetching (admin projects, student project data)
- Automatic caching and background refetching
- Built-in loading/error states reduce boilerplate
- React hooks (useState, useEffect) sufficient for UI state (modals, sorting)
- No global state needed (no Redux/Zustand complexity)

**Usage Pattern (DO NOT MODIFY):**
```typescript
// lib/hooks/useProjects.ts
export function useProjects() {
  return useQuery({
    queryKey: ['admin', 'projects'],
    queryFn: async () => {
      const response = await fetch('/api/admin/projects', { credentials: 'include' })
      if (!response.ok) throw new Error('Failed to fetch projects')
      return response.json()
    },
  })
}
```

**Enhancement Strategy:**
- Style loading states with professional spinners
- Style error states with clear messaging
- Do NOT modify query logic or cache configuration

**Alternatives Considered:**
- **Redux Toolkit:** Not chosen - overkill for current needs, adds complexity
- **Zustand:** Not chosen - no global state requirements
- **Native fetch:** Not chosen - React Query provides better UX with caching

## Icons

**Decision:** lucide-react 0.554.0

**Rationale:**
- Already extensively used throughout app (20+ icons)
- 1000+ icons available (all required icons in library)
- Tree-shakeable (only imported icons included in bundle)
- Consistent style (outlined icons, modern aesthetic)
- RTL-compatible (no manual flipping needed)
- Actively maintained with frequent updates

**Icons Currently in Use:**
- BarChart3 - Logo
- Lock, Shield - Security features
- Zap, TrendingUp - Performance features
- Eye, EyeOff - Password visibility toggle
- Plus, RefreshCw, Download - Actions
- LogOut, ExternalLink, Trash2, Copy, Check - Admin UI
- ArrowLeft - Navigation
- Loader2 - Loading states

**Alternatives Considered:**
- **react-icons:** Not chosen - inconsistent styles, larger bundle
- **heroicons:** Not chosen - fewer icons, different aesthetic
- **Font Awesome:** Not chosen - font-based (not SVG), performance issues

## Typography

**Decision:** Rubik font (Google Fonts, variable font with weights 300-700)

**Rationale:**
- Already configured in app/layout.tsx
- Hebrew + Latin subsets support RTL layout
- Variable font enables multiple weights without multiple requests
- Modern, friendly aesthetic appropriate for academic platform
- display: 'swap' prevents FOIT (flash of invisible text)

**Configuration (NO CHANGES):**
```typescript
// app/layout.tsx
const rubik = Rubik({
  subsets: ['hebrew', 'latin'],
  weight: ['300', '400', '500', '700'],
  display: 'swap',
  variable: '--font-rubik'
})
```

**Typography Scale (Define in globals.css):**
```css
:root {
  --font-size-h1: 2.25rem;   /* 36px */
  --font-size-h2: 1.875rem;  /* 30px */
  --font-size-h3: 1.5rem;    /* 24px */
  --font-size-h4: 1.25rem;   /* 20px */
  --font-size-body: 1rem;    /* 16px */
  --font-size-small: 0.875rem; /* 14px */
}
```

**Alternatives Considered:**
- **Inter:** Not chosen - no Hebrew support
- **Heebo:** Not chosen - already using Rubik, no need to change

## Authentication

**Decision:** JWT cookie-based sessions (existing implementation)

**Rationale:**
- Already implemented in lib/auth/admin.ts and lib/auth/project.ts
- Admin sessions: JWT cookies with secure flags
- Student sessions: Project-specific JWT for password-protected viewing
- Middleware enforces HTTPS and security headers
- No authentication changes needed for UI redesign

**Implementation (DO NOT MODIFY):**
- Admin auth: Username/password → JWT cookie → dashboard access
- Student auth: Project password → JWT cookie → project viewer access
- Session persistence: Cookies with httpOnly, secure flags
- Logout: Clear cookies, redirect to login

**Enhancement Strategy:**
- Style login forms with gradient branding
- Enhance password input styling
- Improve loading states during authentication
- Do NOT modify authentication logic or session management

**Alternatives Considered:**
- **NextAuth:** Not chosen - overkill for simple admin/student auth
- **Auth0:** Not chosen - external dependency, unnecessary complexity

## Database

**Decision:** Prisma 5.19.0 + PostgreSQL (Supabase)

**Rationale:**
- Already configured and working (plan-1 delivery)
- Type-safe database queries
- Schema migrations handled by Prisma
- No schema changes needed for UI redesign

**Schema (NO CHANGES):**
```prisma
model Project {
  id            String   @id @default(cuid())
  name          String
  description   String?
  password      String
  student_email String
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

**Enhancement Strategy:**
- No database changes in this iteration
- All data model remains unchanged
- UI only consumes existing data

## Notifications

**Decision:** sonner 2.0.7

**Rationale:**
- Already in use for toast notifications
- RTL support configured (direction: 'rtl')
- Positioned top-left (correct for RTL)
- Lightweight and performant

**Current Usage (NO CHANGES):**
```typescript
import { toast } from 'sonner'

toast.success('פרויקט נוצר בהצלחה')
toast.error('שגיאה ביצירת פרויקט')
```

**Optional Enhancement:**
- Custom styling to match brand colors (low priority)
- Keep existing functionality unchanged

**Alternatives Considered:**
- **react-hot-toast:** Not chosen - already using sonner, works well

## Development Tools

### Testing
- **Framework:** Manual testing (no automated tests in current codebase)
- **Coverage target:** Not applicable for UI redesign
- **Strategy:** Comprehensive manual testing checklist (see validation plan)
  - Admin authentication flows
  - Form validation error states
  - RTL layout verification
  - Responsive design testing (768px, 1024px)
  - Browser compatibility (Chrome 90+ primary, others in Iteration 2)

### Code Quality
- **Linter:** ESLint (Next.js default configuration)
- **Formatter:** Prettier (if configured) or rely on ESLint
- **Type Checking:** TypeScript 5.5.0 strict mode
- **Run before commit:** `npm run build` (catches TypeScript errors)

### Build & Deploy
- **Build tool:** Next.js built-in (Webpack/Turbopack)
- **Deployment target:** Vercel (automatic deployment on push to main)
- **CI/CD:** Vercel automatic deployments (no separate CI needed)
- **Build command:** `npm run build`
- **Start command:** `npm run start` (production server)

## Environment Variables

All environment variables already configured (no new variables needed):

- `DATABASE_URL`: Supabase PostgreSQL connection string
  - **Purpose:** Prisma database connection for project data
  - **Where to get:** Supabase project dashboard → Settings → Database → Connection string

- `DIRECT_URL`: Supabase direct connection (for migrations)
  - **Purpose:** Prisma migrations without connection pooling
  - **Where to get:** Supabase project dashboard → Settings → Database → Direct connection

- `ADMIN_USERNAME`: Admin login username
  - **Purpose:** Authentication for /admin section
  - **Where to get:** Set by developer (secure credential)

- `ADMIN_PASSWORD`: Admin login password (hashed)
  - **Purpose:** Authentication for /admin section
  - **Where to get:** Set by developer (hashed with bcrypt)

**Note:** All environment variables stored in Vercel project settings and .env.local (git-ignored).

## Dependencies Overview

**Core Dependencies (NO NEW PACKAGES):**
- `next@14.2.33` - Framework
- `react@18.3.1` - UI library
- `react-dom@18.3.1` - React DOM renderer
- `typescript@5.5.0` - Type checking

**Styling Dependencies:**
- `tailwindcss@3.4.4` - Utility-first CSS framework
- `autoprefixer@10.4.19` - CSS vendor prefixing
- `postcss@8.4.38` - CSS processing
- `class-variance-authority@0.7.1` - Component variants
- `clsx@2.1.1` - Conditional classNames
- `tailwind-merge@3.4.0` - Merge Tailwind classes

**UI Dependencies:**
- `lucide-react@0.554.0` - Icons
- `@radix-ui/react-dialog@1.1.15` - Modal primitives
- `sonner@2.0.7` - Toast notifications

**Form Dependencies:**
- `react-hook-form@7.66.1` - Form state management
- `@hookform/resolvers@5.2.2` - Zod resolver
- `zod@3.23.8` - Schema validation

**Data Fetching:**
- `@tanstack/react-query@5.90.11` - Server state management

**Database:**
- `@prisma/client@5.19.0` - Database ORM
- `prisma@5.19.0` - Database toolkit

**Typography:**
- `next/font` - Google Fonts loader (Rubik)

**Total Package Count:** ~25 packages (existing)
**New Packages for Iteration 1:** 0 (zero)

## Performance Targets

**Page Performance:**
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.5s
- Cumulative Layout Shift: < 0.1

**Bundle Sizes:**
- CSS bundle: < 100KB (current: 30KB, target: 50KB conservative)
- JavaScript bundle: Maintain current size (~200KB gzipped)
- Total static assets: ~1.3MB (current baseline)

**Animation Performance:**
- All transitions: 60fps (use transform/opacity only, avoid layout thrashing)
- Hover effects: < 200ms duration
- Modal animations: Smooth open/close (Radix UI built-in)
- No jank on scroll (backdrop blur optimized)

**Lighthouse Targets:**
- Performance: > 90
- Accessibility: > 90 (WCAG 2.1 AA baseline)
- Best Practices: > 90
- SEO: > 90

**Measurement Tools:**
- Chrome DevTools Lighthouse
- Chrome DevTools Performance profiler
- Network tab for bundle size analysis
- Vercel Analytics (automatic)

## Security Considerations

**Authentication Security (DO NOT MODIFY):**
- Admin credentials stored as environment variables (secure)
- JWT cookies with httpOnly and secure flags
- HTTPS enforcement via middleware
- Session expiration handled by JWT

**Content Security Policy:**
- CSP headers enforced by middleware
- Prevent XSS attacks
- Restrict script sources

**Data Protection:**
- Student emails and passwords encrypted
- Database connection over SSL (Supabase)
- No sensitive data in client-side code

**UI Security Enhancements:**
- Password visibility toggle (Eye/EyeOff icons) - already implemented
- Clear validation feedback prevents security confusion
- Rate limiting on authentication (already implemented)

**No Security Changes Needed:** This iteration is purely visual. All security mechanisms remain unchanged.

## Browser Compatibility

**Primary Browser (Iteration 1):**
- Chrome 90+ (most testing, primary development browser)

**Target Browsers (Iteration 2 testing):**
- Firefox 88+
- Safari 14+ (macOS/iOS)
- Edge 90+

**CSS Features Used:**
- CSS Grid (supported Chrome 57+, Firefox 52+, Safari 10.1+, Edge 16+)
- Flexbox (supported all target browsers)
- CSS Gradients (supported all target browsers)
- Backdrop Filter (supported Chrome 76+, Safari 9+, Firefox 103+, Edge 79+)
  - **Note:** backdrop-blur may not work in older Firefox, fallback to solid background

**Tailwind PostCSS Autoprefixer:**
Automatically adds vendor prefixes for browser compatibility. No manual prefixing needed.

**Testing Strategy:**
- Iteration 1: Chrome only (fast iteration)
- Iteration 2: All browsers (comprehensive QA)

## RTL (Right-to-Left) Support

**Current Implementation (KEEP UNCHANGED):**
- Root layout sets `dir="rtl"` on `<html>` tag
- Tailwind automatically mirrors layout in RTL mode
- Rubik font supports Hebrew and Latin characters

**RTL Patterns to Follow:**
- Default to RTL (no dir attribute needed)
- Add `dir="ltr"` only for: passwords, emails, URLs, technical codes
- Use `text-right` for Hebrew content, `text-left` for LTR overrides
- Gradients work correctly in RTL (no manual reversal needed)
- Icons position automatically (no flipping required)

**Testing Requirements:**
- Test all components with Hebrew text
- Verify mixed RTL/LTR content (Hebrew labels + English emails)
- Check gradient directions render correctly
- Verify table alignment with RTL headers

**Browser DevTools:**
Use Chrome DevTools → Elements → Computed → direction to verify RTL mode.

## Development Workflow

**Local Development:**
```bash
npm run dev        # Start development server (localhost:3000)
npm run build      # Production build (test TypeScript, bundle size)
npm run start      # Start production server locally
```

**Code Quality Checks:**
```bash
npm run lint       # Run ESLint (if configured)
tsc --noEmit       # TypeScript type checking
```

**Testing Workflow:**
1. Make UI changes in components
2. Test in Chrome DevTools responsive mode (768px, 1024px)
3. Test RTL layout with Hebrew text
4. Test authentication flows (login, logout)
5. Run `npm run build` to catch TypeScript errors
6. Visual inspection of all changed components

**Git Workflow:**
1. Create feature branch from main
2. Make changes
3. Test locally
4. Commit with descriptive message
5. Push to GitHub
6. Create PR for integration
7. Code review (if team)
8. Merge to main
9. Vercel auto-deploys

**Environment:**
- Node.js 18+ (LTS)
- npm or yarn package manager
- Git for version control
- VS Code (recommended) with TypeScript extensions

## Performance Budgets

**Critical Thresholds (Do Not Exceed):**
- CSS bundle: 100KB (alert if > 50KB)
- Page load time: 2s (alert if > 1.5s)
- Lighthouse performance: 90 (alert if < 85)

**Monitoring:**
- Run Lighthouse after each builder completes
- Compare bundle size before/after changes
- Profile animations with Chrome DevTools Performance tab

**If Budget Exceeded:**
- Remove unused Tailwind utilities
- Optimize gradient usage (CSS gradients, not images)
- Consider lazy loading (dynamic imports) for heavy components
- Review and remove duplicate styles

## Accessibility Standards

**WCAG 2.1 AA Compliance (Baseline):**
- Color contrast: 4.5:1 for normal text, 3:1 for large text
- Keyboard navigation: All interactive elements accessible via keyboard
- ARIA labels: shadcn/ui components include ARIA by default
- Focus indicators: Visible focus rings on all interactive elements

**Enhancements (Built-in):**
- Radix UI primitives provide accessibility out of the box
- React Hook Form error announcements for screen readers
- Semantic HTML (heading hierarchy, form labels)

**Testing:**
- Chrome DevTools Lighthouse accessibility audit
- Keyboard-only navigation testing
- Screen reader testing (optional, post-MVP)

**Note:** WCAG AAA and advanced accessibility features are post-MVP enhancements.
