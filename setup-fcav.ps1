# setup-fcav.ps1 â€” Instalador Unificado FCAV CODE
# Uso: irm https://raw.githubusercontent.com/Hectorajm2001/fcav-code/main/setup-fcav.ps1 | iex

$ErrorActionPreference = "Stop"
$Green = "Green"
$Yellow = "Yellow"

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$logoUrl = "https://raw.githubusercontent.com/Hectorajm2001/fcav-code/main/resources/fcav-logo.txt"
try {
    $logo = Invoke-RestMethod $logoUrl -ErrorAction SilentlyContinue
    if ($logo) { Write-Host $logo -ForegroundColor $Green }
} catch {}

Write-Host ""
Write-Host "  Instalador Unificado de Agentes FCAV..." -ForegroundColor $Yellow
Write-Host ""
Write-Host "  Selecciona el motor que deseas instalar:" -ForegroundColor White
Write-Host "  [1] Pi (Recomendado, soporta comandos y herramientas avanzadas)" -ForegroundColor $Green
Write-Host "  [2] OpenCode (VersiÃ³n original legacy)" -ForegroundColor White
Write-Host ""

$opcion = Read-Host "  OpciÃ³n (1/2)"

if ($opcion -eq "1") {
    Write-Host "`n  Iniciando instalaciÃ³n de Pi..." -ForegroundColor $Yellow
    $scriptUrl = "https://raw.githubusercontent.com/Hectorajm2001/fcav-code/main/pi/setup-fcav.ps1"
    $script = Invoke-RestMethod $scriptUrl
    if ($script.Length -gt 0 -and $script[0] -eq [char]0xFEFF) { $script = $script.Substring(1) }
    Invoke-Expression $script
} elseif ($opcion -eq "2") {
    Write-Host "`n  Iniciando instalaciÃ³n de OpenCode..." -ForegroundColor $Yellow
    $scriptUrl = "https://raw.githubusercontent.com/Hectorajm2001/fcav-code/main/opencode/setup-fcav.ps1"
    $script = Invoke-RestMethod $scriptUrl
    if ($script.Length -gt 0 -and $script[0] -eq [char]0xFEFF) { $script = $script.Substring(1) }
    Invoke-Expression $script
} else {
    Write-Host "`n  OpciÃ³n no vÃ¡lida. Cancelando." -ForegroundColor Red
    exit 1
}
