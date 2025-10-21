# Quick Setup Script for Pizza Order App Development
Write-Host "🍕 Pizza Order App - Quick Development Setup" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

# Function to check if command exists
function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# Check Node.js
Write-Host "`n📋 Checking Node.js..." -ForegroundColor Cyan
if (Test-Command "node") {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
    
    # Install dependencies
    Write-Host "`n📦 Installing dependencies..." -ForegroundColor Cyan
    
    Write-Host "Installing server dependencies..." -ForegroundColor Yellow
    Set-Location "server"
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install server dependencies" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "Installing client dependencies..." -ForegroundColor Yellow
    Set-Location "..\client"
    npm install --legacy-peer-deps
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install client dependencies" -ForegroundColor Red
        exit 1
    }
    
    Set-Location ".."
    Write-Host "✅ Dependencies installed successfully!" -ForegroundColor Green
    
    # Start servers
    Write-Host "`n🚀 Starting development servers..." -ForegroundColor Green
    Write-Host "Backend will start on: http://localhost:5000" -ForegroundColor Cyan
    Write-Host "Frontend will start on: http://localhost:3000" -ForegroundColor Cyan
    
    # Start backend in new window
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\server'; Write-Host 'Starting Backend Server...' -ForegroundColor Green; npm run dev"
    
    # Wait a moment then start frontend
    Start-Sleep -Seconds 2
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\client'; Write-Host 'Starting Frontend Server...' -ForegroundColor Green; npm start"
    
    Write-Host "`n✅ Development servers are starting in separate windows!" -ForegroundColor Green
    Write-Host "🌐 Open http://localhost:3000 in your browser" -ForegroundColor Yellow
    
} else {
    Write-Host "❌ Node.js not found!" -ForegroundColor Red
    Write-Host "`n📋 Please install Node.js first:" -ForegroundColor Yellow
    Write-Host "1. Visit: https://nodejs.org/" -ForegroundColor White
    Write-Host "2. Download the LTS version" -ForegroundColor White
    Write-Host "3. Run the installer" -ForegroundColor White
    Write-Host "4. Restart PowerShell and run this script again" -ForegroundColor White
    Write-Host "`n🔄 Or run the automated installer:" -ForegroundColor Cyan
    Write-Host "PowerShell -ExecutionPolicy Bypass -File install-nodejs.ps1" -ForegroundColor White
}
