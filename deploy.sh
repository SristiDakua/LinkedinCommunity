#!/bin/bash

# Deployment script for Professional Network Platform
# This script helps deploy the application to various hosting platforms

echo "🚀 Professional Network Platform - Deployment Helper"
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "backend" ]; then
    echo "❌ Error: Run this script from the project root directory"
    exit 1
fi

# Build frontend
echo "📦 Building frontend..."
npm install
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Frontend build successful"
else
    echo "❌ Frontend build failed"
    exit 1
fi

# Build backend
echo "📦 Building backend..."
cd backend
npm install
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Backend build successful"
    cd ..
else
    echo "❌ Backend build failed"
    exit 1
fi

echo ""
echo "🎉 Build process completed successfully!"
echo ""
echo "📋 Next steps for deployment:"
echo ""
echo "Frontend (Vercel):"
echo "1. Push code to GitHub"
echo "2. Connect repository to Vercel"
echo "3. Deploy from 'dist' folder"
echo ""
echo "Backend (Render/Railway):"
echo "1. Push code to GitHub"
echo "2. Connect repository to Render/Railway"
echo "3. Set environment variables:"
echo "   - MONGODB_URI"
echo "   - JWT_SECRET"
echo "   - NODE_ENV=production"
echo "   - CLIENT_URL_PROD"
echo ""
echo "Database (MongoDB Atlas):"
echo "1. Create cluster and database user"
echo "2. Get connection string"
echo "3. Update environment variables"
echo "4. Run: npm run seed (for demo data)"
echo ""
echo "🔗 Demo credentials after seeding:"
echo "   Email: demo@example.com | Password: demo123"
echo "   Email: jane@example.com | Password: jane123"
echo "   Email: john@example.com | Password: john123"
