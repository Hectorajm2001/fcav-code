Audita los archivos visuales (HTML, CSS, React, Vue, Razor, Blazor) del proyecto para asegurar el cumplimiento del Sistema Visual Institucional FCAV (`skills/fcav-visual`):

### Puntos de Auditoría:
1. **Colores HEX Prohibidos:** Verifica que no existan colores HEX directos (ej. `#FF0000`) en CSS o estilos inline. Todos deben usar tokens:
   - Primario: `var(--fcav-green)` (#559C52 / #22C55E)
   - Secundario: `var(--uat-blue)` (#003D5C / #38BDF8)
   - Acento: `var(--uat-orange)` (#D05F27 / #FB923C)
   - Fondo oscuro: `var(--fcav-bg-dark)` (#080D08 / #0A0A0C)
2. **Tipografía Institucional:**
   - Títulos (H1-H3): `Space Grotesk`
   - Lectura / Párrafos: `Outfit` o `Inter`
   - Código: `JetBrains Mono` o `Fira Code`
3. **Glassmorphism:** Tarjetas y paneles con `backdrop-filter: blur(12px)` y borde translúcido `rgba(255, 255, 255, 0.08)`.
4. **Accesibilidad (WCAG 2.1 AA):**
   - Contraste mínimo de 4.5:1 para texto normal.
   - Indicadores `:focus-visible` claros en botones e inputs.

### Formato de salida:
- `archivo:línea → regla rota → corrección recomendada`
- Si todo cumple: "✅ Cumplimiento del Sistema Visual FCAV al 100%."
