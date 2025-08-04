@echo off
REM Deployment script for Professional Network Platform (Windows)
REM This script helps deploy the application to various hosting platforms

echo 🚀 Professional Network Platform - Deployment Helper
echo ==================================================

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: Run this script from the project root directory
    exit /b 1
)

if not exist "backend" (
    echo ❌ Error: Backend directory not found
    exit /b 1
)

REM Build frontend
echo 📦 Building frontend...
call npm install
call npm run build

if %errorlevel% neq 0 (
    echo ❌ Frontend build failed
    exit /b 1
)
echo ✅ Frontend build successful

REM Build backend
echo 📦 Building backend...
cd backend
call npm install
call npm run build

if %errorlevel% neq 0 (
    echo ❌ Backend build failed
    exit /b 1
)
echo ✅ Backend build successful
cd ..

echo.
echo 🎉 Build process completed successfully!
echo.
echo 📋 Next steps for deployment:
echo.
echo Frontend (Vercel):
echo 1. Push code to GitHub
echo 2. Connect repository to Vercel
echo 3. Deploy from 'dist' folder
echo.
echo Backend (Render/Railway):
echo 1. Push code to GitHub
echo 2. Connect repository to Render/Railway
echo 3. Set environment variables:
echo    - MONGODB_URI
echo    - JWT_SECRET
echo    - NODE_ENV=production
echo    - CLIENT_URL_PROD
echo.
echo Database (MongoDB Atlas):
echo 1. Create cluster and database user
echo 2. Get connection string
echo 3. Update environment variables
echo 4. Run: npm run seed (for demo data)
echo.
echo 🔗 Demo credentials after seeding:
echo    Email: demo@example.com ^| Password: demo123
echo    Email: jane@example.com ^| Password: jane123
echo    Email: john@example.com ^| Password: john123

pause
