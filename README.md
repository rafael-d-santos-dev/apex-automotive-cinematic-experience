# APEX R-01 — Cinematic Automotive Experience

A premium cinematic automotive web experience built around the fictional APEX R-01 sports coupe.

APEX explores how a single photographic asset can become the foundation for an immersive digital product presentation through scroll-driven camera movement, editorial composition, SVG detailing, and carefully controlled motion.

Rather than relying on real-time 3D rendering, the experience uses a custom 2D image-sequence engine to create the impression of a continuous cinematic camera journey.

> **Portfolio Concept:** APEX R-01 is a fictional vehicle created for this project. All vehicle details and material descriptions are conceptual. This project does not represent a real production vehicle or verified automotive specifications.

---

## Project Preview

**APEX R-01 — Cinematic Automotive Experience**

A single-page experience featuring:

- A scroll-controlled cinematic opening sequence.
- Editorial design and engineering presentations.
- Interactive visual performance modes.
- A dramatic final reveal.
- A custom animated brand signature.

---

## Design Direction

The visual identity follows a restrained premium automotive aesthetic.

| Element | Direction |
|---|---|
| Primary background | `#050507` |
| Secondary surface | `#0B0C0F` |
| Primary text | `#F4F5F7` |
| Secondary text | `#9CA3AF` |
| Accent | `#D91E2A` |
| Display typography | Barlow Condensed |
| Interface typography | Plus Jakarta Sans |
| Technical labels | JetBrains Mono |

The visual language combines oversized editorial typography, dark studio imagery, precise red accents, minimal controls, and cinematic transitions.

The goal is to make each section feel like a deliberate chapter in a product launch film rather than a conventional landing page.

---

## Experience Overview

### 01 — Cinematic Hero

The opening sequence introduces the APEX R-01 through a continuous scroll-controlled camera experience.

A custom Canvas 2D renderer interpolates between 18 camera keyframes, creating controlled changes in framing, zoom, tilt, and visual atmosphere.

Four editorial captions accompany the sequence:

- APEX R-01
- Front Splitter
- Forged Architecture
- Rear Light Signature

Desktop and mobile use independently art-directed camera profiles.

### 02 — Design

**Sculpted for Unbroken Air**

An exploration of the vehicle's visual silhouette through animated SVG contours and image composition.

The section highlights three conceptual design elements:

- Roof Arc
- Shoulder Line
- Rear Signature

### 03 — Engineering

**Carbon Mass. Forged Poise.**

A conceptual material study combining a close-up vehicle image with an abstract carbon-inspired SVG pattern.

A scroll-driven reveal transitions between the photographic detail and the vector layer.

The presentation includes three fictional design concepts:

- Carbon-Cell Matrix
- Forged Ten-Spoke
- Fender Extraction

These are visual concepts, not verified production materials or engineering specifications.

### 04 — Performance

**Intent Shaped in Motion**

A panoramic visual presentation with two interactive display modes:

- Grand Touring
- Track Focus

The selector changes the presentation's visual state and accompanying description. It does not simulate actual vehicle performance.

### 05 — Final Reveal

**Presence in Every Line**

A low-key rear composition emphasizes the vehicle's red light signature.

A single action returns visitors to the opening experience.

### 06 — Cinematic Footer

The experience concludes with a custom animated APEX wordmark.

An SVG wheel inspired by a forged ten-spoke design travels across the screen, revealing the brand signature through a synchronized animation.

The footer finishes with the project description and portfolio credits.

---

## Technical Highlights

### Custom 2D Cinematic Sequence Engine

The hero is built around a single master JPEG image rather than a collection of separate photographs or a real-time 3D model.

The sequence engine uses:

- `createImageBitmap()` with an `HTMLImageElement` fallback.
- 18 desktop camera keyframes.
- 18 independently calibrated mobile camera keyframes.
- Catmull–Rom spline interpolation.
- Canvas 2D rendering.
- Progressive offscreen frame preparation.
- Device pixel ratio capped at 2.

Camera properties such as position, zoom, tilt, vignette, and lighting effects are interpolated during scrolling.

This approach creates a cinematic visual experience while keeping the underlying asset workflow relatively lightweight.

### Scroll-Driven Animation

GSAP and ScrollTrigger coordinate the main cinematic interactions.

The project uses:

- Scroll-synchronized camera movement.
- Animated SVG contours.
- Image reveal transitions.
- Clip-path and mask-based compositions.
- Editorial text transitions.
- A one-time animated footer reveal.

Animations are organized within GSAP contexts to support proper cleanup.

### Responsive Art Direction

The experience is not simply a desktop layout scaled down for mobile.

Different visual decisions are applied depending on viewport size:

- Independent hero camera keyframes.
- Different scroll distances and scrub values.
- Mobile-specific image framing.
- Repositioned interactive controls.
- Adapted reveal directions.
- Responsive footer animation dimensions.

### Reduced Motion Support

The project respects the `prefers-reduced-motion` media preference.

When reduced motion is enabled:

- The hero displays a static opening frame.
- Scroll-pinned cinematic movement is disabled.
- Animated sections display their completed visual states.
- The footer displays its completed wordmark without the moving wheel.
- Programmatic scrolling uses automatic behavior.

