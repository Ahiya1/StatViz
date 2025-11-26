# 2L Iteration Plan - StatViz Iteration 3

## Project Vision

StatViz is a secure platform for delivering statistical analysis reports to graduate students in Israeli academic institutions. This final MVP iteration adds student-facing functionality, enabling password-protected access to interactive HTML reports and downloadable DOCX findings documents on mobile devices.

## What's Already Done

### Iteration 1 (PASS - 100%)
- Complete backend infrastructure with Supabase PostgreSQL database
- Admin and project authentication systems with JWT tokens and bcrypt password hashing
- File storage abstraction layer (local filesystem, S3-ready)
- 4 API routes for student access:
  - `POST /api/preview/:id/verify` - Password verification
  - `GET /api/preview/:id` - Project metadata
  - `GET /api/preview/:id/html` - HTML report serving
  - `GET /api/preview/:id/download` - DOCX file download
- Session management with 24-hour project sessions
- Rate limiting (10 attempts/hour per project)
- Hebrew error messages and validation
- HTML self-contained validation
- Security headers and SQL injection prevention

### Iteration 2 (PASS - 95%)
- Complete admin panel with Hebrew RTL support
- Project creation UI with drag-drop file upload
- Project management dashboard with search/filter
- React Hook Form + Zod validation patterns
- TanStack Query for API state management
- shadcn/ui component library (Button, Input, Label, Skeleton, Dialog, Table, Textarea)
- Rubik font with Hebrew and Latin subsets
- Toast notifications (Sonner) with RTL positioning
- Authentication flow (login, session persistence, logout)
- Clipboard copy functionality for project links

## What We're Building (Iteration 3)

This iteration focuses on **student access and mobile optimization**:

1. **Password Protection UI** - Student password entry page with session management
2. **Project Viewer Page** - Display project metadata and embedded HTML report
3. **Secure HTML Iframe** - Sandboxed iframe for Plotly interactive reports
4. **DOCX Download Button** - One-click download with mobile-optimized placement
5. **Mobile-First Design** - Responsive layout for 320px+ devices
6. **Security Hardening** - Tightened CSP headers and iframe sandbox configuration
7. **Deployment Readiness** - Production configuration and deployment documentation

## Architecture Summary

### Frontend Stack
- **Framework**: Next.js 14 with App Router (existing)
- **UI Library**: React 18 with TypeScript (existing)
- **Components**: shadcn/ui + custom student components (5 new components)
- **Styling**: Tailwind CSS with Hebrew RTL support (existing)
- **State Management**: TanStack Query for API calls (existing)
- **Validation**: React Hook Form + Zod (existing pattern, reuse)

### Backend (No Changes Needed)
- **Database**: Supabase PostgreSQL (existing, no new migrations)
- **Authentication**: Project password authentication (existing, fully functional)
- **File Serving**: Session-validated file access (existing, production-ready)
- **Storage**: Local filesystem (S3 migration ready but deferred)

### Mobile Strategy
- **Baseline**: 320px viewport (iPhone SE)
- **Primary Target**: 375px (iPhone 12/13, most common)
- **Touch Targets**: 44px minimum (Apple/Android guidelines)
- **Font Size**: 16px base (prevents iOS auto-zoom)
- **Breakpoints**: Default Tailwind (sm: 640px, md: 768px, lg: 1024px)

### Security Configuration
- **Iframe Sandbox**: `allow-scripts allow-same-origin` (required for Plotly)
- **CSP Headers**: Remove `unsafe-eval`, keep `unsafe-inline` for Plotly
- **Session Cookies**: httpOnly, secure, sameSite: strict (existing)
- **HTML Validation**: Strengthen to block external resources (not just warn)

## Success Criteria

This iteration is successful when ALL criteria are met:

### Authentication & Access
- [ ] 1. Student can navigate to `/preview/:projectId` and see password prompt
- [ ] 2. Correct password grants access and creates 24-hour session
- [ ] 3. Incorrect password shows Hebrew error message
- [ ] 4. Session persists across browser refreshes
- [ ] 5. Session timeout redirects to password prompt with clear message
- [ ] 6. Rate limiting feedback shown after 10 failed attempts

