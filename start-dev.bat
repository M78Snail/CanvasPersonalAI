@echo off
setlocal

:: Always open in new window and keep it open
if "%~1"=="runservice" goto runservice
cmd /k ""%~f0" runservice"
exit /b

:runservice
chcp 65001 >nul
title AI Canvas - Development Server

echo.
echo ==========================================
echo    AI Canvas - Development Server
echo ==========================================
echo.

cd /d "%~dp0"
echo Project directory: %CD%
echo.

echo [1/6] Checking Node.js...
where node >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not found!
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do echo Node: %%i
for /f "tokens=*" %%i in ('npm --version') do echo npm: %%i
echo OK.
echo.

echo [2/6] Checking port 5173...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5173" ^| findstr "LISTENING" 2^>nul') do (
    echo Killing process %%a...
    taskkill /F /PID %%a >nul 2>&1
    timeout /t 2 /nobreak >nul
)
echo OK.
echo.

echo [3/6] Checking dependencies...
if not exist "node_modules" (
    echo node_modules not found, running npm install...
    echo This may take a few minutes...
    call npm install
    if errorlevel 1 (
        echo ERROR: npm install failed
        pause
        exit /b 1
    )
) else (
    echo node_modules found.
)
echo OK.
echo.

echo [4/6] Ready to start server...
echo Server URL: http://localhost:5173/huobao-canvas
echo.

echo [5/6] Opening browser...
start "" http://localhost:5173/huobao-canvas
timeout /t 2 /nobreak >nul

echo.
echo [6/6] Starting dev server...
echo ==========================================
echo.

call npm run dev

echo.
echo Server has exited.
pause
