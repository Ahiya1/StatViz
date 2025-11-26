# StatViz Deployment Guide

Complete step-by-step guide for deploying StatViz to production on Vercel with Supabase Cloud.

## Prerequisites

Before deploying, ensure you have:

- ✅ Vercel account (https://vercel.com)
- ✅ Supabase Cloud account (https://supabase.com)
- ✅ GitHub repository with StatViz code
- ✅ Node.js 18+ installed locally
- ✅ All environment variables ready

---

## Step 1: Supabase Cloud Setup

### 1.1 Create Supabase Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Fill in project details:
   - **Name:** statviz-production
   - **Database Password:** Generate a strong password (save it!)
   - **Region:** Choose closest to your users (e.g., Frankfurt for Israel)
4. Click "Create New Project"
5. Wait ~2 minutes for project provisioning

### 1.2 Get Database Connection String

1. In Supabase dashboard, go to **Settings → Database**
2. Find **Connection String** section
3. Select **Connection Pooling** tab
4. Copy the **Connection string (URI)** - it looks like:
   ```
   postgresql://postgres.XXXX:PASSWORD@HOST:5432/postgres?pgbouncer=true
   ```
5. **IMPORTANT:** Replace `[YOUR-PASSWORD]` with your database password
6. Save this connection string - you'll need it for Vercel

### 1.3 Run Database Migrations

On your local machine:

```bash
# Set the database URL
export DATABASE_URL="postgresql://postgres.XXXX:PASSWORD@HOST:5432/postgres?pgbouncer=true"

# Run Prisma migrations
npx prisma migrate deploy

# Verify migrations succeeded
npx prisma db pull
```

**Expected output:**
```
✔ Prisma Migrate applied the following migration(s):
  migrations/
    └─ 20241120_init/
       └─ migration.sql
```

### 1.4 Verify Tables Created

1. In Supabase dashboard, go to **Table Editor**
2. Verify these tables exist:
   - `project` - Project metadata
   - `project_session` - Student sessions
   - `admin_session` - Admin sessions

---

## Step 2: Environment Variables

### 2.1 Generate JWT Secret

```bash
# Generate 32-byte random string (base64 encoded)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Example output:** `Kx7JvH9pQm2Lw5RnY8Tb3Vf6Gd1Sh4Ua0Cp9Xe7Wz2Ei`

Save this as your `JWT_SECRET`.

### 2.2 Generate Admin Password Hash

```bash
# Replace 'YOUR_ADMIN_PASSWORD' with your desired admin password
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('YOUR_ADMIN_PASSWORD', 10).then(h => console.log(Buffer.from(h).toString('base64')))"
```

**Example output:** `JDJhJDEwJHdwVTdOSy5zZ0F1NmxHNy5mRjVhZC5HR...`

Save this as your `ADMIN_PASSWORD_HASH`.

### 2.3 Required Environment Variables

Prepare these variables for Vercel:

| Variable | Value | Example |
|----------|-------|---------|
| `DATABASE_URL` | Supabase connection string | `postgresql://postgres.XXXX:PASSWORD@HOST:5432/postgres?pgbouncer=true` |
| `JWT_SECRET` | Generated 32-byte base64 string | `Kx7JvH9pQm2Lw5RnY8Tb3Vf6Gd1Sh4Ua0Cp9Xe7Wz2Ei` |
| `ADMIN_PASSWORD_HASH` | Generated bcrypt hash (base64) | `JDJhJDEwJHdwVTdOSy...` |
| `STORAGE_TYPE` | `local` | `local` |
| `UPLOAD_DIR` | `/uploads` | `/uploads` |
| `NODE_ENV` | `production` | `production` |

---

## Step 3: Vercel Deployment

### 3.1 Import Repository

1. Go to https://vercel.com/dashboard
2. Click **"Add New..." → Project**
3. Import your GitHub repository
4. Vercel will auto-detect Next.js

### 3.2 Configure Project

**Framework Preset:** Next.js (auto-detected)
**Root Directory:** `./` (or wherever package.json is)
**Build Command:** `npm run build`
**Output Directory:** `.next`
**Install Command:** `npm install`

### 3.3 Add Environment Variables

In Vercel project settings:

1. Go to **Settings → Environment Variables**
2. Add each variable from Step 2.3:
   - Click **"Add New"**
   - Enter **Key:** `DATABASE_URL`
   - Enter **Value:** `postgresql://postgres...`
   - Select **Environment:** Production, Preview, Development
   - Click **"Save"**
3. Repeat for all 6 variables

**Environment Variable Checklist:**
- [x] `DATABASE_URL`
- [x] `JWT_SECRET`
- [x] `ADMIN_PASSWORD_HASH`
- [x] `STORAGE_TYPE`
- [x] `UPLOAD_DIR`
- [x] `NODE_ENV`

### 3.4 Deploy

1. Click **"Deploy"**
2. Wait for build to complete (~2-3 minutes)
3. Vercel will provide a deployment URL: `https://your-project.vercel.app`

**Build Success:** You should see:
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
```

---

## Step 4: Post-Deployment Verification

### 4.1 Test Admin Login

1. Visit: `https://your-project.vercel.app/admin`
2. Enter your admin password (the one you hashed in Step 2.2)
3. You should see the admin dashboard

**If login fails:**
- Check `ADMIN_PASSWORD_HASH` is correct
- Check `JWT_SECRET` is set
- Check browser console for errors

### 4.2 Create Test Project

1. In admin dashboard, click **"Create New Project"**
2. Fill in test data:
   - **Student Name:** Test Student
   - **Student Email:** test@example.com
   - **Project Name:** Test Project
   - **Research Topic:** Test research
   - **Password:** test123
3. Upload test files (DOCX + HTML)
4. Click **"Create Project"**
5. Copy the student access link

### 4.3 Test Student Access

1. Open the student access link in incognito window
2. Enter the project password (e.g., `test123`)
3. Verify:
   - [x] Project metadata displays
   - [x] HTML report loads in iframe
   - [x] Plotly charts are interactive (if HTML has Plotly)
   - [x] Download button works
   - [x] DOCX file downloads correctly

### 4.4 Mobile Device Testing

**iPhone:**
1. Open Safari on iPhone
2. Access student link
3. Enter password
4. Verify layout and download work

**Android:**
1. Open Chrome on Android
2. Access student link
3. Enter password
4. Verify layout and download work

---

## Step 5: Custom Domain (Optional)

### 5.1 Add Domain in Vercel

1. In Vercel project, go to **Settings → Domains**
2. Click **"Add"**
3. Enter your domain: `statviz.xyz`
4. Click **"Add"**

### 5.2 Configure DNS

Vercel will provide DNS instructions. Common options:

**Option A: A Record (Root domain)**
```
Type: A
Name: @
Value: 76.76.21.21
```

**Option B: CNAME (Subdomain)**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 5.3 Wait for SSL

Vercel automatically provisions SSL certificate via Let's Encrypt (~5-10 minutes).

**Verify SSL:**
- Visit `https://your-domain.com`
- Check for lock icon in browser
- Certificate should be valid

---

## Step 6: Monitoring & Maintenance

### 6.1 View Logs

**Vercel Logs:**
1. Go to project dashboard
2. Click on a deployment
3. View **Functions** tab for runtime logs

**Supabase Logs:**
1. Go to Supabase dashboard
2. Click **Logs** → **Postgres Logs**
3. Filter by severity

### 6.2 Monitor Performance

**Vercel Analytics (built-in):**
- Page load times
- Web Vitals (LCP, FID, CLS)
- Traffic by country

**Supabase Metrics:**
- Database CPU usage
- Storage used
- Active connections

### 6.3 Automatic Deployments

Vercel auto-deploys on git push:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Vercel automatically builds and deploys
# Check: https://vercel.com/your-project/deployments
```

---

## Troubleshooting

### Build Errors

**Error:** `Type error: ...`
```bash
# Fix locally first
npm run build

# If build succeeds locally but fails on Vercel:
# - Check Node.js version matches (Settings → General)
# - Clear Vercel build cache (Settings → General → Clear Cache)
```

**Error:** `Cannot find module '@prisma/client'`
```bash
# Ensure prisma generate runs during build
# Check package.json has:
"postinstall": "prisma generate"
```

### Database Connection Errors

**Error:** `Can't reach database server`
- Verify `DATABASE_URL` is correct in Vercel env vars
- Check Supabase project is not paused (free tier pauses after inactivity)
- Try connection pooling URL (with `?pgbouncer=true`)

**Error:** `Password authentication failed`
- Re-generate connection string from Supabase
- Ensure password is correct (no special characters causing issues)

### File Upload Issues

**Warning:** Vercel filesystem is ephemeral!
- Files uploaded via admin panel are stored in `/uploads`
- **IMPORTANT:** Files will be DELETED on next deployment
- **Recommendation:** Migrate to S3 or Vercel Blob for persistent storage

**Temporary workaround:**
- Don't redeploy frequently in production
- Keep local backups of uploaded files
- Plan S3 migration for post-MVP

### Session Issues

**Error:** `Session expired` after login
- Check `JWT_SECRET` is same across all environments
- Verify cookies are enabled in browser
- Check HTTPS is enabled (cookies with `secure` flag require HTTPS)

### CSP Violations

**Error:** Browser console shows CSP errors
- Check middleware.ts CSP headers
- Verify Plotly HTML doesn't use external resources
- Test with self-contained HTML (selfcontained=TRUE in R)

---

## Rollback Procedure

### Option 1: Vercel Dashboard Rollback

1. Go to **Deployments** tab
2. Find previous working deployment
3. Click **"..."** → **"Promote to Production"**
4. Confirm

**Rollback time:** ~30 seconds

### Option 2: Git Revert

```bash
# Find commit to revert to
git log --oneline

# Revert to specific commit
git revert HEAD
git push origin main

# Vercel auto-deploys reverted version
```

**Note:** Database migrations are forward-only. If schema changed, may need manual rollback.

---

## Production Checklist

Before going live:

### Pre-Launch
- [ ] Supabase project created and migrations applied
- [ ] All environment variables set in Vercel
- [ ] Build succeeds with 0 errors
- [ ] Admin login works
- [ ] Create test project works
- [ ] Student access works (desktop + mobile)
- [ ] DOCX download works
- [ ] SSL certificate issued (if custom domain)

### Performance
- [ ] Lighthouse score >90 (mobile)
- [ ] HTML files <5MB (optimal)
- [ ] Test on 3G network (acceptable load time)

### Security
- [ ] CSP headers verified (no unsafe-eval)
- [ ] Iframe sandbox attributes correct
- [ ] Session cookies httpOnly + secure
- [ ] Admin password strong (12+ characters)

### Documentation
- [ ] Student access instructions shared with Ahiya
- [ ] Admin panel guide created
- [ ] Backup procedure documented

---

## Next Steps (Post-MVP)

**Recommended improvements:**

1. **Persistent File Storage**
   - Migrate to AWS S3 or Vercel Blob
   - Update `STORAGE_TYPE=s3` environment variable
   - No code changes needed (abstraction layer ready)

2. **Session Cleanup**
   - Add cron job to delete expired sessions
   - Prevent database bloat

3. **Analytics**
   - Track project views
   - Monitor download counts
   - Student engagement metrics

4. **Multi-Admin Support**
   - User management system
   - Role-based access control

5. **Email Notifications**
   - Send project link + password to students via email
   - Reduce manual distribution

---

## Support Contacts

**Deployment Issues:**
- Vercel Support: https://vercel.com/support
- Supabase Support: https://supabase.com/support

**StatViz Code Issues:**
- GitHub Repository: [Your repo URL]
- Documentation: This file + `/docs/MOBILE_TESTING.md`

---

**Document Version:** 1.0
**Last Updated:** November 26, 2025
**Author:** Builder-3 (AI)