### Optimized Master Image Loading

The master image is imported statically through Vite.

This allows the production build to generate a hashed asset URL shared by the HTML preload and the JavaScript runtime reference, avoiding the duplicate image download caused by separate asset paths.

---

## Technology Stack

| Technology | Purpose |
|---|---|
| React 19 | User interface and component architecture |
| TypeScript | Type safety |
| Vite 8 | Development server and production bundling |
| Tailwind CSS 4 | Utility-based styling |
| GSAP 3 | Animation orchestration |
| GSAP ScrollTrigger | Scroll-driven interactions |
| Canvas 2D | Cinematic image rendering |
| SVG | Vector illustrations and visual effects |
| Lucide React | Interface icons |

**Typography:** Google Fonts — Barlow Condensed, Plus Jakarta Sans, and JetBrains Mono.

---

## Project Architecture

```text
/
├── index.html
├── metadata.json
├── package.json
├── bun.lock
├── tsconfig.json
├── vite.config.ts
├── .env.example
│
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    │
    ├── assets/
    │   └── images/
    │       └── apex_r01_master_plate_1795004771040.jpg
    │
    ├── data/
    │   └── sequenceConfig.ts
    │
    ├── lib/
    │   └── sequenceEngine.ts
    │
    └── components/
        ├── TopBar.tsx
        ├── CinematicHero.tsx
        ├── DesignSection.tsx
        ├── EngineeringSection.tsx
        ├── PerformanceSection.tsx
        ├── FinalRevealSection.tsx
        └── CinematicFooter.tsx
```

### Core Files

| File | Responsibility |
|---|---|
| `src/App.tsx` | Composes the complete page and its sections |
| `src/main.tsx` | React application entry point |
| `src/index.css` | Global styles, Tailwind configuration, and motion fallback |
| `src/data/sequenceConfig.ts` | Master image import and desktop/mobile camera keyframes |
| `src/lib/sequenceEngine.ts` | Camera interpolation, Canvas rendering, and progressive frame preparation |
| `src/components/TopBar.tsx` | Fixed navigation and responsive mobile menu |
| `src/components/CinematicHero.tsx` | Main cinematic camera sequence |
| `src/components/DesignSection.tsx` | Animated design-line presentation |
| `src/components/EngineeringSection.tsx` | Conceptual material reveal |
| `src/components/PerformanceSection.tsx` | Interactive visual modes |
| `src/components/FinalRevealSection.tsx` | Final vehicle composition |
| `src/components/CinematicFooter.tsx` | Animated brand signature and credits |

---

## Getting Started

### Prerequisites

- Node.js
- npm or Bun

The project includes a `bun.lock` lockfile and also supports npm installation.

### Installation

Clone the repository:

```bash
git clone YOUR_REPOSITORY_URL
cd YOUR_PROJECT_DIRECTORY
```

Install dependencies using Bun:

```bash
bun install
```

Or use npm:

```bash
npm install
```

### Development Server

Start the development server:

```bash
npm run dev
```

The Vite development server uses port `3000`.

Open:

```text
http://localhost:3000
```

### Production Build

Generate the production build:

```bash
npm run build
```

The generated files are placed in:

```text
dist/
```

### Preview Production Build

```bash
npm run preview
```

### TypeScript Validation

```bash
npm run lint
```

Despite the script name, this command runs TypeScript validation:

```bash
tsc --noEmit
```

---

## Accessibility and Interaction

Accessibility considerations implemented in the project include:

- Semantic page landmarks and section headings.
- Accessible labels for interactive controls.
- `aria-expanded` and `aria-controls` for the mobile navigation.
- `aria-current` for active navigation links.
- `aria-pressed` for performance mode selection.
- Keyboard support for the mobile menu, including Escape to close.
- Visible keyboard focus states.
- Minimum 44px touch targets for primary interactive controls.
- Reduced-motion alternatives.

These implementations are part of the source code; comprehensive assistive-technology testing has not been claimed.

---

## Project Limitations

APEX is a frontend portfolio concept, not a production automotive platform.

- The APEX R-01 is entirely fictional.
- All vehicle design and material descriptions are conceptual.
- No verified performance figures, engineering specifications, or production claims are provided.
- The cinematic experience uses 2D image manipulation, not real-time 3D.
- No Three.js, WebGL, or custom real-time shaders are used.
- There is no backend, database, authentication, or user account system.
- There are no live Gemini API integrations or AI-powered features.
- The performance selector is a visual interaction, not a physical simulation.
- The interface content is currently available in English only.
- Google Fonts are loaded from an external service.

The project is intended to demonstrate frontend development, visual storytelling, animation orchestration, responsive art direction, and creative technical problem-solving.

---

## Project Status

**Completed — Portfolio Concept**

The main experience, responsive layouts, cinematic sections, navigation, and footer have been implemented and visually reviewed on a mobile device.

Technical validation has included TypeScript checks and production builds.

Automated browser-based testing and comprehensive accessibility testing have not been performed.

---

## Credits

**APEX R-01 — Cinematic Automotive Experience**

A fictional automotive brand concept created as a frontend development and digital experience portfolio project.

Designed and developed by **Rafael Douglas**.
