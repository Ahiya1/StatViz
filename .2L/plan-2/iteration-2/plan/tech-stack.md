# Technology Stack - Iteration 2

## Executive Summary

Iteration 2 uses **100% of the technology stack established in Iteration 1** with **ZERO new dependencies**. All required design tokens, component patterns, and utilities already exist. This iteration focuses on applying established patterns to student components and conducting comprehensive testing.

## Core Framework

**Decision:** Next.js 14.2.33 (App Router)

**Rationale:**
- Already in use and fully configured in Iteration 1
- App Router architecture proven stable for admin section
- Student components use same routing patterns (dynamic routes, client components)
- Server Components used where appropriate (layouts)
- No upgrade needed - version 14.2.33 is stable and well-supported

**Alternatives Considered:**
- Next.js 15: Rejected - would introduce unnecessary migration risk for UI-only iteration
- Remix: Not applicable - complete framework change out of scope

**Key Features Used:**
- App Router with route groups: `(auth)` for admin, `(student)` for student section
- Dynamic routes: `[projectId]` for student project viewing
- Server Components for layouts, Client Components for interactive UI
- API routes for authentication and data fetching (no changes in Iteration 2)

## Styling Framework

**Decision:** Tailwind CSS 3.4.4

**Rationale:**
- Comprehensive design system established in Iteration 1 (CSS variables, gradient utilities, shadow system)
- Mobile-first responsive design with breakpoints (sm:, md:, lg:) already configured
- RTL support working correctly with `dir="rtl"` in root layout
- Purging ensures minimal bundle size (current 36KB, excellent performance)
- All required utilities already defined in globals.css and tailwind.config.ts

**Configuration Highlights:**
```typescript
// tailwind.config.ts (established in Iteration 1)
{
  theme: {
    extend: {
      colors: {
        'gradient-start': 'hsl(221 83% 53%)',  // blue-600
        'gradient-end': 'hsl(239 84% 67%)',    // indigo-600
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, hsl(221 83% 53%), hsl(239 84% 67%))',
        'gradient-hero': 'linear-gradient(to bottom right, hsl(210 40% 98%), hsl(221 83% 95%), hsl(239 84% 92%))',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07)',
        'glow': '0 0 20px -5px rgba(59, 130, 246, 0.5)',
      },
    },
  },
}
```

**Custom Utilities (globals.css):**
```css
@layer utilities {
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

**No Changes Needed** - All utilities ready for student component application

## Component Library

**Decision:** shadcn/ui (Radix UI primitives)

**Rationale:**
- Comprehensive component library already integrated in Iteration 1
- Button, Input, Label, Dialog components styled with brand colors
- Button gradient variant added in Iteration 1 (ready for student components)
- Fully accessible (WCAG 2.1 AA compliant)
- TypeScript-first with excellent type safety
- Customizable via Tailwind CSS (no CSS-in-JS conflicts)

**Components Used in Student Section:**
- **Button**: Download button, password submit button (uses gradient variant)
- **Input**: Password input field (with validation)
- **Label**: Form labels (RTL-compatible)
- **Dialog**: Not used in student section (admin only)

**Button Variants Available:**
```typescript
// components/ui/button.tsx (established in Iteration 1)
{
  variant: {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
    gradient: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200",
  }
}
```

**Iteration 2 Usage**: Apply `variant="gradient"` to DownloadButton and PasswordPromptForm submit button

## Icons

**Decision:** lucide-react 0.554.0

**Rationale:**
- Lightweight, tree-shakeable icon library (only import icons used)
- Consistent visual style across admin and student sections
- RTL-compatible (no manual flipping needed)
- Wide selection of icons (20+ already in use)

**Icons Used in Student Section:**
- **Download**: Download button icon
- **Loader2**: Loading spinner (project loading, password verification)
- **Eye / EyeOff**: Password visibility toggle
- **AlertCircle**: Error states (add in Iteration 2)
- **BarChart3**: Logo component icon (reused from admin)

**New Icons for Iteration 2:**
```typescript
import { AlertCircle } from 'lucide-react'  // Error state enhancement
```

**Bundle Impact**: Minimal (each icon ~1KB, tree-shaken automatically)

## Form Management

**Decision:** React Hook Form 7.66.1 + Zod 3.23.8

**Rationale:**
- Already used in PasswordPromptForm for password authentication
- Excellent TypeScript integration with Zod schemas
- Minimal re-renders (performant form state management)
- Built-in validation with clear error messages
- Hebrew error messages working correctly

**Current Usage in Student Section:**
```typescript
// components/student/PasswordPromptForm.tsx (existing)
const PasswordSchema = z.object({
  password: z.string().min(1, 'סיסמה נדרשת'),
})

