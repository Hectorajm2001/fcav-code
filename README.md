# FCAV CODE

Agente de programación de la Facultad de Comercio y Administración Victoria (FCAV), UAT.
Conectado a servidor IA local en Intranet (LM Studio).

> **Nota:** FCAV CODE ahora está basado en el motor **Pi** (`@earendil-works/pi-coding-agent`), que ofrece una experiencia de terminal pura, altamente minimalista y compatible de manera nativa con modelos locales a través de OpenAI-compatible endpoints.

## Instalación

**En Windows (PowerShell como Administrador):**
```powershell
irm https://raw.githubusercontent.com/Hectorajm2001/fcav-code/main/setup-fcav.ps1 | iex
```

**En Linux/macOS:**
```bash
curl -fsSL https://raw.githubusercontent.com/Hectorajm2001/fcav-code/main/setup-fcav.sh | bash
```

## Uso

Abre una terminal en tu proyecto y escribe:
```bash
fcavcode
```
*(Este comando inyectará automáticamente la identidad gráfica de la FCAV y configurará el entorno para conectarse al servidor local).*

## Template de Proyectos

Para iniciar un nuevo proyecto bajo los estándares de la FCAV:
1. Clona este repositorio.
2. Copia el contenido de la carpeta `project-template/` (o si migras de OpenCode, la carpeta `opencode/project-template/`) a tu nuevo proyecto.
3. Inicia `fcavcode`.

## Historial y Migración
Los archivos antiguos de OpenCode se encuentran en la carpeta `opencode/` para referencia futura. El nuevo motor Pi no requiere archivos JSON para la UI, sino que confía en el comando Wrapper `fcavcode` para imprimir el logo institucional antes de arrancar.
