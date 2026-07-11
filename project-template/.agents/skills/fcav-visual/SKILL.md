---
name: fcav-visual
description: >
  Sistema visual institucional FCAV para interfaces web.
  Paleta de colores, tipografía, componentes base.
  Invocar al crear interfaces web o documentación visual.
---

# Sistema Visual FCAV CODE

## Paleta de Colores

### CSS Custom Properties
```css
:root {
  /* Primarios FCAV */
  --fcav-green: #559C52;
  --fcav-green-dark: #2E7D32;
  --fcav-green-light: #81C784;
  
  /* UAT Institucional */
  --uat-blue: #003D5C;
  --uat-blue-light: #33627C;
  --uat-orange: #D05F27;
  
  /* Neutrales */
  --fcav-gray-dark: #55565B;
  --fcav-gray-mid: #77787C;
  --fcav-gray-light: #CFCDC9;
  --fcav-bg-light: #F5F5F4;
  --fcav-bg-dark: #0A0E14;
  --fcav-text-light: #E8E8E8;
  --fcav-text-dark: #1A1A1A;
}
```

## Tipografía
- Fuente principal: `Inter` (Google Fonts)
- Fuente alternativa: `Roboto`
- La UAT usa 'Visby Round CF' (no libre). Inter es el equivalente más cercano
- Import: `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');`

## Espaciado
- Base: 4px
- Escala: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64px

## Componentes base
- Botón primario: fondo `--fcav-green`, texto blanco, border-radius 6px
- Botón secundario: borde `--fcav-green`, fondo transparente
- Card: fondo blanco, border `--fcav-gray-light`, border-radius 8px, sombra sutil
- Header: fondo `--fcav-green` o `--uat-blue`, texto blanco
- Footer: fondo `--uat-blue`, texto blanco, links `--fcav-green-light`

## Logo
- Logo FCAV CODE a la izquierda del header
- Tamaño mínimo: 120px ancho
- Espacio de respeto: 16px alrededor

## Modo oscuro
- Fondo: `--fcav-bg-dark`
- Surface: #111820
- Texto: `--fcav-text-light`
- Acentos: `--fcav-green-light`
