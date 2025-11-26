# Builder Task Breakdown - Iteration 3

## Overview

**Total Builders:** 3 primary builders working in parallel

**Estimated Timeline:** 20-26 hours total (parallel execution)

**Builder Assignment Strategy:**
- Builder-1: Authentication UI (password prompt, session management)
- Builder-2: Core viewer functionality (HTML iframe, project metadata)
- Builder-3: Mobile optimization, downloads, deployment (polish & ship)

**Dependencies:**
- Builder-2 depends on Builder-1's session hook
- Builder-3 wraps/enhances Builder-1 and Builder-2 outputs
- Minimal file conflicts (clear boundaries)

---

## Builder-1: Password Protection & Session UI

### Scope

Create the student-facing authentication flow, enabling password-based access to projects with session persistence. This includes the password entry page, session state management, and user feedback for authentication errors.

### Complexity Estimate

**MEDIUM**

**Reasoning:**
- Reuses existing admin LoginForm patterns (proven in iteration 2)
- All backend APIs already exist (iteration 1)
- React Hook Form + Zod validation patterns established
- Mobile-first design adds responsive complexity
- Touch-friendly UI requires attention to detail

**Recommendation:** No split needed. Single builder can complete in 6-8 hours.

### Success Criteria

- [ ] Password prompt displays on `/preview/:projectId` for unauthenticated users
- [ ] Correct password creates 24-hour session and shows project viewer
- [ ] Incorrect password displays Hebrew error message via toast
- [ ] Rate limiting feedback shown after 10 failed attempts
- [ ] Session persists across browser refreshes
- [ ] Session check on page load redirects authenticated users to viewer
- [ ] Password input is mobile-responsive (320px baseline)
- [ ] Password visibility toggle works correctly
- [ ] Form validation prevents empty password submission
- [ ] Loading state shown during password verification
- [ ] Touch targets meet 44px minimum size

### Files to Create

#### 1. Student Page Route
**File:** `app/(student)/preview/[projectId]/page.tsx`

**Purpose:** Main student entry point - handles session check and conditional rendering

**Implementation:**
```typescript
'use client'

import { useProjectAuth } from '@/lib/hooks/useProjectAuth';
import { PasswordPromptForm } from '@/components/student/PasswordPromptForm';
import { ProjectViewer } from '@/components/student/ProjectViewer';
import { Loader2 } from 'lucide-react';

export default function PreviewPage({ params }: { params: { projectId: string } }) {
  const { session, refetchSession } = useProjectAuth(params.projectId);

  if (session.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="mr-2 text-muted-foreground">טוען...</span>
      </div>
    );
  }

  if (session.error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <p className="text-destructive text-lg mb-4">{session.error}</p>
          <Button onClick={() => window.location.reload()}>נסה שוב</Button>
        </div>
      </div>
    );
  }

  if (!session.authenticated) {
    return (
      <PasswordPromptForm
        projectId={params.projectId}
        onSuccess={refetchSession}
      />
    );
  }

  return <ProjectViewer projectId={params.projectId} />;
}
```

