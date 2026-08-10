@echo off
echo Starting ArtNaija local development servers...

start "ArtNaija - Backend" cmd /k "cd Backend && npm run start"
timeout /t 2 /nobreak >nul

start "ArtNaija - Frontend" cmd /k "cd frontend && npm run dev"
timeout /t 2 /nobreak >nul

start "ArtNaija - Admin" cmd /k "cd admin && npm run dev"

echo All three servers launching in separate windows.
echo Backend, Frontend, and Admin terminals are now open.
