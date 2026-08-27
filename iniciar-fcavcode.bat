@echo off
chcp 65001 >nul
title FCAV CODE
cd /d "%~dp0"

set "PATH=%APPDATA%\npm;%LOCALAPPDATA%\Programs\nodejs;C:\Program Files\nodejs;%PATH%"

if /i "%~1"=="update" (
    node "%~dp0opencode\update-fcav.js" %*
    pause
    exit /b %ERRORLEVEL%
)

echo ========================================================
echo   Iniciando FCAV CODE...
echo ========================================================

set "OPENCODE_EXE=%APPDATA%\npm\node_modules\opencode-ai\bin\opencode.exe"

if exist "%OPENCODE_EXE%" (
    "%OPENCODE_EXE%" %*
) else (
    call opencode %*
)

if %ERRORLEVEL% neq 0 (
    echo.
    echo El proceso finalizo con codigo: %ERRORLEVEL%
    pause
)