### HTML Report Viewing
- [ ] 7. HTML report renders in secure iframe with sandbox attributes
- [ ] 8. All Plotly graphs are interactive (zoom, pan, hover tooltips)
- [ ] 9. Iframe content displays without horizontal scroll on 320px+ screens
- [ ] 10. Loading skeleton shown while HTML loads
- [ ] 11. Error fallback displayed if HTML fails to load

### DOCX Download
- [ ] 12. Download button triggers DOCX download
- [ ] 13. Downloaded file has Hebrew-safe filename
- [ ] 14. Download button is accessible on mobile (fixed position, 44px+ height)
- [ ] 15. Download initiates without session expiration errors

### Mobile Optimization
- [ ] 16. Password prompt is mobile-responsive (320px baseline)
- [ ] 17. All touch targets meet 44px minimum size
- [ ] 18. Viewport meta tag configured (width=device-width)
- [ ] 19. Hebrew RTL layout works on iOS Safari and Android Chrome
- [ ] 20. No accidental zoom on input focus (16px font size)

### Security
- [ ] 21. Iframe sandbox prevents cookie/localStorage access from embedded HTML
- [ ] 22. CSP headers remove `unsafe-eval` while preserving Plotly functionality
- [ ] 23. External resource validation blocks (not just warns) non-self-contained HTML
- [ ] 24. Session validation prevents unauthorized file access

### Performance
- [ ] 25. HTML files <5MB load in <10 seconds on 3G
- [ ] 26. File size warnings shown during upload for HTML >5MB
- [ ] 27. Student bundle size <200KB (code splitting from admin panel)

### Deployment
- [ ] 28. Build completes with zero TypeScript errors
- [ ] 29. Deployment documentation created (environment variables, Vercel setup)
- [ ] 30. Platform deployed to production URL
- [ ] 31. Manual mobile testing completed on real devices (iOS + Android)

## Out of Scope (Post-MVP)

**Not included in Iteration 3:**
- Dynamic iframe height adjustment via postMessage (use fixed height)
- Progressive Web App (PWA) offline support
- File compression optimization beyond Next.js defaults
- Multi-admin support
- Session cleanup cron job (manual cleanup acceptable for MVP)
- Automated E2E tests (manual testing sufficient)
- Advanced analytics dashboard
- Email notifications for project creation
- Password reset functionality (admin must create new project)

**Rationale**: Focus on core student access flow. These features add complexity without being essential for MVP launch. Can be prioritized based on user feedback.

## Timeline Estimate

Based on explorer analysis and builder task breakdown:

### Planning Phase
- **Duration**: Complete (this document)
- **Deliverables**: 4 planning documents

### Building Phase (3 Builders in Parallel)
- **Builder-1**: Password Protection & Session UI (6-8 hours)
- **Builder-2**: Project Viewer & HTML Iframe (7-9 hours)
- **Builder-3**: DOCX Download & Mobile Polish (7-9 hours)
- **Total**: 20-26 hours (parallel execution)

### Integration Phase
- **Duration**: 2-3 hours
- **Conflicts**: Minimal (clear builder boundaries)
- **Testing**: Component integration verification

### Validation Phase
- **Duration**: 4-5 hours
- **Activities**:
  - Manual mobile testing (iPhone + Android)
  - 3G network throttling tests
  - Plotly interaction verification
  - Security audit (iframe sandbox, CSP)
  - Deployment verification

### Deployment Phase
- **Duration**: 2-3 hours
- **Activities**:
  - Vercel deployment configuration
  - Supabase Cloud setup
  - Environment variables migration
  - SSL verification
  - Production smoke tests

**Total Estimated Time**: 28-37 hours (slightly over 25-30 hour target due to comprehensive mobile testing and deployment)

## Risk Assessment

### High Risks

**Risk 1: Large HTML Files on Mobile Networks**
- **Impact**: 10MB HTML on 3G = 107 seconds (vision target: <10s)
- **Mitigation**:
  - File size validation (warn >5MB, block >10MB)
  - Loading progress indicators
  - Admin guidance documentation for R export optimization
  - Recommend Ahiya keep reports under 5MB

**Risk 2: HTML with External Dependencies**
- **Impact**: Broken Plotly charts if HTML not self-contained
- **Mitigation**:
  - Strengthen validation to ERROR (not warn) on external resources
  - Admin UI blocking error with clear R guidance
  - Iframe error fallback with "open in new tab" option
  - Documentation: `selfcontained=TRUE` requirement

