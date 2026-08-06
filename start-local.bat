@echo off
echo Starting Charity Project Services...
start cmd /k "cd Backend && npm run dev"
start cmd /k "cd frontend && npm run dev"
start cmd /k "cd admin && npm run dev"
echo All services are starting in separate windows.
pause
