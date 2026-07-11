# FCAV CODE

Agente de programación de la Facultad de Comercio y Administración Victoria (FCAV), UAT.
Conectado a servidor IA local en Intranet (LM Studio).

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

## Template de Proyectos

Para iniciar un nuevo proyecto bajo los estándares de la FCAV:
1. Clona este repositorio
2. Copia el contenido de la carpeta `project-template/` a tu nuevo proyecto
3. Inicia `fcavcode`

Incluye:
- Skills de ciberseguridad (OWASP + LGPDPPP)
- Skills visuales (Identidad UAT/FCAV)
- Comandos custom (`/audit-seguridad`)
