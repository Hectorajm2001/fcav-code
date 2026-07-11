# setup-fcav.ps1 - Instalador Unificado FCAV CODE
# Uso: irm https://raw.githubusercontent.com/Hectorajm2001/fcav-code/master/setup-fcav.ps1 | iex

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
$logoUrl = "https://raw.githubusercontent.com/Hectorajm2001/fcav-code/master/resources/fcav-logo.txt"
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

function Get-InteractiveMenu {
    param (
        [string]$Title,
        [string[]]$Options
    )
    
    Write-Host ""
    Write-Host "  $Title" -ForegroundColor $C_TEXT
    Write-Host "  (Usa flechas Arriba/Abajo y Enter para seleccionar)" -ForegroundColor $C_DIM
    
    $selectedIndex = 0
    
    for ($i = 0; $i -lt $Options.Length; $i++) { Write-Host "" }
    
    try { [Console]::CursorVisible = $false } catch {}

    $key = $null
    while ($true) {
        try { [Console]::SetCursorPosition(0, [Console]::CursorTop - $Options.Length) } catch {}
        
        for ($i = 0; $i -lt $Options.Length; $i++) {
            try { [Console]::SetCursorPosition(0, [Console]::CursorTop) } catch {}
            if ($i -eq $selectedIndex) {
                $line = "  > $($Options[$i])"
                Write-Host $line.PadRight(60) -ForegroundColor $C_SUCCESS
            } else {
                $line = "    $($Options[$i])"
                Write-Host $line.PadRight(60) -ForegroundColor $C_DIM
            }
        }
        
        try {
            $key = [System.Console]::ReadKey($true)
            if ($key.Key -eq 'UpArrow') {
                $selectedIndex = [Math]::Max(0, $selectedIndex - 1)
            } elseif ($key.Key -eq 'DownArrow') {
                $selectedIndex = [Math]::Min($Options.Length - 1, $selectedIndex + 1)
            } elseif ($key.Key -eq 'Enter') {
                break
            }
        } catch {
            try { [Console]::CursorVisible = $true } catch {}
            $res = Read-Host "  Selecciona una opcion (1 o 2)"
            if ($res -match "^[12]$") {
                return $res
            }
        }
    }
    
    try { [Console]::CursorVisible = $true } catch {}
    return ($selectedIndex + 1).ToString()
}

$opcion = Get-InteractiveMenu -Title "Motores de IA disponibles:" -Options @(
    "Pi       (Recomendado, comandos y herramientas)",
    "OpenCode (Version original legacy)"
)

if ($opcion -eq "1") {
    Write-Host ""
    Write-Log "INFO" "Iniciando instalacion de Pi..."
    $scriptUrl = "https://raw.githubusercontent.com/Hectorajm2001/fcav-code/master/pi/setup-fcav.ps1"
} else {
    Write-Host ""
    Write-Log "INFO" "Iniciando instalacion de OpenCode..."
    $scriptUrl = "https://raw.githubusercontent.com/Hectorajm2001/fcav-code/master/opencode/setup-fcav.ps1"
}

try {
    $script = Invoke-RestMethod $scriptUrl
    if ($script.Length -gt 0 -and $script[0] -eq [char]0xFEFF) { $script = $script.Substring(1) }
    Invoke-Expression $script
} catch {
    Write-Log "ERR" "Hubo un error al descargar o ejecutar el script de instalacion."
    exit 1
}
