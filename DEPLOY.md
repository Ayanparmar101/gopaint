# GoPaint Deployment

## ✅ Already Deployed
- **Frontend**: https://gopaint-six.vercel.app (Vercel)

## Backend Deployment (Render)

**Prerequisites**: A Render account (free at https://render.com)

### Step 1: Push code to GitHub

```bash
git init
git add -A
git commit -m "Initial commit"
# Create a repo on GitHub first (github.com/new)
git remote add origin https://github.com/YOUR_USERNAME/gopaint.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Render

1. Go to https://dashboard.render.com
2. Click **New +** → **Web Service**
3. Connect your GitHub repo
4. Configure:
   - **Name**: `gopaint-server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free
5. Add Environment Variables:
   - `OPENROUTER_API_KEY` = `YOUR_OPENROUTER_API_KEY`
   - `OPENROUTER_HTTP_REFERER` = `https://gopaint-six.vercel.app`
   - `OPENROUTER_APP_TITLE` = `GoPaint`
6. Click **Create Web Service**

Wait for the deploy to finish (~2 min). Your URL will be like `https://gopaint-server.onrender.com`.

### Step 3: Link frontend to backend

```bash
# Add the server URL to Vercel
echo "https://gopaint-server.onrender.com" | vercel env add VITE_SERVER_URL production

# Redeploy Vercel frontend with the env var
vercel --prod
```

### Step 4: Verify

Open https://gopaint-six.vercel.app — it should connect to the backend, generate AI images, and score drawings.

---

## Troubleshooting

If the backend fails to start, check Render logs:
1. Go to Render Dashboard → gopaint-server → Logs
2. Look for JavaScript errors or missing env vars

If CORS errors appear in the browser console:
- Verify `VITE_SERVER_URL` is set correctly on Vercel
- Verify `OPENROUTER_HTTP_REFERER` matches the Vercel URL
