#!/bin/bash
# setup-fcav.sh - Instalador Unificado FCAV CODE
# Uso: curl -fsSL https://raw.githubusercontent.com/Hectorajm2001/fcav-code/main/setup-fcav.sh | bash

set -e

C_INFO='\033[0;36m'
C_SUCCESS='\033[0;32m'
C_WARN='\033[1;33m'
C_ERROR='\033[0;31m'
C_TEXT='\033[1;37m'
C_DIM='\033[0;90m'
NC='\033[0m'

write_log() {
    local type=$1
    local message=$2
    if [ "$type" = "INFO" ]; then echo -e " ${C_INFO}[ * ]${NC} ${C_TEXT}${message}${NC}"
    elif [ "$type" = "OK" ];   then echo -e " ${C_SUCCESS}[ OK ]${NC} ${C_TEXT}${message}${NC}"
    elif [ "$type" = "WARN" ]; then echo -e " ${C_WARN}[ !! ]${NC} ${C_TEXT}${message}${NC}"
    elif [ "$type" = "ERR" ];  then echo -e " ${C_ERROR}[ ERR ]${NC} ${C_TEXT}${message}${NC}"
    fi
}

write_header() {
    local title=$1
    echo -e ""
    echo -e " ${C_DIM}========================================================${NC}"
    echo -e "   ${C_SUCCESS}${title}${NC}"
    echo -e " ${C_DIM}========================================================${NC}"
    echo -e ""
}

clear
echo -e "${C_SUCCESS}"
curl -fsSL https://raw.githubusercontent.com/Hectorajm2001/fcav-code/main/resources/fcav-logo.txt || true
echo -e "${NC}"

write_header "INSTALADOR UNIFICADO FCAV CODE"

write_log "INFO" "Comprobando requisitos del sistema..."
if ! command -v node &> /dev/null; then
    write_log "ERR" "Node.js no esta instalado. Por favor instala Node.js (https://nodejs.org)."
    exit 1
fi
write_log "OK" "Node.js detectado."

get_interactive_menu() {
    local prompt="$1"
    shift
    local options=("$@")
    local selected=0
    local num_options=${#options[@]}
    local key seq

    echo -e ""
    echo -e "  ${C_TEXT}${prompt}${NC}"
    echo -e "  ${C_DIM}(Usa flechas Arriba/Abajo y Enter para seleccionar)${NC}"

    echo -en "\033[?25l" # Ocultar cursor

    for i in "${!options[@]}"; do echo ""; done

    while true; do
        echo -en "\033[${num_options}A" # Subir cursor

        for i in "${!options[@]}"; do
            echo -en "\033[2K\r" # Limpiar linea
            if [ $i -eq $selected ]; then
                echo -e "  ${C_SUCCESS}> ${options[$i]}${NC}"
            else
                echo -e "    ${C_DIM}${options[$i]}${NC}"
            fi
        done

        if [ -c /dev/tty ]; then
            read -rsn1 key < /dev/tty
        else
            read -rsn1 key
        fi

        case "$key" in
            $'\x1b')
                if [ -c /dev/tty ]; then
                    read -rsn2 -t 0.1 seq < /dev/tty
                else
                    read -rsn2 -t 0.1 seq
                fi
                case "$seq" in
                    "[A") [ $selected -gt 0 ] && selected=$((selected - 1)) ;;
                    "[B") [ $selected -lt $((num_options - 1)) ] && selected=$((selected + 1)) ;;
                esac
                ;;
            "") break ;;
        esac
    done

    echo -en "\033[?25h" # Mostrar cursor
    return $((selected + 1))
}

get_interactive_menu "Motores de IA disponibles:" \
    "Pi       (Recomendado, comandos y herramientas)" \
    "OpenCode (Version original legacy)"
opcion=$?

if [ "$opcion" = "1" ]; then
    echo -e ""
    write_log "INFO" "Iniciando instalacion de Pi..."
    curl -fsSL https://raw.githubusercontent.com/Hectorajm2001/fcav-code/main/pi/setup-fcav.sh | bash
else
    echo -e ""
    write_log "INFO" "Iniciando instalacion de OpenCode..."
    curl -fsSL https://raw.githubusercontent.com/Hectorajm2001/fcav-code/main/opencode/setup-fcav.sh | bash
fi
