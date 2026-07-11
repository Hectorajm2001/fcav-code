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
Write-Host ""
Write-Host "  Instalando FCAV CODE..." -ForegroundColor $Yellow
Write-Host ""

# 1. Verificar Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Node.js no encontrado. Instala desde https://nodejs.org" -ForegroundColor Red
    exit 1
}

# 2. Instalar motor Pi
if (-not (Get-Command pi -ErrorAction SilentlyContinue)) {
    Write-Host "[1/4] Instalando motor de IA (Pi)..." -ForegroundColor $Yellow
    npm i -g @earendil-works/pi-coding-agent
} else {
    Write-Host "[1/4] Motor de IA ya instalado ✓" -ForegroundColor $Green
}

# 3. Preguntar IP del servidor
Write-Host "[2/4] Configuracion del servidor..." -ForegroundColor $Yellow
$serverIP = Read-Host "  IP del servidor LM Studio (ej: 192.168.1.100)"
if ([string]::IsNullOrWhiteSpace($serverIP)) {
    $serverIP = "localhost"
}
Write-Host "  Servidor configurado: http://${serverIP}:1234/v1" -ForegroundColor $Green

# 4. Clonar config FCAV (Logo y Agents)
Write-Host "[3/4] Configurando identidad FCAV CODE..." -ForegroundColor $Yellow
$configDir = "$env:USERPROFILE\.config\fcav"
$tempDir = "$env:TEMP\fcav-code-setup"

New-Item -ItemType Directory -Force -Path $configDir | Out-Null
New-Item -ItemType Directory -Force -Path $tempDir | Out-Null

$baseUrl = "https://raw.githubusercontent.com/Hectorajm2001/fcav-code/master/resources"
Invoke-WebRequest "$baseUrl/fcav-logo.txt" -OutFile "$configDir\fcav-logo.txt"

$baseUrlConfig = "https://raw.githubusercontent.com/Hectorajm2001/fcav-code/master/opencode/config"
Invoke-WebRequest "$baseUrlConfig/AGENTS.md" -OutFile "$configDir\AGENTS.md" -ErrorAction SilentlyContinue

# 5. Crear comando fcavcode
Write-Host "[4/4] Configurando comando 'fcavcode'..." -ForegroundColor $Yellow
try {
    $npmGlobal = npm root -g | Split-Path
    
    # Wrapper para CMD
    $wrapperCmd = "$npmGlobal\fcavcode.cmd"
    $cmdLines = @(
        "@echo off",
        "powershell -Command `"[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Write-Host (Get-Content '%USERPROFILE%\.config\fcav\fcav-logo.txt' -Raw -Encoding utf8) -ForegroundColor Green`"",
        "set OPENAI_API_KEY=lm-studio",
        "set OPENAI_BASE_URL=http://${serverIP}:1234/v1",
        "pi --provider openai --model qwen2.5-coder-32b-instruct %*"
    )
    $cmdLines | Out-File $wrapperCmd -Encoding utf8
    
    # Wrapper para PowerShell
    $wrapperPs1 = "$npmGlobal\fcavcode.ps1"
    $ps1Lines = @(
        "[Console]::OutputEncoding = [System.Text.Encoding]::UTF8",
        "Write-Host (Get-Content `"`$env:USERPROFILE\.config\fcav\fcav-logo.txt`" -Raw -Encoding utf8) -ForegroundColor Green",
        "`$env:OPENAI_API_KEY = `"lm-studio`"",
        "`$env:OPENAI_BASE_URL = `"http://${serverIP}:1234/v1`"",
        "pi --provider openai --model qwen2.5-coder-32b-instruct `$args"
    )
    $ps1Lines | Out-File $wrapperPs1 -Encoding utf8
    
    Write-Host "      Comando fcavcode creado ✓" -ForegroundColor $Green
} catch {
    Write-Host "      Advertencia: No se pudo crear el comando fcavcode globalmente." -ForegroundColor Yellow
}

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
