# Alexandria Studio — Landing Page

Sitio web corporativo de Alexandria Studio, consultora de TI con sede en Ciudad de Mexico, activa desde 2017. Construido con Astro, Tailwind CSS v4 y Three.js.

---

## Stack tecnologico

| Tecnologia | Version | Rol |
|---|---|---|
| [Astro](https://astro.build) | ^4.0 | Framework SSG — generacion estatica |
| [Tailwind CSS](https://tailwindcss.com) | ~4.3 | Estilos utilitarios (via Vite plugin) |
| [Three.js](https://threejs.org) | r128 | Globo 3D animado en el footer, cargado bajo demanda desde CDN |
| [@astrojs/sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/) | 3.1.6 | Sitemap XML automatico |

Three.js no forma parte de las dependencias de `package.json`. Un observador solicita la versión r128 desde cdnjs únicamente cuando el visitante se aproxima al footer; la construcción de la escena y su ciclo de render quedan fuera de la carga inicial.

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
│   ├── fonts/                  # Inter y Geist Mono variables autoalojadas
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
│   ├── scripts/
│   │   └── footer-globe.ts     # Escena WebGL cargada como chunk diferido
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

## Rendimiento

- El canvas del Hero funciona a un máximo de 30 FPS, reduce densidad y resolución en móvil, y se pausa fuera del viewport o cuando la pestaña queda oculta.
- Three.js y la escena del footer se descargan e inicializan sólo al aproximarse al globo. Su render también se pausa fuera del viewport.
- El mapa de actividad se genera durante el build como un SVG de tres trazados, sin crear 90 nodos mediante JavaScript.
- Las animaciones decorativas con `data-animate-when-visible` comparten un único `IntersectionObserver`.
- Las secciones fuera del primer viewport utilizan `content-visibility: auto` para diferir layout y pintura.
- Inter y Geist Mono se sirven desde `public/fonts`; sólo Inter normal se precarga y las variantes cursiva/mono se solicitan cuando el contenido las utiliza.

### Caché en producción

`public/.htaccess` configura los encabezados para servidores Apache o LiteSpeed:

- CSS y JavaScript con hash: un año e `immutable`.
- Imágenes públicas: 30 días.
- Fuentes WOFF2 locales: un año e `immutable`.
- HTML y manifest: revalidación obligatoria.

El archivo se copia automáticamente a `dist/.htaccess`. Si el despliegue utiliza Nginx u otra plataforma que ignore `.htaccess`, deben trasladarse las mismas políticas a la configuración del servidor.

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

El código fuente de este repositorio se distribuye bajo los términos de la licencia MIT (consulta [LICENSE](LICENSE)). La marca Alexandria Studio, sus logotipos y los materiales de terceros conservan sus derechos y licencias aplicables.
