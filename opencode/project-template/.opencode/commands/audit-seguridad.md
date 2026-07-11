Revisa todo el código del proyecto buscando:
1. Credenciales hardcodeadas (passwords, API keys, tokens, connection strings)
2. Inyección SQL (string concatenation en queries, SqlCommand sin parámetros)
3. XSS (uso de @Html.Raw sin sanitizar, innerHTML en JS)
4. CORS abierto (AllowAnyOrigin)
5. CSRF sin protección (POST/PUT/DELETE sin [ValidateAntiForgeryToken])
6. Datos personales sin protección LGPDPPP (CURP, RFC, matrícula en texto plano)
7. Archivos .env o appsettings.Development.json en git (revisar .gitignore)
8. Paquetes NuGet obsoletos o con vulnerabilidades conocidas

Formato: archivo:línea → problema → fix recomendado.
Una línea por hallazgo. Sin ensayos.
