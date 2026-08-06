@echo off
echo Building and Starting Charity Project in Docker...
docker-compose down
docker-compose up --build -d
echo.
echo Services are running:
echo - Frontend: http://localhost:5173
echo - Admin: http://localhost:5174
echo - Backend: http://localhost:5000/health
echo.
docker-compose ps
pause
