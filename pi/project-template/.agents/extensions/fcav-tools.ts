import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

export default function (pi: ExtensionAPI) {
  pi.registerCommand("audit-seguridad", {
    description: "Revisar todo el proyecto buscando fallos de seguridad (OWASP, LGPDPPP, credenciales).",
    handler: async (args, ctx) => {
      ctx.ui.notify("Iniciando auditoría de ciberseguridad...", "info");
      return `Revisa todo el código de este proyecto buscando:
1. Credenciales hardcodeadas (passwords, API keys, tokens, connection strings)
2. Inyección SQL (string concatenation en queries, SqlCommand sin parámetros)
3. XSS (uso de @Html.Raw sin sanitizar, innerHTML en JS)
4. CORS abierto (AllowAnyOrigin)
5. CSRF sin protección (POST/PUT/DELETE sin [ValidateAntiForgeryToken])
6. Datos personales sin protección LGPDPPP (CURP, RFC, matrícula en texto plano)
7. Archivos .env o appsettings.Development.json en git (revisar .gitignore)
8. Paquetes NuGet obsoletos o con vulnerabilidades conocidas

Formato esperado: archivo:línea -> problema -> fix recomendado.`;
    },
  });

  pi.registerCommand("fcav-init", {
    description: "Crear estructura base de un proyecto .NET (Controllers, Models, Views, Data, Services).",
    handler: async (args, ctx) => {
      ctx.ui.notify("Inicializando estructura FCAV...", "info");
      return `Crea la estructura de carpetas base recomendada para un proyecto FCAV (.NET MVC):
- Controllers/
- Models/
- Views/
- Data/
- Services/
- wwwroot/

Usa comandos de consola para crear las carpetas y archivos base. Si el proyecto ya tiene estas carpetas, indícalo. Confirma cuando esté listo.`;
    },
  });

  pi.registerCommand("add-controller", {
    description: "Añadir un nuevo controlador MVC con inyección de dependencias (.NET).",
    handler: async (args, ctx) => {
      ctx.ui.notify("Generando controlador MVC...", "info");
      const name = args ? args : "[Nombre]";
      return `Crea un nuevo controlador MVC en C# llamado ${name}Controller.
Asegúrate de:
1. Incluir el namespace adecuado.
2. Inyectar un DbContext y un ILogger en el constructor usando inyección de dependencias.
3. Incluir el atributo [Authorize] a nivel de clase si corresponde, o explicar cómo agregarlo.
4. Incluir los métodos base: Index (GET), Create (GET/POST con [ValidateAntiForgeryToken]), Edit, y Delete.
5. Usa Entity Framework Core (async/await) para las consultas simuladas.`;
    },
  });

  pi.registerCommand("run-tests", {
    description: "Ejecutar todos los tests unitarios del proyecto (.NET).",
    handler: async (args, ctx) => {
      ctx.ui.notify("Ejecutando suite de tests...", "info");
      return `Ejecuta los tests del proyecto usando el comando 'dotnet test'. 
Lee la salida de la consola e indícame explícitamente cuántos tests pasaron y cuántos fallaron.
Si hay tests fallidos, analiza la causa de los errores y proponme una solución para arreglarlos.`;
    },
  });
}
