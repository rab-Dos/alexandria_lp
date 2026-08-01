# Alexandria Studio — Landing Page

Sitio web corporativo de Alexandria Studio, consultora de TI con sede en Ciudad de Mexico, activa desde 2017. Construido con Astro, Tailwind CSS v4 y Three.js.

---

## Stack tecnologico

| Tecnologia | Version | Rol |
|---|---|---|
| [Astro](https://astro.build) | ^4.0 | Framework SSG — generacion estatica |
| [Tailwind CSS](https://tailwindcss.com) | ~4.3 | Estilos utilitarios (via Vite plugin) |
| [Three.js](https://threejs.org) | r128 | Globo 3D animado en el footer |
| [@astrojs/sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/) | ^3.7 | Sitemap XML automatico |

---

## Requisitos previos

- Node.js >= 18
- [pnpm](https://pnpm.io) >= 8

---

## Instalacion

```bash
git clone https://github.com/tu-usuario/alexandria-studio.git
cd alexandria-studio
pnpm install
```

---

## Comandos disponibles

| Comando | Descripcion |
|---|---|
| `pnpm dev` | Inicia el servidor de desarrollo en `localhost:4321` |
| `pnpm build` | Genera el sitio estatico en `dist/` |
| `pnpm preview` | Sirve el build de produccion localmente |

---

## Estructura del proyecto

```
/
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
└── package.json
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

---

## Compatibilidad de navegadores

Probado y optimizado para:

- Chrome / Edge (Chromium) — ultimas 2 versiones
- Firefox — ultimas 2 versiones
- Safari (macOS e iOS) — 15+, con `powerPreference: 'low-power'` en el WebGL del footer
- Samsung Internet — 18+

---

## Licencia

Todos los derechos reservados. (c) 2025 Alexandria Studio.
