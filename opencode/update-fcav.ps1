# update-fcav.ps1 — Actualiza OpenCode e inyecta identidad FCAV CODE
# Uso: fcavcode update (o irm https://raw.githubusercontent.com/Hectorajm2001/fcav-code/master/opencode/update-fcav.ps1 | iex)

$ErrorActionPreference = "Continue"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$Green = "Green"
$Yellow = "Yellow"
$White = "White"

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
Write-Host "        Facultad de Comercio " -ForegroundColor $Yellow
Write-Host "                 y           " -ForegroundColor $Yellow
Write-Host "       Administración Victoria" -ForegroundColor $Yellow
Write-Host ""
Write-Host "========================================================" -ForegroundColor DarkGray
Write-Host "   FCAV CODE — Actualizador y Parcheador" -ForegroundColor $Green
Write-Host "========================================================" -ForegroundColor DarkGray
Write-Host ""

# 1. Actualizar motor OpenCode desde npm
Write-Host "[1/3] Actualizando motor de IA (OpenCode) desde npm..." -ForegroundColor $Yellow
try {
    npm install -g opencode-ai@latest
    Write-Host "      Motor actualizado correctamente ✓" -ForegroundColor $Green
} catch {
    Write-Host "      Advertencia: No se pudo actualizar vía npm o ya está en la última versión." -ForegroundColor Yellow
}

# 2. Descargar / actualizar configs y tema FCAV
Write-Host ""
Write-Host "[2/3] Sincronizando identidad visual y temas FCAV..." -ForegroundColor $Yellow
$configDir = "$env:USERPROFILE\.config\opencode"
$themesDir = "$configDir\themes"
$tempDir = "$env:TEMP\fcav-update-$([Guid]::NewGuid().ToString('N'))"

New-Item -ItemType Directory -Force -Path $themesDir | Out-Null
New-Item -ItemType Directory -Force -Path $tempDir | Out-Null

$baseUrl = "https://raw.githubusercontent.com/Hectorajm2001/fcav-code/master/opencode/config"
try {
    Invoke-WebRequest "$baseUrl/tui.json" -OutFile "$configDir\tui.json" -ErrorAction SilentlyContinue
    Invoke-WebRequest "$baseUrl/fcav-logo.txt" -OutFile "$configDir\fcav-logo.txt" -ErrorAction SilentlyContinue
    Invoke-WebRequest "$baseUrl/themes/fcav.json" -OutFile "$themesDir\fcav.json" -ErrorAction SilentlyContinue
    Invoke-WebRequest "$baseUrl/themes/fcav-light.json" -OutFile "$themesDir\fcav-light.json" -ErrorAction SilentlyContinue
    Invoke-WebRequest "$baseUrl/AGENTS.md" -OutFile "$configDir\AGENTS.md" -ErrorAction SilentlyContinue
} catch {}

# 3. Reinyectar logotipo y colores FCAV en los binarios
Write-Host ""
Write-Host "[3/3] Inyectando logotipo y colores FCAV en los binarios..." -ForegroundColor $Yellow
$patchScript = "$tempDir\patch-logo.js"
try {
    Invoke-WebRequest "https://raw.githubusercontent.com/Hectorajm2001/fcav-code/master/opencode/patch-logo.js" -OutFile $patchScript -ErrorAction SilentlyContinue
} catch {}

if (-not (Test-Path $patchScript)) {
    # Fallback local si existe en el proyecto
    if (Test-Path "$PSScriptRoot\patch-logo.js") {
        Copy-Item "$PSScriptRoot\patch-logo.js" $patchScript -Force
    }
}

if (Test-Path $patchScript) {
    node $patchScript
} else {
    Write-Host "      No se pudo obtener el script de inyección." -ForegroundColor Yellow
}

Remove-Item $tempDir -Recurse -Force -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "========================================================" -ForegroundColor DarkGray
Write-Host "   ✅ FCAV CODE actualizado e inyectado con éxito" -ForegroundColor $Green
Write-Host "========================================================" -ForegroundColor DarkGray
Write-Host ""
