# CI/CD Setup Guide for Vercel

## Option 1: Vercel Git Integration (Recommended - Easiest) ⭐

This is the **easiest and most reliable** way to set up automatic deployments.

### Steps:

1. **Push your code to GitHub:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. **Connect GitHub to Vercel:**
   - Go to: https://vercel.com/nguyenhaodo-3683s-projects/expense-tracker/settings/git
   - Click "Connect Git Repository"
   - Select your GitHub repository
   - Vercel will automatically detect your Next.js project

3. **Automatic Deployments:**
   - Every push to `main` → Deploys to Production
   - Pull requests → Creates Preview deployments
   - That's it! No configuration needed.

---

## Option 2: GitHub Actions (More Control)

If you prefer GitHub Actions, follow these steps:

### 1. Get Vercel Credentials:

```bash
# Get your Vercel Project ID
vercel project ls

# Get your Vercel Org ID
vercel whoami
```

### 2. Add GitHub Secrets:

Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

Add these secrets:
- `VERCEL_TOKEN` - Get from: https://vercel.com/account/tokens
- `VERCEL_ORG_ID` - Run: `vercel whoami` or find in Vercel dashboard
- `VERCEL_PROJECT_ID` - Run: `vercel project ls` or find in Vercel dashboard URL

### 3. Push the workflow:

The workflow file `.github/workflows/deploy.yml` is already created. Just commit and push:

```bash
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Actions CI/CD workflow"
git push origin main
```

---

## Which Option Should You Choose?

**Option 1 (Vercel Git Integration):**
- ✅ Easiest setup
- ✅ Automatic preview deployments for PRs
- ✅ Built-in Vercel features
- ✅ Zero configuration

**Option 2 (GitHub Actions):**
- ✅ More control over the build process
- ✅ Can run tests before deployment
- ✅ Can customize deployment steps
- ⚠️ Requires more setup

**Recommendation:** Use **Option 1** unless you need custom build steps or testing.

---

## Current Status

After connecting GitHub through Vercel Dashboard:
- ✅ Automatic deployments on push to `main`
- ✅ Preview deployments for pull requests
- ✅ Automatic build and deployment
- ✅ No manual deployment needed

