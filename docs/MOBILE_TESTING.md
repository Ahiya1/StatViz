# Mobile Testing Checklist - StatViz

Comprehensive manual testing guide for validating StatViz on mobile devices.

## Testing Strategy

**Approach:** Real device testing + Chrome DevTools emulation

**Priority Devices:**
1. iPhone SE (320px) - Minimum viable width
2. iPhone 12/13/14 (375px) - Most common iOS device
3. Android phone (360px) - Most common Android width
4. iPad (768px) - Tablet verification

**Browsers:**
- iOS Safari (primary)
- Android Chrome (primary)
- Firefox Mobile (optional)

---

## Test Devices Reference

| Device | Screen Width | Browser | Priority |
|--------|-------------|---------|----------|
| iPhone SE (2020) | 320px | Safari 14+ | HIGH |
| iPhone 12/13/14 | 375px | Safari 14+ | HIGH |
| Samsung Galaxy S21 | 360px | Chrome 90+ | HIGH |
| iPad (9th gen) | 768px | Safari 14+ | MEDIUM |
| Google Pixel 6 | 393px | Chrome 90+ | LOW |

---

## Pre-Testing Setup

### 1. Chrome DevTools Responsive Mode

**Quick Access:**
```
1. Open Chrome DevTools (F12)
2. Click device icon (Ctrl+Shift+M)
3. Select "Responsive"
4. Enter custom dimensions
```

**Recommended Presets:**
- 320 x 568 (iPhone SE)
- 375 x 812 (iPhone 12)
- 360 x 800 (Android)
- 768 x 1024 (iPad)

### 2. Network Throttling

**Simulate 3G:**
```
1. Chrome DevTools → Network tab
2. Select "Slow 3G" from throttling dropdown
3. Refresh page
```

**Expected Performance:**
- First Contentful Paint: <2 seconds
- HTML iframe load: <10 seconds (for 5MB files)

### 3. Test Data

**Project IDs:**
- Test Project 1: `TOyGstYr4MOy` (password: `test1234`)
- Test Project 2: `LwX2xC2ACoVI` (password: `test5678`)

**Test URLs:**
- Local: `http://localhost:3001/preview/TOyGstYr4MOy`
- Production: `https://your-domain.vercel.app/preview/TOyGstYr4MOy`

---

## Section 1: Password Prompt Page

### 1.1 Layout & Typography

