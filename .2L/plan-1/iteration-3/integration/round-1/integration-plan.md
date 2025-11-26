# Integration Plan - Round 1

**Created:** 2025-11-26T10:30:00Z
**Iteration:** plan-1/iteration-3
**Total builders to integrate:** 3

---

## Executive Summary

Iteration 3 integration is **LOW COMPLEXITY** with excellent builder coordination. All three builders completed successfully with clear integration points and minimal file conflicts. The download button placeholder left by Builder-2 was perfectly positioned for Builder-3's implementation. Only one file (ProjectViewer.tsx) requires actual integration work - all other files are additive with no conflicts.

**Key Insights:**
- **Excellent coordination:** Builder-2 left explicit placeholder for Builder-3's download button
- **Clean separation:** Each builder owns distinct files with minimal overlap
- **Shared types:** All builders use common `lib/types/student.ts` (no conflicts)
- **Configuration merges:** Builder-1 and Builder-3 modified different config files (no conflicts)
- **Ready for production:** All builders report TypeScript 0 errors and successful builds

**Integration Complexity:** LOW
**Estimated Integration Time:** 1-2 hours
**Risk Level:** LOW (clear boundaries, working code already demonstrated)

---

## Builders to Integrate

### Primary Builders

- **Builder-1:** Password Protection & Session UI - Status: **COMPLETE**
  - Time: ~2 hours
  - Files: 5 created (4 new + 1 modified)
  - Quality: TypeScript 0 errors, dev server tested

- **Builder-2:** Project Viewer & HTML Iframe - Status: **COMPLETE**
  - Time: ~6.5 hours
  - Files: 5 created
  - Quality: Build successful, manual testing passed

- **Builder-3:** Download & Deployment - Status: **COMPLETE**
  - Time: ~5.5 hours
  - Files: 8 created (1 component + 4 config + 3 docs)
  - Quality: Production-ready, comprehensive documentation

**Total outputs to integrate:** 18 files (3 modified, 15 new)

---

## File Inventory

| File | Builder | Action | Conflicts | Priority |
|------|---------|--------|-----------|----------|
| **Configuration Files** |
| `app/layout.tsx` | Builder-1 | Modified (viewport) | None | P2 |
| `middleware.ts` | Builder-3 | Modified (CSP) | None | P1 |
| `next.config.mjs` | Builder-3 | Modified (prod config) | None | P2 |
| `lib/upload/validator.ts` | Builder-3 | Modified (file size) | None | P2 |
| **Components** |
| `components/student/PasswordPromptForm.tsx` | Builder-1 | Created | None | P3 |
| `components/student/ProjectViewer.tsx` | Builder-2 | Created | **Builder-3 modified** | **P1** |
| `components/student/ProjectMetadata.tsx` | Builder-2 | Created | None | P3 |
| `components/student/HtmlIframe.tsx` | Builder-2 | Created | None | P3 |
| `components/student/DownloadButton.tsx` | Builder-3 | Created | None | P1 |
| **Pages** |
| `app/(student)/preview/[projectId]/page.tsx` | Builder-1 | Created | None | P3 |
| `app/(student)/preview/[projectId]/view/page.tsx` | Builder-2 | Created | None | P3 |
| `app/(student)/layout.tsx` | Builder-1 | Created | None | P3 |
| **Hooks** |
| `lib/hooks/useProjectAuth.ts` | Builder-1 | Created | None | P3 |
| `lib/hooks/useProject.ts` | Builder-2 | Created | None | P3 |
| **Types** |
| `lib/types/student.ts` | Builder-2 | Created | None | P3 |
| **Documentation** |
| `docs/DEPLOYMENT.md` | Builder-3 | Created | None | P3 |
| `docs/MOBILE_TESTING.md` | Builder-3 | Created | None | P3 |
| `docs/STUDENT_GUIDE.md` | Builder-3 | Created | None | P3 |

**Priority Legend:**
- **P1:** Critical integration work required
- **P2:** Verification needed (no merge conflicts)
- **P3:** Direct copy (no integration needed)

---

## Integration Zones

### Zone 1: Download Button Integration (CRITICAL)

**Builders involved:** Builder-2, Builder-3

**Conflict type:** Component integration (placeholder replacement)

**Risk level:** LOW (clear placeholder with explicit TODO comment)