const { register, handleSubmit, formState: { errors } } = useForm<PasswordFormData>({
  resolver: zodResolver(PasswordSchema),
})
```

**No Changes Needed** - Validation logic preserved, only UI styling enhanced

## State Management

**Decision:** @tanstack/react-query 5.90.11

**Rationale:**
- Already used for all server state management (admin and student sections)
- Excellent caching, background refetching, optimistic updates
- Loading/error states handled automatically
- Used in useProject and useProjectAuth hooks

**Current Usage in Student Section:**
```typescript
// lib/hooks/useProject.ts (existing)
export function useProject(projectId: string) {
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const response = await fetch(`/api/preview/${projectId}`)
      if (!response.ok) throw new Error('Failed to fetch project')
      return response.json()
    },
    staleTime: 60000,  // 1 minute
  })
}
```

**No Changes Needed** - Hooks remain unchanged, only UI components enhanced

## Authentication

**Decision:** HTTP-only cookies with bcrypt password hashing

**Rationale:**
- Secure session management for admin (already implemented)
- Password-based authentication for student project access (already implemented)
- Rate limiting on password verification (already implemented - 5 attempts per hour)
- No changes needed in Iteration 2 (UI-only enhancement)

**Implementation Notes:**
- Admin authentication: Username/password with bcrypt hashing
- Student authentication: Per-project password stored in database
- Session cookies: httpOnly, secure, sameSite=strict
- Rate limiting: Prevents brute force attacks on student passwords

**Iteration 2 Scope**: Enhance authentication UI only (preserve all logic)

## Notifications

**Decision:** Sonner 2.0.7

**Rationale:**
- Modern toast notification library with excellent UX
- RTL support configured in root layout
- Hebrew messages working correctly
- Used for success/error notifications in admin and student sections

**RTL Configuration:**
```tsx
// app/layout.tsx (established in Iteration 1)
<Toaster
  position="top-left"  // RTL-appropriate position
  toastOptions={{
    style: { direction: 'rtl' }  // Hebrew text direction
  }}
/>
```

**No Changes Needed** - Notifications working correctly, no new toast types in Iteration 2

## Typography

**Decision:** Rubik font (Google Fonts) with Hebrew subset

**Rationale:**
- Excellent Hebrew support with proper glyph rendering
- Multiple weights available (300, 400, 500, 700)
- Display swap for performance (prevents FOIT - Flash of Invisible Text)
- RTL-optimized letter spacing and line height

**Configuration:**
```typescript
// app/layout.tsx (established in Iteration 1)
import { Rubik } from 'next/font/google'

const rubik = Rubik({
  subsets: ['hebrew'],
  weight: ['300', '400', '500', '700'],
  display: 'swap',
  variable: '--font-rubik',
})

