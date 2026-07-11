# setup-fcav.ps1 — Instalador Unificado FCAV CODE
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
Write-Host "  Instalador Unificado de Agentes FCAV..." -ForegroundColor $Yellow
Write-Host ""
Write-Host "  Selecciona el motor que deseas instalar:" -ForegroundColor White
Write-Host "  [1] Pi (Recomendado, soporta comandos y herramientas avanzadas)" -ForegroundColor $Green
Write-Host "  [2] OpenCode (Versión original legacy)" -ForegroundColor White
Write-Host ""

$opcion = Read-Host "  Opción (1/2)"

if ($opcion -eq "1") {
    Write-Host "`n  Iniciando instalación de Pi..." -ForegroundColor $Yellow
    $scriptUrl = "https://raw.githubusercontent.com/Hectorajm2001/fcav-code/main/pi/setup-fcav.ps1"
    $script = Invoke-RestMethod $scriptUrl
    if ($script -match "^\xEF\xBB\xBF") { $script = $script.Substring(3) }
    if ($script.Length -gt 0 -and $script[0] -eq [char]0xFEFF) { $script = $script.Substring(1) }
    Invoke-Expression $script
} elseif ($opcion -eq "2") {
    Write-Host "`n  Iniciando instalación de OpenCode..." -ForegroundColor $Yellow
    $scriptUrl = "https://raw.githubusercontent.com/Hectorajm2001/fcav-code/main/opencode/setup-fcav.ps1"
    $script = Invoke-RestMethod $scriptUrl
    if ($script -match "^\xEF\xBB\xBF") { $script = $script.Substring(3) }
    if ($script.Length -gt 0 -and $script[0] -eq [char]0xFEFF) { $script = $script.Substring(1) }
    Invoke-Expression $script
} else {
    Write-Host "`n  Opción no válida. Cancelando." -ForegroundColor Red
    exit 1
}