**Risk 3: Plotly Touch Compatibility**
- **Impact**: Interactive charts may not respond to touch on old mobile browsers
- **Mitigation**:
  - Browser requirements documentation (iOS 12+, Chrome 90+)
  - Manual testing on real devices (iPhone + Android)
  - Plotly config optimization for mobile
  - DOCX download as fallback

### Medium Risks

**Risk 4: Cross-Browser Iframe Issues**
- **Impact**: Safari ITP may block cookies in iframes
- **Mitigation**:
  - Consider SameSite=None for iframe cookies (requires HTTPS)
  - Comprehensive browser testing (Chrome, Safari, Firefox, Edge)
  - Fallback UI for iframe failures
  - 10-second timeout detection

**Risk 5: Mobile RTL Edge Cases**
- **Impact**: Fixed-position buttons may appear on wrong side
- **Mitigation**:
  - Reuse iteration 2 RTL patterns (proven)
  - CSS logical properties (`inset-inline-end`)
  - Visual QA on Hebrew locale browsers
  - Test on iOS + Android devices

### Low Risks

**Risk 6: Rate Limiting Reset on Deploy**
- **Impact**: In-memory rate limiter resets, allowing new attack window
- **Mitigation**: Note for post-MVP Redis migration (not blocking)

## Integration Strategy

**How builder outputs merge:**

### File Organization
```
app/
├── (student)/                    # Builder-1 creates
│   └── preview/
│       └── [projectId]/
│           └── page.tsx          # Password prompt + viewer container
├── api/                          # EXISTS (iteration 1, no changes)
│   └── preview/[id]/*
└── layout.tsx                    # Builder-3 adds viewport meta tag

components/
├── ui/                           # EXISTS (iteration 2, reuse)
└── student/                      # New folder
    ├── PasswordPromptForm.tsx    # Builder-1
    ├── ProjectViewer.tsx         # Builder-2
    ├── ProjectMetadata.tsx       # Builder-2
    ├── HtmlIframe.tsx            # Builder-2
    └── DownloadButton.tsx        # Builder-3

lib/
├── auth/                         # EXISTS (iteration 1, no changes)
├── hooks/
│   ├── useProjectAuth.ts         # Builder-1
│   └── useProject.ts             # Builder-2
└── upload/
    └── validator.ts              # Builder-3 enhances (file size warnings)

middleware.ts                     # Builder-3 enhances (CSP headers)

docs/
├── DEPLOYMENT.md                 # Builder-3 creates
└── MOBILE_TESTING.md             # Builder-3 creates
```

### Shared Interfaces
```typescript
// lib/types/student.ts (Builder-1 creates, others use)
export interface ProjectSession {
  projectId: string;
  authenticated: boolean;
}

export interface ProjectData {
  id: string;
  name: string;
  student: { name: string; email: string };
  researchTopic: string;
  createdAt: string;
}
```

### Integration Points
1. **Builder-1 → Builder-2**: `useProjectAuth()` hook provides session state to viewer
2. **Builder-2 → Builder-3**: `ProjectViewer` component includes placeholder for download button
3. **Builder-3**: Wraps all components with mobile-optimized layout and viewport config

### Conflict Prevention
- **No overlapping files**: Each builder owns distinct components
- **Clear interfaces**: TypeScript types define component contracts
- **Placeholder comments**: Mark where other builders integrate
- **API routes**: All builders use existing iteration 1 routes (no backend changes)

## Deployment Plan

### Environment Variables (Production)
```bash
# Database
DATABASE_URL="postgresql://user:pass@host:5432/db"  # Supabase Cloud

# Authentication
JWT_SECRET="[32+ character random string]"          # Generate new for prod
ADMIN_PASSWORD_HASH="[base64 encoded bcrypt hash]"  # Same as dev or new

# Storage (iteration 3 uses local, S3 ready)
STORAGE_TYPE="local"
UPLOAD_DIR="/uploads"                               # Vercel persistent storage

# Optional
NODE_ENV="production"
```

### Deployment Steps
1. **Vercel Project Setup**
   - Connect GitHub repository
   - Configure environment variables
   - Set framework preset: Next.js
   - Root directory: `/` (or wherever package.json is)

