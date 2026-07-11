#!/bin/bash
# init.sh - Generador de proyectos FCAV CODE
# Uso: curl -fsSL https://raw.githubusercontent.com/Hectorajm2001/fcav-code/master/pi/init.sh | bash

set -e

C_INFO="\033[0;36m"
C_SUCCESS="\033[0;32m"
C_WARN="\033[0;33m"
C_ERROR="\033[0;31m"
C_TEXT="\033[1;37m"
C_DIM="\033[0;90m"
NC="\033[0m"

log_info() { echo -e " [ ${C_INFO}*${NC} ] ${C_TEXT}$1${NC}"; }
log_ok() { echo -e " [ ${C_SUCCESS}OK${NC} ] ${C_TEXT}$1${NC}"; }
log_warn() { echo -e " [ ${C_WARN}!!${NC} ] ${C_TEXT}$1${NC}"; }
log_err() { echo -e " [ ${C_ERROR}ERR${NC} ] ${C_TEXT}$1${NC}"; }

print_header() {
    echo ""
    echo -e "${C_DIM} ========================================================${NC}"
    echo -e "   ${C_SUCCESS}$1${NC}"
    echo -e "${C_DIM} ========================================================${NC}"
    echo ""
}

get_interactive_menu() {
    local prompt="$1"
    shift
    local options=("$@")
    local selected=0

    echo ""
    echo -e "  ${C_TEXT}$prompt${NC}"
    echo -e "  ${C_DIM}(Usa flechas Arriba/Abajo y Enter para seleccionar)${NC}"
    
    for i in "${!options[@]}"; do echo ""; done

    if [ -t 0 ]; then
        tput civis
        stty -echo -icanon
        
        while true; do
            tput cuu ${#options[@]}
            
            for i in "${!options[@]}"; do
                tput el
                if [ $i -eq $selected ]; then
                    echo -e "  > ${C_SUCCESS}${options[$i]}${NC}"
                else
                    echo -e "    ${C_DIM}${options[$i]}${NC}"
                fi
            done
            
            read -rsn1 key
            if [[ $key == $'\x1b' ]]; then
                read -rsn2 key
                if [[ $key == "[A" ]]; then
                    ((selected--))
                    if [ $selected -lt 0 ]; then selected=0; fi
                elif [[ $key == "[B" ]]; then
                    ((selected++))
                    if [ $selected -ge ${#options[@]} ]; then selected=$((${#options[@]} - 1)); fi
                fi
            elif [[ $key == "" ]]; then
                break
            fi
        done
        
        stty echo icanon
        tput cnorm
        return $selected
    else
        for i in "${!options[@]}"; do
            echo "  $((i+1)). ${options[$i]}"
        done
        read -p "  Selecciona una opcion (1-${#options[@]}): " sel
        if [[ "$sel" =~ ^[0-9]+$ ]] && [ "$sel" -ge 1 ] && [ "$sel" -le "${#options[@]}" ]; then
            return $((sel-1))
        else
            return 0
        fi
    fi
}

print_header "FCAV CODE - CREADOR DE PROYECTOS"

project_name=""
if [ -n "$FCAV_INIT_ARGS" ]; then
    project_name="$FCAV_INIT_ARGS"
else
    while [ -z "$project_name" ]; do
        read -p "  [?] Nombre del proyecto: " project_name
    done
fi

if [ -d "$project_name" ]; then
    log_err "El directorio '$project_name' ya existe. Cancelando."
    exit 1
fi

plantillas=(
    "ASP.NET Core MVC (Web Backend + Frontend)"
    ".NET MAUI (Aplicacion Movil iOS/Android)"
    "Node.js + Express (API REST Basica)"
    "Proyecto Vacio (Solo inyectar configuracion FCAV)"
)

get_interactive_menu "Selecciona la plantilla para el proyecto '$project_name':" "${plantillas[@]}"
opcion_plantilla=$?

echo ""
log_info "Creando proyecto '$project_name'..."

case $opcion_plantilla in
    0)
        dotnet new mvc -n "$project_name" -o "$project_name" >/dev/null
        ;;
    1)
        dotnet new maui -n "$project_name" -o "$project_name" >/dev/null
        ;;
    2)
        mkdir -p "$project_name"
        cd "$project_name"
        npm init -y >/dev/null
        npm install express >/dev/null
        cat << 'EOF' > index.js
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('API FCAV funcionando');
});

app.listen(3000, () => {
  console.log('Servidor en puerto 3000');
});
EOF
        cd ..
        ;;
    3)
        mkdir -p "$project_name"
        ;;
esac

log_ok "Estructura generada."

log_info "Inyectando Identidad FCAV (.agents) al proyecto..."
agents_dir="$project_name/.agents"
skills_dir="$agents_dir/skills/fcav-visual"

mkdir -p "$agents_dir"
mkdir -p "$skills_dir"

cat << 'EOF' > "$agents_dir/AGENTS.md"
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
EOF

cat << 'EOF' > "$skills_dir/SKILL.md"
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
EOF

log_ok "Identidad academica configurada."
echo ""
echo -e "  ${C_SUCCESS}✅ Proyecto '$project_name' listo.${NC}"
echo ""
echo -e "  ${C_TEXT}Siguientes pasos:${NC}"
echo -e "    ${C_WARN}cd $project_name${NC}"
echo -e "    ${C_SUCCESS}fcavcode${NC}"
echo ""