**Description:**
Builder-2 created ProjectViewer.tsx with a placeholder for the download button:
```typescript
{/* Download button placeholder - Builder-3 will implement */}
<div className="lg:absolute lg:top-4 lg:right-4">
  {/* TODO: Builder-3 - Add DownloadButton here */}
</div>
```

Builder-3 created DownloadButton.tsx and documented the integration in their report (line 786-805).

**Files affected:**
- `components/student/ProjectViewer.tsx` - Builder-2 created with placeholder, Builder-3 documented replacement
- `components/student/DownloadButton.tsx` - Builder-3 created standalone component

**Integration strategy:**
1. Open `components/student/ProjectViewer.tsx`
2. Locate placeholder comment (around line 60-65 based on Builder-2's report)
3. Add import: `import { DownloadButton } from '@/components/student/DownloadButton'`
4. Replace placeholder with: `<DownloadButton projectId={projectId} projectName={data.name} />`
5. Verify props match Builder-3's interface:
   - `projectId: string` - Available from component props
   - `projectName: string` - Available from `data.name` (TanStack Query result)
6. Verify positioning CSS remains:
   - Mobile: Fixed bottom with z-index (from DownloadButton.tsx)
   - Desktop: Absolute top-right (from placeholder div)

**Expected outcome:**
Download button appears in ProjectViewer component with proper mobile/desktop positioning. Button triggers DOCX download via `/api/preview/:id/download` endpoint.

**Assigned to:** Integrator-1

**Estimated complexity:** LOW (5-10 minutes)

---

### Zone 2: Configuration Files Merge

**Builders involved:** Builder-1, Builder-3

**Conflict type:** File modifications (different files, no conflicts)

**Risk level:** LOW (different files modified by different builders)

**Description:**
- Builder-1 modified `app/layout.tsx` to add viewport meta tag
- Builder-3 modified `middleware.ts` for CSP headers
- Builder-3 modified `next.config.mjs` for production optimizations
- Builder-3 modified `lib/upload/validator.ts` for file size validation

No actual conflicts - each builder modified different files. Verification needed to ensure all changes are present and correct.

**Files affected:**
- `app/layout.tsx` - Builder-1: Added viewport configuration (line 24-28 per report)
- `middleware.ts` - Builder-3: Enhanced CSP headers (removed unsafe-eval, added data:/blob:)
- `next.config.mjs` - Builder-3: Added production config (reactStrictMode, compress, headers)
- `lib/upload/validator.ts` - Builder-3: Added validateHtmlFileSize(), enhanced external resource detection

**Integration strategy:**
1. Verify `app/layout.tsx` has viewport meta tag:
   ```typescript
   viewport: {
     width: 'device-width',
     initialScale: 1.0,
     maximumScale: 5.0,
   }
   ```
2. Verify `middleware.ts` has updated CSP:
   - `script-src 'self' 'unsafe-inline'` (NO unsafe-eval)
   - `style-src 'self' 'unsafe-inline' data:`
   - `img-src 'self' data: blob:`
   - `frame-ancestors 'none'`
3. Verify `next.config.mjs` has production settings:
   - `reactStrictMode: true`
   - `compress: true`
   - `poweredByHeader: false`
   - Security headers function
4. Verify `lib/upload/validator.ts` has new function:
   - `validateHtmlFileSize()` exists
   - Returns FileSizeValidationResult interface
   - Blocks >10MB, warns >5MB

**Expected outcome:**
All configuration files have correct settings from respective builders. No merge conflicts. TypeScript compiles successfully.

**Assigned to:** Integrator-1

**Estimated complexity:** LOW (15-20 minutes verification)

---

### Zone 3: Shared Types Consistency

**Builders involved:** Builder-1, Builder-2, Builder-3

**Conflict type:** Type imports (no conflicts)

**Risk level:** LOW (TypeScript will catch any issues)

**Description:**
Builder-2 created `lib/types/student.ts` with interfaces:
- `SessionState` - Used by Builder-1's useProjectAuth hook
- `ProjectData` - Used by Builder-2's useProject hook
- `PasswordFormData` - Used by Builder-1's PasswordPromptForm

All builders reference these types via imports. No conflicts expected since Builder-2 defined them first and other builders imported.

**Files affected:**
- `lib/types/student.ts` - Builder-2 created (source of truth)
- `lib/hooks/useProjectAuth.ts` - Builder-1 imports SessionState
- `lib/hooks/useProject.ts` - Builder-2 imports ProjectData
- `components/student/PasswordPromptForm.tsx` - Builder-1 imports PasswordFormData
- `components/student/ProjectViewer.tsx` - Builder-2 imports ProjectData

**Integration strategy:**
1. Verify `lib/types/student.ts` exists and exports all types
2. Run TypeScript compiler: `npm run type-check` or `tsc --noEmit`
3. Check for import resolution errors
4. Verify no circular dependencies

**Expected outcome:**
All type imports resolve correctly. TypeScript compiles with 0 errors. No runtime type issues.

**Assigned to:** Integrator-1

**Estimated complexity:** LOW (5 minutes - automated check)

---

### Zone 4: Routing Verification

**Builders involved:** Builder-1, Builder-2

**Conflict type:** Page routes (no conflicts, complementary)

**Risk level:** LOW (standard Next.js routing, clear separation)

**Description:**
Builder-1 created password prompt page at `/preview/[projectId]`
Builder-2 created viewer page at `/preview/[projectId]/view`

These are complementary routes:
1. User visits `/preview/:id` → Password prompt (Builder-1)
2. User enters password → Session created
3. Page shows ProjectViewer component (Builder-2's component imported by Builder-1)

**Files affected:**
- `app/(student)/preview/[projectId]/page.tsx` - Builder-1: Entry point with auth check
- `app/(student)/preview/[projectId]/view/page.tsx` - Builder-2: Viewer page (likely unused - Builder-1 already shows ProjectViewer)
- `app/(student)/layout.tsx` - Builder-1: Route group wrapper

**Integration strategy:**
1. Verify both routes exist and render correctly
2. Check if `/view` route is redundant (Builder-1's page.tsx already shows ProjectViewer after auth)
3. If redundant, document for cleanup (don't delete - may be intentional)
4. Test routing flow:
   - Navigate to `/preview/:id` → Password prompt
   - Enter password → ProjectViewer appears
   - Refresh → Session persists, ProjectViewer still visible
5. Verify no 404 errors in dev server

**Expected outcome:**
Routing works correctly. Session flow is seamless. No broken links or 404 errors.

**Assigned to:** Integrator-1

**Estimated complexity:** LOW (10 minutes testing)

**Note:** Builder-2's `/view` page may be unused since Builder-1's page dynamically shows ProjectViewer after authentication. This is acceptable - verify both approaches work, document which is canonical.

---

## Independent Features (Direct Merge)

These builder outputs have no conflicts and can be merged directly without integration work:

- **Builder-1:**
  - `lib/hooks/useProjectAuth.ts` - Standalone hook
  - `components/student/PasswordPromptForm.tsx` - Standalone component

- **Builder-2:**
  - `components/student/ProjectMetadata.tsx` - Standalone component
  - `components/student/HtmlIframe.tsx` - Standalone component
  - `lib/hooks/useProject.ts` - Standalone hook

- **Builder-3:**
  - `docs/DEPLOYMENT.md` - Documentation only
  - `docs/MOBILE_TESTING.md` - Documentation only
  - `docs/STUDENT_GUIDE.md` - Documentation only

**Assigned to:** Integrator-1 (quick copy alongside Zone work)

**Estimated time:** 5 minutes (all files are in builder reports, just need to be placed in correct locations)

---

## Parallel Execution Groups

### Group 1 (All Work - Single Integrator)

**Rationale:** Low complexity allows single integrator to handle all zones efficiently. No dependencies between zones that would benefit from parallelization.

- **Integrator-1:**
  - Zone 1 (Download button integration) - 5-10 min
  - Zone 2 (Configuration verification) - 15-20 min
  - Zone 3 (Type consistency check) - 5 min
  - Zone 4 (Routing verification) - 10 min
  - Independent features (direct copy) - 5 min

**Total estimated time:** 40-50 minutes of focused work

**No Group 2 needed** - All work can be completed in parallel (no sequential dependencies)

---

## Integration Order

**Recommended sequence:**

### Step 1: Setup & Verification (10 min)
1. Create integration directory structure: `.2L/plan-1/iteration-3/integration/round-1/`
2. Verify all builder reports are accessible
3. Run initial build to establish baseline: `npm run build`
4. Note current TypeScript errors (if any)

### Step 2: Direct Merge - Independent Features (5 min)
5. Copy all standalone files from builder reports:
   - Hooks: `lib/hooks/useProjectAuth.ts`, `lib/hooks/useProject.ts`
   - Components: `PasswordPromptForm.tsx`, `ProjectMetadata.tsx`, `HtmlIframe.tsx`
   - Types: `lib/types/student.ts`
   - Pages: `app/(student)/preview/[projectId]/page.tsx`, `app/(student)/preview/[projectId]/view/page.tsx`
   - Layouts: `app/(student)/layout.tsx`
   - Documentation: All 3 docs files
6. Copy Builder-3's new component: `DownloadButton.tsx`

### Step 3: Configuration Merges (Zone 2) (15 min)
7. Verify `app/layout.tsx` has viewport meta tag
8. Verify `middleware.ts` has enhanced CSP headers
9. Verify `next.config.mjs` has production config
10. Verify `lib/upload/validator.ts` has file size validation

### Step 4: Download Button Integration (Zone 1) (10 min)
11. Open `components/student/ProjectViewer.tsx`
12. Add DownloadButton import at top
13. Replace placeholder with component
14. Verify props match interface
15. Save file

### Step 5: Type Consistency Check (Zone 3) (5 min)
16. Run TypeScript compiler: `npm run type-check`
17. Verify 0 errors
18. Check imports resolve correctly

### Step 6: Routing Verification (Zone 4) (10 min)
19. Start dev server: `npm run dev`
20. Test route: `/preview/test-project`
21. Verify password prompt appears
22. Test authentication flow
23. Verify ProjectViewer appears after auth

### Step 7: Build & Final Verification (10 min)
24. Run production build: `npm run build`
25. Verify 0 TypeScript errors
26. Verify 0 ESLint errors (warnings acceptable)
27. Check bundle sizes are reasonable
28. Document any warnings or issues

### Step 8: Integration Report (10 min)
29. Create `integrator-1-report.md`
30. Document what was merged
31. List any issues encountered
32. Confirm success criteria met

**Total time:** 1-1.5 hours

---

## Shared Resources Strategy

### Shared Types

**Issue:** Multiple builders use types from `lib/types/student.ts`

**Resolution:**
- Builder-2 created the definitive type file
- All builders import from this single source
- No duplicate type definitions found
- TypeScript ensures consistency

**Action:** None needed - already correctly implemented

**Responsible:** N/A (already resolved by builders)

---

### Shared Components

**Issue:** Builder-1 imports Builder-2's ProjectViewer component

**Resolution:**
- Builder-1 uses dynamic import to load ProjectViewer after authentication
- Clean separation of concerns: Builder-1 = auth, Builder-2 = viewing
- No tight coupling or circular dependencies

**Action:** Verify dynamic import works correctly in integrated codebase

**Responsible:** Integrator-1 in Zone 4

---

### Configuration Files

**Issue:** Multiple builders modified configuration

**Resolution:**
- No conflicts - each builder modified different files
- Builder-1: `app/layout.tsx` (viewport)
- Builder-3: `middleware.ts`, `next.config.mjs`, `lib/upload/validator.ts`
- All changes are additive (no deletions)

**Action:** Verify all config files have expected changes

**Responsible:** Integrator-1 in Zone 2

---

### API Routes

**Issue:** All builders rely on existing API routes from Iteration 1

**Resolution:**
- No API changes needed (confirmed by all builder reports)
- Existing routes are sufficient:
  - `GET /api/preview/:id` - Project metadata
  - `GET /api/preview/:id/html` - HTML report
  - `GET /api/preview/:id/download` - DOCX download
  - `POST /api/preview/:id/verify` - Password verification

**Action:** None needed - API routes already exist

**Responsible:** N/A (no changes required)

---

## Expected Challenges

### Challenge 1: Download Button Props Mismatch

**Issue:** ProjectViewer might not have `projectName` in scope where DownloadButton is placed

**Impact:** TypeScript error if props don't match

**Mitigation:**
1. Verify `data.name` is available from TanStack Query result
2. Check Builder-2's ProjectViewer implementation for data structure
3. If missing, extract project name from `data` object
4. Worst case: Pass `projectId` only, fetch name inside DownloadButton

**Likelihood:** LOW (Builder-2 report shows `data.name` exists in ProjectMetadata)

**Responsible:** Integrator-1 in Zone 1

---

### Challenge 2: CSP Headers Breaking Plotly

**Issue:** Removing `unsafe-eval` might break Plotly chart functionality

**Impact:** Interactive charts could stop working

**Mitigation:**
1. Builder-3 tested and confirmed Plotly doesn't need `unsafe-eval`
2. If issues arise, add back `unsafe-eval` temporarily
3. Test with real Plotly HTML in iframe
4. Document in integration report if rollback needed

**Likelihood:** LOW (Builder-3 explicitly verified in testing)

**Responsible:** Integrator-1 in Zone 2

---

### Challenge 3: Viewport Meta Tag Placement

**Issue:** Builder-1 added viewport to `app/layout.tsx`, but structure unclear

**Impact:** Viewport might not apply correctly if placed wrong

**Mitigation:**
1. Verify viewport is in correct location (metadata export)
2. Check Next.js 14 viewport documentation
3. Test on mobile device (Chrome DevTools)
4. Ensure viewport isn't duplicated

**Likelihood:** LOW (Builder-1 followed Next.js patterns)

**Responsible:** Integrator-1 in Zone 2

---

### Challenge 4: Routing Confusion (Two Viewer Pages)

**Issue:** Builder-1 created `/preview/:id/page.tsx`, Builder-2 created `/preview/:id/view/page.tsx`

**Impact:** Unclear which page is canonical, potential duplicate code

**Mitigation:**
1. Review both pages - Builder-1's page shows ProjectViewer after auth
2. Builder-2's `/view` page might be redundant
3. Test both routes, document which is used
4. Consider removing duplicate in cleanup (not during integration)

**Likelihood:** MEDIUM (confirmed by builder reports - likely intentional separation)

**Responsible:** Integrator-1 in Zone 4

---

## Success Criteria for This Integration Round

- [ ] All zones successfully resolved
- [ ] Download button integrated into ProjectViewer
- [ ] Configuration files merged correctly (viewport, CSP, prod config)
- [ ] TypeScript compiles with 0 errors
- [ ] ESLint shows only warnings (no errors)
- [ ] All imports resolve correctly
- [ ] No circular dependencies
- [ ] Routing works: `/preview/:id` → password prompt → viewer
- [ ] Dev server starts without errors
- [ ] Production build succeeds
- [ ] Bundle sizes are reasonable (<200KB per route)
- [ ] All builder functionality preserved:
  - Password protection works
  - Session persistence works
  - HTML iframe renders
  - Plotly charts are interactive
  - Download button appears and functions
- [ ] Mobile viewport meta tag present
- [ ] CSP headers tightened (no unsafe-eval)
- [ ] File size validation in place
- [ ] Documentation files copied

**Completion threshold:** 14/14 criteria met

---

## Notes for Integrators

### Important Context

1. **Builder Coordination:** All three builders demonstrated excellent coordination
   - Builder-2 left explicit placeholder for Builder-3
   - Builder-1 and Builder-2 shared types cleanly
   - No builders stepped on each other's toes

2. **Testing Status:**
   - Builder-1: Dev server tested, TypeScript 0 errors
   - Builder-2: Build tested, manual testing passed
   - Builder-3: Build tested, code reviewed (real device testing deferred to validation)

3. **Known Limitations:**
   - Real device testing not performed (mobile optimization verification pending)
   - CSP headers not tested in production (middleware verified in code)
   - File size validation not tested with real uploads (logic verified)

### Watch Out For

1. **ProjectViewer.tsx is critical** - This is where Builder-2 and Builder-3 intersect
   - Carefully integrate DownloadButton
   - Preserve existing layout and styling
   - Don't break TanStack Query integration

2. **CSP headers are security-critical** - Don't accidentally weaken them
   - Verify `unsafe-eval` is NOT present
   - Ensure `data:` and `blob:` are present for Plotly
   - Test that Plotly still works after CSP changes

3. **Viewport meta tag is mobile-critical** - Verify it's in correct location
   - Must be in metadata export, not in component
   - Check Next.js 14 viewport API documentation

4. **Hebrew RTL must persist** - Don't break RTL layout
   - Inherited from root layout
   - Verify download button text is RTL
   - Check email remains LTR (mixed content handling)

### Patterns to Maintain

**From patterns.md:**
- Authentication: Client-side session check
- Components: Mobile-first responsive
- Error handling: Toast notifications
- Hebrew: RTL global configuration
- Security: Iframe sandbox, CSP headers
- Performance: Code splitting, caching

**Critical patterns:**
- Dynamic imports for code splitting (ProjectViewer)
- TanStack Query for data fetching
- React Hook Form + Zod for validation
- Sonner for toast notifications
- Lucide React for icons

### Testing Checklist After Integration

1. **Build Test:**
   ```bash
   npm run build
   # Expected: Success, 0 TypeScript errors
   ```

2. **Dev Server Test:**
   ```bash
   npm run dev
   # Expected: Starts on port 3000/3001
   ```

3. **Route Test:**
   - Navigate to: `http://localhost:3000/preview/test-project`
   - Expected: Password prompt appears
   - Enter password: `test1234` (or actual password from database)
   - Expected: ProjectViewer appears with download button

4. **Download Test:**
   - Click download button
   - Expected: DOCX file downloads with Hebrew filename

5. **Mobile Test (DevTools):**
   - Open Chrome DevTools
   - Toggle device toolbar
   - Test: iPhone SE (320px), iPhone 12 (375px), iPad (768px)
   - Expected: No horizontal scroll, button positioned correctly

---

## Next Steps

After integration complete:

1. **Create Integration Report:**
   - File: `.2L/plan-1/iteration-3/integration/round-1/integrator-1-report.md`
   - Document what was merged
   - List any issues encountered
   - Confirm success criteria met

2. **Run ivalidator:**
   - Check code cohesion score
   - Target: ≥90% cohesion
   - If <90%: Spawn healer to fix issues
   - If ≥90%: Proceed to validation

3. **Validation Phase:**
   - Use `docs/MOBILE_TESTING.md` for comprehensive testing
   - Test on real devices (iPhone + Android)
   - Verify Plotly interactivity
   - Check download functionality on mobile
   - Run Lighthouse audit

4. **Deployment Phase:**
   - Follow `docs/DEPLOYMENT.md` step-by-step
   - Deploy to Vercel
   - Migrate database to Supabase Cloud
   - Configure environment variables
   - Verify production build

---

## Rollback Plan

If integration fails:

### Step 1: Identify Failure Zone
- TypeScript errors? → Zone 3 (types) or Zone 1 (props mismatch)
- Build errors? → Zone 2 (configuration)
- Runtime errors? → Zone 1 (component integration) or Zone 4 (routing)

### Step 2: Isolate Problem
- Revert last change
- Re-run build/dev server
- Verify error disappears
- Document which change caused issue

### Step 3: Fix or Escalate
- **If simple:** Fix directly (typo, import path, etc.)
- **If complex:** Review builder reports for that zone
- **If blocking:** Escalate to healer with detailed issue description

### Step 4: Re-test
- Apply fix
- Run full test sequence again
- Verify success criteria met
- Document resolution

### Emergency Rollback
If critical failure, revert to pre-integration state:
```bash
# Stash all changes
git stash

# Return to last known good commit
git checkout <commit-before-integration>

# Create issue report for healer
```

---

## Integration Plan Quality Checklist

- [x] All builder outputs analyzed
- [x] Conflicts identified (1 integration point, 0 true conflicts)
- [x] Clear zone definitions
- [x] Realistic time estimates
- [x] Risk assessment completed
- [x] Testing strategy defined
- [x] Success criteria measurable
- [x] Rollback plan documented
- [x] Next steps clear

---

**Integration Planner:** 2l-iplanner
**Plan created:** 2025-11-26T10:30:00Z
**Round:** 1
**Complexity:** LOW
**Estimated time:** 1-2 hours
**Risk level:** LOW
**Recommended integrators:** 1

---

## Summary for Orchestrator

**Integration Strategy:** Single integrator, sequential execution
**Critical Zone:** Zone 1 (Download button integration)
**Blocking Issues:** None identified
**Ready to proceed:** YES

**Integrator Assignment:**
- Integrator-1: All zones (40-50 minutes focused work)

**Success Probability:** 95%+ (excellent builder coordination, clear integration points)

**Post-Integration:** Proceed to ivalidator for cohesion check, then validation phase for real device testing.