**Key Requirements:**
- Use `'use client'` directive (interactive component)
- Import `useProjectAuth` hook (create in task #3)
- Handle 3 states: loading, unauthenticated, authenticated
- Pass `onSuccess` callback to password form for session refresh

---

#### 2. Password Prompt Component
**File:** `components/student/PasswordPromptForm.tsx`

**Purpose:** Password entry form with validation, error handling, and mobile optimization

**Implementation:** See `patterns.md` section "Password Verification" (full example provided)

**Key Requirements:**
- React Hook Form + Zod validation
- Password visibility toggle (Eye/EyeOff icons)
- Submit button: `size="lg"`, `min-h-[44px]` (touch-friendly)
- Hebrew error messages via toast notifications
- Loading state during API call (`isSubmitting`)
- API call to `POST /api/preview/:id/verify`
- Handle success (call `onSuccess` callback), errors, and rate limiting (429)
- Mobile-first responsive design (centered card, max-w-md)
- Base font size 16px (prevents iOS zoom on input focus)

**Reuse Patterns:**
- Copy structure from `components/admin/LoginForm.tsx`
- Use same form validation pattern
- Use same password toggle pattern
- Follow same error handling pattern

---

#### 3. Session Management Hook
**File:** `lib/hooks/useProjectAuth.ts`

**Purpose:** Client-side hook for checking and managing project session state

**Implementation:** See `patterns.md` section "Client-Side Session Check" (full example provided)

**Key Requirements:**
- Check session on mount via `GET /api/preview/:id`
- Return `{ session, refetchSession }`
- Session state: `{ authenticated: boolean; loading: boolean; error: string | null }`
- Handle 200 (authenticated), 401 (not authenticated), other errors
- Use fetch API (not TanStack Query - avoid over-engineering)
- Graceful error handling for network failures

**API Response Handling:**
```typescript
// 200 OK + success: true → authenticated
// 401 Unauthorized → not authenticated (expected, not an error)
// Other errors → show error message to user
```

---

#### 4. TypeScript Types
**File:** `lib/types/student.ts`

**Purpose:** Shared TypeScript interfaces for student UI

**Implementation:**
```typescript
export interface SessionState {
  authenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface ProjectData {
  id: string;
  name: string;
  student: {
    name: string;
    email: string;
  };
  researchTopic: string;
  createdAt: string;
  viewCount: number;
  lastAccessed: string | null;
}

export interface PasswordFormData {
  password: string;
}
```

**Key Requirements:**
- Export all interfaces
- Use consistent naming (PascalCase)
- Match API response structure (from iteration 1 routes)

---

#### 5. Student Route Group Layout (Optional)
**File:** `app/(student)/layout.tsx`

**Purpose:** Optional layout wrapper for student routes (can defer if not needed)

**Implementation:**
```typescript
export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
```

**Note:** This is a placeholder. Can be enhanced post-MVP with student-specific headers, footers, etc. For iteration 3, just pass through children.

---

### Dependencies

**Depends on:**
- Iteration 1 backend (all APIs exist, no changes needed)
- Iteration 2 UI components (Button, Input, Label)
- Iteration 2 Zod + React Hook Form setup

**Blocks:**
- Builder-2 (needs `useProjectAuth` hook and session state management)

### Implementation Notes

#### Critical Details

1. **API Routes (Existing - DO NOT MODIFY):**
   - `POST /api/preview/:id/verify` - Returns `{ success: true }` + sets `project_token` cookie
   - `GET /api/preview/:id` - Returns project metadata (requires session cookie)
   - Cookie name: `project_token` (httpOnly, sameSite: strict, 24-hour expiry)

2. **Error Codes (from API):**
   - `INVALID_PASSWORD` (401) - Wrong password
   - `RATE_LIMIT_EXCEEDED` (429) - Too many attempts (10/hour)
   - `PROJECT_NOT_FOUND` (404) - Project doesn't exist or deleted
   - `SESSION_EXPIRED` (401) - Token expired (show on GET /api/preview/:id)

3. **Mobile Optimization:**
   - Password input: `className="text-base"` (16px font, prevents iOS zoom)
   - Submit button: `size="lg"` (44px height minimum)
   - Card: `max-w-md` (400px max width on desktop)
   - Padding: `p-4` mobile, `sm:p-8` desktop

4. **RTL Considerations:**
   - Password toggle icon: `left-3` (left side in RTL = end of input)
   - All text: Hebrew by default (inherits `dir="rtl"` from root layout)
   - Email fields: Not applicable in password form

#### Gotchas

1. **Session Cookie Access:**
   - Client-side JavaScript CANNOT read `project_token` (httpOnly)
   - Session check must use API call, not cookie inspection
   - Trust API response for authentication state

2. **Auto-Redirect Loop:**
   - Ensure session check only runs once on mount
   - Use `useEffect` with empty dependency array
   - Don't re-check on every render (causes infinite loop)

3. **Toast Position:**
   - Toaster configured globally in root layout (top-left, RTL)
   - No need to configure in component
   - Just import `toast` and call methods

4. **Form Reset:**
   - Clear password field on error (security best practice)
   - Use `reset()` from React Hook Form after failed attempt
   - Don't clear on success (user navigates away automatically)

### Patterns to Follow

**From `patterns.md`:**
- "Authentication Pattern" → Client-Side Session Check
- "Authentication Pattern" → Password Verification
- "Component Structure" → Mobile-First Responsive Component
- "Error Handling" → Toast Notifications
- "Hebrew RTL Guidelines" → Global Configuration (inherited)

**From Iteration 2:**
- `components/admin/LoginForm.tsx` → Form structure, validation, password toggle
- `lib/hooks/useAuth.ts` → Hook pattern (adapted for project sessions)

### Testing Requirements

#### Manual Testing Checklist

**Authentication Flow:**
- [ ] Navigate to `/preview/test-project-id` (unauthenticated)
- [ ] See password prompt (not project viewer)
- [ ] Enter wrong password → See Hebrew error toast
- [ ] Enter correct password → Navigate to project viewer
- [ ] Refresh page → Still authenticated (session persists)
- [ ] Wait 24 hours OR delete cookie → Redirected to password prompt

**Mobile Testing:**
- [ ] Test on 320px viewport (iPhone SE)
- [ ] Password input doesn't trigger zoom on focus
- [ ] Submit button is large enough to tap (44px+)
- [ ] Card is centered and scrollable
- [ ] No horizontal scroll

**Error Handling:**
- [ ] Network error → Show Hebrew network error message
- [ ] Rate limit (10 attempts) → Show rate limit message
- [ ] Non-existent project → Show project not found error

**Edge Cases:**
- [ ] Empty password submission → Zod validation error
- [ ] Very long password (>100 chars) → Zod validation error
- [ ] Special characters in password → Work correctly
- [ ] Hebrew characters in password → Work correctly (edge case, unlikely)

#### Unit Tests (Optional, Deferred to Post-MVP)

If implementing automated tests:
```typescript
// __tests__/PasswordPromptForm.test.tsx
describe('PasswordPromptForm', () => {
  it('renders password input and submit button', () => {});
  it('shows validation error on empty submission', () => {});
  it('calls onSuccess on successful authentication', () => {});
  it('shows error toast on wrong password', () => {});
  it('disables button during submission', () => {});
});
```

### Potential Split Strategy

**If complexity proves HIGH during execution:**

This task is well-scoped and unlikely to require splitting. If time constraints emerge, consider:

**Foundation (Builder-1 creates first):**
- `lib/hooks/useProjectAuth.ts` - Session hook
- `lib/types/student.ts` - TypeScript types
- `app/(student)/preview/[projectId]/page.tsx` - Basic route

**Sub-Builder 1A (Optional split):**
- `components/student/PasswordPromptForm.tsx` - Complete password form component

**Recommendation:** Do NOT split unless builder explicitly requests it. The component is straightforward and reuses proven patterns.

---

## Builder-2: Project Viewer & HTML Iframe

### Scope

Create the main student viewing experience, displaying project metadata and embedding the interactive HTML report in a secure, mobile-optimized iframe. This includes data fetching, loading states, error handling, and Plotly compatibility.

### Complexity Estimate

**MEDIUM-HIGH**

**Reasoning:**
- Iframe security configuration requires careful implementation
- Mobile responsive layout has multiple breakpoints
- Loading states and error fallbacks add complexity
- Data fetching with TanStack Query (established pattern)
- Integration with Builder-1's session management
- No backend changes (all APIs exist)

**Recommendation:** No split needed. Single builder with 7-9 hours is sufficient. If iframe complexity is underestimated, defer dynamic height to post-MVP (use fixed height).

### Success Criteria

- [ ] Project metadata displays correctly (name, student, topic)
- [ ] HTML report renders in iframe without errors
- [ ] All Plotly graphs are interactive (zoom, pan, hover)
- [ ] Iframe has correct sandbox attributes (`allow-scripts allow-same-origin`)
- [ ] Loading skeleton shown while HTML loads
- [ ] Error fallback displayed if iframe fails to load (with "open in new tab" button)
- [ ] Mobile layout: full viewport width, no horizontal scroll
- [ ] Desktop layout: centered with max-width, rounded corners
- [ ] Hebrew RTL layout works correctly
- [ ] Email displays in LTR (mixed content handling)
- [ ] Session expiration redirects to password prompt
- [ ] View count increments on password verification (existing backend behavior)

### Files to Create

#### 1. Project Viewer Container
**File:** `components/student/ProjectViewer.tsx`

**Purpose:** Main container component that fetches project data and orchestrates layout

**Implementation:** See `patterns.md` section "Component Structure" (full example provided)

**Key Requirements:**
- Use TanStack Query for data fetching (`useQuery`)
- Query key: `['project', projectId]`
- Stale time: 1 hour (project metadata rarely changes)
- Handle loading state (show full-page spinner)
- Handle error state (show error message with retry button)
- Layout: flexbox column (header → main → download button)
- Compose sub-components: `<ProjectMetadata />`, `<HtmlIframe />`, `<DownloadButton />` (placeholder)

**Data Fetching:**
```typescript
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
  staleTime: 1000 * 60 * 60, // 1 hour
});
```

**Layout Structure:**
```typescript
<div className="min-h-screen flex flex-col">
  <ProjectMetadata project={data} />
  <main className="flex-1 relative">
    <HtmlIframe projectId={projectId} />
  </main>
  {/* DownloadButton placeholder - Builder-3 will implement */}
  <div className="lg:absolute lg:top-4 lg:right-4">
    {/* TODO: Builder-3 - Add DownloadButton here */}
  </div>
</div>
```

---

#### 2. Project Metadata Header
**File:** `components/student/ProjectMetadata.tsx`

**Purpose:** Display project information in a mobile-responsive header

**Implementation:** See `patterns.md` section "Responsive Layout Pattern" (full example provided)

**Key Requirements:**
- Accept `project` prop with type `ProjectData` (from `lib/types/student.ts`)
- Display: project name, student name, student email, research topic
- Mobile: Compact padding (p-4), smaller text (text-xl)
- Desktop: Spacious padding (lg:p-6), larger text (lg:text-3xl)
- Email: `dir="ltr"` and `text-left` for proper BiDi handling
- Research topic: Line clamp on mobile (`line-clamp-2`), full on desktop
- Max width: `max-w-6xl mx-auto` (centered on large screens)
- Background: White with bottom border (`bg-white border-b`)

**Props Interface:**
```typescript
interface ProjectMetadataProps {
  project: {
    name: string;
    student: { name: string; email: string };
    researchTopic: string;
  };
}
```

---

#### 3. HTML Iframe Component
**File:** `components/student/HtmlIframe.tsx`

**Purpose:** Secure iframe wrapper for HTML report with loading states and error handling

**Implementation:** See `patterns.md` section "Error Handling" → "Client-Side Error Handling" (full example provided)

**Key Requirements:**
- Accept `projectId` prop
- Iframe attributes:
  - `src`: `/api/preview/${projectId}/html`
  - `sandbox`: `"allow-scripts allow-same-origin"`
  - `title`: `"Statistical Analysis Report"` (accessibility)
  - `className`: Mobile: `w-full h-full border-0`, Desktop: `lg:rounded-lg lg:border`
  - `loading`: `"lazy"` (performance)
- Loading state: Show skeleton until iframe `onLoad` event
- Error handling: 15-second timeout, fallback UI with "open in new tab" button
- Use `useRef` to access iframe DOM element
- Use `useState` for loading/error states
- Hebrew error messages

**Security Critical:**
- Sandbox MUST include `allow-scripts` (Plotly requires it)
- Sandbox MUST include `allow-same-origin` (Plotly DOM access)
- Do NOT include `allow-forms`, `allow-popups`, `allow-top-navigation`

**Mobile Layout:**
- Full viewport height: `h-full` or `h-screen`
- No border/radius on mobile (edge-to-edge)
- Border and rounded corners on desktop (`lg:rounded-lg lg:border`)

---

#### 4. Project Data Hook
**File:** `lib/hooks/useProject.ts`

**Purpose:** Reusable TanStack Query hook for fetching project metadata

**Implementation:**
```typescript
import { useQuery } from '@tanstack/react-query';
import type { ProjectData } from '@/lib/types/student';

export function useProject(projectId: string) {
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: async (): Promise<ProjectData> => {
      const response = await fetch(`/api/preview/${projectId}`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || 'Failed to load project');
      }

      return result.data.project;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    cacheTime: 1000 * 60 * 60 * 24, // 24 hours
    retry: 1, // Only retry once
  });
}
```

**Key Requirements:**
- Return type explicitly defined as `ProjectData`
- Error handling throws with Hebrew message
- Aggressive caching (project metadata doesn't change)
- Single retry on failure (avoid hammering server)

---

### Dependencies

**Depends on:**
- Builder-1's `useProjectAuth` hook (session management)
- Iteration 1 API routes (no changes)
- Iteration 2 TanStack Query setup (already configured)
- Iteration 2 UI components (Skeleton)

**Blocks:**
- Builder-3 (needs `ProjectViewer` component to add download button)

### Implementation Notes

#### Critical Details

1. **API Response Structure:**
```typescript
// GET /api/preview/:id response
{
  success: true,
  data: {
    project: {
      id: string;
      name: string;
      student: { name: string; email: string };
      research_topic: string;  // Note: snake_case from API
      created_at: string;
      view_count: number;
      last_accessed: string | null;
    }
  }
}
```

**Transform to camelCase:**
```typescript
return {
  ...result.data.project,
  researchTopic: result.data.project.research_topic,
  createdAt: result.data.project.created_at,
  viewCount: result.data.project.view_count,
  lastAccessed: result.data.project.last_accessed,
};
```

2. **Iframe Loading Detection:**
   - Use `onLoad` event (fires when content fully loaded)
   - Timeout fallback (15 seconds) for error detection
   - `onError` is unreliable for content load failures

3. **Iframe Height:**
   - Use fixed height for MVP: `h-screen` or `h-full`
   - Do NOT implement dynamic height (postMessage complexity)
   - Future enhancement: Add postMessage for auto-height

4. **Session Expiration Handling:**
   - If API returns 401 during data fetch, user should be redirected to password prompt
   - This is handled by error state in `ProjectViewer`
   - Error message from API will be in Hebrew ("הפגישה פגה תוקף")

#### Gotchas

1. **Plotly Load Time:**
   - Large HTML (5-10MB) can take 5-10 seconds on 3G
   - Show loading skeleton, not blank screen
   - Timeout should be generous (15 seconds minimum)

2. **Iframe Same-Origin:**
   - HTML served from same domain (`/api/preview/:id/html`)
   - No CORS issues (same-origin policy satisfied)
   - Sandbox `allow-same-origin` is safe in this context

3. **Mixed Content:**
   - Email is English LTR within Hebrew RTL context
   - Must use `dir="ltr"` AND `text-left` for proper alignment
   - Test with both Hebrew and English student names

4. **TanStack Query Errors:**
   - Query errors are thrown, not returned in `error` state
   - Must use `try/catch` in `queryFn` or let React Error Boundary catch
   - Provide fallback UI in component for network errors

### Patterns to Follow

**From `patterns.md`:**
- "Component Structure" → Mobile-First Responsive Component
- "Error Handling" → Client-Side Error Handling
- "Iframe Security" → Secure Iframe Implementation
- "Hebrew RTL Guidelines" → Mixed Content (Hebrew + English)
- "Loading States" → Skeleton Pattern

**From Iteration 2:**
- `lib/hooks/useAuth.ts` → TanStack Query hook pattern (adapt for project data)
- `components/admin/DashboardHeader.tsx` → Responsive header layout

### Testing Requirements

#### Manual Testing Checklist

**Data Fetching:**
- [ ] Navigate to authenticated project → See project metadata
- [ ] Check network tab → Single API call to `/api/preview/:id`
- [ ] Metadata displays correctly (name, student, email, topic)
- [ ] Email displays in LTR (left-to-right alignment)

**Iframe Rendering:**
- [ ] HTML report loads in iframe (not new page)
- [ ] Plotly graphs render correctly
- [ ] Interactive features work (zoom, pan, hover tooltips)
- [ ] Sandbox attributes visible in DevTools (allow-scripts, allow-same-origin)
- [ ] No JavaScript errors in console

**Loading States:**
- [ ] Skeleton shown while iframe loads
- [ ] Skeleton disappears after load complete
- [ ] Loading state respects timeout (15 seconds)

**Error Handling:**
- [ ] Disconnect network → See error fallback
- [ ] "Open in new tab" button works
- [ ] Session expired (delete cookie) → Redirect to password prompt

**Mobile Layout:**
- [ ] Test 320px viewport → No horizontal scroll
- [ ] Test 375px viewport → Optimal layout
- [ ] Test 768px viewport → Desktop layout with border/radius
- [ ] Iframe full height on mobile
- [ ] Header compact on mobile, spacious on desktop

**RTL Testing:**
- [ ] Hebrew text right-aligned
- [ ] Email left-aligned (LTR)
- [ ] Research topic wraps correctly
- [ ] Line clamp works on mobile (2 lines max)

#### Plotly Interaction Testing

- [ ] Click chart → Zoom/pan works
- [ ] Pinch gesture (mobile) → Zoom works
- [ ] Tap data point → Tooltip appears
- [ ] Double-tap → Reset zoom
- [ ] Charts responsive to window resize

### Potential Split Strategy

**If complexity proves VERY HIGH during execution:**

**Foundation (Builder-2 creates first):**
- `lib/hooks/useProject.ts` - Data fetching hook
- `lib/types/student.ts` - Enhance with ProjectData interface
- `components/student/ProjectViewer.tsx` - Basic container (minimal)

**Sub-Builder 2A: Metadata & Layout**
- `components/student/ProjectMetadata.tsx` - Complete responsive header
- Enhance `ProjectViewer.tsx` with proper layout

**Sub-Builder 2B: Iframe & Security**
- `components/student/HtmlIframe.tsx` - Complete secure iframe component
- Loading states, error handling, timeout logic

**Recommendation:** Only split if iframe security proves more complex than anticipated. Most builders can complete this in 7-9 hours without split.

---

## Builder-3: DOCX Download, Mobile Polish & Deployment

### Scope

Complete the MVP by adding DOCX download functionality, performing comprehensive mobile optimization across all student components, tightening security headers, and deploying to production. This is the "polish and ship" phase that makes the platform production-ready.

### Complexity Estimate

**MEDIUM-HIGH**

**Reasoning:**
- Download button is straightforward
- Mobile optimization requires testing across multiple devices/viewports
- CSP header configuration is security-critical (must be correct)
- Deployment involves multiple platforms (Vercel + Supabase Cloud)
- File size validation enhancement touches existing upload logic
- Documentation creation requires thoroughness
- Manual testing is time-consuming

**Recommendation:** No split needed. Builder-3 should be detail-oriented and thorough. 7-9 hours is realistic with comprehensive testing.

### Success Criteria

- [ ] Download button renders on project viewer page
- [ ] Click download → DOCX file downloads with Hebrew-safe filename
- [ ] Download button: fixed bottom on mobile, absolute top-right on desktop
- [ ] Download button meets 44px touch target minimum
- [ ] Loading state shown during download initiation
- [ ] Viewport meta tag added to root layout
- [ ] All touch targets verified ≥44px across student UI
- [ ] CSP headers tightened (remove `unsafe-eval`)
- [ ] File size validation enhanced (warn >5MB, block >10MB)
- [ ] HTML validation strengthened (ERROR on external resources)
- [ ] Manual mobile testing completed (iOS + Android)
- [ ] Platform deployed to production (Vercel + Supabase Cloud)
- [ ] Deployment documentation created
- [ ] Mobile testing checklist created

### Files to Create

#### 1. Download Button Component
**File:** `components/student/DownloadButton.tsx`

**Purpose:** Trigger DOCX download with mobile-optimized placement and loading feedback

**Implementation:** See `patterns.md` section "Touch-Friendly Components" (full example provided)

**Key Requirements:**
- Accept props: `projectId`, `projectName`
- Button size: `lg` (44px minimum height)
- Mobile: Fixed bottom bar (`fixed bottom-4 left-4 right-4 z-50`)
- Desktop: Absolute top-right (`lg:absolute lg:top-4 lg:right-4`)
- Loading state: Show spinner during download
- Download method: `window.location.href` (simpler than fetch for binary files)
- Toast feedback: "ההורדה מתחילה..." → "הקובץ הורד בהצלחה"
- Icon: `Download` from lucide-react
- Full-width on mobile, auto-width on desktop

**Integration:**
```typescript
// components/student/ProjectViewer.tsx (Builder-2 created placeholder)
// Builder-3: Replace placeholder comment with:
<DownloadButton projectId={projectId} projectName={data.name} />
```

**Download Flow:**
1. User clicks button
2. Set `isDownloading = true`
3. Show toast: "ההורדה מתחילה..."
4. Trigger download: `window.location.href = /api/preview/${projectId}/download`
5. Wait 1 second (download started)
6. Show toast: "הקובץ הורד בהצלחה"
7. Set `isDownloading = false`

---

#### 2. Viewport Meta Tag
**File:** `app/layout.tsx` (MODIFY EXISTING)

**Purpose:** Configure viewport for mobile browsers (CRITICAL)

**Implementation:**
```typescript
// app/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'StatViz - פלטפורמת דוחות סטטיסטיים',
  description: 'פלטפורמה מאובטחת לצפייה בדוחות ניתוח סטטיסטיים',
  viewport: {
    width: 'device-width',
    initialScale: 1.0,
    maximumScale: 5.0,  // Allow zoom for accessibility
  },
};

// ... rest of layout (no other changes)
```

**Critical:** Without this, mobile browsers render at ~980px and zoom out (terrible UX).

---

#### 3. CSP Headers Enhancement
**File:** `middleware.ts` (CREATE OR MODIFY)

**Purpose:** Tighten Content Security Policy for iframe routes

**Implementation:** See `patterns.md` section "CSP Headers (Middleware Enhancement)" (full example provided)

**Key Requirements:**
- Remove `unsafe-eval` from script-src (not needed for Plotly)
- Keep `unsafe-inline` (Plotly requires inline scripts)
- Add `data:` to style-src (Plotly data URLs)
- Add `blob:` to img-src (Plotly blob URLs)
- Add `frame-ancestors 'none'` (prevent clickjacking)
- Apply only to `/api/preview/*` routes (don't affect admin panel)

**Changes from Iteration 2:**
```diff
- script-src 'self' 'unsafe-inline' 'unsafe-eval';
+ script-src 'self' 'unsafe-inline';
- style-src 'self' 'unsafe-inline';
+ style-src 'self' 'unsafe-inline' data:;
- img-src 'self';
+ img-src 'self' data: blob:;
+ frame-ancestors 'none';
```

---

#### 4. File Size Validation Enhancement
**File:** `lib/upload/validator.ts` (MODIFY EXISTING)

**Purpose:** Add file size warnings and strengthen HTML validation

**Implementation:** See `patterns.md` section "Input Sanitization" (full example provided)

**Key Requirements:**
- Add `validateHtmlFileSize(buffer: Buffer)` function
- Warn if HTML >5MB (עשוי לטעון לאט במובייל)
- Block if HTML >10MB (קובץ גדול מדי)
- Strengthen `validateHtmlSelfContained()` to return ERRORS (not warnings) on external resources
- Hebrew error/warning messages

**Changes:**
```typescript
// OLD: Warning on external resources
return { isValid: true, warnings: ['External CSS detected'] };

// NEW: Error on external resources
return { isValid: false, errors: ['הקובץ מכיל CSS חיצוני - חייב להיות עצמאי'] };
```

**Integration:**
- Admin upload UI (iteration 2) will display errors and block upload
- No UI changes needed (existing error display logic handles this)

---

#### 5. Touch Target Audit
**File:** Create temporary checklist, verify all components

**Purpose:** Ensure all interactive elements meet 44px minimum

**Components to Check:**
- [ ] `PasswordPromptForm` submit button → Use `size="lg"`
- [ ] `DownloadButton` → Use `size="lg"` + `min-h-[44px]`
- [ ] `HtmlIframe` error fallback "Open in new tab" button → `size="lg"`
- [ ] Password visibility toggle → Already 44x44px (icon button)

**Fix Pattern:**
```typescript
// If button is too small:
<Button size="lg" className="min-h-[44px]">
```

---

#### 6. Deployment Documentation
**File:** `docs/DEPLOYMENT.md`

**Purpose:** Step-by-step guide for deploying to production

**Content:**
```markdown
# StatViz Deployment Guide

## Prerequisites

- Vercel account
- Supabase Cloud account
- GitHub repository

## Step 1: Supabase Cloud Setup

1. Create new project at https://supabase.com/dashboard
2. Wait for project provisioning (~2 minutes)
3. Navigate to Settings → Database
4. Copy connection string:
   ```
   postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
   ```
5. Run migrations:
   ```bash
   export DATABASE_URL="postgresql://..."
   npx prisma migrate deploy
   ```
6. Verify tables created in Table Editor

## Step 2: Environment Variables

Generate secrets:
```bash
# JWT secret (32+ characters)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Admin password hash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('YOUR_PASSWORD', 10).then(h => console.log(Buffer.from(h).toString('base64')))"
```

## Step 3: Vercel Deployment

1. Import repository to Vercel
2. Configure environment variables:
   - `DATABASE_URL`: Supabase connection string
   - `JWT_SECRET`: Generated secret
   - `ADMIN_PASSWORD_HASH`: Base64 bcrypt hash
   - `STORAGE_TYPE`: `local`
   - `UPLOAD_DIR`: `/uploads`
3. Deploy

## Step 4: Post-Deployment Verification

1. Visit deployed URL
2. Test admin login at `/admin`
3. Create test project
4. Access student viewer at `/preview/:id`
5. Verify DOCX download
6. Test on mobile device

## Step 5: Custom Domain (Optional)

1. Add domain in Vercel dashboard
2. Configure DNS (A record or CNAME)
3. Wait for SSL certificate provisioning

## Troubleshooting

### Build Errors
- Check TypeScript compilation: `npm run build`
- Verify environment variables set

### Database Connection
- Test connection: `npx prisma db pull`
- Check connection string format

### File Upload Issues
- Vercel filesystem is ephemeral
- Consider migrating to S3 or Vercel Blob

## Rollback

Vercel keeps previous deployments:
1. Dashboard → Deployments
2. Click previous deployment
3. Click "Promote to Production"
```

---

#### 7. Mobile Testing Checklist
**File:** `docs/MOBILE_TESTING.md`

**Purpose:** Comprehensive manual testing checklist

**Content:**
```markdown
# Mobile Testing Checklist - StatViz

## Devices

- [ ] iPhone SE (320px width) - Minimum target
- [ ] iPhone 12/13 (375px width) - Primary target
- [ ] Android phone (360px width)
- [ ] iPad (768px width)

## Browser Testing

- [ ] iOS Safari
- [ ] Android Chrome
- [ ] (Optional) Firefox, Edge

## Password Prompt Page

- [ ] Page renders without horizontal scroll
- [ ] Password input doesn't trigger zoom on focus
- [ ] Password toggle icon visible and functional
- [ ] Submit button large enough to tap (44px+)
- [ ] Submit button has adequate spacing from edges
- [ ] Error toast appears in correct position (top-left)
- [ ] Loading state shows during verification
- [ ] Form centered on screen

## Project Viewer Page

- [ ] Header displays all metadata
- [ ] Student name in Hebrew right-aligned
- [ ] Email in English left-aligned (LTR)
- [ ] Research topic truncates on mobile (2 lines)
- [ ] HTML iframe full viewport width
- [ ] No horizontal scroll within iframe
- [ ] Plotly charts render correctly

## Plotly Interactions

- [ ] Single finger drag pans chart
- [ ] Pinch gesture zooms in/out
- [ ] Tap shows tooltip
- [ ] Double-tap resets view
- [ ] Charts responsive to orientation change

## Download Button

- [ ] Button visible at bottom of screen (mobile)
- [ ] Button fixed in position during scroll
- [ ] Button large enough to tap (44px+)
- [ ] Download initiates correctly
- [ ] DOCX file has Hebrew-safe filename
- [ ] Loading spinner shows during download

## Network Conditions

- [ ] Test on 3G throttling (Chrome DevTools)
- [ ] Loading skeleton shows during slow HTML load
- [ ] Timeout fallback triggers after 15 seconds

## RTL Layout

- [ ] All Hebrew text right-aligned
- [ ] Download button on correct side (bottom-left in RTL)
- [ ] Icons positioned correctly
- [ ] No text overflow with long words

## Edge Cases

- [ ] Very long project name wraps correctly
- [ ] Very long research topic truncates
- [ ] Large HTML (>5MB) shows warning during upload
- [ ] Session expiration redirects to password prompt

## Performance

- [ ] First Contentful Paint <2 seconds
- [ ] HTML iframe loads in <10 seconds (3G)
- [ ] No janky scrolling
- [ ] Smooth animations (60fps)

## Accessibility

- [ ] Zoom works (pinch or browser zoom)
- [ ] Text readable at 200% zoom
- [ ] Color contrast sufficient
- [ ] Focus indicators visible
```

---

### Dependencies

**Depends on:**
- Builder-1's `PasswordPromptForm` (for touch target verification)
- Builder-2's `ProjectViewer` (to integrate download button)
- Iteration 1 download API route (no changes needed)

**Blocks:** Nothing (final builder)

### Implementation Notes

#### Critical Details

1. **Download API (Existing - DO NOT MODIFY):**
   - `GET /api/preview/:id/download`
   - Returns DOCX with `Content-Disposition: attachment`
   - Filename sanitized (Hebrew-safe: `\u0590-\u05FF`)
   - Session validation required (cookie: `project_token`)

2. **Button Placement Math:**
   - Mobile: `fixed bottom-4 left-4 right-4` (16px margins)
   - Desktop: `lg:absolute lg:top-4 lg:right-4` (relative to parent)
   - Z-index: `z-50` (above iframe content)
   - Shadow: `shadow-lg` (visual elevation)

3. **CSP Testing:**
   - After deploying CSP changes, verify Plotly still works
   - Test in Chrome, Safari, Firefox
   - Check browser console for CSP violations
   - If Plotly breaks, incrementally add back directives

4. **File Size Impact:**
   - 5MB HTML on 3G (750Kbps) = 53 seconds
   - 10MB HTML on 3G = 107 seconds (exceeds 10s target)
   - Warnings critical for user experience

#### Gotchas

1. **Download Detection:**
   - No reliable way to detect download completion
   - Use timeout (1 second) as heuristic
   - Toast success may appear before actual download complete

2. **Fixed Button on iOS:**
   - `position: fixed` can behave oddly during scroll
   - Test on real iOS device (not just simulator)
   - May need `transform: translateZ(0)` for GPU acceleration

3. **Viewport Meta Tag:**
   - Must be in root layout metadata, not added via middleware
   - Changes require full page reload (not hot reload)
   - Test on real device to verify (emulator may not reflect accurately)

4. **CSP Header Conflicts:**
   - Admin panel and student routes have different CSP needs
   - Ensure CSP only applied to `/api/preview/*` routes
   - Use middleware matcher to scope correctly

### Patterns to Follow

**From `patterns.md`:**
- "Touch-Friendly Components" → Download button implementation
- "CSP Headers (Middleware Enhancement)" → Security configuration
- "Input Sanitization" → File size validation
- "Mobile Optimization" → Viewport configuration

**From Iteration 2:**
- File upload validator structure (adapt for size checks)

### Testing Requirements

#### Manual Testing Checklist

**Download Functionality:**
- [ ] Click download button → DOCX downloads
- [ ] Filename contains project name in Hebrew
- [ ] Filename doesn't contain special characters (sanitized)
- [ ] File opens correctly in Microsoft Word
- [ ] Multiple downloads work (no session expiration)

**Mobile Optimization:**
- [ ] Complete `docs/MOBILE_TESTING.md` checklist
- [ ] Test on real iPhone (iOS Safari)
- [ ] Test on real Android phone (Chrome)
- [ ] Test on tablet (iPad or Android)
- [ ] Document any issues found

**Security:**
- [ ] Browser console shows no CSP violations
- [ ] Plotly charts still work after CSP tightening
- [ ] Iframe cannot access parent window
- [ ] External resource HTML blocked during upload

**Deployment:**
- [ ] Build completes: `npm run build` (0 errors)
- [ ] Vercel deployment succeeds
- [ ] Supabase migrations applied
- [ ] Admin login works in production
- [ ] Student access works in production
- [ ] DOCX download works in production

#### Performance Testing

- [ ] Run Lighthouse on deployed URL (mobile preset)
- [ ] Performance score >90
- [ ] Accessibility score >95
- [ ] Test with 3G throttling (Chrome DevTools)
- [ ] HTML load time <10 seconds for 5MB files

### Deployment Checklist

**Pre-Deployment:**
- [ ] All TypeScript errors resolved
- [ ] ESLint passes (0 errors)
- [ ] Build succeeds locally
- [ ] Manual testing completed

**Deployment:**
- [ ] Supabase project created
- [ ] Database migrations run
- [ ] Environment variables configured in Vercel
- [ ] Vercel deployment triggered
- [ ] Deployment successful

**Post-Deployment:**
- [ ] Production URL accessible
- [ ] Admin login functional
- [ ] Create test project
- [ ] Student access functional
- [ ] DOCX download functional
- [ ] Mobile testing on real devices
- [ ] Document production URL

### Potential Split Strategy

**If complexity proves HIGH during execution:**

This builder has diverse tasks. If time-constrained, consider:

**Foundation (Builder-3 creates first):**
- `components/student/DownloadButton.tsx` - Complete download functionality
- Viewport meta tag addition
- Touch target audit

**Sub-Builder 3A: Security & Validation**
- `middleware.ts` - CSP headers
- `lib/upload/validator.ts` - File size validation

**Sub-Builder 3B: Deployment & Documentation**
- `docs/DEPLOYMENT.md`
- `docs/MOBILE_TESTING.md`
- Actual deployment to Vercel + Supabase
- Production testing

**Recommendation:** Only split if deployment complexity is underestimated. Most experienced builders can complete this in 7-9 hours.

---

## Builder Execution Order

### Phase 1: Parallel Foundation (No Dependencies)
**Start immediately:**
- Builder-1: Authentication UI (password prompt, session hook)
- Builder-2: Project metadata component (can start without Builder-1's hook, just mock it)

**Duration:** 6-8 hours each

---

### Phase 2: Integration Point
**After Builder-1 completes `useProjectAuth` hook:**
- Builder-2: Integrate session hook into `ProjectViewer` container
- Builder-2: Complete iframe component

**Duration:** Remaining 2-4 hours for Builder-2

---

### Phase 3: Final Polish & Ship
**After Builder-1 and Builder-2 complete:**
- Builder-3: Add download button to `ProjectViewer`
- Builder-3: Mobile optimization, CSP headers, deployment

**Duration:** 7-9 hours

---

## Integration Notes

### Shared Interfaces

**Builder-1 creates, others use:**
```typescript
// lib/types/student.ts
export interface SessionState {
  authenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface ProjectData {
  id: string;
  name: string;
  student: { name: string; email: string };
  researchTopic: string;
  createdAt: string;
  viewCount: number;
  lastAccessed: string | null;
}
```

### Integration Points

1. **Builder-1 → Builder-2:**
   - Builder-2 imports `useProjectAuth` from `lib/hooks/useProjectAuth.ts`
   - Builder-2 uses `SessionState` type

2. **Builder-2 → Builder-3:**
   - Builder-3 imports `ProjectViewer` and adds `<DownloadButton />` where placeholder comment exists
   - Builder-3 uses `ProjectData` type for download button props

3. **All Builders → Validator:**
   - Validator uses `docs/MOBILE_TESTING.md` created by Builder-3
   - Validator tests complete student flow (auth → view → download)

### Conflict Prevention

**No File Overlaps:**
- Each builder owns distinct files
- Only Builder-3 modifies existing files (`app/layout.tsx`, `lib/upload/validator.ts`, `middleware.ts`)
- Modifications are additive (no deletions)

**Clear Interfaces:**
- TypeScript types define contracts
- Placeholder comments mark integration points
- API responses documented in this plan

**Testing Coordination:**
- Builder-1 tests: Password prompt in isolation
- Builder-2 tests: Project viewer with mocked authentication
- Builder-3 tests: Complete flow end-to-end

---

## Success Metrics

**Code Quality:**
- 0 TypeScript errors
- 0 ESLint errors (intentional warnings OK)
- All components follow patterns from `patterns.md`

**Functionality:**
- All 31 success criteria from `overview.md` met
- Manual testing checklists completed
- Production deployment successful

**Performance:**
- Lighthouse mobile score >90
- Bundle size <200KB (student bundle)
- HTML load <10s on 3G (for files <5MB)

**User Experience:**
- Touch targets ≥44px
- Hebrew RTL perfect on mobile
- No horizontal scroll on 320px+
- Plotly interactions smooth

---

**Task Breakdown Status:** COMPLETE
**Ready for:** Builder execution
**Expected Outcome:** Shippable MVP in 28-37 hours (3 builders parallel)
