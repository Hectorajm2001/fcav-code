# setup-fcav.ps1 — Instala FCAV CODE en un comando
# Uso: irm https://raw.githubusercontent.com/Hectorajm2001/fcav-code/master/setup-fcav.ps1 | iex

$ErrorActionPreference = "Stop"
$Green = "Green"
$Yellow = "Yellow"

Write-Host ""
Write-Host "  ███████╗ ██████╗ █████╗ ██╗   ██╗" -ForegroundColor $Green
Write-Host "  ██╔════╝██╔════╝██╔══██╗██║   ██║" -ForegroundColor $Green
Write-Host "  █████╗  ██║     ███████║██║   ██║" -ForegroundColor $Green
Write-Host "  ██╔══╝  ██║     ██╔══██║╚██╗ ██╔╝" -ForegroundColor $Green
Write-Host "  ██║     ╚██████╗██║  ██║ ╚████╔╝ " -ForegroundColor $Green
Write-Host "  ╚═╝      ╚═════╝╚═╝  ╚═╝  ╚═══╝ " -ForegroundColor $Green
Write-Host "   ██████╗ ██████╗ ██████╗ ███████╗" -ForegroundColor $Green
Write-Host "  ██╔════╝██╔═══██╗██╔══██╗██╔════╝" -ForegroundColor $Green
Write-Host "  ██║     ██║   ██║██║  ██║█████╗  " -ForegroundColor $Green
Write-Host "  ██║     ██║   ██║██║  ██║██╔══╝  " -ForegroundColor $Green
Write-Host "  ╚██████╗╚██████╔╝██████╔╝███████╗" -ForegroundColor $Green
Write-Host "   ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝" -ForegroundColor $Green
Write-Host "        Facultad de Comercio " -ForegroundColor $Green
Write-Host "                 y           " -ForegroundColor $Green
Write-Host "       Administración Victoria" -ForegroundColor $Green
Write-Host ""
Write-Host "  Instalando FCAV CODE..." -ForegroundColor $Yellow
Write-Host ""

# 1. Verificar Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Node.js no encontrado. Instala desde https://nodejs.org" -ForegroundColor Red
    Read-Host "Presiona Enter para salir..."
    exit 1
}

# 2. Instalar OpenCode
if (-not (Get-Command opencode -ErrorAction SilentlyContinue)) {
    Write-Host "[1/4] Instalando motor de IA..." -ForegroundColor $Yellow
    npm i -g opencode-ai
} else {
    Write-Host "[1/4] Motor de IA ya instalado ✓" -ForegroundColor $Green
}

# 3. Crear comando fcavcode
Write-Host "[2/4] Configurando comando 'fcavcode'..." -ForegroundColor $Yellow
try {
    $npmGlobal = npm root -g | Split-Path
    
    # Wrapper para CMD
    $wrapperCmd = "$npmGlobal\fcavcode.cmd"
    @"
@echo off
if /i "%~1"=="update" (
    powershell -NoProfile -ExecutionPolicy Bypass -Command "Invoke-Expression (Invoke-RestMethod 'https://raw.githubusercontent.com/Hectorajm2001/fcav-code/master/opencode/update-fcav.ps1' -ErrorAction SilentlyContinue); if (`$?) { exit 0 } else { node '%USERPROFILE%\.config\opencode\update-fcav.js' %* }"
    if %ERRORLEVEL% neq 0 (
        set "CONFIG_DIR=%USERPROFILE%\.config\opencode"
        if exist "%CONFIG_DIR%\update-fcav.js" (
            node "%CONFIG_DIR%\update-fcav.js" %*
        ) else if exist "%CONFIG_DIR%\patch-logo.js" (
            npm i -g opencode-ai@latest
            node "%CONFIG_DIR%\patch-logo.js"
        )
    )
    exit /b %ERRORLEVEL%
)

if not exist ".opencode" mkdir ".opencode"
if not exist ".opencode\tui.json" copy "%USERPROFILE%\.config\opencode\tui.json" ".opencode\tui.json" >nul
if not exist ".opencode\themes" xcopy "%USERPROFILE%\.config\opencode\themes" ".opencode\themes" /E /I /Q >nul

set "PATH=%APPDATA%\npm;%LOCALAPPDATA%\Programs\nodejs;C:\Program Files\nodejs;%PATH%"
set "OPENCODE_EXE=%APPDATA%\npm\node_modules\opencode-ai\bin\opencode.exe"

if exist "%OPENCODE_EXE%" (
    "%OPENCODE_EXE%" %*
) else (
    call opencode %*
)
"@ | Out-File $wrapperCmd -Encoding utf8
    
    # Wrapper para PowerShell
    $wrapperPs1 = "$npmGlobal\fcavcode.ps1"
    @"
param(
    [Parameter(ValueFromRemainingArguments = `$true)]
    [string[]]`$Arguments
)

`$firstArg = if (`$Arguments.Length -gt 0) { `$Arguments[0] } else { "" }

if (`$firstArg -eq "update") {
    `$updateUrl = "https://raw.githubusercontent.com/Hectorajm2001/fcav-code/master/opencode/update-fcav.ps1"
    try {
        `$script = Invoke-RestMethod `$updateUrl -ErrorAction Stop
        if (`$script.Length -gt 0 -and `$script[0] -eq [char]0xFEFF) { `$script = `$script.Substring(1) }
        Invoke-Expression `$script
        exit 0
    } catch {
        `$localUpdate = "`$env:USERPROFILE\.config\opencode\update-fcav.js"
        if (Test-Path `$localUpdate) {
            node `$localUpdate
            exit 0
        }
        `$localPatch = "`$env:USERPROFILE\.config\opencode\patch-logo.js"
        if (Test-Path `$localPatch) {
            npm i -g opencode-ai@latest
            node `$localPatch
            exit 0
        }
    }
}

`$configDir = "`$env:USERPROFILE\.config\opencode"
try {
    if (!(Test-Path ".opencode")) { New-Item -ItemType Directory -Force -Path ".opencode" -ErrorAction Stop | Out-Null }
    if (!(Test-Path ".opencode\tui.json") -and (Test-Path "`$configDir\tui.json")) { Copy-Item "`$configDir\tui.json" ".opencode\tui.json" -ErrorAction Stop }
    if (!(Test-Path ".opencode\themes") -and (Test-Path "`$configDir\themes")) { Copy-Item "`$configDir\themes" ".opencode\themes" -Recurse -ErrorAction Stop }
} catch {}

`$env:PATH = "`$env:APPDATA\npm;`$env:LOCALAPPDATA\Programs\nodejs;C:\Program Files\nodejs;`$env:PATH"
`$opencodeExe = "`$env:APPDATA\npm\node_modules\opencode-ai\bin\opencode.exe"

if (Test-Path `$opencodeExe) {
    & `$opencodeExe `$Arguments
} else {
    opencode `$Arguments
}
"@ | Out-File $wrapperPs1 -Encoding utf8
    
    Write-Host "      Comando fcavcode creado ✓" -ForegroundColor $Green
} catch {
    Write-Host "      Advertencia: No se pudo crear el comando fcavcode globalmente." -ForegroundColor Yellow
}

