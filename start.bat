@echo off
echo Starting Gastronome Restaurant Website...
echo.

echo Starting Backend Server (Flask)...
start cmd /k "cd /d %~dp0backend && python app.py"

timeout /t 2 /nobreak > nul

echo Starting Frontend Server (Next.js)...
start cmd /k "cd /d %~dp0nextjs-frontend && npm run dev"

echo.
echo Both servers are starting!
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
pause
