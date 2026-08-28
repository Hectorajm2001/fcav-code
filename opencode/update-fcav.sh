#!/bin/bash
# update-fcav.sh — Actualiza OpenCode e inyecta identidad FCAV CODE
# Uso: fcavcode update (o curl -fsSL https://raw.githubusercontent.com/Hectorajm2001/fcav-code/master/opencode/update-fcav.sh | bash)

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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
echo -e "${YELLOW}        Facultad de Comercio ${NC}"
echo -e "${YELLOW}                 y           ${NC}"
echo -e "${YELLOW}       Administración Victoria${NC}"
echo -e ""
echo -e "========================================================"
echo -e "   ${GREEN}FCAV CODE — Actualizador y Parcheador${NC}"
echo -e "========================================================"
echo -e ""

# 1. Actualizar motor OpenCode desde npm
echo -e "${YELLOW}[1/3] Actualizando motor de IA (OpenCode) desde npm...${NC}"
npm install -g opencode-ai@latest || true
echo -e "${GREEN}      Motor actualizado ✓${NC}"

# 2. Descargar / actualizar configs y tema FCAV
echo -e ""
echo -e "${YELLOW}[2/3] Sincronizando identidad visual y temas FCAV...${NC}"
CONFIG_DIR="${XDG_CONFIG_HOME:-$HOME/.config}/opencode"
mkdir -p "$CONFIG_DIR/themes" "$CONFIG_DIR/commands" "$CONFIG_DIR/plugins"

BASE_URL="https://raw.githubusercontent.com/Hectorajm2001/fcav-code/master/opencode/config"
curl -s -o "$CONFIG_DIR/tui.json" "$BASE_URL/tui.json" || true
curl -s -o "$CONFIG_DIR/fcav-logo.txt" "$BASE_URL/fcav-logo.txt" || true
curl -s -o "$CONFIG_DIR/themes/fcav.json" "$BASE_URL/themes/fcav.json" || true
curl -s -o "$CONFIG_DIR/themes/fcav-dark.json" "$BASE_URL/themes/fcav-dark.json" || true
curl -s -o "$CONFIG_DIR/themes/fcav-light.json" "$BASE_URL/themes/fcav-light.json" || true
curl -s -o "$CONFIG_DIR/AGENTS.md" "$BASE_URL/AGENTS.md" || true
curl -s -o "$CONFIG_DIR/plugins/fcav-toolkit.js" "$BASE_URL/plugins/fcav-toolkit.js" || true
curl -s -o "$CONFIG_DIR/commands/audit-seguridad.md" "$BASE_URL/commands/audit-seguridad.md" || true
curl -s -o "$CONFIG_DIR/commands/commit-es.md" "$BASE_URL/commands/commit-es.md" || true
curl -s -o "$CONFIG_DIR/commands/design-check.md" "$BASE_URL/commands/design-check.md" || true
curl -s -o "$CONFIG_DIR/commands/doc-api.md" "$BASE_URL/commands/doc-api.md" || true
curl -s -o "$CONFIG_DIR/commands/ayuda.md" "$BASE_URL/commands/ayuda.md" || true

# 3. Reinyectar logotipo y colores FCAV en los binarios
echo -e ""
echo -e "${YELLOW}[3/3] Inyectando logotipo y colores FCAV en los binarios...${NC}"
TEMP_PATCH="/tmp/patch-logo-$$.js"
if curl -s -o "$TEMP_PATCH" "https://raw.githubusercontent.com/Hectorajm2001/fcav-code/master/opencode/patch-logo.js"; then
    node "$TEMP_PATCH" || true
    rm -f "$TEMP_PATCH"
fi

echo -e ""
echo -e "========================================================"
echo -e "   ${GREEN}✅ FCAV CODE actualizado e inyectado con éxito${NC}"
echo -e "========================================================"
echo -e ""