<html lang="he" dir="rtl" className={rubik.variable}>
```

**Typography Scale (CSS Variables):**
```css
/* app/globals.css (established in Iteration 1) */
:root {
  --font-size-h1: 2.25rem;    /* 36px */
  --font-size-h2: 1.875rem;   /* 30px */
  --font-size-h3: 1.5rem;     /* 24px */
  --font-size-h4: 1.25rem;    /* 20px */
  --font-size-body: 1rem;     /* 16px */
  --font-size-small: 0.875rem;/* 14px */
}
```

**No Changes Needed** - Typography scale comprehensive and used consistently

## Build & Development Tools

**Decision:** Next.js built-in build system (Turbopack in dev, Webpack in prod)

**Rationale:**
- Fast development server with hot module replacement (HMR)
- Optimized production builds with automatic code splitting
- CSS bundling and minification with cssnano
- Image optimization with next/image (not heavily used in this project)
- TypeScript compilation integrated

**Build Commands:**
```bash
npm run dev      # Development server (port 3000)
npm run build    # Production build
npm start        # Production server
npm run lint     # ESLint with Next.js preset
```

**Build Output Analysis:**
- CSS bundle: Current 36KB, expected ~38KB after Iteration 2
- JS bundles: Optimized with tree-shaking and code splitting
- Static assets: ~1.3MB baseline (mostly PDF reports)

**No Changes Needed** - Build configuration optimal

## Code Quality Tools

**Decision:** ESLint with Next.js preset, TypeScript 5.x

**Rationale:**
- Catches common bugs and enforces code style
- Next.js ESLint config includes React best practices
- TypeScript provides compile-time type safety
- Integration with VS Code for real-time feedback

**ESLint Rules:**
- Next.js recommended rules
- React Hooks rules (prevents invalid hook usage)
- Accessibility rules (basic WCAG checks)

**TypeScript Configuration:**
- Strict mode enabled
- Path aliases configured (@/ for project root)
- Type checking on build (prevents deployment of type errors)

**No Changes Needed** - Code quality tools working correctly

## Performance Tools

**Decision:** Chrome DevTools (Lighthouse, Performance tab, Network tab)

**Rationale:**
- Built into Chrome browser (no installation needed)
- Industry-standard performance metrics (Core Web Vitals)
- Lighthouse provides actionable recommendations
- Performance tab identifies animation jank and frame drops
- Network tab validates bundle sizes and load times

**Testing Tools for Iteration 2 QA:**

### Lighthouse Audits
**Usage:** Performance, accessibility, best practices, SEO audits
**How to Run:**
1. Open Chrome DevTools (F12)
2. Navigate to Lighthouse tab
3. Select "Performance" category
4. Choose "Desktop" mode (test mobile separately)
5. Click "Generate report"

**Targets:**
- Performance score: >90
- First Contentful Paint (FCP): <1.8s
- Largest Contentful Paint (LCP): <2.5s
- Cumulative Layout Shift (CLS): <0.1
- Time to Interactive (TTI): <3.8s

### Performance Tab
**Usage:** 60fps animation verification, identify jank
**How to Run:**
1. Open DevTools > Performance tab
2. Click Record
3. Interact with page (scroll, hover buttons, open modals)
4. Stop recording
5. Analyze frame rate (should be consistent 60fps / 16.67ms per frame)

**Test Scenarios:**
- Scrolling landing page (smooth 60fps)
- Hovering buttons (gradient transitions smooth)
- Modal open/close (backdrop blur performant)

### Network Tab
**Usage:** Bundle size validation, load time measurement
**How to Run:**
1. Open DevTools > Network tab
2. Disable cache (checkbox)
3. Reload page
4. Check "Transferred" column for bundle sizes
5. Verify total page load time at bottom

**Targets:**
- CSS bundle: <100KB (current 36KB)
- Total page load: <2s
- Static assets: ~1.3MB baseline

**No Additional Tools Needed** - Chrome DevTools sufficient for all Iteration 2 testing

## Cross-Browser Testing Strategy

**Target Browsers:**
1. **Chrome 90+** (Primary development browser)
2. **Firefox 88+** (Gecko engine, different rendering)
3. **Safari 14+** (WebKit engine, iOS compatibility)
4. **Edge 90+** (Chromium-based, Windows users)

**Testing Methodology:**
- **Visual Inspection**: Gradient rendering, shadow effects, layout consistency
- **Functional Testing**: Login, password verification, download functionality
- **Responsive Testing**: Resize to 375px (mobile), 768px (tablet), 1024px (desktop)
- **RTL Verification**: Hebrew text alignment, gradient direction, icon positioning

**Browser-Specific Considerations:**

### Safari Specifics
- Backdrop blur support: Safari 14+ supports -webkit-backdrop-filter (already in globals.css)
- Date input styling: May render differently (not used in student section)
- Flexbox gaps: Fully supported in Safari 14+

### Firefox Specifics
- CSS Grid: Fully supported
- Backdrop filter: Requires about:config flag in older versions (not a concern for Firefox 88+)
- Smooth scroll: Supported

### Edge Specifics
- Chromium-based: Renders identically to Chrome (minimal testing needed)
- Focus on functional testing only

**Testing Matrix:**
| Browser | Visual | Functional | Responsive | RTL | Priority |
|---------|--------|------------|------------|-----|----------|
| Chrome  | Full   | Full       | Full       | Full| High     |
| Safari  | Full   | Full       | Full       | Full| High     |
| Firefox | Quick  | Full       | Quick      | Full| Medium   |
| Edge    | Quick  | Full       | Quick      | Full| Medium   |

## Mobile Testing Requirements

**Target Devices:**
- **iOS Safari** (iPhone SE, iPhone 12/13/14)
- **Chrome Android** (Samsung Galaxy, Google Pixel)

**Why Real Devices Required:**
- Browser DevTools emulation doesn't accurately simulate touch interactions
- Virtual keyboard behavior differs from real devices
- Font rendering varies by OS (Hebrew text)
- RTL layout may render differently on mobile Safari vs Chrome

**Minimum Testing Requirement:**
Test on **at least ONE real mobile device** (iOS or Android)

**Test Scenarios:**
1. Student password prompt on mobile (keyboard doesn't obscure input)
2. Project viewer with iframe scrolling (smooth scroll on touch)
3. Download button tap (44px touch target, thumb-reachable at bottom)
4. Form input focus (keyboard behavior)
5. RTL text rendering (Hebrew alignment)

**Alternative if Physical Devices Unavailable:**
- BrowserStack (cloud device testing service) - Optional, not required
- Borrow devices from stakeholders (Ahiya, colleagues)
- Use browser DevTools as fallback (not ideal but acceptable for low-risk UI changes)

## Environment Variables

**No New Environment Variables in Iteration 2**

All environment variables established in plan-1 (core functionality):

```bash
# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."  # For Supabase connection pooling

