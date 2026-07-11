#!/bin/bash
# setup-fcav.sh — Instalador Unificado FCAV CODE
# Uso: curl -fsSL https://raw.githubusercontent.com/Hectorajm2001/fcav-code/main/setup-fcav.sh | bash

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
WHITE='\033[1;37m'
NC='\033[0m'

echo -e ""
echo -e "${GREEN}  ███████╗ ██████╗ █████╗ ██╗   ██╗${NC}"
echo -e "${GREEN}  ██╔════╝██╔════╝██╔══██╗██║   ██║${NC}"
echo -e "${GREEN}  █████╗  ██║     ███████║██║   ██║${NC}"
echo -e "${GREEN}  ██╔══╝  ██║     ██╔══██║╚██╗ ██╔╝${NC}"
echo -e "${GREEN}  ██║     ╚██████╗██║  ██║ ╚████╔╝ ${NC}"
echo -e "${GREEN}  ╚═╝      ╚═════╝╚═╝  ╚═╝  ╚═══╝ ${NC}"
echo -e "${GREEN}   ██████╗ ██████╗ ██████╗ ███████╗${NC}"
echo -e "${GREEN}  ██╔════╝██╔═══██╗██╔══██╗██╔════╝${NC}"
echo -e "${GREEN}  ██║     ██║   ██║██║  ██║█████╗  ${NC}"
echo -e "${GREEN}  ██║     ██║   ██║██║  ██║██╔══╝  ${NC}"
echo -e "${GREEN}  ╚██████╗╚██████╔╝██████╔╝███████╗${NC}"
echo -e "${GREEN}   ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝${NC}"
echo -e ""
echo -e "${YELLOW}  Instalador Unificado de Agentes FCAV...${NC}"
echo -e ""
echo -e "${WHITE}  Selecciona el motor que deseas instalar:${NC}"
echo -e "${GREEN}  [1] Pi (Recomendado, soporta comandos y herramientas avanzadas)${NC}"
echo -e "${WHITE}  [2] OpenCode (Versión original legacy)${NC}"
echo -e ""

read -p "  Opción (1/2): " opcion

if [ "$opcion" = "1" ]; then
    echo -e "\n${YELLOW}  Iniciando instalación de Pi...${NC}"
    curl -fsSL https://raw.githubusercontent.com/Hectorajm2001/fcav-code/main/pi/setup-fcav.sh | bash
elif [ "$opcion" = "2" ]; then
    echo -e "\n${YELLOW}  Iniciando instalación de OpenCode...${NC}"
    curl -fsSL https://raw.githubusercontent.com/Hectorajm2001/fcav-code/main/opencode/setup-fcav.sh | bash
else
    echo -e "\n\033[0;31m  Opción no válida. Cancelando.\033[0m"
    exit 1
fi
