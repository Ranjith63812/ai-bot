@echo off
:: AI Assistant Startup Script v1.2
echo Starting AI Assistant...

:: Auto-Run Setup if Config Missing
if not exist "server\venv" (
    echo "[!] First time run detected (Backend missing). Running Setup..."
    call setup.bat
)
if not exist "client\node_modules" (
    echo "[!] First time run detected (Frontend missing). Running Setup..."
    call setup.bat
)

:: Start Backend
start "AI Backend" cmd /k "cd server && call venv\Scripts\activate && python -m uvicorn app.main:app --reload"

:: Start Frontend
start "AI Frontend" cmd /k "cd client && npm run dev"

echo Done! Backend running on port 8000, Frontend on port 5173.
pause
