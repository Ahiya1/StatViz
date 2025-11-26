# Iteration 3 Vision: Student Access & Project Viewer

## Core Goal
Enable password-protected student access to interactive statistical analysis reports with mobile-optimized viewing and DOCX download capabilities.

## What We're Building

### 1. Password Protection System
**Student-facing authentication at `/preview/:project_id`**

- Clean, minimal Hebrew UI for password entry
- Session management with 24-hour JWT tokens
- Rate limiting to prevent brute-force attacks
- Graceful error messages in Hebrew
- Session persistence across page refreshes

### 2. Project Viewer Page
**Interactive report viewing after authentication**

- Display project metadata (name, student name, research topic)
- Embedded HTML report in secure iframe
- Dynamic iframe height adjustment for responsive content
- Interactive Plotly graphs (zoom, pan, hover tooltips)
- View count tracking and last-accessed timestamp

### 3. DOCX Download
**Prominent download functionality**

- Fixed-position download button
- Session-validated file serving
- Proper Content-Disposition headers
- Progress feedback for large files

### 4. Mobile Optimization
**Full responsive design for 320px+ screens**

- Touch-friendly UI (44px+ tap targets)
- Full-width iframe rendering
- Fixed-bottom download button on mobile
- Performance optimization for large HTML files
- Test on actual devices (iPhone, Android)

### 5. Production Deployment
**Live deployment to statviz.xyz**

- Vercel configuration and deployment
- Supabase Cloud database setup
- Environment variables configuration
- SSL/HTTPS enforcement
- Content Security Policy headers

## User Flows

### Flow 1: First-Time Access
1. Ahiya sends student link: `https://statviz.xyz/preview/{project_id}`
2. Student opens link on mobile device
3. Sees password prompt in Hebrew
4. Enters password provided by Ahiya
5. System validates password, creates 24-hour session
6. Redirects to project viewer
7. HTML report loads in iframe with interactive graphs
8. Student can zoom/pan Plotly charts
9. Student downloads DOCX for offline reading

### Flow 2: Return Visit (Within 24 hours)
1. Student returns to same link
2. Session cookie is still valid
3. Automatically shows project viewer (skips password)
4. Can continue exploring report and re-download DOCX

### Flow 3: Session Expired
1. Student returns after 24 hours
2. Session expired
3. Gracefully redirects to password prompt
4. Re-authentication required
5. New 24-hour session created

## Technical Requirements

### Session Management
- JWT tokens with 24-hour expiration
- httpOnly cookies for XSS protection
- Secure and sameSite attributes in production
- Database-backed session storage for revocation
- Automatic cleanup of expired sessions

### HTML Iframe Security
- Iframe sandbox with allow-scripts and allow-same-origin
- Content Security Policy headers
- XSS protection for embedded content
- postMessage for dynamic height adjustment
- Fallback "Open in new tab" if iframe fails

### Mobile Performance
- Lazy loading for HTML content
- Loading skeleton during HTML fetch
- Optimized bundle sizes
- Touch event optimization
- Test with 3G throttling

### Database Extensions
None required - uses existing schema from iteration 1:
- Projects table: viewCount, lastAccessed fields
- ProjectSession table: token, projectId, expiresAt

## Success Criteria

### Functional Requirements ✅
- Student can access project with correct password
- Invalid password shows Hebrew error message
- Session persists for 24 hours
- Session expires correctly after 24 hours
- HTML report renders fully in iframe
- Plotly graphs are interactive (zoom, pan, hover)
- DOCX downloads successfully with correct filename
- View count increments on first access
- Last accessed timestamp updates

### Mobile Requirements ✅
- Full functionality on 320px screens (iPhone SE)
- Touch interactions work smoothly
- Iframe fills screen width appropriately
- Download button accessible and prominent
- Hebrew text displays correctly
- No horizontal scroll

### Performance Requirements ✅
- Password → report access in <5 seconds
- HTML report loads in <10 seconds on mobile (3G simulation)
- No jank or lag during graph interactions
- DOCX download starts immediately (<1 second)

### Security Requirements ✅
- HTTPS enforced in production
- Rate limiting prevents password brute force
- Sessions are httpOnly and secure
- No XSS vulnerabilities in iframe
- CSP headers configured correctly

### Production Requirements ✅
- Platform deployed to production URL
- Database connected and migrations applied
- SSL certificate valid
- No console errors in production
- Error monitoring active (optional for MVP)

## Out of Scope (Post-MVP)

- Password reset functionality
- Multiple concurrent sessions per project
- Email notifications to students
- Analytics dashboard for Ahiya
- Batch project creation
- API for external integrations
- Mobile app (PWA or native)
- Admin mobile optimization

## Dependencies

**From Iteration 1:**
- Database schema (projects, sessions tables)
- File storage utilities
- Password hashing (bcrypt)
- JWT token utilities

**From Iteration 2:**
- Hebrew RTL patterns
- Tailwind configuration
- shadcn/ui components
- Error handling utilities

**New Dependencies:**
None - all functionality uses existing tech stack

## Estimated Complexity

**Risk Level:** MEDIUM

**Critical Risks:**
1. HTML iframe rendering on mobile (highest risk)
2. Plotly touch interactions on mobile devices
3. Session management edge cases
4. Mobile performance with large HTML files (5-10MB)
5. Deployment environment configuration

**Estimated Hours:** 25-30

**Builder Breakdown:**
- Builder 1: Password prompt & session management (8-10 hours)
- Builder 2: Project viewer & HTML iframe (8-10 hours)
- Builder 3: Mobile optimization & polish (6-8 hours)
- Builder 4: Production deployment & testing (3-4 hours)

## Definition of Done

**Iteration 3 is complete when:**
1. ✅ Student can access password-protected reports
2. ✅ HTML reports render with interactive Plotly graphs
3. ✅ DOCX downloads work reliably
4. ✅ Mobile experience is fully functional (320px+)
5. ✅ Sessions persist and expire correctly
6. ✅ Platform is deployed to production with HTTPS
7. ✅ All security headers configured
8. ✅ Manual testing on real mobile devices passes
9. ✅ Hebrew UI displays correctly
10. ✅ Validation confidence ≥ 90%

## Hebrew UI Text

**Password Prompt:**
- Title: "גישה למחקר"
- Input label: "הזן סיסמה"
- Submit button: "כניסה"
- Error: "סיסמה שגויה. אנא נסה שוב"
- Loading: "מאמת..."

**Project Viewer:**
- Page title: "[שם הפרויקט]"
- Student: "סטודנט: [שם]"
- Topic: "נושא: [נושא המחקר]"
- Download button: "הורד את המסמך המלא"
- Loading: "טוען דוח..."
- Session expired: "פג תוקף ההתחברות. אנא הזן סיסמה שוב"

---

**Vision Owner:** Ahiya (Product Owner)
**Target Completion:** Iteration 3 of 3
**Status:** PENDING
