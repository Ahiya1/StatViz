# Validation Checklist for iValidator

**Integration:** Round 1 - COMPLETE
**Next Phase:** iValidator cohesion check + Manual validation
**Status:** Ready for validation

---

## Quick Start

1. Run cohesion check: `ivalidator` (expect 95%+ score)
2. If cohesion ≥90%: Proceed to manual testing
3. If cohesion <90%: Spawn healer for issues
4. Manual testing: Follow this checklist + MOBILE_TESTING.md

---

## Cohesion Check (iValidator)

**Expected score:** 95%+

**Why high score expected:**
- Zero file conflicts
- All patterns followed
- Shared types used consistently
- TypeScript 0 errors
- Production build succeeds

**If score <90%:**
Check for:
- Unused imports
- Duplicate code
- Pattern violations
- Type inconsistencies

---

## Manual Testing Checklist

### Environment Setup

- [ ] Dev server running: `npm run dev`
- [ ] Test project seeded:
  - ID: `TOyGstYr4MOy`
  - Password: `test1234`
- [ ] Browser DevTools open (Network + Console tabs)

---

### Test 1: Password Prompt (Builder-1)

**URL:** `http://localhost:3001/preview/TOyGstYr4MOy`

- [ ] Page loads without errors
- [ ] Password prompt displays
- [ ] Hebrew text: "גישה לפרויקט"
- [ ] Password input visible
- [ ] "כניסה" button visible
- [ ] Button height ≥44px (DevTools measure)
- [ ] No console errors

**Expected behavior:**
- Centered card layout
- Mobile-responsive (test 320px, 375px, 768px)
- Hebrew RTL alignment

---

### Test 2: Wrong Password (Builder-1)

- [ ] Enter password: `wrong_password`
- [ ] Click: כניסה button
- [ ] Toast error appears: "סיסמה שגויה. אנא נסה שוב."
- [ ] Password field cleared
- [ ] Button re-enabled after toast
- [ ] No console errors

---

### Test 3: Correct Password (Builder-1 + Builder-2)

- [ ] Enter password: `test1234`
- [ ] Click: כניסה button
- [ ] Toast success (brief): "אימות הצליח!"
- [ ] Page transitions to ProjectViewer
- [ ] Project metadata displays:
  - [ ] Project name (Hebrew)
  - [ ] Student name
  - [ ] Student email (LTR direction)
  - [ ] Research topic
- [ ] HTML iframe loads
- [ ] No console errors

---

### Test 4: Download Button (Builder-3)

**Mobile view (320px):**
- [ ] Button visible at bottom
- [ ] Button position: Fixed, z-index high
- [ ] Button full-width with margins
- [ ] Button height ≥44px
- [ ] Hebrew text: "הורד מסמך מלא"
- [ ] Download icon visible

**Desktop view (1024px+):**
- [ ] Button position: Absolute top-right
- [ ] Button auto-width (fits content)
- [ ] Button not overlapping iframe

**Click download:**
- [ ] Click button
- [ ] Loading state: "מוריד..." with spinner
- [ ] File downloads (check browser downloads)
- [ ] Filename contains Hebrew project name
- [ ] File extension: `.docx`
- [ ] Success toast: "הקובץ הורד בהצלחה"
- [ ] No console errors

---

### Test 5: Session Persistence (Builder-1)

- [ ] Refresh page: F5
- [ ] Page still shows ProjectViewer (no password prompt)
- [ ] Project data still displayed
- [ ] Download button still works
- [ ] No console errors

**Session cookie check (DevTools > Application > Cookies):**
- [ ] Cookie `project_token` exists
- [ ] Cookie HttpOnly: true
- [ ] Cookie Secure: true (if HTTPS)
- [ ] Cookie Expiry: ~24 hours from login

---

### Test 6: Mobile Responsiveness (All Builders)

**iPhone SE (320px):**
- [ ] No horizontal scroll
- [ ] Password form readable
- [ ] ProjectViewer header compact
- [ ] Download button full-width bottom
- [ ] Iframe loads without overflow
- [ ] All text readable (16px minimum)

**iPhone 12 (375px):**
- [ ] Optimal layout
- [ ] All elements spaced correctly
- [ ] Download button positioned correctly

**iPad (768px):**
- [ ] Desktop layout engaged
- [ ] Header spacious (lg: breakpoints)
- [ ] Metadata in horizontal row
- [ ] Iframe has border and rounded corners
- [ ] Download button absolute top-right

**Desktop (1024px+):**
- [ ] Max-width constraint on content
- [ ] Centered layout
- [ ] All desktop styles applied

---

### Test 7: Hebrew RTL Layout (Builder-1 + Builder-2)

- [ ] Page direction: RTL
- [ ] Text alignment: Right
- [ ] Button icons: Left of text (ml-2 in RTL)
- [ ] Padding/margins: Correct in RTL
- [ ] Email displays LTR (dir="ltr" attribute)
- [ ] No text overflow or wrapping issues

---

### Test 8: Error Handling (All Builders)

**Network error (disconnect internet):**
- [ ] Refresh page
- [ ] Error message: "שגיאת רשת. אנא בדוק את החיבור לאינטרנט."
- [ ] "נסה שוב" button works when reconnected

**Invalid project ID:**
- [ ] Visit: `/preview/invalid-id`
- [ ] Error displayed (404 or appropriate message)
- [ ] No blank screen
- [ ] No console errors (expected API 404)

---

### Test 9: Build Verification

**Already passed in integration:**
- [x] TypeScript: 0 errors
- [x] ESLint: 0 errors
- [x] Production build: SUCCESS
- [x] Bundle sizes: Optimal

