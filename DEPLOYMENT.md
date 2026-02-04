# Free Deployment Guide

## Option 1: Vercel (Recommended - Easiest)

### Steps:
1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Build your project:
```bash
npm run build
```

3. Deploy:
```bash
vercel
```

4. Follow prompts and get instant URL

**Pros:** 
- Instant deployment
- Auto SSL
- Custom domains
- CI/CD with GitHub
- Best for React apps

**URL:** You'll get a URL like: `your-app.vercel.app`

---

## Option 2: Netlify

### Steps:
1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Build:
```bash
npm run build
```

3. Deploy:
```bash
netlify deploy --prod
```

**Pros:**
- Easy deployment
- Form handling
- Serverless functions
- Custom domains

**URL:** You'll get: `your-app.netlify.app`

---

## Option 3: GitHub Pages

### Steps:
1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Add to package.json:
```json
"homepage": "https://yourusername.github.io/repo-name",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

3. Deploy:
```bash
npm run deploy
```

**Note:** Requires GitHub repository

---

## Quick Deploy with Vercel (Fastest):

```bash
# 1. Build the project
npm run build

# 2. Install Vercel
npm i -g vercel

# 3. Deploy
vercel --prod
```

You'll get a live URL in seconds!

---

## Important Notes:

### Backend Connection:
Your app currently connects to `http://localhost:8000`. For production:

1. Update `.env`:
```
VITE_API_URL=https://your-backend-url.com
```

2. Or deploy backend on:
   - Railway.app (free)
   - Render.com (free)
   - Fly.io (free tier)

### For Demo Without Backend:
The frontend will work but API calls will fail. Consider:
- Using mock data
- Deploying backend separately
- Using a demo API endpoint

---

## Recommended: Vercel

**Why?** 
- Zero config
- Instant deployment
- Perfect for React/Vite
- Free SSL
- Global CDN

**Command:**
```bash
vercel
```

That's it! Share the URL with your client.