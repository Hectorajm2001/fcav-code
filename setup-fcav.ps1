# setup-fcav.ps1 - Instalador Unificado FCAV CODE
# Uso: irm https://raw.githubusercontent.com/Hectorajm2001/fcav-code/main/setup-fcav.ps1 | iex

$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$C_INFO    = "Cyan"
$C_SUCCESS = "Green"
$C_WARN    = "Yellow"
$C_ERROR   = "Red"
$C_TEXT    = "White"
$C_DIM     = "Gray"

function Write-Log {
    param([string]$Type, [string]$Message)
    if ($Type -eq "INFO") { Write-Host " [ * ] " -ForegroundColor $C_INFO -NoNewline }
    elseif ($Type -eq "OK")   { Write-Host " [ OK ] " -ForegroundColor $C_SUCCESS -NoNewline }
    elseif ($Type -eq "WARN") { Write-Host " [ !! ] " -ForegroundColor $C_WARN -NoNewline }
    elseif ($Type -eq "ERR")  { Write-Host " [ ERR ] " -ForegroundColor $C_ERROR -NoNewline }
    Write-Host $Message -ForegroundColor $C_TEXT
}

function Write-Header {
    param([string]$Title)
    Write-Host ""
    Write-Host " ========================================================" -ForegroundColor $C_DIM
    Write-Host "   $Title" -ForegroundColor $C_SUCCESS
    Write-Host " ========================================================" -ForegroundColor $C_DIM
    Write-Host ""
}

Clear-Host
$logoUrl = "https://raw.githubusercontent.com/Hectorajm2001/fcav-code/main/resources/fcav-logo.txt"
try {
    $logo = Invoke-RestMethod $logoUrl -ErrorAction SilentlyContinue
    if ($logo) { Write-Host $logo -ForegroundColor $C_SUCCESS }
} catch {}

Write-Header "INSTALADOR UNIFICADO FCAV CODE"

Write-Log "INFO" "Comprobando requisitos del sistema..."
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Log "ERR" "Node.js no esta instalado. Por favor instala Node.js (https://nodejs.org)."
    exit 1
}
Write-Log "OK" "Node.js detectado."

Write-Host ""
Write-Host "  Motores de IA disponibles:" -ForegroundColor $C_TEXT
Write-Host "  --------------------------------------------------------" -ForegroundColor $C_DIM
Write-Host "  [1] Pi       (Recomendado, comandos y herramientas)" -ForegroundColor $C_SUCCESS
Write-Host "  [2] OpenCode (Version original legacy)" -ForegroundColor $C_DIM
Write-Host "  --------------------------------------------------------" -ForegroundColor $C_DIM
Write-Host ""

$opcion = ""
while ($opcion -notmatch "^[12]$") {
    $opcion = Read-Host "  Selecciona una opcion (1 o 2)"
    if ($opcion -notmatch "^[12]$") {
        Write-Log "WARN" "Opcion no valida, intenta de nuevo."
    }
}

if ($opcion -eq "1") {
    Write-Host ""
    Write-Log "INFO" "Iniciando instalacion de Pi..."
    $scriptUrl = "https://raw.githubusercontent.com/Hectorajm2001/fcav-code/main/pi/setup-fcav.ps1"
} else {
    Write-Host ""
    Write-Log "INFO" "Iniciando instalacion de OpenCode..."
    $scriptUrl = "https://raw.githubusercontent.com/Hectorajm2001/fcav-code/main/opencode/setup-fcav.ps1"
}

try {
    $script = Invoke-RestMethod $scriptUrl
    if ($script.Length -gt 0 -and $script[0] -eq [char]0xFEFF) { $script = $script.Substring(1) }
    Invoke-Expression $script
} catch {
    Write-Log "ERR" "Hubo un error al descargar o ejecutar el script de instalacion."
    exit 1
}