**No re-test needed** (unless code changes)

---

### Test 10: Admin Panel Regression

**Quick smoke test:**
- [ ] Visit: `/admin`
- [ ] Login: username `ahiya`, password `admin123`
- [ ] Dashboard loads
- [ ] 2 projects visible
- [ ] Can view project details
- [ ] No console errors

**Why quick test:**
- No admin code changed in Iteration 3
- Full admin testing done in Iteration 1-2
- Just verify nothing broke

---

## Security Verification

### CSP Headers (Builder-3)

**In production only** (after deployment):

- [ ] Deploy to Vercel/staging
- [ ] Visit student page: `/preview/TOyGstYr4MOy`
- [ ] DevTools > Network > Select HTML response
- [ ] Headers tab
- [ ] Check `Content-Security-Policy` header:
  - [ ] `script-src 'self' 'unsafe-inline'` (NO unsafe-eval)
  - [ ] `style-src 'self' 'unsafe-inline' data:`
  - [ ] `img-src 'self' data: blob:`
  - [ ] `frame-ancestors 'none'`
- [ ] Console: No CSP violations
- [ ] Plotly charts still interactive

### Iframe Sandbox (Builder-2)

**DevTools > Elements:**
- [ ] Find iframe element
- [ ] Check sandbox attribute: `allow-scripts allow-same-origin`
- [ ] NO `allow-forms`, `allow-popups`, `allow-top-navigation`

---

## Performance Testing

### Page Load (Chrome DevTools > Performance)

**3G Throttling:**
- [ ] DevTools > Network > Throttling > Slow 3G
- [ ] Refresh page
- [ ] Measure load time:
  - [ ] Password prompt: <3 seconds
  - [ ] ProjectViewer: <5 seconds
  - [ ] HTML iframe: <10 seconds (depends on file size)

**Lighthouse Audit:**
- [ ] DevTools > Lighthouse
- [ ] Device: Mobile
- [ ] Run audit
- [ ] Check scores:
  - [ ] Performance: >90 (target)
  - [ ] Accessibility: >95 (target)
  - [ ] Best Practices: >90 (target)
  - [ ] SEO: >80 (acceptable for private tool)

---

## Real Device Testing (Optional but Recommended)

**iPhone (iOS Safari):**
- [ ] Password prompt renders correctly
- [ ] Touch targets responsive
- [ ] Download button tap works
- [ ] DOCX downloads to Files app
- [ ] Plotly charts interactive (pinch zoom)
- [ ] No viewport zoom-out issues

**Android (Chrome):**
- [ ] Password prompt renders correctly
- [ ] Touch targets responsive
- [ ] Download button tap works
- [ ] DOCX downloads correctly
- [ ] Plotly charts interactive

---

## File Size Validation (Admin Panel)

**Upload large HTML:**
- [ ] Go to admin dashboard
- [ ] Create new project
- [ ] Upload HTML >10MB
- [ ] Expected: Error message (Hebrew)
- [ ] Upload HTML 5-8MB
- [ ] Expected: Warning message (Hebrew) but allowed

**Upload external resources:**
- [ ] Create HTML with `<link href="https://example.com/style.css">`
- [ ] Upload to admin panel
- [ ] Expected: Error message: "הקובץ מכיל CSS חיצוני..."
- [ ] Upload blocked

---

## Pass/Fail Criteria

### PASS if:
- ✅ All critical tests pass (Test 1-5)
- ✅ No console errors (except expected 401/404)
- ✅ Mobile layout works (Test 6)
- ✅ Download functionality works (Test 4)
- ✅ Security checks pass (CSP, sandbox)

### FAIL if:
- ❌ TypeScript errors appear
- ❌ Console errors on normal flow
- ❌ Download doesn't work
- ❌ CSP violations in console
- ❌ Session doesn't persist
- ❌ Mobile layout broken

### NEEDS HEALING if:
- ⚠️ Minor UI glitches (spacing, alignment)
- ⚠️ Performance issues (>10s load time)
- ⚠️ Accessibility issues (contrast, focus)
- ⚠️ Partial functionality (some features work, some don't)

---

## Notes for Validator

### Testing Environment

**Local testing:**
- Use `npm run dev` (port 3001 or 3000)
- Test projects seeded in Iteration 2
- Browser: Chrome (latest)

**Production testing (after deployment):**
- Deploy to Vercel staging
- Use real Supabase Cloud database
- Test on real devices (iPhone + Android)

### Known Issues (Non-Blocking)

1. **Viewport metadata warning:**
   - Next.js 14 deprecation warning
   - Functionality works correctly
   - Can fix in post-MVP cleanup

2. **ESLint warnings (8 unused variables):**
   - Intentional (logging patterns)
   - No impact on functionality
   - Can clean up post-MVP

3. **Redundant `/view` route:**
   - Builder-2's page may be unused
   - No harm (doesn't break anything)
   - Can remove in cleanup if confirmed unused

### Time Estimate

**Manual testing:** 2-3 hours
**Real device testing:** 1 hour
**Performance testing:** 1 hour
**Total:** 4-5 hours

### Success Definition

**Integration is validated when:**
1. All critical tests pass
2. No blocking issues found
3. Code cohesion ≥90%
4. Performance acceptable
5. Security verified

**Ready for deployment when:**
1. Validation complete
2. Real device testing done
3. Lighthouse scores acceptable
4. All docs reviewed (DEPLOYMENT.md ready)

---

**Next Phase:** Deployment (follow DEPLOYMENT.md)

**Estimated Time to Production:** 4-6 hours (validation + deployment)

---

**Created:** November 26, 2025
**Integrator:** Integrator-1
**Status:** Ready for validation