# 4. Clonar config FCAV
Write-Host "[3/4] Configurando identidad FCAV CODE..." -ForegroundColor $Yellow
$configDir = "$env:USERPROFILE\.config\opencode"
$themesDir = "$configDir\themes"
$tempDir = "$env:TEMP\fcav-code-setup"

New-Item -ItemType Directory -Force -Path $themesDir | Out-Null
New-Item -ItemType Directory -Force -Path $tempDir | Out-Null

$baseUrl = "https://raw.githubusercontent.com/Hectorajm2001/fcav-code/master/opencode/config"
Invoke-WebRequest "$baseUrl/tui.json" -OutFile "$configDir\tui.json"
Invoke-WebRequest "$baseUrl/fcav-logo.txt" -OutFile "$configDir\fcav-logo.txt"
Invoke-WebRequest "$baseUrl/themes/fcav.json" -OutFile "$themesDir\fcav.json"
Invoke-WebRequest "$baseUrl/themes/fcav-light.json" -OutFile "$themesDir\fcav-light.json"
Invoke-WebRequest "$baseUrl/AGENTS.md" -OutFile "$configDir\AGENTS.md"

# 4.1. Aplicar identidad visual FCAV al ejecutable de OpenCode
Write-Host "      Personalizando identidad visual (FCAV Logo)..." -ForegroundColor $Yellow
try {
    $patchScript = "$tempDir\patch-logo.js"
    Invoke-WebRequest "https://raw.githubusercontent.com/Hectorajm2001/fcav-code/master/opencode/patch-logo.js" -OutFile $patchScript -ErrorAction SilentlyContinue
    if (Test-Path $patchScript) {
        node $patchScript | Out-Null
        Write-Host "      Logo de FCAV CODE aplicado al motor ✓" -ForegroundColor $Green
    }
} catch {
    # Ignorar si no se pudo aplicar el parche binario
}

# 5. Preguntar IP del servidor
Write-Host "[4/4] Configuracion del servidor..." -ForegroundColor $Yellow
$serverIP = Read-Host "  IP del servidor LM Studio (ej: 192.168.1.100)"
if ([string]::IsNullOrWhiteSpace($serverIP)) {
    $serverIP = "localhost"
}
Write-Host "  Servidor configurado: http://${serverIP}:1234/v1" -ForegroundColor $Green

# Guardar IP en config global
$opencodeJson = @{
    '$schema' = "https://opencode.ai/config.json"
    provider = @{
        lmstudio = @{
            npm = "@ai-sdk/openai-compatible"
            name = "LM Studio (FCAV Intranet)"
            options = @{ baseURL = "http://${serverIP}:1234/v1" }
            models = @{
                "local-model" = @{ model = "local-model" }
            }
        }
    }
    model = "lmstudio/local-model"
} | ConvertTo-Json -Depth 5
$opencodeJson | Out-File "$configDir\opencode.json" -Encoding utf8

Remove-Item $tempDir -Recurse -Force -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "  ✅ FCAV CODE instalado correctamente" -ForegroundColor $Green
Write-Host ""
Write-Host "  Para usar:" -ForegroundColor White
Write-Host "    1. Abre terminal en tu proyecto" -ForegroundColor White
Write-Host "    2. Escribe: fcavcode" -ForegroundColor $Green
Write-Host ""
Write-Host "  Para iniciar un nuevo proyecto FCAV:" -ForegroundColor White
Write-Host "    git clone https://github.com/Hectorajm2001/fcav-code" -ForegroundColor $Yellow
Write-Host "    Copia project-template/ como base de tu proyecto" -ForegroundColor White
Write-Host ""
