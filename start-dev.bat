@echo off
echo 🍕 Pizza Order App - Development Server Startup
echo ===============================================

echo.
echo 📋 Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed or not in PATH
    echo 📋 Please install Node.js first:
    echo    1. Visit: https://nodejs.org/
    echo    2. Download LTS version
    echo    3. Run installer
    echo    4. Restart command prompt
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js is installed
echo.

echo 📦 Installing dependencies...
echo Installing server dependencies...
cd server
call npm install
if errorlevel 1 (
    echo ❌ Failed to install server dependencies
    pause
    exit /b 1
)

echo.
echo Installing client dependencies...
cd ..\client
call npm install --legacy-peer-deps
if errorlevel 1 (
    echo ❌ Failed to install client dependencies
    pause
    exit /b 1
)

echo.
echo ✅ Dependencies installed successfully!
echo.
echo 🚀 Starting development servers...
echo.
echo 📋 This will open two command windows:
echo    - Backend server (port 5000)
echo    - Frontend server (port 3000)
echo.

cd ..\server
start "Backend Server" cmd /k "echo 🔧 Starting Backend Server... && npm run dev"

timeout /t 3 /nobreak >nul

cd ..\client
start "Frontend Server" cmd /k "echo 🎨 Starting Frontend Server... && npm start"

echo.
echo ✅ Development servers are starting...
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend:  http://localhost:5000
echo.
echo Press any key to exit this window...
pause >nul