2. **Supabase Cloud Setup**
   - Create new project
   - Copy DATABASE_URL from connection string
   - Run migrations: `npx prisma migrate deploy`
   - Verify tables created

3. **Build Verification**
   - Run `npm run build` locally
   - Verify 0 TypeScript errors
   - Check bundle sizes (<200KB student)

4. **Deploy to Vercel**
   - Push to main branch (auto-deploy) OR
   - Trigger manual deployment via Vercel dashboard

5. **Post-Deployment Tests**
   - Verify admin login works
   - Create test project
   - Access student viewer with password
   - Download DOCX file
   - Test on mobile device (real iPhone/Android)

### Rollback Plan
- Vercel automatic rollback to previous deployment
- Database migrations are forward-only (no schema changes in iteration 3)
- Keep previous deployment URL active during testing

## Questions Answered

### 1. Should we refactor auth to middleware?
**Decision**: NO for iteration 3 (keep inline auth checks)
**Rationale**:
- Auth middleware exists (`requireProjectAuth()`) but is unused
- Refactoring adds integration risk with no user-facing benefit
- Current pattern is consistent across all routes
- Defer to post-MVP cleanup iteration

### 2. How to handle large HTML files on 3G?
**Decision**: File size warnings + admin guidance
**Implementation**:
- Warn if HTML >5MB during upload
- Block if HTML >10MB
- Show loading progress indicator
- Document R optimization best practices for Ahiya

### 3. What CSP configuration exactly?
**Decision**: Remove `unsafe-eval`, keep `unsafe-inline`
```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline' data:;
  img-src 'self' data: blob:;
  connect-src 'self';
  frame-ancestors 'none';
```
**Rationale**: Plotly requires `unsafe-inline` for embedded scripts. `unsafe-eval` is unnecessary and removed for security.

### 4. Mobile testing approach?
**Decision**: Real device testing + Chrome DevTools emulation
**Devices**:
- iPhone SE (320px - minimum target)
- iPhone 12/13 (375px - primary target)
- Android phone (360px - common size)
- iPad (768px - tablet verification)

**Method**:
- Fast iteration: Chrome DevTools responsive mode
- Final validation: Real iOS + Android devices via USB debugging
- Optional: BrowserStack for broader device coverage (deferred to post-MVP)

### 5. Deployment checklist completeness?
**Decision**: Production environment variables documented in `DEPLOYMENT.md`
**Required Variables**:
- `DATABASE_URL` (Supabase Cloud)
- `JWT_SECRET` (32+ chars, regenerate for prod)
- `ADMIN_PASSWORD_HASH` (base64 encoded bcrypt)
- `STORAGE_TYPE` ("local" for iteration 3)
- `UPLOAD_DIR` ("/uploads")

### 6. Iframe sandbox attributes?
**Decision**: `sandbox="allow-scripts allow-same-origin"`
**Rationale**:
- `allow-scripts`: Required for Plotly interactivity
- `allow-same-origin`: Required for Plotly DOM/canvas access
- Risk mitigated by: HTML is admin-uploaded, validation blocks external resources, CSP headers, session validation

### 7. Download button placement?
**Decision**: Fixed bottom bar on mobile, relative top-right on desktop
**Implementation**:
```typescript
<Button className="
  fixed bottom-4 left-4 right-4 z-50 shadow-lg
  lg:relative lg:bottom-0 lg:left-0 lg:right-0 lg:w-auto
">
```

### 8. Loading state for HTML iframe?
**Decision**: YES, skeleton loading state until iframe `onLoad` event
**Implementation**: Show animated skeleton while HTML loads (can take 5-10s on 3G)

### 9. Session expiration handling?
**Decision**: Redirect to password prompt with Hebrew error toast
**Implementation**: No modal (simpler UX). Student re-enters password for new 24-hour session.

### 10. View count increment timing?
**Decision**: Keep current behavior (increment on password verification)
**Rationale**: Simpler than tracking iframe load. Avoids double-counting on page refresh.

---

**Plan Status**: COMPLETE
**Ready for**: Builder execution
**Expected Outcome**: Shippable MVP with student access, mobile optimization, and production deployment

**Next Steps**:
1. Builders read this overview + `tech-stack.md`, `patterns.md`, `builder-tasks.md`
2. Execute tasks in parallel
3. Integrator merges outputs
4. Validator performs manual mobile testing
5. Deploy to production
