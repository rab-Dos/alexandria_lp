# Alexandria Studio — Landing Page

Sitio web corporativo de Alexandria Studio, consultora de TI con sede en Ciudad de Mexico, activa desde 2017. Construido con Astro, Tailwind CSS v4 y Three.js.

---

## Stack tecnologico

| Tecnologia | Version | Rol |
|---|---|---|
| [Astro](https://astro.build) | ^4.0 | Framework SSG — generacion estatica |
| [Tailwind CSS](https://tailwindcss.com) | ~4.3 | Estilos utilitarios (via Vite plugin) |
| [Three.js](https://threejs.org) | r128 | Globo 3D animado en el footer, cargado desde CDN |
| [@astrojs/sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/) | 3.1.6 | Sitemap XML automatico |

Three.js no forma parte de las dependencias de `package.json`; el footer carga la versión r128 en tiempo de ejecución desde cdnjs.

---

## Requisitos previos

- Node.js >= 20
- [pnpm](https://pnpm.io) >= 9

---

## Instalacion

```bash
git clone https://github.com/rab-Dos/alexandria_lp.git
cd alexandria_lp
pnpm install
```

---

## Comandos disponibles

| Comando | Descripcion |
|---|---|
| `pnpm dev` | Inicia el servidor de desarrollo en `localhost:4321` |
| `pnpm build` | Genera el sitio estatico en `dist/` |
| `pnpm preview` | Sirve el build de produccion localmente |

Actualmente el proyecto no define comandos específicos para lint, pruebas automatizadas o comprobación de tipos.

---

## Estructura del proyecto

```
/
├── cdn/
│   ├── opengraph.webp          # Imagen social utilizada en producción
│   ├── opengraph.png           # Variante PNG
│   └── opengraph.svg           # Fuente vectorial
│
├── public/
│   ├── Alexandria.svg          # Logo SVG
│   ├── Alexandria.png          # Logo PNG (fallback y PWA)
│   ├── favicon.ico             # Favicon universal
│   ├── manifest.webmanifest    # Web App Manifest
│   ├── robots.txt              # Control de rastreadores
│   └── llms.txt                # Descripcion para rastreadores de IA
│
├── src/
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Hero.astro
│   │   ├── About.astro
│   │   ├── Services.astro
│   │   ├── ServiceCard.astro
│   │   ├── Pricing.astro
│   │   ├── Contact.astro
│   │   ├── Footer.astro        # Incluye globo 3D con Three.js
│   │   ├── SectionDivider.astro
│   │   └── icons/
│   ├── layouts/
│   │   └── Layout.astro        # Head global: SEO, JSON-LD, OG, manifest
│   ├── pages/
│   │   ├── index.astro         # Landing page principal
│   │   ├── privacidad.astro    # Aviso de Privacidad (LFPDPPP)
│   │   └── terminos.astro      # Terminos de Uso
│   └── styles/
│       └── global.css          # Design tokens y estilos base (Tailwind @theme)
│
├── astro.config.mjs
├── package.json
└── pnpm-lock.yaml
```

---

## Configuracion de dominio

El dominio de produccion se configura en `astro.config.mjs`:

```js
export default defineConfig({
  site: 'https://alexandriastudio.cloud/',
  // ...
});
```

El sitemap se genera automaticamente en cada build (`/sitemap-index.xml`).

---

## SEO y rastreadores

- **robots.txt** — permite rastreo completo, incluyendo GPTBot, ClaudeBot y PerplexityBot
- **sitemap-index.xml** — generado por `@astrojs/sitemap` en cada build
- **manifest.webmanifest** — PWA basica con colores de marca
- **llms.txt** — descripcion legible para sistemas de IA
- **JSON-LD** — schema `LocalBusiness` + `ProfessionalService` con catalogo de servicios
- **Open Graph** — imagen social absoluta alojada en `https://alexandriastudio.cloud/cdn/opengraph.webp`
- **Twitter Card** — vista previa de formato grande con imagen y texto alternativo

---

## Accesibilidad

El sitio incorpora prácticas orientadas a WCAG 2.2 AA:

- Landmarks semánticos, jerarquía de encabezados y regiones identificadas con ARIA
- Enlace para saltar directamente al contenido principal
- Indicadores de foco visibles y controles con objetivos táctiles amplios
- Navegación por teclado en menús, pestañas y tarjetas expandibles
- Tablas con encabezados de fila y columna asociados
- Contraste AA para texto normal sobre las superficies oscuras del sitio
- Reducción de animaciones mediante `prefers-reduced-motion`

Estas medidas no sustituyen pruebas manuales periódicas con teclado, lectores de pantalla, zoom y modos de alto contraste.

---

## Compatibilidad de navegadores

Compatibilidad objetivo:

- Chrome / Edge (Chromium) — últimas 2 versiones
- Firefox — últimas 2 versiones
- Safari (macOS e iOS) — 15+
- Samsung Internet — 18+

La lista representa el objetivo de compatibilidad del proyecto; no existe actualmente una matriz automatizada de pruebas entre navegadores.

---

## Licencia

Todos los derechos reservados. El sitio muestra automáticamente el año vigente en el footer.
