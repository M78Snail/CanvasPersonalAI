@echo off
chcp 65001 >nul
title AI Canvas - Development Server

REM AI Canvas - Development Server Startup Script
REM Windows

set PORT=5173
set "PROJECT_DIR=%~dp0"

echo ==========================================
echo    AI Canvas - Development Server
echo ==========================================
echo.

REM Check and kill process on port
echo Checking port %PORT%...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :%PORT% ^| findstr LISTENING') do (
    echo Port %PORT% is in use by PID %%a. Killing process...
    taskkill /F /PID %%a >nul 2>&1
    timeout /t 2 /nobreak >nul
)

REM Navigate to project directory
cd /d "%PROJECT_DIR%"

REM Check if node_modules exists
if not exist "node_modules" (
    echo node_modules not found. Installing dependencies...
    where pnpm >nul 2>&1
    if %ERRORLEVEL% equ 0 (
        pnpm install
    ) else (
        npm install
    )
)

REM Start development server
echo.
echo Starting development server...
echo Project directory: %PROJECT_DIR%
echo Server will be available at: http://localhost:%PORT%
echo.
echo Press Ctrl+C to stop the server
echo ==========================================
echo.

REM Open browser after a short delay
start "" /min cmd /c "timeout /t 4 /nobreak >nul && start http://localhost:%PORT%"

REM Start the dev server
where pnpm >nul 2>&1
if %ERRORLEVEL% equ 0 (
    pnpm dev
) else (
    npm run dev
)
