# iniciar-fcavcode.ps1 - Lanzador para FCAV CODE
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
Set-Location $PSScriptRoot

$env:PATH = "$env:APPDATA\npm;$env:LOCALAPPDATA\Programs\nodejs;C:\Program Files\nodejs;$env:PATH"

if ($args.Length -gt 0 -and $args[0] -eq "update") {
    node "$PSScriptRoot\opencode\update-fcav.js" $args
    Read-Host "Presione Enter para continuar..."
    exit $LASTEXITCODE
}

Write-Host "========================================================" -ForegroundColor DarkGray
Write-Host "  Iniciando FCAV CODE..." -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor DarkGray

$opencodeExe = "$env:APPDATA\npm\node_modules\opencode-ai\bin\opencode.exe"
if (Test-Path $opencodeExe) {
    & $opencodeExe $args
} else {
    opencode $args
}
