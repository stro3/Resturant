Write-Host "Starting Gastronome Restaurant Website..." -ForegroundColor Cyan
Write-Host ""

Write-Host "Starting Backend Server (Flask)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; python app.py"

Start-Sleep -Seconds 2

Write-Host "Starting Frontend Server (Next.js)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\nextjs-frontend'; npm run dev"

Write-Host ""
Write-Host "Both servers are starting!" -ForegroundColor Green
Write-Host ""
Write-Host "Backend:  http://localhost:5000" -ForegroundColor Magenta
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Magenta
Write-Host ""
Write-Host "Press any key to exit this window..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
