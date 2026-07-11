#!/bin/bash
# setup-fcav.sh — Instala FCAV CODE en un comando
# Uso: curl -fsSL https://raw.githubusercontent.com/Hectorajm2001/fcav-code/master/setup-fcav.sh | bash

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

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
echo -e "${GREEN}        Facultad de Comercio ${NC}"
echo -e "${GREEN}                 y           ${NC}"
echo -e "${GREEN}       Administración Victoria${NC}"
echo -e ""
echo -e "${YELLOW}  Instalando FCAV CODE...${NC}"
echo -e ""

# 1. Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js no encontrado. Instala desde https://nodejs.org"
    exit 1
fi

# 2. Instalar motor Pi
if ! command -v pi &> /dev/null; then
    echo -e "${YELLOW}[1/4] Instalando motor de IA (Pi)...${NC}"
    npm i -g @earendil-works/pi-coding-agent
else
    echo -e "${GREEN}[1/4] Motor de IA ya instalado ✓${NC}"
fi

# 3. Preguntar IP del servidor
echo -e "${YELLOW}[2/4] Configuracion del servidor...${NC}"
read -p "  IP del servidor LM Studio (ej: 192.168.1.100) [localhost]: " SERVER_IP
SERVER_IP=${SERVER_IP:-localhost}
echo -e "${GREEN}  Servidor configurado: http://${SERVER_IP}:1234/v1${NC}"

# 4. Clonar config FCAV (Logo y Agents)
echo -e "${YELLOW}[3/4] Configurando identidad FCAV CODE...${NC}"
CONFIG_DIR="${XDG_CONFIG_HOME:-$HOME/.config}/fcav"
mkdir -p "$CONFIG_DIR/themes"

BASE_URL="https://raw.githubusercontent.com/Hectorajm2001/fcav-code/master/resources"
curl -s -o "$CONFIG_DIR/fcav-logo.txt" "$BASE_URL/fcav-logo.txt"

BASE_URL_CONFIG="https://raw.githubusercontent.com/Hectorajm2001/fcav-code/master/opencode/config"
curl -s -o "$CONFIG_DIR/AGENTS.md" "$BASE_URL_CONFIG/AGENTS.md"
curl -s -o "$CONFIG_DIR/themes/fcav.json" "$BASE_URL_CONFIG/themes/fcav.json"

# 5. Configurar Pi y crear comando fcavcode
echo -e "${YELLOW}[4/4] Configurando opciones globales...${NC}"

PI_CONFIG_DIR="$HOME/.pi/agent"
mkdir -p "$PI_CONFIG_DIR"
echo "{\"theme\": \"$CONFIG_DIR/themes/fcav.json\"}" > "$PI_CONFIG_DIR/config.json"

# 6. Descargar e instalar Skills globales de FCAV
echo -e "${YELLOW}[5/5] Instalando habilidades institucionales de FCAV...${NC}"
GLOBAL_SKILLS_DIR="$HOME/.pi/agent/skills"
mkdir -p "$GLOBAL_SKILLS_DIR/fcav-cybersecurity"
mkdir -p "$GLOBAL_SKILLS_DIR/fcav-visual"
mkdir -p "$GLOBAL_SKILLS_DIR/audit-seguridad"

BASE_URL_MASTER="https://raw.githubusercontent.com/Hectorajm2001/fcav-code/master"
curl -s -o "$GLOBAL_SKILLS_DIR/fcav-cybersecurity/SKILL.md" "$BASE_URL_MASTER/pi/skills/fcav-cybersecurity/SKILL.md"
curl -s -o "$GLOBAL_SKILLS_DIR/fcav-visual/SKILL.md" "$BASE_URL_MASTER/pi/skills/fcav-visual/SKILL.md"
curl -s -o "$GLOBAL_SKILLS_DIR/audit-seguridad/SKILL.md" "$BASE_URL_MASTER/pi/skills/audit-seguridad/SKILL.md"

WRAPPER="/usr/local/bin/fcavcode"
if [ ! -w "/usr/local/bin" ]; then
    WRAPPER="$HOME/.local/bin/fcavcode"
    mkdir -p "$HOME/.local/bin"
fi

cat << EOF > "$WRAPPER"
#!/bin/bash
if [ "\$1" = "init" ]; then
    shift
    export FCAV_INIT_ARGS="\$*"
    curl -fsSL https://raw.githubusercontent.com/Hectorajm2001/fcav-code/master/pi/init.sh | bash
    exit \$?
fi
echo -e "\033[0;32m"
cat "\$HOME/.config/fcav/fcav-logo.txt"
echo -e "\033[0m"
export OPENAI_API_KEY="lm-studio"
export OPENAI_BASE_URL="http://${SERVER_IP}:1234/v1"
pi --theme "\$HOME/.config/fcav/themes/fcav.json" --append-system-prompt "\$HOME/.config/fcav/AGENTS.md" --provider openai --model qwen2.5-coder-32b-instruct "\$@"
EOF
chmod +x "$WRAPPER"
echo -e "${GREEN}      Comando fcavcode creado en $WRAPPER ✓${NC}"

echo -e ""
echo -e "${GREEN}  ✅ FCAV CODE instalado correctamente${NC}"
echo -e ""
echo -e "  Para usar:"
echo -e "    1. Abre terminal en tu proyecto"
echo -e "    2. Escribe: ${GREEN}fcavcode${NC}"
echo -e ""
echo -e "  ${WHITE}Para iniciar un nuevo proyecto FCAV:${NC}"
echo -e "    ${YELLOW}fcavcode init${NC}"
echo -e ""
