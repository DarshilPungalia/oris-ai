# Deployment Guide for Oris AI Dental Consultation App

## Frontend Deployment (Vercel)

### Prerequisites
- GitHub account
- Vercel account (free)

### Steps

1. **Push code to GitHub** (if not already done)
```bash
cd oris-ai
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/oris-ai.git
git push -u origin main
```

2. **Deploy to Vercel**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts:
# - Connect to GitHub
# - Select your repository
# - Configure build settings (auto-detected for Next.js)
```

3. **Environment Variables in Vercel**
- Go to Vercel dashboard → Your project → Settings → Environment Variables
- Add:
  - `NEXT_PUBLIC_LIVEKIT_URL`
  - `LIVEKIT_API_KEY`
  - `LIVEKIT_API_SECRET`
  - Any other environment variables

## Backend Deployment (Railway)

### Prerequisites
- GitHub account
- Railway account (free $5 credit)

### Steps

1. **Prepare backend for deployment**
```bash
cd oris-ai-backend
```

2. **Create Dockerfile** (Railway can auto-detect Python but Dockerfile is more reliable)

3. **Create railway.json config**

4. **Deploy to Railway**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

5. **Set Environment Variables in Railway**
- Go to Railway dashboard → Your project → Variables
- Add all your .env variables

## Alternative: DigitalOcean App Platform ⭐ (Highly Recommended)

### Why DigitalOcean?
- **Cost**: $200 free credit for 60 days, then $5/month
- **Performance**: Excellent speed and reliability
- **Developer Experience**: Simple deployment process
- **Features**: Auto-scaling, built-in CI/CD, SSD storage, global CDN
- **Support**: Great documentation and community

### Steps for DigitalOcean

1. **Sign up for DigitalOcean**
- Go to [digitalocean.com](https://digitalocean.com)
- Sign up and get $200 free credit (60 days)

2. **Create App Platform Project**
- Go to DigitalOcean dashboard
- Click "Create" → "Apps"
- Connect your GitHub repository
- Select `oris-ai-backend` folder

3. **Configure Build Settings**
- DigitalOcean auto-detects Python
- Build Command: `pip install -r requirements.txt`
- Run Command: `python RetrievalEngineRAGAgent.py dev`
- Port: 8000

4. **Set Environment Variables**
- In app settings, add all your environment variables:
  - `GOOGLE_API_KEY`
  - `ELEVENLABS_API_KEY`
  - `ELEVENLABS_VOICE_ID`
  - `LIVEKIT_URL`
  - `LIVEKIT_API_KEY`
  - `LIVEKIT_API_SECRET`
  - `WEBHOOK_URL`

5. **Deploy**
- Click "Create Resources"
- DigitalOcean will build and deploy automatically
- Get your app URL (e.g., `https://your-app-name.ondigitalocean.app`)

## Alternative: Render Deployment (Free)

### Steps for Render

1. **Create render.yaml**

2. **Connect GitHub to Render**
- Go to Render dashboard
- Connect your GitHub repository
- Select Python environment
- Set build and start commands

## Domain Setup (Optional)

### Free Custom Domain Options
1. **Freenom** - Free .tk, .ml, .ga domains
2. **GitHub Student Pack** - Free .me domain if you're a student
3. **Use Railway/Vercel subdomain** - Free but branded

## Post-Deployment Checklist

- [ ] Frontend accessible via HTTPS
- [ ] Backend API responding
- [ ] LiveKit connection working
- [ ] Environment variables configured
- [ ] CORS settings updated for production URLs
- [ ] Test end-to-end consultation flow

## Monitoring & Maintenance

### Free Monitoring Options
1. **Vercel Analytics** - Built-in for frontend
2. **Railway Metrics** - Built-in for backend
3. **Uptime Robot** - Free uptime monitoring
4. **Google Analytics** - Free web analytics

## Cost Estimation

### Completely Free Option
- Frontend: Vercel (free)
- Backend: Render (free tier)
- Database: Supabase (free)
- **Total: $0/month**

### Recommended Option (Best Performance)
- Frontend: Vercel (free)
- Backend: DigitalOcean App Platform ($5/month after free credits)
- Database: Supabase (free)
- **Total: $5/month**

### Budget Option
- Frontend: Vercel (free)
- Backend: Railway ($5/month)
- Database: Supabase (free)
- **Total: $5/month**

## Scaling Considerations

When you outgrow free tiers:
- Vercel Pro: $20/month
- Railway Pro: $20/month
- Supabase Pro: $25/month
- Consider AWS/GCP for enterprise scale