# Admin Authentication
ADMIN_USERNAME="admin"
ADMIN_PASSWORD_HASH="$2b$10$..."  # bcrypt hashed password

# Session Secret
SESSION_SECRET="random-secret-key-32-chars-min"

# Next.js
NODE_ENV="production"  # or "development"
```

**Iteration 2 Scope**: No environment variable changes (UI-only enhancement)

## Dependencies Overview

**Production Dependencies (No Changes):**
```json
{
  "next": "14.2.33",
  "react": "^18",
  "react-dom": "^18",
  "tailwindcss": "^3.4.4",
  "@radix-ui/react-dialog": "^1.1.15",
  "@radix-ui/react-label": "^2.1.1",
  "@radix-ui/react-slot": "^1.1.1",
  "@tanstack/react-query": "^5.90.11",
  "lucide-react": "^0.554.0",
  "sonner": "^2.0.7",
  "react-hook-form": "^7.66.1",
  "@hookform/resolvers": "^5.2.2",
  "zod": "^3.23.8",
  "clsx": "^2.1.1",
  "tailwind-merge": "^3.4.0",
  "class-variance-authority": "^0.7.1"
}
```

**Dev Dependencies (No Changes):**
```json
{
  "typescript": "^5",
  "@types/node": "^20",
  "@types/react": "^18",
  "@types/react-dom": "^18",
  "eslint": "^8",
  "eslint-config-next": "14.2.33",
  "autoprefixer": "^10.4.19"
}
```

**Zero New Dependencies Added in Iteration 2**

**Bundle Size Impact:**
- CSS: 36KB → ~38KB (+2KB expected for student component styles)
- JS: No new JavaScript libraries
- Total: Well within performance budget

## Performance Targets

### Page Load Performance
- **First Contentful Paint (FCP)**: <1.8s
- **Largest Contentful Paint (LCP)**: <2.5s
- **Time to Interactive (TTI)**: <3.8s
- **Cumulative Layout Shift (CLS)**: <0.1
- **Total Page Load Time**: <2s

### Bundle Size Targets
- **CSS Bundle**: <100KB (current: 36KB, expected: 38KB after Iteration 2)
- **JavaScript Bundles**: Automatically optimized by Next.js (no target change)
- **Static Assets**: ~1.3MB baseline (PDF reports, no change expected)

### Animation Performance
- **Frame Rate**: Consistent 60fps (16.67ms per frame)
- **Hover Effects**: Smooth CSS transitions (200ms duration)
- **Scroll Behavior**: Smooth scrolling with scroll-behavior: smooth
- **Modal Animations**: Backdrop blur performant (GPU-accelerated)

### Lighthouse Scores (All Pages)
- **Performance**: >90
- **Accessibility**: >90 (baseline, enhanced in post-MVP)
- **Best Practices**: >90
- **SEO**: >90 (landing page primarily)

**Pages to Audit:**
1. Landing page (/)
2. Admin login (/admin)
3. Admin dashboard (/admin/dashboard)
4. Student password prompt (/preview/[projectId])
5. Student project viewer (/preview/[projectId]/view)

## Security Considerations

**Authentication Security (Established in plan-1):**
- Admin passwords hashed with bcrypt (salt rounds: 10)
- Student project passwords stored hashed in database
- HTTP-only cookies prevent XSS attacks
- Secure flag ensures HTTPS-only cookies
- SameSite=strict prevents CSRF attacks

**Rate Limiting (Established in plan-1):**
- Password verification limited to 5 attempts per hour per project
- Prevents brute force attacks on student passwords
- Error message in Hebrew: "יותר מדי ניסיונות. נסה שוב בעוד שעה"

**XSS Prevention:**
- React auto-escapes user input (prevents script injection)
- No use of dangerouslySetInnerHTML except in HtmlIframe (sandboxed)
- Iframe sandbox: `allow-same-origin allow-scripts` (restrictive)

**CSRF Prevention:**
- SameSite=strict cookies
- All mutations use POST/DELETE with credentials: 'include'

**Content Security Policy (Future Enhancement):**
- Not implemented in MVP (out of scope for Iteration 2)
- Would restrict script sources, prevent inline scripts

**Iteration 2 Scope**: No security changes (UI-only enhancement, preserve all security measures)

## Accessibility Considerations

**Current Baseline (WCAG 2.1 AA):**
- Semantic HTML (heading hierarchy, form labels)
- Keyboard navigation (tab order, focus states)
- Touch targets minimum 44px (mobile accessibility)
- Color contrast ratios meet AA standards
- Screen reader support (ARIA labels on icons)

**RTL Support:**
- Root layout: `lang="he" dir="rtl"`
- Hebrew text aligns right automatically
- Mixed content handled with explicit `dir="ltr"` on technical fields
- Toaster notifications RTL-aware

**Form Accessibility:**
- Labels associated with inputs (htmlFor/id)
- Error messages announced to screen readers
- Required fields indicated
- Validation feedback clear and visible

**Iteration 2 Enhancements:**
- Maintain all existing accessibility features
- Ensure new gradient backgrounds don't reduce text contrast
- Verify focus states visible on gradient buttons
- Test keyboard navigation through enhanced student components

**Post-MVP Accessibility (Out of Scope for Iteration 2):**
- ARIA landmarks for page regions
- Skip navigation links
- Full screen reader testing
- Keyboard shortcut documentation
- High contrast mode support

## Summary

Iteration 2 leverages **100% of the technology stack from Iteration 1** with **zero new dependencies**. All design tokens, component patterns, and utilities are ready for application to student components. The comprehensive testing phase uses built-in Chrome DevTools for performance audits, cross-browser testing, and RTL verification.

**Key Technology Decisions:**
1. **Reuse Iteration 1 design system** - Apply Logo, gradients, button variants to student components
2. **Manual testing with Chrome DevTools** - No automated testing framework needed for this iteration
3. **Zero new dependencies** - Focus on applying existing patterns, not adding tools
4. **Performance budget monitored** - CSS stays well under 100KB target (current 36KB, expected 38KB)
5. **Cross-browser testing prioritizes Chrome + Safari** - Covers 90% of users

**Technology Readiness**: All tools and patterns ready for builder execution. No setup or configuration needed.
