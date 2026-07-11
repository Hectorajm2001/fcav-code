# setup-fcav.ps1 — Instala FCAV CODE en un comando
# Uso: irm https://raw.githubusercontent.com/Hectorajm2001/fcav-code/main/setup-fcav.ps1 | iex

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
if not exist ".opencode" mkdir ".opencode"
if not exist ".opencode\tui.json" copy "%USERPROFILE%\.config\opencode\tui.json" ".opencode\tui.json" >nul
if not exist ".opencode\themes" xcopy "%USERPROFILE%\.config\opencode\themes" ".opencode\themes" /E /I /Q >nul
opencode %*
"@ | Out-File $wrapperCmd -Encoding utf8
    
    # Wrapper para PowerShell
    $wrapperPs1 = "$npmGlobal\fcavcode.ps1"
    @"
`$configDir = "`$env:USERPROFILE\.config\opencode"
if (!(Test-Path ".opencode")) { New-Item -ItemType Directory -Force -Path ".opencode" | Out-Null }
if (!(Test-Path ".opencode\tui.json")) { Copy-Item "`$configDir\tui.json" ".opencode\tui.json" }
if (!(Test-Path ".opencode\themes")) { Copy-Item "`$configDir\themes" ".opencode\themes" -Recurse }
opencode `$args
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

$baseUrl = "https://raw.githubusercontent.com/Hectorajm2001/fcav-code/main/config"
Invoke-WebRequest "$baseUrl/tui.json" -OutFile "$configDir\tui.json"
Invoke-WebRequest "$baseUrl/fcav-logo.txt" -OutFile "$configDir\fcav-logo.txt"
Invoke-WebRequest "$baseUrl/themes/fcav.json" -OutFile "$themesDir\fcav.json"
Invoke-WebRequest "$baseUrl/AGENTS.md" -OutFile "$configDir\AGENTS.md"

# 5. Preguntar IP del servidor
Write-Host "[4/4] Configuración del servidor..." -ForegroundColor $Yellow
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
                "qwen2.5-coder-32b" = @{ model = "qwen2.5-coder-32b-instruct" }
            }
        }
    }
    model = "lmstudio/qwen2.5-coder-32b"
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
