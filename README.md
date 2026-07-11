# FCAV CODE

Agente de programación de la Facultad de Comercio y Administración Victoria (FCAV), UAT.
Conectado a servidor IA local en Intranet (LM Studio).

Este repositorio aloja dos variantes del agente de IA de la FCAV. Puedes instalar cualquiera de los dos motores usando nuestro instalador unificado.

- **Pi (Recomendado):** Un motor más moderno y ligero basado en terminal (`@earendil-works/pi-coding-agent`), que soporta *extensiones en código (TypeScript)* y automatización avanzada (ej. `/audit-seguridad`, `/add-controller`).
- **OpenCode (Legacy):** La versión original de la interfaz que proveía soporte a temas personalizados en `.opencode/`.

## Instalación (Instalador Unificado)

Al ejecutar estos comandos, el instalador te preguntará qué motor deseas utilizar (Pi u OpenCode) y te guiará en la configuración del servidor local.

**En Windows (PowerShell como Administrador):**
```powershell
irm https://raw.githubusercontent.com/Hectorajm2001/fcav-code/main/setup-fcav.ps1 | iex
```

**En Linux/macOS:**
```bash
curl -fsSL https://raw.githubusercontent.com/Hectorajm2001/fcav-code/main/setup-fcav.sh | bash
```

## Uso

Una vez instalado, abre una terminal en tu proyecto y escribe:
```bash
fcavcode
```
*(Este comando inyectará automáticamente la identidad gráfica de la FCAV y arrancará el motor que hayas seleccionado).*

## Template de Proyectos

Para iniciar un nuevo proyecto bajo los estándares de la FCAV:
1. Clona este repositorio: `git clone https://github.com/Hectorajm2001/fcav-code`
2. Si instalaste **Pi**, copia el contenido de `pi/project-template/` a tu nuevo proyecto. Esto agregará las reglas (`AGENTS.md`) y las extensiones personalizadas para Pi.
3. Si instalaste **OpenCode**, copia el contenido de `opencode/project-template/` a tu nuevo proyecto.
4. Inicia tu editor y ejecuta `fcavcode`.

## Estructura del Repositorio
- `pi/`: Instaladores y templates exclusivos para el motor Pi.
- `opencode/`: Instaladores y plantillas originales de OpenCode.
- `resources/`: Recursos compartidos (como el logo ASCII de FCAV).
