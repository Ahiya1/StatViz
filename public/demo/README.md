# Demo Assets Directory

This directory contains placeholder images and assets for the StatViz demo/landing page. The SVG placeholders can be used during development and should be replaced with real screenshots for production.

## Current Placeholder Files (SVG)

These SVG files are available for development use:

| File | Purpose | Status |
|------|---------|--------|
| `spss-correlation.svg` | SPSS correlation table screenshot | Placeholder ready |
| `spss-regression.svg` | SPSS regression output screenshot | Placeholder ready |
| `messy-word-doc.svg` | Poorly formatted Word document | Placeholder ready |
| `sample-excel.svg` | Clean Excel data preview | Placeholder ready |
| `sample-hypotheses.svg` | Hypotheses form preview | Placeholder ready |

## Required Production Assets (WebP)

For production, replace the SVG placeholders with actual WebP screenshots:

### Pain Point Images (Gray Theme)

These images represent the "before" state - the frustrating experience researchers face.

#### 1. spss-correlation.webp

**Purpose:** Show intimidating SPSS correlation output

**Content Requirements:**
- Real SPSS Statistics Viewer screenshot
- Correlation matrix with 4-6 variables
- Include Pearson correlations, significance values, and N
- Show the clinical gray interface
- Dense numerical data

**Dimensions:** 800x600px (or 2:1.5 aspect ratio)

**Styling Notes:**
- Keep the authentic SPSS gray interface
- Include the toolbar and menu bars
- Show footer notes about significance levels

#### 2. spss-regression.webp

**Purpose:** Show complex, dense regression output

**Content Requirements:**
- Real SPSS regression output
- Include Model Summary, ANOVA table, and Coefficients table
- Multiple predictors (3-5 variables)
- All the statistical details (B, Std. Error, Beta, t, Sig., confidence intervals)

**Dimensions:** 800x600px

**Styling Notes:**
- Full SPSS interface visible
- Dense tables with many columns
- Clinical, institutional feel

#### 3. messy-word-doc.webp

**Purpose:** Show chaotic copy-paste formatting nightmare

**Content Requirements:**
- Microsoft Word document screenshot
- Tables pasted from SPSS with broken formatting
- Mixed fonts and font sizes
- Track changes visible
- Comments/annotations
- TODO notes in red
- Misaligned text and tables
- Strikethrough text

**Dimensions:** 800x600px

**Styling Notes:**
- Show the Word ribbon/toolbar
- Multiple formatting issues visible
- Highlight boxes and annotations
- Chaotic, frustrating appearance

### Clean Input Images (Professional Theme)

These images represent the clean, organized StatViz input experience.

#### 4. sample-excel.webp

**Purpose:** Show clean, organized data ready for analysis

**Content Requirements:**
- Excel or spreadsheet with research data
- Clear column headers (participant_id, age, gender, etc.)
- 6-10 visible data rows
- Professional, organized layout
- Sheet tabs visible at bottom

**Dimensions:** 800x600px

**Styling Notes:**
- Light, clean color scheme
- Header row highlighted
- Alternating row colors (subtle)
- Professional data organization

#### 5. sample-hypotheses.webp

**Purpose:** Show the StatViz hypotheses input form

**Content Requirements:**
- StatViz UI form screenshot (or mockup)
- Research question field
- Hypothesis type selection
- H0 and H1 input fields
- Variable definition sections
- Submit/Generate button

**Dimensions:** 800x600px

**Styling Notes:**
- Clean, modern UI
- Color-coded sections (green for H1, red for H0)
- Professional form design
- Matches StatViz brand colors

## Color Palette Reference

### Pain Images (Gray Theme)
- Primary: `#6b7280` (gray-500)
- Secondary: `#9ca3af` (gray-400)
- Light: `#d1d5db` (gray-300)
- Background: `#f3f4f6` (gray-100)

### Clean Input Images
- Accent: `#3b82f6` (blue-500)
- Success: `#22c55e` (green-500)
- Background: `#f8fafc` (slate-50)
- Border: `#e2e8f0` (slate-200)

## Usage in Code

### SVG Placeholders (Development)
```tsx
<Image
  src="/demo/spss-correlation.svg"
  alt="SPSS correlation table"
  width={800}
  height={600}
/>
```

### WebP Production Images
```tsx
<Image
  src="/demo/spss-correlation.webp"
  alt="SPSS correlation table"
  width={800}
  height={600}
  priority
/>
```

## Image Optimization Guidelines

When creating production WebP files:

1. **Capture at 2x resolution** (1600x1200) for retina displays
2. **Export as WebP** with 80-85% quality
3. **File size target:** Under 100KB per image
4. **Fallback:** Provide PNG versions if needed for older browsers

## Creating Real Screenshots

### SPSS Screenshots
1. Open SPSS Statistics Viewer
2. Run correlation/regression analysis on sample data
3. Capture full window including toolbars
4. Crop to remove personal/identifying info

### Word Document Screenshot
1. Create a document with intentionally bad formatting
2. Paste tables from SPSS
3. Add comments, track changes, TODO notes
4. Capture full window

### Excel Screenshot
1. Create clean dataset with realistic column names
2. Format with header row and alternating colors
3. Include 150+ rows indicator in status bar
4. Capture full window

### StatViz Form Screenshot
1. Use the actual StatViz hypotheses form
2. Fill with sample research question
3. Capture the form in filled state

## Hebrew Text Notes

For Hebrew-language demo:
- Screenshots should show actual Hebrew text where applicable
- RTL layout should be visible
- Consider Hebrew variable names in Excel/data previews

## File Checklist

Production-ready checklist:

- [ ] spss-correlation.webp - Real SPSS screenshot
- [ ] spss-regression.webp - Real SPSS screenshot
- [ ] messy-word-doc.webp - Real Word screenshot
- [ ] sample-excel.webp - Real Excel screenshot
- [ ] sample-hypotheses.webp - Real StatViz UI screenshot

## Notes

- SVG placeholders are vector-based and scale to any size
- SVG files include "PLACEHOLDER" label for easy identification
- Replace with WebP for production deployment
- Keep SVG files for fallback/development use
