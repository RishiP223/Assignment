# Deployment Guide for Notes App

This guide will help you deploy your Notes App to Vercel or Netlify.

## Prerequisites

1. **GitHub Account** (recommended) or GitLab/Bitbucket
2. **Vercel Account** (free at [vercel.com](https://vercel.com)) OR **Netlify Account** (free at [netlify.com](https://netlify.com))
3. **Groq API Key** - Get one from [console.groq.com](https://console.groq.com)

---

## Step 1: Prepare Your Code

### 1.1 Create a `.env` file (for local development only)

Create a `.env` file in the root directory:
```
VITE_GROQ_API_KEY=your_groq_api_key_here
```

**Important:** This file is already in `.gitignore` and won't be committed to Git.

### 1.2 Test your build locally

```bash
npm run build
```

This should create a `dist` folder. Test it with:
```bash
npm run preview
```

---

## Step 2: Push to GitHub

1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Create a GitHub repository:**
   - Go to [github.com](https://github.com)
   - Click "New repository"
   - Name it (e.g., `notes-groq`)
   - Don't initialize with README
   - Click "Create repository"

3. **Push your code:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/notes-groq.git
   git branch -M main
   git push -u origin main
   ```

---

## Option A: Deploy to Vercel

### Step 1: Sign up / Login
- Go to [vercel.com](https://vercel.com)
- Sign up with GitHub (recommended) or email

### Step 2: Import Project
1. Click **"Add New..."** → **"Project"**
2. Click **"Import Git Repository"**
3. Select your GitHub repository (`notes-groq`)
4. Click **"Import"**

### Step 3: Configure Build Settings
Vercel should auto-detect Vite. Verify these settings:
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### Step 4: Add Environment Variable
1. In the project settings, scroll to **"Environment Variables"**
2. Click **"Add"**
3. Add:
   - **Key:** `VITE_GROQ_API_KEY`
   - **Value:** Your Groq API key
4. Click **"Save"**

### Step 5: Deploy
1. Click **"Deploy"**
2. Wait for deployment to complete (usually 1-2 minutes)
3. Your site will be live at `https://your-project-name.vercel.app`

### Step 6: Custom Domain (Optional)
1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions

---

## Option B: Deploy to Netlify

### Step 1: Sign up / Login
- Go to [netlify.com](https://netlify.com)
- Sign up with GitHub (recommended) or email

### Step 2: Import Project
1. Click **"Add new site"** → **"Import an existing project"**
2. Click **"Deploy with GitHub"** (or GitLab/Bitbucket)
3. Authorize Netlify to access your repositories
4. Select your repository (`notes-groq`)

### Step 3: Configure Build Settings
Netlify should auto-detect Vite. Verify these settings:
- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Base directory:** (leave empty)

### Step 4: Add Environment Variable
1. Before deploying, click **"Show advanced"**
2. Click **"New variable"**
3. Add:
   - **Key:** `VITE_GROQ_API_KEY`
   - **Value:** Your Groq API key
4. Click **"Deploy site"**

### Step 5: Deploy
1. Netlify will automatically deploy
2. Wait for deployment to complete (usually 1-2 minutes)
3. Your site will be live at `https://random-name-123456.netlify.app`

### Step 6: Custom Domain (Optional)
1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Follow DNS configuration instructions

---

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Ensure `npm run build` works locally
- Check build logs in Vercel/Netlify dashboard

### API Key Not Working
- Verify environment variable name is exactly `VITE_GROQ_API_KEY`
- Make sure you redeployed after adding the environment variable
- Check browser console for errors

### Site Not Loading
- Clear browser cache
- Check if build completed successfully
- Verify the output directory is `dist`

### Environment Variable Not Found
- Make sure variable name starts with `VITE_` (required for Vite)
- Redeploy after adding environment variables
- Check that variable is set for "Production" environment

---

## Updating Your Site

### Automatic Deployments
Both Vercel and Netlify automatically deploy when you push to your main branch:
```bash
git add .
git commit -m "Update message"
git push
```

### Manual Deploy
- **Vercel:** Go to dashboard → Click "Redeploy"
- **Netlify:** Go to site → "Deploys" → "Trigger deploy"

---

## Security Notes

✅ **DO:**
- Keep your API key in environment variables (never in code)
- Use `.env` file for local development (already in `.gitignore`)
- Rotate your API key if it's exposed

❌ **DON'T:**
- Commit `.env` file to Git
- Share your API key publicly
- Hardcode API keys in your source code

---

## Quick Reference

| Platform | Build Command | Output Dir | Env Var Prefix |
|----------|--------------|------------|----------------|
| Vercel   | `npm run build` | `dist` | `VITE_` |
| Netlify  | `npm run build` | `dist` | `VITE_` |

---

## Need Help?

- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **Netlify Docs:** [docs.netlify.com](https://docs.netlify.com)
- **Vite Deployment:** [vitejs.dev/guide/static-deploy](https://vitejs.dev/guide/static-deploy.html)

