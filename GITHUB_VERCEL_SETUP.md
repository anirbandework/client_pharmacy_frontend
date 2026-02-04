# GitHub + Vercel Setup Guide

## Step 1: Initialize Git Repository

Run these commands in your terminal:

```bash
cd "/Users/anirbande/Desktop/client frontend"

# Initialize Git
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Daily Records Management System"
```

## Step 2: Create GitHub Repository

1. Go to https://github.com
2. Click the **"+"** icon (top right) → **"New repository"**
3. Fill in:
   - **Repository name:** `daily-records-frontend` (or any name)
   - **Description:** "Daily Records Management System"
   - **Visibility:** Private or Public (your choice)
   - **DO NOT** initialize with README (we already have code)
4. Click **"Create repository"**

## Step 3: Push Code to GitHub

GitHub will show you commands. Use these:

```bash
# Add GitHub as remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Rename branch to main
git branch -M main

# Push code
git push -u origin main
```

**Replace:**
- `YOUR_USERNAME` with your GitHub username
- `YOUR_REPO_NAME` with your repository name

## Step 4: Connect Vercel to GitHub

1. Go to https://vercel.com
2. Click **"Sign Up"** or **"Login"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub

## Step 5: Deploy from GitHub

1. On Vercel dashboard, click **"Add New"** → **"Project"**
2. Find your repository: `daily-records-frontend`
3. Click **"Import"**
4. Vercel auto-detects settings:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Click **"Deploy"**

## Step 6: Wait for Deployment

- Vercel builds and deploys (takes 1-2 minutes)
- You'll get a URL: `https://your-project.vercel.app`

## ✅ Done! Now Automatic Deployments Work

### Future Updates:

```bash
# 1. Make changes to your code

# 2. Commit changes
git add .
git commit -m "Updated feature"

# 3. Push to GitHub
git push

# 4. Vercel automatically deploys! 🚀
```

---

## Quick Commands Summary:

```bash
# Initial Setup (One Time)
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main

# Future Updates (Every Time)
git add .
git commit -m "Your update message"
git push
```

---

## Troubleshooting:

### If git push asks for credentials:
```bash
# Use GitHub Personal Access Token
# Generate at: https://github.com/settings/tokens
```

### If you get "remote already exists":
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
```

---

## Your Deployment URL:

After deployment, you'll get:
- **Production:** `https://your-project.vercel.app`
- **Dashboard:** https://vercel.com/dashboard

Share the production URL with your client! 🎉