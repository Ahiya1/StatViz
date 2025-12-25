# Project Vision: StatViz Demo

**Created:** 2025-12-25T13:15:00Z
**Plan:** plan-3

---

## Problem Statement

StatViz needs a compelling demo to showcase the quality of its statistical analysis service to potential B2B customers (tutors, agudot, academic service companies). The demo must demonstrate the transformation from raw data to stunning interactive reports while keeping the analysis process opaque ("the black box").

**Current pain points:**
- No demo exists to show potential customers what they'll receive
- Customers can't experience the output quality before committing
- The value proposition isn't tangible without seeing real examples

---

## Target Users

**Primary user:** Potential B2B customers evaluating StatViz
- Independent tutors wanting to outsource/augment statistical work
- Agudot (student unions) offering statistical services
- Academic service companies looking to scale

**Secondary users:** None for this demo scope

---

## Core Value Proposition

Show potential customers the stunning transformation from raw research data to professional interactive reports, creating desire while keeping the process opaque.

**Key benefits:**
1. Customers see exactly what their students will receive
2. Quality speaks for itself - immediate "wow" factor
3. Process remains proprietary - no details revealed

---

## Feature Breakdown

### Must-Have (MVP)

1. **Fake Research Dataset**
   - Description: Generate realistic dataset for demo research project
   - Research topic: הקשר בין שימוש ברשתות חברתיות לבין דימוי גוף ודיכאון בקרב מתבגרים
   - Acceptance criteria:
     - [ ] 180 rows (adolescents ages 14-18)
     - [ ] Social media use scale (10 items, 1-5)
     - [ ] Body image scale (12 items, 1-6)
     - [ ] Depression scale (8 items, 1-4)
     - [ ] Demographics: gender (בן/בת), age, school type (ממלכתי/ממ"ד/חרדי)
     - [ ] Correlations baked in for significant results on all 5 hypotheses
     - [ ] Realistic Hebrew column names

2. **Statistical Analysis Execution**
   - Description: Run full analysis pipeline on fake data
   - Acceptance criteria:
     - [ ] Cronbach's alpha calculated for all 3 scales
     - [ ] Descriptive statistics for all variables
     - [ ] Correlation matrix computed
     - [ ] Independent t-tests for gender differences (H3)
     - [ ] One-way ANOVA for sector differences (H5)
     - [ ] Mediation analysis - Baron & Kenny method (H4)
     - [ ] Multiple regression with all predictors
     - [ ] All 5 hypotheses produce significant/meaningful results

3. **Interactive HTML Report**
   - Description: Professional HTML report matching existing StatViz quality
   - Acceptance criteria:
     - [ ] Executive summary with hypothesis cards (✓/✗)
     - [ ] Demographics section with pie/bar charts
     - [ ] Reliability section showing Cronbach's alpha
     - [ ] Each hypothesis with stats table + Plotly visualization
     - [ ] Correlation heatmap
     - [ ] Mediation path diagram
     - [ ] Summary table of all results
     - [ ] Purple/blue gradient theme
     - [ ] Hebrew RTL throughout
     - [ ] Mobile responsive
     - [ ] Publication-quality graphs

4. **DOCX Report**
   - Description: Academic-ready Word document
   - Acceptance criteria:
     - [ ] Title page with research topic
     - [ ] All sections in academic Hebrew
     - [ ] Embedded graphs (PNG exports)
     - [ ] APA-style statistical reporting
     - [ ] Ready for academic submission
     - [ ] Proper RTL formatting

5. **"The Pain" Assets**
   - Description: Screenshots showing what students currently receive (the ugly alternative)
   - Acceptance criteria:
     - [ ] SPSS output screenshot - raw correlation table (gray, clinical, numbers-only)
     - [ ] SPSS output screenshot - regression output (intimidating, no visualization)
     - [ ] Messy Word doc screenshot - copy-pasted tables, no formatting
     - [ ] All screenshots in Hebrew context
     - [ ] Realistic (could be from actual SPSS session)

6. **Demo Page (/demo)**
   - Description: Landing page showing the pain→transformation→solution flow
   - User story: As a potential customer, I want to see what students currently suffer with vs. what they could receive
   - Acceptance criteria:
     - [ ] Route: `/demo`
     - [ ] Section 1: "ראה מה הסטודנטים שלך מקבלים" header
     - [ ] Section 2: THE PAIN - "מה הסטודנטים מקבלים היום"
           - Screenshot of ugly SPSS output (raw tables, no visualization)
           - Screenshot of messy Word doc with copy-pasted tables
           - Gray, clinical, confusing interface
           - Message: "זה מה שהם רואים עכשיו..."
     - [ ] Section 3: Sample input display (Excel screenshot + hypotheses form)
     - [ ] Section 4: Black box message - "מעובד באמצעות מערכת הניתוח הסטטיסטי שלנו"
     - [ ] Section 5: THE SOLUTION - Output showcase
           - Embedded HTML report preview (interactive, beautiful)
           - DOCX download button
           - Message: "...וזה מה שהם יכולים לקבל"
     - [ ] Section 6: CTA - "רוצה את זה עבור הלקוחות שלך? דבר איתנו"
     - [ ] Professional design matching StatViz theme
     - [ ] Hebrew RTL
     - [ ] Mobile responsive
     - [ ] Smooth scroll/animation between pain→solution

7. **Public Report Viewer**
   - Description: Demo report viewable without password
   - Acceptance criteria:
     - [ ] Demo report accessible at public URL (no password required)
     - [ ] Clean viewer interface
     - [ ] Download button for DOCX
     - [ ] Professional footer

8. **Updated Landing Page**
   - Description: Current landing page updated to direct users to demo
   - Acceptance criteria:
     - [ ] Clear CTA pointing to /demo
     - [ ] Maintains existing admin functionality
     - [ ] Professional appearance

### Should-Have (Post-MVP)

None - this is demo-only scope.

### Could-Have (Future)

None - explicitly out of scope for this plan.

---

## User Flows

### Flow 1: Potential Customer Views Demo

**Steps:**
1. User lands on homepage
2. User clicks CTA to view demo
3. User sees THE PAIN - ugly SPSS output, messy Word docs (what students get today)
4. User sees sample input (what a student would submit)
5. User sees "black box" processing message
6. User sees THE SOLUTION - stunning output (interactive HTML)
7. User experiences the contrast - gray/ugly → vibrant/professional
8. User can click through the HTML report sections
9. User can download sample DOCX
10. User sees CTA to contact for service

**Edge cases:**
- Mobile user: Responsive design ensures good experience
- Slow connection: Charts load progressively

**Error handling:**
- If storage fails to load: Show static fallback preview

---

## Data Model Overview

**Key entities:**

1. **Demo Project (in storage)**
   - Files: report.html, findings.docx
   - Location: `projects/demo/` in Supabase Storage
   - Public access (no password)

2. **No database changes required**
   - Demo uses storage directly
   - Existing Project model unchanged

---

## Technical Requirements

**Production Stack (Locked):**

Default:
- **Frontend + API:** Vercel (Next.js)
- **Database + Auth:** Supabase (PostgreSQL + Storage)
- **CI/CD:** GitHub Actions

**Must support:**
- Hebrew RTL text rendering
- Plotly.js for interactive charts
- Mobile responsive design
- Public file access from Supabase Storage

**Constraints:**
- No changes to existing project/admin functionality
- Demo must work alongside existing password-protected projects
- Single admin (Ahiya) - no multi-tenant features

**Preferences:**
- Match existing purple/blue gradient theme
- Reuse existing component patterns where possible
- Keep demo self-contained in /demo route

---

## Demo Research Specifications

### Research Topic
הקשר בין שימוש ברשתות חברתיות לבין דימוי גוף ודיכאון בקרב מתבגרים

### Sample
N = 180 adolescents (ages 14-18)

### Variables

| Variable | Type | Measurement |
|----------|------|-------------|
| שימוש ברשתות חברתיות | IV | 10 items, scale 1-5 |
| דימוי גוף | Mediator | 12 items, scale 1-6 |
| דיכאון | DV | 8 items, scale 1-4 |
| מגדר | Demographic | בן/בת |
| גיל | Demographic | years (14-18) |
| סוג בית ספר | Demographic | ממלכתי/ממ"ד/חרדי |

### Hypotheses

1. שימוש גבוה ברשתות חברתיות קשור לדימוי גוף שלילי יותר
2. שימוש גבוה ברשתות חברתיות קשור לרמות דיכאון גבוהות יותר
3. בנות ידווחו על דימוי גוף שלילי יותר מבנים
4. דימוי גוף מתווך את הקשר בין שימוש ברשתות לדיכאון
5. יימצאו הבדלים בין מגזרים ברמת השימוש ברשתות

### Required Analyses
- Cronbach's alpha (all scales)
- Descriptive statistics
- Correlation matrix
- Independent t-tests (gender)
- One-way ANOVA (sector)
- Mediation analysis (Baron & Kenny)
- Multiple regression

### Expected Results (bake into fake data)
- H1: r ≈ -0.35 to -0.45 (significant negative correlation)
- H2: r ≈ 0.30 to 0.40 (significant positive correlation)
- H3: t significant, d ≈ 0.4-0.6 (girls report worse body image)
- H4: Significant mediation (Sobel test p < .05)
- H5: F significant, η² ≈ 0.06-0.10 (sector differences in social media use)

---

## Success Criteria

**The demo is successful when:**

1. **Input looks realistic**
   - Metric: Would a real student recognize this as a typical submission?
   - Target: Indistinguishable from real student data

2. **Process feels professional and opaque**
   - Metric: No technical details exposed
   - Target: Zero mentions of AI/automation/tools

3. **Output is stunning**
   - Metric: Immediate "wow" reaction
   - Target: Publication-quality graphs, perfect Hebrew

4. **Hebrew is perfect**
   - Metric: RTL display, no glitches, proper fonts
   - Target: 100% correct rendering

5. **Mobile works**
   - Metric: Usable on phone screens
   - Target: All content accessible, charts responsive

6. **CTA is clear**
   - Metric: Users know how to proceed
   - Target: Single clear action to contact

---

## Out of Scope

**Explicitly not included:**
- Customer dashboard
- Batch processing
- Customer accounts/login
- Custom branding per customer
- Analytics (views, downloads)
- Tiered pricing
- Any product features beyond demo
- Changes to admin functionality
- Multi-admin support

**Why:** This plan is demo-only. Product features belong in a future plan.

---

## Assumptions

1. Existing StatViz infrastructure (Vercel + Supabase) is working
2. Current HTML report template is the target quality level
3. Demo data doesn't need to be statistically perfect, just realistic enough
4. Python analysis will be run locally, outputs uploaded manually
5. Demo password protection is not needed (public access preferred)

---

## Open Questions

1. ~~Should demo report require password?~~ **RESOLVED: No, public access**
2. Contact CTA format - WhatsApp link? Email? Contact form?

---

## Language Guidelines

**Do say:**
- "מערכת ניתוח סטטיסטי מתקדמת"
- "תהליך עיבוד מקצועי"
- "Proprietary analysis pipeline"
- "Professional statistical processing"

**Don't say:**
- AI / Claude / LLM
- "Takes 5 minutes"
- "Automated"
- Any technical details about generation

---

## Next Steps

- [ ] Review and refine this vision
- [ ] Run `/2l-plan` for interactive master planning
- [ ] OR run `/2l-prod` to auto-plan and execute

---

**Vision Status:** VISIONED
**Ready for:** Master Planning
