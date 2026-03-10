@echo off
title AE Scripts Market - Dev Server

echo.
echo ========================================
echo    AE Scripts Market - Dev Server
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo [Checking] First run, installing dependencies...
    echo.
    call npm install
    if errorlevel 1 (
        echo.
        echo [Error] Failed to install dependencies! Please check your network.
        echo.
        pause
        exit /b 1
    )
    echo.
    echo [Success] Dependencies installed!
    echo.
)

echo [Starting] Starting development server...
echo.
echo The server will open in your browser automatically
echo Or visit: http://localhost:5173
echo Press Ctrl+C to stop the server
echo.
echo ========================================
echo.

call npm run dev

if errorlevel 1 (
    echo.
    echo [Error] Failed to start server!
    echo.
    pause
    exit /b 1
)