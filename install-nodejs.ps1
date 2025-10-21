# PowerShell script to install Node.js automatically
Write-Host "🚀 Installing Node.js for Pizza Order App Development" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green

# Check if Node.js is already installed
try {
    $nodeVersion = node --version 2>$null
    if ($nodeVersion) {
        Write-Host "✅ Node.js is already installed: $nodeVersion" -ForegroundColor Green
        exit 0
    }
} catch {
    Write-Host "📦 Node.js not found. Installing..." -ForegroundColor Yellow
}

# Method 1: Try winget (Windows Package Manager)
Write-Host "🔄 Trying winget installation..." -ForegroundColor Cyan
try {
    $wingetResult = winget install OpenJS.NodeJS --accept-source-agreements --accept-package-agreements --silent
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Node.js installed successfully via winget!" -ForegroundColor Green
        Write-Host "🔄 Please restart your PowerShell session and run this script again to verify installation." -ForegroundColor Yellow
        exit 0
    }
} catch {
    Write-Host "❌ winget installation failed" -ForegroundColor Red
}

# Method 2: Try Chocolatey
Write-Host "🔄 Trying Chocolatey installation..." -ForegroundColor Cyan
try {
    # Check if Chocolatey is installed
    choco --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        choco install nodejs -y
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Node.js installed successfully via Chocolatey!" -ForegroundColor Green
            Write-Host "🔄 Please restart your PowerShell session and run this script again to verify installation." -ForegroundColor Yellow
            exit 0
        }
    }
} catch {
    Write-Host "❌ Chocolatey not available or installation failed" -ForegroundColor Red
}

# Method 3: Download and install manually
Write-Host "🔄 Downloading Node.js installer..." -ForegroundColor Cyan
$nodeUrl = "https://nodejs.org/dist/v20.10.0/node-v20.10.0-x64.msi"
$installerPath = "$env:TEMP\nodejs-installer.msi"

try {
    Invoke-WebRequest -Uri $nodeUrl -OutFile $installerPath -UseBasicParsing
    Write-Host "✅ Downloaded Node.js installer" -ForegroundColor Green
    
    Write-Host "🔄 Running installer..." -ForegroundColor Cyan
    Start-Process -FilePath "msiexec.exe" -ArgumentList "/i", $installerPath, "/quiet", "/norestart" -Wait
    
    Write-Host "✅ Node.js installation completed!" -ForegroundColor Green
    Write-Host "🔄 Please restart your PowerShell session to use Node.js" -ForegroundColor Yellow
    
    # Clean up
    Remove-Item $installerPath -Force -ErrorAction SilentlyContinue
    
} catch {
    Write-Host "❌ Manual installation failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "📋 Manual Installation Instructions:" -ForegroundColor Yellow
    Write-Host "1. Visit: https://nodejs.org/" -ForegroundColor White
    Write-Host "2. Download the LTS version" -ForegroundColor White
    Write-Host "3. Run the installer" -ForegroundColor White
    Write-Host "4. Restart PowerShell" -ForegroundColor White
}

Write-Host "`n🎯 Next Steps After Node.js Installation:" -ForegroundColor Green
Write-Host "1. Restart PowerShell" -ForegroundColor White
Write-Host "2. Run: cd server && npm install" -ForegroundColor White
Write-Host "3. Run: cd client && npm install --legacy-peer-deps" -ForegroundColor White
Write-Host "4. Set up .env file in server directory" -ForegroundColor White
Write-Host "5. Start servers: npm run dev (server) and npm start (client)" -ForegroundColor White
