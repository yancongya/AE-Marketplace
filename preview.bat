@echo off
title AE Scripts Market - Preview Production Build

echo.
echo ========================================
echo    AE Scripts Market - Preview
echo ========================================
echo.

REM Check if dist directory exists
if not exist "dist" (
    echo [Info] dist directory not found, need to build first
    echo.
    set /p build_choice="Build now? (Y/N): "
    if /i "%build_choice%"=="Y" (
        echo.
        echo [Building] Building project...
        echo.
        call npm run build
        if errorlevel 1 (
            echo.
            echo [Error] Build failed!
            echo.
            pause
            exit /b 1
        )
        echo.
        echo [Success] Build complete!
        echo.
    ) else (
        echo.
        echo [Cancelled] Operation cancelled
        echo.
        pause
        exit /b 0
    )
)

echo [Starting] Starting preview server...
echo.
echo The preview will open in your browser automatically
echo Or visit: http://localhost:4173
echo Press Ctrl+C to stop the server
echo.
echo ========================================
echo.

call npm run preview

if errorlevel 1 (
    echo.
    echo [Error] Failed to start preview server!
    echo.
    pause
    exit /b 1
)