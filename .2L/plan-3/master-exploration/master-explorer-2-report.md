# Master Exploration Report

## Explorer ID
master-explorer-2

## Focus Area
Demo Content & Data Generation Strategy

## Vision Summary
Create a compelling demo for StatViz that showcases the transformation from raw research data ("the pain" - ugly SPSS output) to stunning interactive HTML reports ("the solution"), targeting B2B customers (tutors, agudot, academic service companies).

---

## Demo Content Requirements

### 1. Fake Research Dataset (Excel/CSV)
**Research Topic:** "The relationship between social media use, body image, and depression among adolescents"
(Hebrew: הקשר בין שימוש ברשתות חברתיות לבין דימוי גוף ודיכאון בקרב מתבגרים)

**Required Structure:**
| Column Category | Variables | Details |
|-----------------|-----------|---------|
| Demographics | מגדר (gender) | 1=בן, 2=בת |
| Demographics | גיל (age) | 14-18 years |
| Demographics | סוג_בית_ספר (school_type) | 1=ממלכתי, 2=ממ"ד, 3=חרדי |
| Scale Items | sm_1 to sm_10 | Social media use (1-5 Likert) |
| Scale Items | bi_1 to bi_12 | Body image (1-6 Likert) |
| Scale Items | dep_1 to dep_8 | Depression (1-4 Likert) |

**Sample Size:** N = 180 adolescents

### 2. Interactive HTML Report
**Required Sections (based on existing template pattern):**
1. **Navigation Bar** - Quick links to all sections
2. **Executive Summary** - 5 hypothesis cards with support status icons
3. **Demographics Section** - Pie/bar charts for gender, age, school type
4. **Reliability Section** - Cronbach's alpha for 3 scales with interpretation
5. **Hypothesis 1** - Correlation: SM Use vs Body Image
6. **Hypothesis 2** - Correlation: SM Use vs Depression
7. **Hypothesis 3** - T-test: Gender differences in body image
8. **Hypothesis 4** - Mediation: Body image mediates SM->Depression
9. **Hypothesis 5** - ANOVA: Sector differences in SM use
10. **Full Results Table** - Summary of all analyses
11. **Footer** - StatViz branding

**Visual Theme Requirements:**
- Purple/blue gradient background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- White cards with rounded corners (16px)
- Hebrew RTL throughout
- Plotly.js for all interactive charts
- Self-contained (all CSS/JS inline)

