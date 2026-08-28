Genera la documentación técnica de las APIs y endpoints del proyecto actual bajo el estándar institucional FCAV:

### Estructura Requerida por Endpoint:
1. **Método y Ruta:** `[GET|POST|PUT|DELETE|PATCH] /api/v1/recurso`
2. **Descripción:** Resumen de 1-2 líneas del propósito del endpoint.
3. **Autenticación / Roles:** (ej. `Bearer JWT`, `Rol: Administrador | Docente | Alumno`).
4. **Parámetros de Entrada:** Tabla con Nombre, Tipo, Requerido, Descripción.
5. **Ejemplo de Request Body:** JSON con tipos de datos reales.
6. **Respuestas:**
   - `200 OK` / `201 Created`: Ejemplo JSON con `{ "status": "success", "data": {...} }`.
   - `400 Bad Request` / `404 Not Found`: Ejemplo JSON con `{ "status": "error", "message": "..." }`.
   - `401 Unauthorized` / `403 Forbidden`.

Genera la salida en Markdown limpio y estructurado listo para incluirse en un archivo `README.md` o documentación técnica del proyecto.
