@echo off
echo 🚀 GitHub Push Helper Script
echo ================================

echo.
echo 📋 Instructions:
echo 1. Go to GitHub.com and create a new repository
echo 2. Name it: linkedin-community-platform (or similar)
echo 3. Set it to PUBLIC
echo 4. DON'T initialize with README
echo 5. Copy the repository URL from GitHub
echo.

set /p REPO_URL="📝 Enter your GitHub repository URL (https://github.com/username/repo.git): "

if "%REPO_URL%"=="" (
    echo ❌ Error: Repository URL is required
    pause
    exit /b 1
)

echo.
echo 🔗 Adding remote origin...
git remote add origin %REPO_URL%

echo 📤 Pushing to GitHub...
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ✅ SUCCESS! Your code is now on GitHub!
    echo.
    echo 📋 For CIAAN Cyber Tech submission:
    echo 🔗 GitHub Repository: %REPO_URL%
    echo 📧 Email this link to: ciaancybertech@gmail.com
    echo.
    echo 🚀 Next: Deploy to Vercel/Render using this repository
) else (
    echo.
    echo ❌ Push failed. Please check your repository URL and try again.
    echo 💡 Make sure you have push access to the repository.
)

echo.
pause
