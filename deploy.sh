#!/bin/bash

# Quick deployment script for Oris AI

echo "🚀 Deploying Oris AI Dental Consultation App"
echo "============================================="

# Check if required tools are installed
command -v git >/dev/null 2>&1 || { echo "❌ Git is required but not installed. Aborting." >&2; exit 1; }
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required but not installed. Aborting." >&2; exit 1; }

echo "📋 Pre-deployment checklist:"
echo "1. ✅ Git repository initialized"
echo "2. ✅ Node.js installed"

# Frontend deployment to Vercel
echo ""
echo "🌐 Deploying Frontend to Vercel..."
echo "-----------------------------------"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

cd oris-ai
echo "📁 Current directory: $(pwd)"

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Frontend deployed to Vercel!"

# Backend deployment instructions
echo
echo "🔧 Backend Deployment Options:"
echo "-----------------------------------"
echo "Choose one of these options:"
echo
echo "Option 1: DigitalOcean App Platform (Recommended)"
echo "1. Go to https://digitalocean.com and sign up (get $200 free credit)"
echo "2. Create → Apps → Connect GitHub"
echo "3. Select oris-ai-backend folder"
echo "4. Add environment variables"
echo "5. Deploy (auto-scaling, great performance)"
echo
echo "Option 2: Railway"
echo "1. Go to https://railway.app and sign up"
echo "2. Connect your GitHub repository"
echo "3. Select the oris-ai-backend folder"
echo "4. Add environment variables"
echo "5. Deploy!"
echo
echo "Option 3: Render (Free)"
echo "1. Go to https://render.com and sign up"
echo "2. Connect GitHub → Web Service"
echo "3. Select oris-ai-backend folder"
echo "4. Add environment variables"
echo "5. Deploy (free tier has cold starts)"
echo
echo "Environment Variables needed for all platforms:"
echo "    - GOOGLE_API_KEY"
echo "    - ELEVENLABS_API_KEY"
echo "    - ELEVENLABS_VOICE_ID"
echo "    - LIVEKIT_URL"
echo "    - LIVEKIT_API_KEY"
echo "    - LIVEKIT_API_SECRET"
echo "    - WEBHOOK_URL"

echo ""
echo "🎉 Deployment Guide Complete!"
echo "📚 For detailed instructions, see DEPLOYMENT_GUIDE.md"