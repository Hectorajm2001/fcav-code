# init.ps1 - Generador de proyectos FCAV CODE
# Uso: iex (irm "https://raw.githubusercontent.com/Hectorajm2001/fcav-code/master/pi/init.ps1")

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
            $res = Read-Host "  Selecciona una opcion (1-$($Options.Length))"
            if ($res -match "^\d+$" -and [int]$res -ge 1 -and [int]$res -le $Options.Length) {
                return $res
            }
        }
    }
    
    try { [Console]::CursorVisible = $true } catch {}
    return ($selectedIndex + 1).ToString()
}

Write-Header "FCAV CODE - CREADOR DE PROYECTOS"

# Nombre del proyecto
$projectName = ""
if ($env:FCAV_INIT_ARGS -and $env:FCAV_INIT_ARGS.Trim() -ne "") {
    $projectName = $env:FCAV_INIT_ARGS.Trim()
} else {
    while ([string]::IsNullOrWhiteSpace($projectName)) {
        $projectName = Read-Host "  [?] Nombre del proyecto"
    }
}

if (Test-Path $projectName) {
    Write-Log "ERR" "El directorio '$projectName' ya existe. Cancelando."
    exit 1
}

# Selección de plantilla
$plantillas = @(
    "ASP.NET Core MVC (Web Backend + Frontend)",
    ".NET MAUI (Aplicacion Movil iOS/Android)",
    "Node.js + Express (API REST Basica)",
    "Proyecto Vacio (Solo inyectar configuracion FCAV)"
)

$opcionPlantilla = Get-InteractiveMenu -Title "Selecciona la plantilla para el proyecto '$projectName':" -Options $plantillas

Write-Host ""
Write-Log "INFO" "Creando proyecto '$projectName'..."

# Crear andamiaje
switch ($opcionPlantilla) {
    "1" {
        dotnet new mvc -n $projectName -o $projectName | Out-Null
    }
    "2" {
        dotnet new maui -n $projectName -o $projectName | Out-Null
    }
    "3" {
        New-Item -ItemType Directory -Force -Path $projectName | Out-Null
        Set-Location $projectName
        npm init -y | Out-Null
        npm install express | Out-Null
        Set-Content -Path "index.js" -Value "const express = require('express');`nconst app = express();`n`napp.get('/', (req, res) => {`n  res.send('API FCAV funcionando');`n});`n`napp.listen(3000, () => {`n  console.log('Servidor en puerto 3000');`n});" -Encoding utf8
        Set-Location ..
    }
    "4" {
        New-Item -ItemType Directory -Force -Path $projectName | Out-Null
    }
}

Write-Log "OK" "Estructura generada."

# Inyectar reglas FCAV
Write-Log "INFO" "Inyectando Identidad FCAV (.agents) al proyecto..."
$agentsDir = "$projectName\.agents"
$skillsDir = "$agentsDir\skills\fcav-visual"

New-Item -ItemType Directory -Force -Path $agentsDir | Out-Null
New-Item -ItemType Directory -Force -Path $skillsDir | Out-Null

$agentsContent = @"
# FCAV CODE

Eres FCAV CODE, el asistente de programacion de la Facultad de Comercio y Administracion Victoria (FCAV), Universidad Autonoma de Tamaulipas (UAT).

## Idioma
- Responde siempre en espanol.
- Terminologia tecnica en ingles cuando sea estandar.

## Tono y Comportamiento Academico
- Profesional, academico y claro.
- Actuas como un profesor/tutor experto: ademas de dar el codigo, explica brevemente **por que** tomaste esa decision para que el alumno aprenda.
- Comenta el codigo de forma didactica.

## Seguridad e Identidad Institucional
- Protege credenciales. Usa siempre variables de entorno.
- Las interfaces de usuario deben adherirse al manual de identidad visual FCAV (usa la skill fcav-visual).
"@
Set-Content -Path "$agentsDir\AGENTS.md" -Value $agentsContent -Encoding utf8

$skillContent = @"
---
name: fcav-visual
description: Identidad visual, colores y directrices de UI de la Facultad de Comercio y Administracion Victoria (FCAV)
---

# Identidad Visual FCAV (UAT)

Cada vez que disenes o modifiques una interfaz grafica de usuario (UI), web, o movil, DEBES usar estrictamente la siguiente paleta de colores y lineamientos. No uses colores genericos si hay un color equivalente aqui.

## Colores Institucionales

- **Verde Principal (FCAV):** `#559C52` (Uso principal, botones, encabezados)
- **Verde Secundario (Border/Acento):** `#2E7D32`
- **Azul UAT (Opcional para acentos institucionales):** `#003D5C`
- **Naranja UAT (Opcional para advertencias):** `#D05F27`
- **Fondo Claro:** `#F5F5F4`
- **Superficie Blanca:** `#FFFFFF`
- **Texto Principal:** `#1A1A1A`
- **Texto Secundario (Muted):** `#77787C`
- **Color de Exito:** `#81C784`
- **Color de Error:** `#E74C3C`

## Instrucciones de Diseno
- Redondeo: Usa esquinas ligeramente redondeadas (border-radius: 8px) para mantener un aspecto moderno pero academico.
- Sombras: Sombras suaves para separar elementos de superficie.
- Tipografia: Si esta disponible, usa `Inter`, `Roboto` o tipografias sans-serif limpias.
"@
Set-Content -Path "$skillsDir\SKILL.md" -Value $skillContent -Encoding utf8

Write-Log "OK" "Identidad academica configurada."
Write-Host ""
Write-Host "  ✅ Proyecto '$projectName' listo." -ForegroundColor $C_SUCCESS
Write-Host ""
Write-Host "  Siguientes pasos:" -ForegroundColor $C_TEXT
Write-Host "    cd $projectName" -ForegroundColor $C_WARN
Write-Host "    fcavcode" -ForegroundColor $C_SUCCESS
Write-Host ""
