# FCAV CODE

Agente de programación de la Facultad de Comercio y Administración Victoria (FCAV), UAT.  
Conectado al servidor IA institucional local en Intranet (LM Studio).

Este repositorio aloja dos variantes del agente de IA de la FCAV. Puedes instalar cualquiera de los dos motores usando nuestro instalador unificado:

- **Pi (Recomendado):** Motor moderno y ligero basado en terminal (`@earendil-works/pi-coding-agent`), con soporte a *extensiones en código (TypeScript)* y automatizaciones de ciberseguridad y desarrollo (`/audit-seguridad`, `/add-controller`).
- **OpenCode (Legacy):** Interfaz completa de terminal con soporte de ventanas, temas personalizados (`matrix`, `fcav`) y navegación avanzada.

---

## 🚀 Métodos de Instalación

### Opción 1: Instalación Local (Recomendado para Repositorios Privados)
Si el repositorio de GitHub está configurado como **privado** o deseas instalarlo desde tu copia local:

#### En Windows:
1. Abre tu terminal (PowerShell o CMD) y clona el repositorio:
   ```powershell
   git clone https://github.com/Hectorajm2001/fcav-code.git
   cd fcav-code
   ```
2. Ejecuta el instalador unificado:
   ```powershell
   powershell -ExecutionPolicy Bypass -File .\setup-fcav.ps1
   ```
   *(También puedes hacer doble clic en `iniciar-fcavcode.bat` para iniciar o instalar directamente).*

#### En Linux / macOS:
```bash
git clone https://github.com/Hectorajm2001/fcav-code.git
cd fcav-code
chmod +x setup-fcav.sh
./setup-fcav.sh
```

---

### Opción 2: Instalación en una sola línea (Con GitHub CLI para Repos Privados)
Si tienes instalado y autenticado [GitHub CLI (`gh auth login`)](https://cli.github.com/), puedes instalarlo directamente en una sola línea sin clonar manualmente:

#### En Windows (PowerShell):
```powershell
gh api -H "Accept: application/vnd.github.raw" repos/Hectorajm2001/fcav-code/contents/setup-fcav.ps1 | iex
```

#### En Linux / macOS:
```bash
gh api -H "Accept: application/vnd.github.raw" repos/Hectorajm2001/fcav-code/contents/setup-fcav.sh | bash
```

---

### Opción 3: Instalación Remota Directa (Repositorios Públicos)
Si el repositorio es público, puedes ejecutar directamente:

#### En Windows (PowerShell como Administrador o Usuario):
```powershell
irm https://raw.githubusercontent.com/Hectorajm2001/fcav-code/master/setup-fcav.ps1 | iex
```

#### En Linux / macOS:
```bash
curl -fsSL https://raw.githubusercontent.com/Hectorajm2001/fcav-code/master/setup-fcav.sh | bash
```

---

## 💻 Uso Diario

Una vez instalado, abre cualquier terminal en la carpeta de tu proyecto y ejecuta:

```bash
fcavcode
```

> **Nota:** Este comando inicializará automáticamente la identidad gráfica de la FCAV (logotipo institucional y tema verde) y conectará tu entorno al servidor IA de la intranet.

### Actualizar FCAV CODE
Para actualizar el motor de IA y asegurarte de mantener la identidad gráfica institucional y los últimos parches:
```bash
fcavcode update
```

---

## 📁 Template de Proyectos

Para iniciar un nuevo proyecto bajo las normas y estándares de desarrollo de la FCAV:
1. Clona este repositorio: `git clone https://github.com/Hectorajm2001/fcav-code`
2. Si utilizas **Pi**: Copia el contenido de `pi/project-template/` a la raíz de tu nuevo proyecto (agrega las reglas institucionales `AGENTS.md` y extensiones).
3. Si utilizas **OpenCode**: Copia el contenido de `opencode/project-template/` a la raíz de tu proyecto.
4. Abre tu terminal en el proyecto y ejecuta `fcavcode`.

---

## 📂 Estructura del Repositorio

- `setup-fcav.ps1` / `setup-fcav.sh`: Instalador interactivo unificado (soporta ejecución remota y local).
- `iniciar-fcavcode.bat` / `iniciar-fcavcode.ps1`: Lanzadores rápidos locales para Windows.
- `pi/`: Instaladores, habilidades y plantillas exclusivas para el motor Pi.
- `opencode/`: Parches binarios de logotipo institucional, temas y plantillas para OpenCode.
- `resources/`: Recursos gráficos y tipografía institucional ASCII de la FCAV.