- [ ] Page renders without horizontal scroll (320px+)
- [ ] Password form card is centered vertically and horizontally
- [ ] Card max-width: 400px (doesn't span full width on tablets)
- [ ] Title "גישה לפרויקט" is clearly visible
- [ ] Hebrew text is right-aligned
- [ ] Padding adequate on all sides (16px minimum)

### 1.2 Password Input Field

- [ ] Input field doesn't trigger zoom on focus (font-size: 16px)
- [ ] Input is large enough for touch (min-height: 44px)
- [ ] Placeholder text visible in Hebrew
- [ ] Password toggle icon (eye) visible and clickable
- [ ] Password toggle works (text ↔ dots)
- [ ] Autofill works correctly (if browser supports)

### 1.3 Submit Button

- [ ] Button spans full width of card
- [ ] Button height ≥44px (touch target compliance)
- [ ] Button text "כניסה" clearly visible
- [ ] Loading state shows "מאמת..." with spinner
- [ ] Disabled state is visually distinct
- [ ] Button has adequate spacing from input (8px+)

### 1.4 Error Handling

**Test: Wrong password**
- [ ] Enter incorrect password → Submit
- [ ] Toast error appears (top-left in RTL)
- [ ] Error message in Hebrew: "סיסמה שגויה"
- [ ] Toast auto-dismisses after 4 seconds
- [ ] Password field is cleared (security)

**Test: Rate limiting**
- [ ] Enter wrong password 10 times
- [ ] 11th attempt shows rate limit error
- [ ] Error message: "יותר מדי ניסיונות. נסה שוב בעוד שעה."

**Test: Network error**
- [ ] Disable network (airplane mode)
- [ ] Submit form
- [ ] Error message: "שגיאת רשת. אנא בדוק את החיבור לאינטרנט."

### 1.5 RTL Layout

- [ ] All Hebrew text flows right-to-left
- [ ] Password toggle icon on correct side (left in RTL context)
- [ ] Button text alignment correct
- [ ] Form elements don't overlap or misalign

---

## Section 2: Project Viewer Page

### 2.1 Header (ProjectMetadata)

**Mobile (320px-767px):**
- [ ] Header compact with padding: 16px
- [ ] Project name font-size: ~20px (text-xl)
- [ ] Student name visible and right-aligned
- [ ] Email visible and LEFT-aligned (dir="ltr")
- [ ] Research topic truncates at 2 lines (line-clamp-2)
- [ ] "..." ellipsis appears if topic is long

**Desktop (768px+):**
- [ ] Header spacious with padding: 24px (lg:p-6)
- [ ] Project name font-size: ~30px (lg:text-3xl)
- [ ] Student name and email in horizontal row
- [ ] Research topic shows full text (no truncation)
- [ ] Max-width: 1152px (max-w-6xl), centered

### 2.2 HTML Iframe

**Layout:**
- [ ] Iframe takes full viewport width (w-full)
- [ ] Iframe height fills remaining space (flex-1)
- [ ] No border or radius on mobile (edge-to-edge)
- [ ] Border and rounded corners on desktop (lg:rounded-lg lg:border)
- [ ] No horizontal scroll inside iframe
- [ ] No double scrollbars (iframe + page)

**Loading State:**
- [ ] Skeleton placeholder shows while HTML loads
- [ ] Loading message "טוען דוח..." visible
- [ ] Skeleton has subtle pulse animation
- [ ] Skeleton disappears after iframe loads

**Error State:**
- [ ] If HTML fails to load (15 sec timeout), error fallback shows
- [ ] Error message in Hebrew
- [ ] "פתח בחלון חדש" button visible and functional
- [ ] Button opens HTML in new tab

### 2.3 Plotly Charts (If HTML Contains Plotly)

**Rendering:**
- [ ] All charts render correctly (no blank spaces)
- [ ] Chart legends visible and readable
- [ ] Axis labels visible (not cut off)
- [ ] Colors and styling correct

**Desktop Interactions:**
- [ ] Hover over data point → Tooltip appears
- [ ] Click and drag → Pan chart
- [ ] Scroll wheel → Zoom in/out
- [ ] Double-click → Reset zoom

**Mobile Touch Interactions:**
- [ ] Tap data point → Tooltip appears
- [ ] Single finger drag → Pan chart
- [ ] Pinch gesture → Zoom in/out
- [ ] Double-tap → Reset zoom
- [ ] Charts responsive to orientation change (portrait ↔ landscape)

### 2.4 Download Button

**Mobile (320px-767px):**
- [ ] Button fixed at bottom of screen
- [ ] Button spans full width with 24px margins (left + right)
- [ ] Button stays in place during scroll (z-index: 50)
- [ ] Button height ≥44px (touch target)
- [ ] Button doesn't obscure critical content
- [ ] Shadow visible for elevation (shadow-lg)

**Desktop (768px+):**
- [ ] Button positioned absolute top-right
- [ ] Button auto-width (not full width)
- [ ] Button doesn't overlap header content
- [ ] Button visible without scrolling

**Button Behavior:**
- [ ] Icon: Download (arrow down to tray)
- [ ] Text: "הורד מסמך מלא"
- [ ] Icon positioned to right of text (ml-2 in RTL)
- [ ] Loading state: Spinner + "מוריד..."
- [ ] Disabled during download (no double-click)

**Download Functionality:**
- [ ] Click button → Download initiates
- [ ] Toast: "ההורדה מתחילה..." (brief)
- [ ] DOCX file downloads
- [ ] Filename contains project name (Hebrew characters preserved)
- [ ] Filename sanitized (no special characters)
- [ ] File opens correctly in Microsoft Word

---

## Section 3: Performance Testing

### 3.1 Page Load Performance

**Test on Slow 3G:**
- [ ] Password prompt loads in <2 seconds
- [ ] Project metadata loads in <2 seconds
- [ ] HTML iframe shows loading skeleton immediately
- [ ] HTML content loads in <10 seconds (5MB file)

**Test on 4G:**
- [ ] All pages load in <1 second
- [ ] Iframe content appears quickly

### 3.2 Lighthouse Audit (Mobile)

**Run Lighthouse:**
```
1. Chrome DevTools → Lighthouse tab
2. Select "Mobile" device
3. Categories: Performance, Accessibility, Best Practices
4. Click "Analyze page load"
```

**Target Scores:**
- Performance: >90
- Accessibility: >95
- Best Practices: >90

**Common Issues to Check:**
- [ ] Images optimized (if any)
- [ ] Font loading optimized
- [ ] JavaScript bundle size acceptable (<200KB)
- [ ] First Contentful Paint <2s
- [ ] Largest Contentful Paint <2.5s

### 3.3 Network Performance

**Monitor network requests:**
- [ ] No redundant API calls (verify in Network tab)
- [ ] HTML file cached after first load
- [ ] Project metadata cached (1 hour stale time)
- [ ] Download request only fires on button click

**File Sizes:**
- [ ] HTML <5MB: Optimal
- [ ] HTML 5-10MB: Warning shown during upload
- [ ] HTML >10MB: Blocked during upload

---

## Section 4: RTL & Hebrew Typography

### 4.1 Text Direction

- [ ] All Hebrew text flows right-to-left
- [ ] Punctuation appears on correct side (right side in RTL)
- [ ] Numbers don't reverse (123 stays 123, not 321)
- [ ] Mixed Hebrew/English text renders correctly

### 4.2 Email Display (LTR within RTL)

- [ ] Email address displays left-to-right
- [ ] Email aligns to left side of container
- [ ] `dir="ltr"` attribute present in DevTools
- [ ] No text overlap or misalignment

### 4.3 Icons & Spacing

- [ ] Download icon to right of text (RTL)
- [ ] Spinner to right of "מוריד..." text
- [ ] Eye icon on left side of password input (end position in RTL)
- [ ] Toast notification in top-left corner

---

## Section 5: Touch Target Compliance

**Minimum size:** 44x44px (Apple HIG & Android Material Design)

### 5.1 Password Prompt
- [ ] Password input height: ≥44px
- [ ] Submit button height: ≥44px
- [ ] Password toggle icon: ≥44px tap area

### 5.2 Project Viewer
- [ ] Download button height: ≥44px
- [ ] "Open in new tab" button (error fallback): ≥44px
- [ ] "Retry" button (error state): ≥44px

### 5.3 Spacing
- [ ] Buttons have ≥8px spacing from edges
- [ ] Multiple buttons (if any) have ≥12px gap between them
- [ ] No accidental taps on adjacent elements

---

## Section 6: Edge Cases & Error Scenarios

### 6.1 Session Expiration

**Test:**
1. Authenticate successfully
2. View project
3. Delete `project_token` cookie (DevTools → Application → Cookies)
4. Refresh page or click download

**Expected:**
- [ ] Error message: "הפגישה פגה תוקף"
- [ ] User redirected to password prompt (or shown error)

### 6.2 Very Long Content

**Test with long project name:**
- [ ] Name doesn't overflow container
- [ ] Name wraps to multiple lines
- [ ] Header remains readable

**Test with long research topic:**
- [ ] Mobile: Truncates to 2 lines with ellipsis
- [ ] Desktop: Shows full text (or wraps)

### 6.3 Network Interruption

**Test:**
1. Start loading HTML iframe
2. Disable network mid-load
3. Wait for timeout (15 seconds)

**Expected:**
- [ ] Error fallback displays
- [ ] User can retry or open in new tab

### 6.4 Orientation Change

**Test (on real device):**
1. View project in portrait mode
2. Rotate to landscape
3. Rotate back to portrait

**Expected:**
- [ ] Layout adjusts correctly
- [ ] No content clipping
- [ ] Plotly charts redraw (if present)
- [ ] Download button repositions correctly

---

## Section 7: Browser Compatibility

### 7.1 iOS Safari

**Test on iPhone:**
- [ ] Password input doesn't zoom (font-size: 16px)
- [ ] Fixed positioning works (download button)
- [ ] Touch events work (Plotly, buttons)
- [ ] DOCX download works (not blocked)
- [ ] Session cookies persist across tabs

### 7.2 Android Chrome

**Test on Android:**
- [ ] All features work as on iOS
- [ ] Download goes to Downloads folder
- [ ] No unexpected zoom behavior
- [ ] Back button works correctly

### 7.3 Desktop Chrome

**Test on laptop/desktop:**
- [ ] Responsive breakpoints work (resize window)
- [ ] Desktop layout engages at 1024px+ (lg:)
- [ ] Download button in top-right
- [ ] Hover states work (if any)

---

## Section 8: Accessibility

### 8.1 Zoom & Scaling

- [ ] Pinch-to-zoom works (max-scale: 5.0)
- [ ] Content remains readable at 200% zoom
- [ ] Layout doesn't break at high zoom levels
- [ ] Text reflows correctly

### 8.2 Color Contrast

- [ ] Primary text has sufficient contrast (4.5:1 minimum)
- [ ] Button text readable on background
- [ ] Placeholder text visible but distinct
- [ ] Error messages clearly visible (red text)

### 8.3 Keyboard Navigation (Desktop)

- [ ] Tab through all interactive elements
- [ ] Focus indicators visible
- [ ] Enter submits password form
- [ ] Space activates buttons

---

## Section 9: Security Validation

### 9.1 CSP Headers

**Check in DevTools:**
```
1. Open Network tab
2. Click any request
3. Headers → Response Headers
4. Find "Content-Security-Policy"
```

**Verify CSP for /api/preview/* routes:**
- [ ] `default-src 'self'`
- [ ] `script-src 'self' 'unsafe-inline'` (NO unsafe-eval)
- [ ] `style-src 'self' 'unsafe-inline' data:`
- [ ] `img-src 'self' data: blob:`
- [ ] `frame-ancestors 'none'`

**Check Console:**
- [ ] No CSP violation errors
- [ ] Plotly charts still render (unsafe-inline allows them)

### 9.2 Iframe Sandbox

**Check in DevTools:**
```
1. Inspect iframe element
2. View attributes
```

**Verify:**
- [ ] `sandbox="allow-scripts allow-same-origin"`
- [ ] NO `allow-forms`
- [ ] NO `allow-popups`
- [ ] NO `allow-top-navigation`

### 9.3 Cookies

**Check in DevTools:**
```
1. Application → Cookies
2. Find project_token
```

**Verify cookie attributes:**
- [ ] `HttpOnly` (JavaScript cannot access)
- [ ] `Secure` (HTTPS only, in production)
- [ ] `SameSite=Strict` (CSRF protection)
- [ ] Expiry: 24 hours from creation

---

## Test Results Template

### Test Session Details

**Date:** _________
**Tester:** _________
**Environment:** Local / Staging / Production
**Build Version:** _________

### Device 1: iPhone SE (320px)

| Category | Status | Notes |
|----------|--------|-------|
| Password Prompt | ✅ ⚠️ ❌ | |
| Project Viewer | ✅ ⚠️ ❌ | |
| Download Button | ✅ ⚠️ ❌ | |
| Plotly Charts | ✅ ⚠️ ❌ N/A | |
| Performance | ✅ ⚠️ ❌ | FCP: __s, LCP: __s |
| RTL Layout | ✅ ⚠️ ❌ | |

### Device 2: iPhone 12 (375px)

[Same table]

### Device 3: Android (360px)

[Same table]

### Issues Found

1. **Issue:** [Description]
   - **Severity:** Critical / High / Medium / Low
   - **Steps to reproduce:** [Steps]
   - **Expected:** [What should happen]
   - **Actual:** [What happens]

2. [...]

### Screenshots

Attach screenshots of:
- Password prompt (mobile)
- Project viewer (mobile)
- Download button (fixed position)
- Plotly charts (if applicable)
- Any bugs/issues found

---

## Quick Test (10 minutes)

For rapid iteration testing:

1. **Password Prompt (2 min)**
   - [ ] Load page on 320px viewport
   - [ ] Enter password → Submit
   - [ ] Verify no horizontal scroll

2. **Project Viewer (3 min)**
   - [ ] Check header displays correctly
   - [ ] Verify iframe loads HTML
   - [ ] Check download button position

3. **Download (2 min)**
   - [ ] Click download button
   - [ ] Verify DOCX downloads
   - [ ] Check filename is correct

4. **Plotly (3 min, if applicable)**
   - [ ] Check charts render
   - [ ] Test pinch-to-zoom on mobile
   - [ ] Verify tooltips work

**Pass criteria:** All 4 sections ✅

---

## Full Test (1-2 hours)

Complete all sections 1-9 on at least 3 devices (iPhone, Android, Desktop).

**Sign-off criteria:**
- All HIGH priority items: ✅
- Critical issues: 0
- High severity issues: ≤1
- Medium/Low issues: Documented for post-MVP

---

**Document Version:** 1.0
**Last Updated:** November 26, 2025
**Author:** Builder-3 (AI)