### 3. DOCX Report
**Required Sections:**
1. Title page with research topic
2. Section 1: Population description (demographics)
3. Section 2: Reliability (Cronbach's alpha for each scale)
4. Section 3: Research results (all hypotheses with APA-style statistics)
5. Graph specifications (PNG exports from HTML report)

### 4. "The Pain" Screenshots (SPSS Output)
**Required Screenshots:**
1. **SPSS Correlation Matrix** - Gray, clinical, numbers-only table showing Pearson correlations
2. **SPSS Regression Output** - Intimidating regression table with coefficients, SE, t, sig columns
3. **Messy Word Document** - Copy-pasted SPSS tables with broken formatting

### 5. Demo Input Sample
**Required Assets:**
1. Excel file screenshot showing raw data structure
2. Sample hypotheses form (what a student would submit)

---

## Data Generation Strategy

### Approach: Correlation Matrix First
Generate the fake data backwards - start with the desired correlation matrix, then generate individual responses that produce those correlations.

### Step 1: Define Target Correlation Matrix

```
                    SM_Use   BodyImage   Depression
SM_Use              1.00     -0.38       0.35
BodyImage          -0.38      1.00      -0.45
Depression          0.35     -0.45       1.00
```

**Rationale:**
- SM_Use to BodyImage: r = -0.38 (higher SM use = more negative body image)
- SM_Use to Depression: r = 0.35 (higher SM use = higher depression)
- BodyImage to Depression: r = -0.45 (worse body image = higher depression)

### Step 2: Generate Correlated Scale Scores
Use Cholesky decomposition to generate correlated continuous variables:

```python
import numpy as np
from scipy.stats import norm

# Target correlation matrix
R = np.array([
    [1.00, -0.38, 0.35],
    [-0.38, 1.00, -0.45],
    [0.35, -0.45, 1.00]
])

# Cholesky decomposition
L = np.linalg.cholesky(R)

# Generate 180 participants with correlated scores
n = 180
z = np.random.normal(0, 1, (n, 3))
correlated_scores = z @ L.T
```

### Step 3: Convert to Discrete Likert Items
For each scale, distribute items to achieve target alpha:

**Social Media Scale (10 items, 1-5):**
- Target mean: 3.2 (moderate-high use)
- Target SD: 0.8
- Target alpha: 0.85

**Body Image Scale (12 items, 1-6):**
- Target mean: 3.8 (slightly positive, but room for variance)
- Target SD: 0.9
- Target alpha: 0.88
- Note: Higher = better body image (invert for "negative" interpretation)

**Depression Scale (8 items, 1-4):**
- Target mean: 1.8 (mild depression on average)
- Target SD: 0.6
- Target alpha: 0.82

### Step 4: Generate Demographics with Built-in Effects

**Gender Distribution:**
- N = 90 females (50%), N = 90 males (50%)
- Girls: Mean body image 0.4 SD lower than boys (for H3)
- Cohen's d target: 0.4-0.6

**Age Distribution:**
- Normal distribution around 16 years
- Range: 14-18
- No specific age effects needed

**School Sector Distribution:**
- Mamlachti: N = 70 (39%)
- Mamlad: N = 65 (36%)
- Charedi: N = 45 (25%)
- Charedi sector: SM use 0.5 SD lower (for H5)
- Target eta-squared: 0.06-0.10

### Step 5: Add Realistic Noise
- 2-3% missing data (random)
- Response style effects (some extreme responders)
- No perfect patterns (add random variation)

---

## Statistical Results to Bake In

### Reliability (Cronbach's Alpha)
| Scale | Target Alpha | Interpretation |
|-------|--------------|----------------|
| Social Media Use | 0.85 | Good |
| Body Image | 0.88 | Good-Excellent |
| Depression | 0.82 | Good |

### Descriptive Statistics Targets
| Variable | M | SD | Range |
|----------|---|----|----- |
| Social Media Use | 3.2 | 0.8 | 1-5 |
| Body Image | 3.8 | 0.9 | 1-6 |
| Depression | 1.8 | 0.6 | 1-4 |
| Age | 16.0 | 1.2 | 14-18 |

### Hypothesis 1: SM Use -> Body Image (Correlation)
**Expected Results:**
- r = -0.38 to -0.42
- p < .001
- 95% CI: [-0.50, -0.25]
- **Interpretation:** Significant negative correlation - higher SM use associated with worse body image

### Hypothesis 2: SM Use -> Depression (Correlation)
**Expected Results:**
- r = 0.32 to 0.38
- p < .001
- 95% CI: [0.20, 0.48]
- **Interpretation:** Significant positive correlation - higher SM use associated with higher depression

### Hypothesis 3: Gender -> Body Image (T-test)
**Expected Results:**
- t(178) = -3.2 to -3.8
- p < .01
- Cohen's d = 0.48 to 0.56
- Girls M = 3.55, SD = 0.85
- Boys M = 4.05, SD = 0.90
- **Interpretation:** Girls report significantly worse body image

### Hypothesis 4: Body Image Mediates SM->Depression (Baron & Kenny)
**Expected Results:**

Step 1 (SM -> Depression):
- b = 0.28, SE = 0.07, t = 4.0, p < .001

Step 2 (SM -> Body Image):
- b = -0.43, SE = 0.08, t = -5.4, p < .001

Step 3 (SM + Body Image -> Depression):
- SM: b = 0.15, SE = 0.08, t = 1.9, p = .06 (reduced, becoming non-significant)
- Body Image: b = -0.30, SE = 0.06, t = -5.0, p < .001

**Sobel Test:**
- z = 3.2, p < .01
- **Interpretation:** Significant partial mediation - body image partially mediates the relationship

### Hypothesis 5: Sector -> SM Use (One-way ANOVA)
**Expected Results:**
- F(2, 177) = 8.5 to 10.5
- p < .001
- eta-squared = 0.08 to 0.10 (medium effect)

**Post-hoc (Tukey HSD):**
- Mamlachti (M = 3.35) vs Charedi (M = 2.75): p < .001
- Mamlad (M = 3.20) vs Charedi (M = 2.75): p < .01
- Mamlachti vs Mamlad: p = .45 (not significant)

**Interpretation:** Charedi sector uses social media significantly less than other sectors

---

## Asset Requirements

### Static Images Needed

| Asset | Description | Source | Priority |
|-------|-------------|--------|----------|
| spss_correlation.png | SPSS correlation matrix screenshot | Mock/Create in SPSS | HIGH |
| spss_regression.png | SPSS regression output screenshot | Mock/Create in SPSS | HIGH |
| messy_word.png | Poorly formatted Word doc with pasted tables | Create mock document | HIGH |
| excel_data_sample.png | Screenshot of raw Excel data | Generated data | MEDIUM |
| hypotheses_form.png | Sample student submission form | Create mock form | MEDIUM |

### Generated Files Needed

| File | Description | Format |
|------|-------------|--------|
| demo_data.xlsx | Fake research dataset (180 rows) | Excel |
| demo_report.html | Interactive statistical report | HTML (self-contained) |
| demo_findings.docx | Academic Word document | DOCX |
| charts/*.png | Exported chart images for DOCX | PNG |

### Optional Enhancement Assets

| Asset | Description | Notes |
|-------|-------------|-------|
| input_animation.gif | Animation showing data entry | Nice-to-have for demo page |
| before_after.png | Side-by-side comparison | Marketing asset |

---

## Content Creation Order

### Phase 1: Data Generation (Foundation)
**Order matters - everything depends on the dataset**

1. **Generate correlation matrix** - Define exact target correlations
2. **Create Python script** - Cholesky-based data generation
3. **Generate 180 rows** - With baked-in correlations
4. **Add demographics** - Gender, age, sector with built-in group effects
5. **Validate data** - Check correlations and group differences match targets
6. **Export to Excel** - demo_data.xlsx with Hebrew column names

**Dependencies:** None
**Blocks:** All statistical analysis, all reports

### Phase 2: Statistical Analysis
**Run full analysis pipeline on fake data**

1. **Calculate Cronbach's alpha** - For all 3 scales
2. **Descriptive statistics** - All variables
3. **Pearson correlations** - H1 and H2
4. **Independent t-test** - H3 (gender)
5. **Mediation analysis** - H4 (Baron & Kenny steps)
6. **One-way ANOVA** - H5 (sector)
7. **Document all results** - For use in reports

**Dependencies:** Phase 1 complete
**Blocks:** HTML and DOCX report creation

### Phase 3: HTML Report Creation
**Build the showcase interactive report**

1. **Copy existing template structure** - From `/uploads/9uqknTvWUJ5m/report.html`
2. **Update content** - Research topic, hypotheses, Hebrew text
3. **Create Plotly charts:**
   - Demographics pie/bar charts
   - Correlation scatter plots (H1, H2)
   - Bar chart for t-test (H3)
   - Mediation path diagram (H4)
   - Bar chart for ANOVA (H5)
   - Correlation heatmap
4. **Add hypothesis cards** - Executive summary
5. **Test RTL rendering** - Hebrew display
6. **Test responsiveness** - Mobile view

**Dependencies:** Phase 2 complete
**Blocks:** DOCX report (needs PNG exports)

### Phase 4: DOCX Report Creation
**Create academic submission document**

1. **Export PNG charts** - From HTML report
2. **Create title page** - Research topic, institution
3. **Write demographics section** - Hebrew academic style
4. **Write reliability section** - Cronbach's alpha table
5. **Write results sections** - APA-style for each hypothesis
6. **Insert charts** - Embed PNGs
7. **Format RTL** - Proper Hebrew formatting

**Dependencies:** Phase 3 complete (for chart exports)

### Phase 5: Pain Assets Creation
**Create the "before" screenshots**

1. **Option A (Real SPSS):**
   - Open SPSS with demo data
   - Run correlation analysis
   - Screenshot raw output
   - Run regression
   - Screenshot output

2. **Option B (Mocked):**
   - Create SPSS-like table in HTML
   - Style with gray clinical appearance
   - Screenshot the mock

3. **Create messy Word doc:**
   - Paste SPSS tables into Word
   - Leave formatting broken
   - Screenshot result

**Dependencies:** Phase 1 (demo data)
**Can run parallel to:** Phase 3-4

### Phase 6: Demo Page Assembly
**Build the /demo route**

1. **Create demo page layout**
2. **Integrate pain screenshots**
3. **Add input sample display**
4. **Add black box message**
5. **Embed HTML report preview**
6. **Add CTA section**
7. **Upload assets to Supabase Storage**

**Dependencies:** Phases 3, 4, 5 complete

---

## Technical Recommendations

### Data Generation Script Location
Create Python script at: `/scripts/generate_demo_data.py`

### Demo Files Storage
Upload to Supabase Storage at:
```
projects/demo/
  - data.xlsx       (raw data)
  - report.html     (interactive report)
  - findings.docx   (academic document)
```

### Pain Assets Storage
Upload to Supabase Storage at:
```
demo-assets/
  - spss_correlation.png
  - spss_regression.png
  - messy_word.png
  - excel_sample.png
```

### Public Access Configuration
Demo files should NOT require password (vision requirement):
- Set public access in Supabase Storage bucket
- Or create special handling for demo project in API

---

## Risk Factors

### Medium Risks

**1. Correlation Validity**
- **Risk:** Generated data might not produce exact target correlations
- **Mitigation:** Use seeded random generation, validate before finalizing
- **Fallback:** Manually adjust a few data points to hit targets

**2. SPSS Availability**
- **Risk:** May not have SPSS installed to create real screenshots
- **Mitigation:** Create convincing HTML mockups of SPSS output
- **Alternative:** Use R output styled to look clinical

**3. Hebrew Font Rendering in DOCX**
- **Risk:** Hebrew text might not render correctly in Word
- **Mitigation:** Test early, use proper fonts (David, Arial Hebrew)

### Low Risks

**1. Plotly Chart Mobile Responsiveness**
- **Risk:** Charts might not look great on mobile
- **Mitigation:** Use responsive: true config, test on devices

**2. Self-Contained HTML Size**
- **Risk:** HTML file with embedded data might be large
- **Mitigation:** Keep under 5MB (acceptable per spec)

---

## Column Naming Convention (Hebrew)

### Demographics
```
מגדר          // Gender (1=בן, 2=בת)
גיל           // Age (14-18)
סוג_בית_ספר   // School type (1=ממלכתי, 2=ממ"ד, 3=חרדי)
```

### Social Media Scale Items (10 items)
```
שימוש_רשתות_1  through  שימוש_רשתות_10
```

### Body Image Scale Items (12 items)
```
דימוי_גוף_1  through  דימוי_גוף_12
```

### Depression Scale Items (8 items)
```
דיכאון_1  through  דיכאון_8
```

---

## Sample Item Content (Hebrew)

### Social Media Scale (1-5, never to always)
1. כמה פעמים ביום אתה/את בודק/ת את הרשתות החברתיות?
2. כמה זמן ביום אתה/את מבלה/ה ברשתות חברתיות?
3. האם קשה לך להתרחק מהטלפון?
4. ...

### Body Image Scale (1-6, strongly disagree to strongly agree)
1. אני מרוצה/ה מהמראה שלי
2. אני משווה את עצמי לאחרים ברשתות החברתיות
3. אני חושב/ת שהגוף שלי נראה טוב
4. ...

### Depression Scale (1-4, not at all to very much)
1. הרגשתי עצוב/ה בשבועיים האחרונים
2. היה לי קשה ליהנות מדברים
3. הרגשתי חסר/ת תקווה לגבי העתיד
4. ...

---

## Estimated Time Breakdown

| Phase | Task | Hours |
|-------|------|-------|
| 1 | Data Generation Script | 2-3 |
| 1 | Data Validation | 1 |
| 2 | Statistical Analysis | 1-2 |
| 3 | HTML Report Creation | 4-5 |
| 4 | DOCX Report Creation | 2-3 |
| 5 | Pain Assets Creation | 1-2 |
| 6 | Demo Page Assembly | 3-4 |
| **Total** | | **14-20 hours** |

---

## Notes & Observations

1. **Template Exists:** The existing report at `/uploads/9uqknTvWUJ5m/report.html` provides an excellent template with all the styling, navigation, and chart patterns needed. This significantly reduces development time.

2. **Theme Consistency:** The purple/blue gradient (`#667eea` to `#764ba2`) is already established in the codebase. HTML report should match.

3. **Mediation Diagram:** This is the most complex visualization - may require custom SVG or a specialized Plotly configuration to show the mediation path with arrows.

4. **SPSS Pain Points:** The contrast between clinical gray SPSS output and colorful interactive reports is the core value proposition. Make the "before" look genuinely painful.

5. **Hebrew Academic Style:** DOCX should follow Israeli academic conventions (Guy's format as mentioned in spec).

6. **Data Realism:** The fake data should be "realistic enough" - perfect statistical properties are not required, just convincing patterns.

---

*Exploration completed: 2025-12-25*
*This report informs master planning decisions for demo content creation*
