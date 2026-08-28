Analiza los cambios en `git diff` o los archivos modificados en el área de preparación (staging) y genera un mensaje de commit en español con el estándar Conventional Commits:

### Estructura:
`tipo(alcance): descripción concisa en imperativo y minúsculas`

### Tipos permitidos:
- `feat`: Nueva funcionalidad
- `fix`: Corrección de error o bug
- `docs`: Cambios exclusivamente en documentación o comentarios
- `style`: Ajustes de formato, espaciado o linting (sin cambios en lógica)
- `refactor`: Refactorización de código que no añade features ni corrige bugs
- `test`: Creación o modificación de pruebas unitarias/integración
- `chore`: Actualización de dependencias, scripts de build o configuración

### Instrucciones:
1. Revisa el diff actual (`git diff --cached` o `git diff`).
2. Resume el cambio principal en UNA sola línea clara y directa en español.
3. Si el cambio es complejo, añade una lista con viñetas breves explicando el 'por qué'.
4. NUNCA incluyas mensajes genéricos como "actualización de código".
