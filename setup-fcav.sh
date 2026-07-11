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

echo -e ""
echo -e "  ${C_TEXT}Motores de IA disponibles:${NC}"
echo -e "  ${C_DIM}--------------------------------------------------------${NC}"
echo -e "  ${C_SUCCESS}[1] Pi       (Recomendado, comandos y herramientas)${NC}"
echo -e "  ${C_DIM}[2] OpenCode (Version original legacy)${NC}"
echo -e "  ${C_DIM}--------------------------------------------------------${NC}"
echo -e ""

opcion=""
while [[ ! "$opcion" =~ ^[12]$ ]]; do
    read -p "  Selecciona una opcion (1 o 2): " opcion
    if [[ ! "$opcion" =~ ^[12]$ ]]; then
        write_log "WARN" "Opcion no valida, intenta de nuevo."
    fi
done

if [ "$opcion" = "1" ]; then
    echo -e ""
    write_log "INFO" "Iniciando instalacion de Pi..."
    curl -fsSL https://raw.githubusercontent.com/Hectorajm2001/fcav-code/main/pi/setup-fcav.sh | bash
else
    echo -e ""
    write_log "INFO" "Iniciando instalacion de OpenCode..."
    curl -fsSL https://raw.githubusercontent.com/Hectorajm2001/fcav-code/main/opencode/setup-fcav.sh | bash
fi
