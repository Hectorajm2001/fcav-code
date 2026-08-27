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

# 2. Instalar OpenCode
if ! command -v opencode &> /dev/null; then
    echo -e "${YELLOW}[1/4] Instalando motor de IA...${NC}"
    npm i -g opencode-ai
else
    echo -e "${GREEN}[1/4] Motor de IA ya instalado ✓${NC}"
fi

# 3. Crear comando fcavcode
echo -e "${YELLOW}[2/4] Configurando comando 'fcavcode'...${NC}"
WRAPPER="/usr/local/bin/fcavcode"
if [ ! -w "/usr/local/bin" ]; then
    WRAPPER="$HOME/.local/bin/fcavcode"
    mkdir -p "$HOME/.local/bin"
fi

cat << 'EOF' > "$WRAPPER"
#!/bin/bash
if [ "$1" = "update" ]; then
    UPDATE_URL="https://raw.githubusercontent.com/Hectorajm2001/fcav-code/master/opencode/update-fcav.sh"
    if curl -fsSL "$UPDATE_URL" | bash; then
        exit 0
    else
        CONFIG_DIR="${XDG_CONFIG_HOME:-$HOME/.config}/opencode"
        if [ -f "$CONFIG_DIR/update-fcav.js" ]; then
            node "$CONFIG_DIR/update-fcav.js" "$@"
            exit 0
        fi
        npm i -g opencode-ai@latest
        if [ -f "$CONFIG_DIR/patch-logo.js" ]; then
            node "$CONFIG_DIR/patch-logo.js"
        fi
        exit 0
    fi
fi

CONFIG_DIR="${XDG_CONFIG_HOME:-$HOME/.config}/opencode"
if [ ! -d ".opencode" ]; then
    mkdir -p ".opencode/themes" 2>/dev/null || true
fi
if [ ! -f ".opencode/tui.json" ] && [ -f "$CONFIG_DIR/tui.json" ]; then
    cp "$CONFIG_DIR/tui.json" ".opencode/tui.json" 2>/dev/null
fi
if [ -d "$CONFIG_DIR/themes" ] && [ ! -f ".opencode/themes/fcav.json" ]; then
    cp -r "$CONFIG_DIR/themes/"* ".opencode/themes/" 2>/dev/null
fi
opencode "$@"
EOF
chmod +x "$WRAPPER"
echo -e "${GREEN}      Comando fcavcode creado en $WRAPPER ✓${NC}"

# 4. Clonar config FCAV
echo -e "${YELLOW}[3/4] Configurando identidad FCAV CODE...${NC}"
CONFIG_DIR="${XDG_CONFIG_HOME:-$HOME/.config}/opencode"
mkdir -p "$CONFIG_DIR/themes"

BASE_URL="https://raw.githubusercontent.com/Hectorajm2001/fcav-code/master/opencode/config"
curl -s -o "$CONFIG_DIR/tui.json" "$BASE_URL/tui.json"
curl -s -o "$CONFIG_DIR/fcav-logo.txt" "$BASE_URL/fcav-logo.txt"
curl -s -o "$CONFIG_DIR/themes/fcav.json" "$BASE_URL/themes/fcav.json"
curl -s -o "$CONFIG_DIR/AGENTS.md" "$BASE_URL/AGENTS.md"

# 4.1. Aplicar identidad visual FCAV al ejecutable de OpenCode
echo -e "${YELLOW}      Personalizando identidad visual (FCAV Logo)...${NC}"
TEMP_PATCH="/tmp/patch-logo-$$.js"
if curl -s -o "$TEMP_PATCH" "https://raw.githubusercontent.com/Hectorajm2001/fcav-code/master/opencode/patch-logo.js" 2>/dev/null; then
    if [ -f "$TEMP_PATCH" ]; then
        node "$TEMP_PATCH" >/dev/null 2>&1 || true
        rm -f "$TEMP_PATCH"
        echo -e "${GREEN}      Logo de FCAV CODE aplicado al motor ✓${NC}"
    fi
fi

# 5. Preguntar IP del servidor
echo -e "${YELLOW}[4/4] Configuracion del servidor...${NC}"
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
