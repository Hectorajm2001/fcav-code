#!/bin/bash
# setup-fcav.sh — Instala FCAV CODE en un comando
# Uso: curl -fsSL https://raw.githubusercontent.com/Hectorajm2001/fcav-code/main/setup-fcav.sh | bash

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
echo -e ""
echo -e "${YELLOW}  Instalando FCAV CODE...${NC}"
echo -e ""

# 1. Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js no encontrado. Instala desde https://nodejs.org"
    exit 1
fi

# 2. Instalar OpenCode
if ! command -v opencode &> /dev/null; then
    echo -e "${YELLOW}[1/4] Instalando motor de IA...${NC}"
    npm i -g opencode-ai
else
    echo -e "${GREEN}[1/4] Motor de IA ya instalado ✓${NC}"
fi

# 3. Crear comando fcavcode
echo -e "${YELLOW}[2/4] Configurando comando 'fcavcode'...${NC}"
NPM_GLOBAL=$(npm root -g | xargs dirname)
if [ -w "$NPM_GLOBAL" ]; then
    echo '#!/bin/bash' > "$NPM_GLOBAL/fcavcode"
    echo 'opencode "$@"' >> "$NPM_GLOBAL/fcavcode"
    chmod +x "$NPM_GLOBAL/fcavcode"
    echo -e "${GREEN}      Comando fcavcode creado ✓${NC}"
else
    echo -e "${YELLOW}      Advertencia: No se pudo crear el comando fcavcode por permisos.${NC}"
fi

# 4. Clonar config FCAV
echo -e "${YELLOW}[3/4] Configurando identidad FCAV CODE...${NC}"
CONFIG_DIR="${XDG_CONFIG_HOME:-$HOME/.config}/opencode"
mkdir -p "$CONFIG_DIR/themes"

BASE_URL="https://raw.githubusercontent.com/Hectorajm2001/fcav-code/main/config"
curl -s -o "$CONFIG_DIR/tui.json" "$BASE_URL/tui.json"
curl -s -o "$CONFIG_DIR/fcav-logo.txt" "$BASE_URL/fcav-logo.txt"
curl -s -o "$CONFIG_DIR/themes/fcav.json" "$BASE_URL/themes/fcav.json"
curl -s -o "$CONFIG_DIR/AGENTS.md" "$BASE_URL/AGENTS.md"

# 5. Preguntar IP del servidor
echo -e "${YELLOW}[4/4] Configuración del servidor...${NC}"
read -p "  IP del servidor LM Studio (ej: 192.168.1.100) [localhost]: " SERVER_IP
SERVER_IP=${SERVER_IP:-localhost}
echo -e "${GREEN}  Servidor configurado: http://${SERVER_IP}:1234/v1${NC}"

# Guardar IP en config global
cat > "$CONFIG_DIR/opencode.json" << EOF
{
  "\$schema": "https://opencode.ai/config.json",
  "provider": {
    "lmstudio": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "LM Studio (FCAV Intranet)",
      "options": {
        "baseURL": "http://${SERVER_IP}:1234/v1"
      },
      "models": {
        "qwen2.5-coder-32b": {
          "model": "qwen2.5-coder-32b-instruct"
        }
      }
    }
  },
  "model": "lmstudio/qwen2.5-coder-32b"
}
EOF

echo -e ""
echo -e "${GREEN}  ✅ FCAV CODE instalado correctamente${NC}"
echo -e ""
echo -e "  Para usar:"
echo -e "    1. Abre terminal en tu proyecto"
echo -e "    2. Escribe: ${GREEN}fcavcode${NC}"
echo -e ""
echo -e "  Para iniciar un nuevo proyecto FCAV:"
echo -e "    ${YELLOW}git clone https://github.com/Hectorajm2001/fcav-code${NC}"
echo -e "    Copia project-template/ como base de tu proyecto"
echo -e ""
