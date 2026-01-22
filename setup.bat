@echo off
setlocal
echo ==========================================
echo      AI Assistant - One-Time Setup v1.2
echo ==========================================

echo.
echo [1/4] Checking prerequisites...
python --version >nul 2>&1
if errorlevel 1 goto py_error
node --version >nul 2>&1
if errorlevel 1 goto node_error

echo.
echo [2/4] Installing Backend (Python)...
cd server
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)
call venv\Scripts\activate
if exist venv\lib\site-packages\fastapi goto skip_pip_install
echo Installing dependencies...
python -m pip install --upgrade pip
pip install -r requirements.txt
if errorlevel 1 goto pip_error
:skip_pip_install
echo Python dependencies verified.
cd ..

echo.
echo [3/4] Installing Frontend (React)...
cd client
if exist node_modules goto skip_node_install
echo Installing npm packages (this may take a few minutes)...
call npm install
if errorlevel 1 goto npm_error
:skip_node_install
echo Frontend modules verified.
cd ..

echo.
echo [4/4] Checking Local AI (Ollama)...
where ollama >nul 2>&1
if errorlevel 1 goto install_ollama
goto ollama_check_done

:install_ollama
echo Ollama not found. Attempting to auto-install via Winget...
winget install Ollama.Ollama
if errorlevel 1 goto ollama_error
echo.
echo ========================================================
echo  Ollama installed successfully!
echo.
echo  IMPORTANT: Windows needs to refresh to see the new tool.
echo  Please CLOSE this window and run 'setup.bat' ONE MORE TIME.
echo ========================================================
pause
exit /b

:ollama_check_done
echo.
echo Checking AI Model...
start /min "Ollama Service" cmd /c "ollama serve"
:: Wait for service to start
timeout /t 3 >nul

:: Check if model exists
ollama list | findstr "qwen:0.5b" >nul
if not errorlevel 1 (
    echo Model 'qwen:0.5b' is already available.
    goto setup_complete
)

echo Pulling default model 'qwen:0.5b' (this downloads ~400MB)...
call ollama pull qwen:0.5b

:setup_complete

echo.
echo ==========================================
echo        SETUP COMPLETE!
echo ==========================================
echo You can now run 'start_app.bat' to launch the assistant.
pause
exit /b

:py_error
echo Error: Python is not installed. Please install Python 3.8+ and try again.
pause
exit /b

:node_error
echo Error: Node.js is not installed. Please install Node.js v18+ and try again.
pause
exit /b

:pip_error
echo Failed to install Python dependencies.
pause
exit /b

:npm_error
echo Failed to install npm dependencies.
pause
exit /b

:ollama_error
echo.
echo [!] Could not auto-install Ollama.
echo Please download it manually from: https://ollama.com
pause
exit /b
