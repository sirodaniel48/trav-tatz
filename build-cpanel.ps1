# 1. Run the Next.js Production Build
Write-Host "Starting Production Build..." -ForegroundColor Cyan
npm run build

# Check if build was successful
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed! Please fix the errors above." -ForegroundColor Red
    exit 1
}

# 2. Copy the required static files into the standalone directory
Write-Host "Copying static assets into the standalone folder..." -ForegroundColor Cyan
Copy-Item -Path "public" -Destination ".next\standalone\public" -Recurse -Force
Copy-Item -Path ".next\static" -Destination ".next\standalone\.next\static" -Recurse -Force

# 3. Zip the entire standalone folder for cPanel
Write-Host "Zipping files for cPanel deployment..." -ForegroundColor Cyan
# Remove old zip if it exists
if (Test-Path "cpanel-deploy.zip") {
    Remove-Item "cpanel-deploy.zip" -Force
}

Compress-Archive -Path ".next\standalone\*" -DestinationPath "cpanel-deploy.zip" -Force

Write-Host "Done! Your deployment package is ready: cpanel-deploy.zip" -ForegroundColor Green
Write-Host "Next Step: Upload cPanel-deploy.zip to your cPanel File Manager, extract it, and restart your Node.js app!" -ForegroundColor Yellow
