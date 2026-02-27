# GatiSathi - Quick Push Script
# Usage: Right-click > Run with PowerShell, OR run: .\push.ps1 "your message"

$env:PATH = $env:PATH + ";C:\Program Files\Git\bin"

# Get commit message from argument or prompt
if ($args.Count -gt 0) {
    $msg = $args[0]
} else {
    $msg = Read-Host "Enter commit message (or press Enter for auto)"
    if ([string]::IsNullOrWhiteSpace($msg)) {
        $msg = "Update: $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
    }
}

Write-Host "`n📦 Staging all changes..." -ForegroundColor Cyan
git add .

$status = git status --short
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "✅ Nothing to commit - repo is already up to date!" -ForegroundColor Green
    exit 0
}

Write-Host "📝 Committing: $msg" -ForegroundColor Cyan
git commit -m $msg

Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Cyan
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Successfully pushed to https://github.com/aayush8203/GathiSathi" -ForegroundColor Green
} else {
    Write-Host "`n❌ Push failed. Please check your internet connection or GitHub credentials." -ForegroundColor Red
}
