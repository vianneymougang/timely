# Plan UI/UX Redesign — Timely Phase G (Refonte Complète)

> **Objectif** : Refonte premium complète du frontend — visuelle ET structurelle. Navigation repensée, pages manquantes implémentées, expérience utilisateur cohérente de bout en bout.
> **Branche** : `feature/ui-redesign`
> **Stack** : Angular 20.2 · Tailwind v3.4 · PrimeNG v21 · @ng-icons/phosphor-icons · @scripttype/ng-motion 0.5.0

---

## Consignes d'Implémentation

### Workflow obligatoire avant chaque sprint

**Avant d'écrire la moindre ligne de code ou de config pour une librairie :**

1. **Consulter la documentation officielle** avec `ctx7` :
   ```bash
   ctx7 library "<nom librairie>"          # résoudre l'ID
   ctx7 docs <libraryId> "<sujet précis>"  # lire la doc
   ```
2. **Rechercher si ctx7 ne couvre pas** la librairie avec `ddgr`, ou fetcher la doc directement :
   ```bash
   ddgr --np "<package> <feature> site:github.com OR site:npmjs.com"
   curl -s "https://raw.githubusercontent.com/<org>/<repo>/main/docs/<page>.md"
   ```
   - **ng-motion** : doc officielle sur `https://ng-motion.dev/docs/` — sources brutes sur `https://raw.githubusercontent.com/ScriptType/ng-motion/main/docs/`
3. **Charger les skills de design frontend** en début de session (tous sauf `frontend-design`) :
   - `ng-motion:ng-motion`
   - `high-end-visual-design`
   - `minimalist-ui`
   - `design-taste-frontend`
   - `redesign-existing-projects`
   - `stitch-design-taste`
   - `industrial-brutalist-ui`

### Rappels techniques Sprint 0 (vérifiés via docs officielles)

**@scripttype/ng-motion v0.5.0** ([API ref](https://raw.githubusercontent.com/ScriptType/ng-motion/main/docs/api-reference.md)) :
- `withMotionTransitions` **n'existe pas** — absent de l'API officielle → utiliser `withViewTransitions()` depuis `@angular/router`
- `provideMotionConfig(config)` : defaults globaux (transition, reducedMotion)
- `provideMotionFeatures(bundle)` + `ngmAllFeatures` : chargement des features (gestures, drag, layout…)
- `motion-dom` et `motion-utils` sont des peer dependencies — bien présents en tant que dépendances transitives
- Directive : `NgmMotionDirective` importée dans `imports[]` du composant
- `NgmPresenceDirective` pour les animations d'entrée/sortie avec `*ngmPresence`

**PrimeNG v21 / @primeuix/themes** :
- Tokens **toujours imbriqués** : `card.root.borderRadius`, `button.root.borderRadius`, `inputtext.root.paddingX`
- Couleurs sous `colorScheme.light.root` (pas à plat)

**@ng-icons/core + @ng-icons/phosphor-icons** :
- Icons importés **par composant** : `provideIcons({phosphorHouse, ...})` dans `providers[]`, `NgIcon` dans `imports[]`
- `provideNgIconsConfig({ size: '1.25rem' })` dans `app.config.ts` pour la taille globale
- Nommage : `phosphor` + PascalCase (ex: `phosphorWarning`, `phosphorCalendar`)

---

## Table des matières

1. [État des lieux exhaustif](#1-état-des-lieux-exhaustif)
2. [Architecture de Navigation Repensée](#2-architecture-de-navigation-repensée)
3. [Système de Design — Tokens](#3-système-de-design--tokens)
4. [Installation & Setup](#4-installation--setup)
5. [ngMotion — Système d'Animation](#5-ngmotion--système-danimation)
6. [Composants Partagés](#6-composants-partagés)
7. [Pages Auth](#7-pages-auth)
8. [Admin — Pages Prioritaires Démo](#8-admin--pages-prioritaires-démo)
9. [Admin — Pages Secondaires & Nouvelles](#9-admin--pages-secondaires--nouvelles)
10. [Enseignant — Toutes les Pages](#10-enseignant--toutes-les-pages)
11. [Pages Globales](#11-pages-globales)
12. [Roadmap d'Implémentation](#12-roadmap-dimplémentation)

---

## 1. État des Lieux Exhaustif

### 1.1 Scan des pages existantes

| Section | Page | Lignes HTML | État |
|---------|------|-------------|------|
| **Admin** | Dashboard | 213 | ✅ Implémenté — refonte visuelle |
| **Admin** | Academic (Filières/Classes) | 475 | ✅ Implémenté — refonte visuelle |
| **Admin** | Courses (Cours) | 478 | ✅ Implémenté — refonte visuelle |
| **Admin** | Etudiants | 867 | ✅ Implémenté — refonte visuelle |
| **Admin** | Reports | 140 | ⚠️ Partiel — backend stub + refonte visuelle |
| **Admin** | Resources (Matériels/Équipements) | 517 | ✅ Implémenté — refonte visuelle |
| **Admin** | Room (Salles) | 522 | ✅ Implémenté — refonte visuelle |
| **Admin** | Schedule (container onglets) | 49 | ⚠️ Wrapper simple — restructuration routes |
| **Admin** | Settings | 556 | ✅ Implémenté — refonte visuelle |
| **Admin** | Statistics | 515 | ✅ Implémenté — refonte visuelle |
| **Admin** | Teachers | 603 (sub-component) | ✅ Implémenté — refonte visuelle |
| **Admin** | Conflicts | — | 🔴 N'existe pas — à créer |
| **Teacher** | Dashboard | 143 | ✅ Implémenté — refonte visuelle |
| **Teacher** | Schedule (EDT) | 116 | ✅ Implémenté — refonte visuelle |
| **Teacher** | Availability | 352 | ✅ Déjà refactorisé — améliorations mineures |
| **Teacher** | Courses | 128 | 🔴 Contenu invalide (ancienne sidebar copiée) — à créer |
| **Teacher** | Notifications | 1 | 🔴 Stub vide — à créer |
| **Teacher** | Profile | 1 | 🔴 Stub vide — à créer |
| **Auth** | Login | 81 | ✅ Implémenté — refonte visuelle |
| **Auth** | Forgot Password | 82 | ✅ Implémenté — refonte visuelle |
| **Auth** | Reset Password | 192 | ✅ Implémenté — refonte visuelle |
| **Auth** | Verify Code | 132 | ✅ Implémenté — refonte visuelle |
| **Global** | 404 | — | 🔴 N'existe pas — à créer |

### 1.2 Problèmes structuraux identifiés

**Navigation Admin** :
- Menu plat sans groupes logiques (11 items sans hiérarchie)
- "Statistics" et "Reports" sont séparés alors qu'ils sont conceptuellement liés
- "Resources" (matériels/équipements) noyé au même niveau que "Rooms" et "Courses"
- Aucune section dédiée aux conflits d'EDT (actuellement intégrée dans le viewer)

**Navigation Enseignant** :
- "Mes cours" pointe vers un composant qui affiche une ancienne sidebar au lieu du contenu
- "Notifications" et "Profile" sont des stubs totaux (1 ligne chacun)
- Dashboard = page générique, pas de vrai "planning de la semaine en vue"
- Menu sans groupes logiques (tout au même niveau)

**Architecture routes Admin Schedule** :
- Un seul composant wrapper avec `activeTab()` signal pour switcher entre Générer / Liste
- Le Viewer est une sous-route séparée (`/viewer`) non accessible directement depuis le menu
- Structure à remplacer par des sous-routes propres avec navigation dédiée

**Composants partagés** :
- Deux sidebars distinctes (`sidebar/` et `teacher-sidebar/`) sans composant commun
- `stat-card` et `alert-card` : composants basiques sans animation ni états loading/empty
- Pas de composant `PageHeader`, `EmptyState`, `SkeletonLoader`, `StatusBadge`

**Icônes** :
- Mix de Material Icons CSS class (`material-icons`) et SVG inline — aucune cohérence
- lucide-angular installé mais peu utilisé
- Aucun système d'icônes unifié

### 1.3 Services disponibles (base solide)

```
api, auth, availability, classe, cours, ecole, equipement,
etudiant, filiere, groupe, materiel, planning, report,
salle, teacher, user, ue, ThemeService
```

Tous les services nécessaires à l'implémentation des pages manquantes existent déjà.

---

## 2. Architecture de Navigation Repensée

### 2.1 Sidebar Admin — Groupes et items

La navigation admin passe de 11 items plats à une structure en **5 groupes logiques** avec labels de section.

```
┌─────────────────────────────────┐
│  ▣ Timely          [avatar] ↗   │
├─────────────────────────────────┤
│                                 │
│  VUE D'ENSEMBLE                 │
│  ⊡ Dashboard                    │
│                                 │
│  EMPLOIS DU TEMPS               │
│  ⊞ Générer un EDT               │
│  ⊟ Explorer les EDTs            │
│  ⚠ Conflits           [badge N] │
│                                 │
│  GESTION ACADÉMIQUE             │
│  ⊙ Enseignants                  │
│  ⊙ Étudiants                    │
│  ⊙ Cours                        │
│  ⊙ Structure académique         │
│                                 │
│  INFRASTRUCTURES                │
│  ⊙ Salles                       │
│  ⊙ Ressources                   │
│                                 │
│  ANALYSE                        │
│  ⊙ Statistiques & Rapports      │
│                                 │
├─────────────────────────────────┤
│  ⚙ Paramètres                   │
│  [avatar] Nom Admin             │
│  [→ Déconnexion]                │
└─────────────────────────────────┘
```

**Changements structuraux** :
- "Statistics" et "Reports" **fusionnés** en une seule page "Statistiques & Rapports" avec tabs internes
- Nouvelle route `/admin/conflicts` avec badge de comptage en temps réel
- "Structure académique" regroupe : filières, classes, UEs (anciennement "Academic")
- Paramètres et déconnexion en pied de sidebar

**Routes admin mises à jour** :

```typescript
export const ADMIN_ROUTES: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', loadComponent: () => import('./dashboard/...' },
  // Emplois du temps
  { path: 'schedule/generate', loadComponent: () => import('./schedule/generator/...') },
  { path: 'schedule/explore', loadComponent: () => import('./schedule/list/...') },
  { path: 'schedule/view/:id', loadComponent: () => import('./schedule/viewer/...') },
  { path: 'conflicts', loadComponent: () => import('./conflicts/conflicts.component') },
  // Gestion académique
  { path: 'teachers', loadComponent: () => import('./teachers/teachers-list/...') },
  { path: 'students', loadComponent: () => import('./etudiants/...') },
  { path: 'courses', loadComponent: () => import('./courses/...') },
  { path: 'academic', loadComponent: () => import('./academic/...') },
  // Infrastructures
  { path: 'rooms', loadComponent: () => import('./room/...') },
  { path: 'resources', loadComponent: () => import('./ressources/...') },
  // Analyse
  { path: 'analytics', loadComponent: () => import('./analytics/analytics.component') },
  // Settings
  { path: 'settings', loadComponent: () => import('./settings/...') },
];
```

### 2.2 Sidebar Enseignant — Groupes et items

```
┌─────────────────────────────────┐
│  ▣ Timely          [avatar] ↗   │
├─────────────────────────────────┤
│                                 │
│  MON PLANNING                   │
│  ⊡ Vue semaine (Dashboard)      │
│  ⊟ Mon EDT complet              │
│                                 │
│  MA CHARGE                      │
│  ⊙ Mes cours                    │
│  ⊙ Mes disponibilités           │
│                                 │
│  PERSONNEL                      │
│  ⊙ Notifications        [N]     │
│  ⊙ Mon profil                   │
│                                 │
├─────────────────────────────────┤
│  [avatar] Prénom Nom            │
│  [→ Déconnexion]                │
└─────────────────────────────────┘
```

**Changements structuraux** :
- Dashboard renommé "Vue semaine" — titre qui décrit exactement ce que c'est
- "Mon EDT complet" = vue grille 6 jours filtrable par semaine (anciennement `teacher/schedule`)
- Notifications avec badge de comptage non lues
- Groupes labellisés pour une lecture immédiate

**Routes teacher mises à jour** :

```typescript
export const TEACHER_ROUTES: Routes = [
  { path: '', redirectTo: 'week', pathMatch: 'full' },
  { path: 'week', loadComponent: () => import('./dashboard/...') },
  { path: 'schedule', loadComponent: () => import('./schedule/...') },
  { path: 'courses', loadComponent: () => import('./courses/...') },
  { path: 'availability', loadComponent: () => import('./availability/...') },
  { path: 'notifications', loadComponent: () => import('./notifications/...') },
  { path: 'profile', loadComponent: () => import('./profile/...') },
];
```

### 2.3 Header global (top bar)

Chaque layout dispose d'un header sticky en haut, commun aux deux rôles :

```
┌────────────────────────────────────────────────────────┐
│ [Fil d'ariane]                    [🔔 3] [Avatar ▾]   │
└────────────────────────────────────────────────────────┘
```

- **Breadcrumb** : fil d'ariane automatique basé sur la route active
- **Cloche notifications** : badge compteur (admin + enseignant)
- **Menu avatar** : accès rapide profil + déconnexion

---

## 3. Système de Design — Tokens

### 3.1 Palette de Couleurs

```scss
// Canvas & Surfaces
--color-canvas:       #F9FAFB;  // Fond application
--color-surface:      #FFFFFF;  // Cards, inputs, sidebar
--color-surface-sub:  #F3F4F6;  // Hover rows, sous-surfaces

// Texte
--color-text-primary:   #111827;  // Titres (near-black)
--color-text-secondary: #374151;  // Corps
--color-text-muted:     #6B7280;  // Métadonnées, labels secondaires
--color-text-faint:     #9CA3AF;  // Timestamps, désactivé

// Bordures (tintées slate)
--color-border:        rgba(226, 232, 240, 0.8);
--color-border-strong: rgba(203, 213, 225, 0.9);
--color-border-faint:  rgba(241, 245, 249, 0.9);

// Accent Unique — Indigo
--color-accent:        #6366F1;  // CTA, active nav, focus ring
--color-accent-hover:  #4F46E5;  // Hover
--color-accent-light:  #EEF2FF;  // Bg teinté léger
--color-accent-muted:  #818CF8;  // Icônes secondaires

// Sémantique
--color-success:  #22C55E;
--color-warning:  #F59E0B;
--color-danger:   #EF4444;
--color-info:     #3B82F6;

--color-success-bg: #F0FDF4;
--color-warning-bg: #FFFBEB;
--color-danger-bg:  #FEF2F2;
--color-info-bg:    #EFF6FF;

// Ombres tintées
--shadow-xs: 0 1px 2px rgba(17, 24, 39, 0.04);
--shadow-sm: 0 2px 8px rgba(17, 24, 39, 0.06);
--shadow-md: 0 4px 16px rgba(17, 24, 39, 0.08);
--shadow-lg: 0 8px 32px rgba(17, 24, 39, 0.10);
```

### 3.2 Typographie

| Famille | Poids | Usage |
|---------|-------|-------|
| **Plus Jakarta Sans** | 400, 500, 600, 700 | Corps, UI, navigation, labels |
| **Fraunces** | 400, 600 | Titres H1/H2 display seulement |
| **JetBrains Mono** | 400, 500 | Timestamps, chiffres grilles, codes |

```scss
// Échelle
--text-xs:   0.75rem / 1rem;
--text-sm:   0.875rem / 1.25rem;
--text-base: 1rem / 1.5rem;
--text-lg:   1.125rem / 1.75rem;
--text-xl:   1.25rem / 1.75rem;
--text-2xl:  1.5rem / 2rem;
--text-3xl:  1.875rem / 2.25rem;

// Tracking
--tracking-tight:  -0.02em;  // Titres Fraunces
--tracking-wide:    0.05em;  // Labels uppercase

// Tabular nums pour toutes les données chiffrées
.data-value { font-variant-numeric: tabular-nums; }
```

### 3.3 Border-Radius

```scss
--radius-sm:   6px;    // inputs, petits badges
--radius-md:   8px;    // boutons
--radius-lg:   12px;   // cards standard
--radius-xl:   16px;   // panels, drawers
--radius-2xl:  24px;   // login card, modales
--radius-full: 9999px; // pills, tags, avatars
```

### 3.4 Icônes — Phosphor Icons

Remplacement complet de `material-icons` CSS class et des SVG inline éparpillés.

```bash
bun add @phosphor-icons/angular
```

**Règle poids** :
- `regular` (défaut) — navigation, labels
- `bold` — actions importantes, alertes
- `fill` — états actifs, icônes dans cercles colorés

---

## 4. Installation & Setup

### 4.1 Nouvelle branche

```bash
git checkout develop
git checkout -b feature/ui-redesign
```

### 4.2 Dépendances

```bash
cd timely-frontend
bun add primeng @primeng/themes @primeuix/themes
bun add @phosphor-icons/angular
# Conserver @angular/animations (requis par PrimeNG)
# @angular/material peut rester mais ne plus être utilisé
```

### 4.3 index.html — Fonts

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=JetBrains+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### 4.4 Preset PrimeNG — `src/app/core/theme/timely-preset.ts`

```typescript
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

export const TimelyPreset = definePreset(Aura, {
  primitive: {
    indigo: {
      50: '#eef2ff', 100: '#e0e7ff', 200: '#c7d2fe', 300: '#a5b4fc',
      400: '#818cf8', 500: '#6366f1', 600: '#4f46e5', 700: '#4338ca',
      800: '#3730a3', 900: '#312e81', 950: '#1e1b4b',
    },
  },
  semantic: {
    primary: {
      50: '{indigo.50}', 100: '{indigo.100}', 200: '{indigo.200}',
      300: '{indigo.300}', 400: '{indigo.400}', 500: '{indigo.500}',
      600: '{indigo.600}', 700: '{indigo.700}', 800: '{indigo.800}',
      900: '{indigo.900}', 950: '{indigo.950}',
    },
    focusRing: { width: '2px', style: 'solid', color: '{primary.500}', offset: '2px' },
    colorScheme: {
      light: {
        surface: {
          0: '#ffffff', 50: '#f9fafb', 100: '#f3f4f6', 200: '#e5e7eb',
          300: '#d1d5db', 400: '#9ca3af', 500: '#6b7280', 600: '#4b5563',
          700: '#374151', 800: '#1f2937', 900: '#111827', 950: '#030712',
        },
      },
    },
  },
  components: {
    button:    { borderRadius: '8px', paddingX: '1rem', paddingY: '0.5rem', fontWeight: '600', fontSize: '0.875rem' },
    inputtext: { borderRadius: '8px', paddingX: '0.75rem', paddingY: '0.5625rem', fontSize: '0.875rem' },
    card:      { borderRadius: '12px', shadow: '0 2px 8px rgba(17,24,39,0.06)' },
    datatable: { headerCellPaddingX: '1rem', headerCellPaddingY: '0.75rem', bodyRowPaddingX: '1rem', bodyRowPaddingY: '0.75rem' },
    select:    { borderRadius: '8px' },
    drawer:    { borderRadius: '0' },
  },
});
```

### 4.5 app.config.ts

```typescript
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { provideMotionConfig, provideMotionFeatures, ngmAllFeatures } from '@scripttype/ng-motion';
import { withMotionTransitions } from '@scripttype/ng-motion';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { TimelyPreset } from './core/theme/timely-preset';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withMotionTransitions('fade')),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: TimelyPreset,
        options: { darkModeSelector: '.app-dark', cssLayer: false },
      },
      ripple: true,
    }),
    provideMotionConfig({
      transition: { type: 'spring', stiffness: 280, damping: 24 },
      reducedMotion: 'user',
    }),
    provideMotionFeatures(ngmAllFeatures),
  ],
};
```

### 4.6 styles.scss

```scss
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * { margin: 0; padding: 0; box-sizing: border-box; }

  html {
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  body {
    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
    background-color: #F9FAFB;
    color: #111827;
    line-height: 1.5;
  }

  h1, h2 { font-family: 'Fraunces', serif; letter-spacing: -0.02em; line-height: 1.15; }
  h3, h4, h5, h6 { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600; letter-spacing: -0.01em; }
  code, kbd, .mono { font-family: 'JetBrains Mono', monospace; font-variant-numeric: tabular-nums; }
  :focus-visible { outline: 2px solid #6366F1; outline-offset: 2px; }

  // Shimmer animation pour les skeletons
  @keyframes shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position:  200% 0; }
  }
}
```

### 4.7 tailwind.config.js

```js
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        accent: { 50: '#eef2ff', 100: '#e0e7ff', 400: '#818cf8', 500: '#6366f1', 600: '#4f46e5', 700: '#4338ca' },
        surface: { DEFAULT: '#ffffff', sub: '#f3f4f6', canvas: '#f9fafb' },
      },
      fontFamily: {
        sans:    ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        xs: '0 1px 2px rgba(17,24,39,0.04)',
        sm: '0 2px 8px rgba(17,24,39,0.06)',
        md: '0 4px 16px rgba(17,24,39,0.08)',
        lg: '0 8px 32px rgba(17,24,39,0.10)',
      },
    },
  },
  plugins: [],
};
```

---

## 5. ngMotion — Système d'Animation

### 5.1 Variants réutilisables — `src/app/core/animations/motion.variants.ts`

```typescript
import type { Variants, Transition } from '@scripttype/ng-motion';

export const SPRING_DEFAULT: Transition = { type: 'spring', stiffness: 280, damping: 24 };
export const SPRING_SOFT:    Transition = { type: 'spring', stiffness: 180, damping: 20 };
export const SPRING_SNAPPY:  Transition = { type: 'spring', stiffness: 400, damping: 28 };

export const FADE_UP:   Variants = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };
export const FADE_IN:   Variants = { hidden: { opacity: 0 },        visible: { opacity: 1 } };
export const SCALE_IN:  Variants = { hidden: { opacity: 0, scale: 0.94 }, visible: { opacity: 1, scale: 1 } };
export const SLIDE_LEFT:Variants = { hidden: { opacity: 0, x: -12 }, visible: { opacity: 1, x: 0 } };
export const LIST_ITEM: Variants = { hidden: { opacity: 0, x: -8  }, visible: { opacity: 1, x: 0 } };
```

### 5.2 Patterns par contexte

| Contexte | Variant | Spring | Stagger |
|----------|---------|--------|---------|
| Entrée page | `FADE_UP` whileInView | SOFT | — |
| Cards dashboard | `FADE_UP` whileInView | DEFAULT | 60ms/item |
| Items navigation | `SLIDE_LEFT` au mount | SNAPPY | 40ms/item |
| Modales / Drawers | `SCALE_IN` + `[exit]` | DEFAULT | — |
| Boutons CTA | `[whileTap]="{ scale: 0.97 }"` | SNAPPY | — |
| Rows tableau | `FADE_IN` | SOFT | — |
| Toast | `SLIDE_LEFT` + exit auto | DEFAULT | — |
| Skeleton → Contenu | `FADE_IN` | SOFT | — |
| Cellules grille EDT | `FADE_UP` col-first | SOFT | 40ms/col |
| Indicateur actif nav | `[layoutId]="'nav-pill'"` | DEFAULT | — |

### 5.3 Route transitions

Configuré via `withMotionTransitions('fade')`. Utiliser `[viewTransitionName]` sur les éléments héros partagés entre routes (ex: en-tête de page).

### 5.4 Règles de performance

- `[whileInView]` obligatoire pour les animations `repeat: Infinity` (décoratifs)
- Jamais `window.addEventListener('scroll')` — utiliser `useScroll()` ou `IntersectionObserver`
- Pas de `will-change: transform` manuel — WAAPI le gère
- Cleanup `setTimeout` via `DestroyRef.onDestroy()`

---

## 6. Composants Partagés

### 6.1 Sidebar Unifiée

**Un seul composant** `app-sidebar` avec `@Input() role: 'admin' | 'teacher'` qui adapte les groupes de menu.

**Structure** :
```
<aside> sticky, h-[100dvh], w-64, bg-white, border-r
  ├── Logo zone (p-6, border-b)
  │   └── SVG + "Timely" (Fraunces 18px)
  ├── <nav> (flex-1, overflow-y-auto, px-3 py-4)
  │   └── @for groups
  │       ├── label groupe (text-xs uppercase tracking-wide text-muted, px-3 mb-1)
  │       └── @for items (ngmMotion SLIDE_LEFT stagger)
  │           └── <a> (flex gap-3, py-2.5 px-3, rounded-lg)
  │               ├── [layoutId="nav-pill"] pill actif (4px, indigo)
  │               ├── ph-icon (20px)
  │               └── label (14px 500)
  │               └── badge optionnel (conflicts count)
  └── Footer (border-t, p-4)
      ├── Avatar squircle + nom + rôle
      └── Bouton déconnexion (icon + label)
```

### 6.2 Layout Admin & Enseignant

```html
<div class="flex min-h-[100dvh] bg-surface-canvas">
  <app-sidebar [role]="'admin'" />
  <div class="flex-1 flex flex-col min-w-0">
    <app-top-header />  <!-- breadcrumb + notif + avatar -->
    <main class="flex-1 px-8 py-6">
      <router-outlet />
    </main>
  </div>
</div>
```

### 6.3 TopHeader

- Sticky, `bg-white/80 backdrop-blur-sm`, `border-b`
- Gauche : `p-breadcrumb` PrimeNG (génération auto depuis router)
- Droite : bouton notifications (badge non lues) + avatar menu

### 6.4 PageHeader

Input : `section` (label catégorie), `title` (Fraunces), `description`, slot `actions`.

```html
<section class="flex items-start justify-between mb-8" ngmMotion [animate]="'visible'" [variants]="FADE_UP">
  <div>
    <p class="text-xs font-medium tracking-wide uppercase text-accent-400 mb-1">{{ section }}</p>
    <h1 class="font-display text-2xl font-semibold tracking-tight text-text-primary">{{ title }}</h1>
    <p class="text-sm text-text-muted mt-1">{{ description }}</p>
  </div>
  <div class="flex gap-2"><ng-content select="[actions]" /></div>
</section>
```

### 6.5 StatCard

Inputs : `label`, `value`, `trend` (+/-%), `icon` (phosphor), `color` (semantic).

- Fond blanc, border `rgba(226,232,240,0.8)`, radius 12px, shadow-sm
- Icône dans carré 36px fond `accent-light` (ou sémantique)
- Valeur en `font-mono font-bold text-2xl tabular-nums`
- Trend badge pill vert/rouge avec flèche phosphor

### 6.6 SkeletonLoader

```scss
.skeleton-line {
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 37%, #f3f4f6 63%);
  background-size: 400% 100%;
  animation: shimmer 1.5s ease infinite;
  border-radius: 6px;
}
```

Utilisation : reproduire la forme du contenu attendu (largeurs variables, hauteurs précises).

### 6.7 EmptyState

- Illustration SVG contextuelle (pas d'emoji)
- Titre (Plus Jakarta 16px 600)
- Description (14px muted)
- Bouton d'action optionnel

### 6.8 StatusBadge

```
PUBLIE / DISPONIBLE   → #F0FDF4 bg, #166534 text, dot vert pulsant
BROUILLON / EN_ATTENTE → #FFFBEB bg, #92400E text
CONFLIT / INDISPONIBLE → #FEF2F2 bg, #991B1B text
DEFAULT               → #F3F4F6 bg, #374151 text
```

---

## 7. Pages Auth

### 7.1 Login

**Layout deux colonnes asymétriques (60/40)** :

- **Gauche 60% — brand panel** : fond indigo `#6366F1`, grain texture `::after` fixed, logo blanc, tagline, schéma EDT illustré en SVG blanc/20
- **Droite 40% — form panel** : fond blanc, formulaire centré verticalement, max-w 380px

**Form** :
- "Connexion" en Fraunces 24px
- Email + Mot de passe via `p-inputtext` PrimeNG
- `p-button` full-width indigo + `[whileTap]="{ scale: 0.98 }"`
- Lien "Mot de passe oublié ?" text-link discret

**Mobile** : une colonne, brand panel condensé en header 80px.

**Animations** :
- Brand panel : `FADE_UP` illustration au mount
- Form card : `SCALE_IN` délayé 100ms

### 7.2 Forgot / Reset / Verify

Card centrée `max-w-md`, radius 24px, shadow-lg, fond canvas.
- Icône phosphor fill 48px dans cercle accent-light 80px
- Titre Fraunces, description muted
- Inputs PrimeNG stylisés
- Bouton indigo + `[whileTap]`
- ngMotion : `SCALE_IN` à l'entrée

---

## 8. Admin — Pages Prioritaires Démo

### 8.1 Dashboard Admin

**Layout bento asymétrique** — pas 4 cards égales.

```
┌──────────────────────────────────────────┐
│  PageHeader "Tableau de bord"            │
├────────┬────────┬────────┬───────────────┤
│ KPI 1  │ KPI 2  │ KPI 3  │  Alertes      │
├────────┴────────┴────────┤  actives      │
│  Chart cours/semaine     │  (panel       │
│  (p-chart bar, indigo)   │   scroll)     │
├──────────────────────────┤               │
│  Activité récente        │               │
│  (5 dernières actions)   │               │
└──────────────────────────┴───────────────┘
```

**KPI cards** (staggered `FADE_UP`, delay 60ms each) :
- Total Enseignants — icône `Users`, accent indigo
- Total Salles + taux occupation — icône `Door`, vert si > 60%
- Total Cours + non planifiés — icône `BookOpen`, orange si non planifiés > 0
- Conflits actifs — icône `Warning`, rouge si > 0

**Chart** : `p-chart` (type: 'bar'), données réelles `coursParSemaine[4]`, palette indigo.

**Panel Alertes** :
- Liste avec `[exit]` au dismiss
- Dot coloré + message + heure relative + action "Voir" / "Résoudre"
- Empty state si aucune alerte

**Activité récente** :
- Timeline 5 dernières actions (génération EDT, publication, résolution conflit)
- Timestamp relatif (JetBrains Mono)

### 8.2 Admin Conflicts (NOUVELLE PAGE)

Route : `/admin/conflicts`

**Concept** : Page dédiée à la visualisation et résolution de tous les conflits actifs.

**Header** : PageHeader avec badge compteur + filtre par type (CHEVAUCHEMENT_SALLE, CHEVAUCHEMENT_ENSEIGNANT, etc.)

**Layout** :
- Filtres (type, école, semaine) — `p-select` + `p-calendar`
- `p-datatable` des conflits avec colonnes : Type badge, Enseignant, Salle, Créneau, École, Actions
- Click ligne → drawer avec détail complet + options résolution

**Actions de résolution** :
- "Réassigner la salle" → drawer sélection salle alternative
- "Déplacer le créneau" → mini-grille EDT pick
- "Marquer comme résolu manuellement"

**États** :
- Loading : skeleton 10 lignes
- Aucun conflit : empty state avec illustration check vert

**Données** : `planning.service.ts` (méthode `getConflicts()` ou endpoint dédié)

### 8.3 Schedule — Generator

Route : `/admin/schedule/generate`

**Layout** : Formulaire en 2 colonnes (left : config, right : récap + résultat)

**Étapes visuelles** (stepper horizontal) :
1. Sélection semaine (PrimeNG Calendar, highlight lundis)
2. Options (campus-wide obligatoire — champ informatif)
3. Génération en cours (barre de progression + log)
4. Résultat par école (tableau succès/échec)

**Barre progression** :
- `MotionValue` pour smooth fill animation
- Messages de log défilants (`@for` avec exit)

### 8.4 Schedule — Explorer / Liste

Route : `/admin/schedule/explore`

**Layout** : Filtres + cards EDT générés

**Cards EDT** :
- Semaine, statut badge, nombre créneaux, écoles couvertes
- Actions : Visualiser, Publier, Supprimer
- Grid 3 colonnes → 1 sur mobile

### 8.5 Schedule — Viewer

Route : `/admin/schedule/view/:id`

**Concept** : Grille EDT 6 jours × 8 créneaux. Page dédiée plein-écran.

**Header** :
- Navigateur semaine (← semaine / semaine →)
- Filtres : École `p-select`, Enseignant `p-select`, Classe `p-select`
- Statut badge + Bouton "Publier" (si BROUILLON) + "Exporter iCal"

**Grille EDT** :
- Colonne temps : 08h-12h (4 créneaux) | pause 12h-13h | 13h-17h (4 créneaux)
- 6 colonnes jours : Lun-Sam
- Cellule remplie : `rounded-lg p-2` couleur par matière (5 couleurs cycliques) + cours + salle + enseignant en 12px mono
- Cellule conflit : fond danger-bg, border rouge 2px, icône warning
- Cellule vide : fond canvas hover accent-light/30
- Click cellule → `p-drawer` latéral détail

**Animation grille** : colonnes en `FADE_UP` cascade, `delay: colIndex * 0.04`

### 8.6 Analytics (fusion Statistics + Reports)

Route : `/admin/analytics`

**Layout** : Tabs internes (PrimeNG `p-tabs`) :
- **Statistiques** : KPIs + 4 graphiques (occupation salles, charge horaire, distribution cours, conflits)
- **Rapports** : Configuration + liste des rapports générés + téléchargement

**Onglet Statistiques** :
- Bento asymétrique : graphique barres horizontales occupation salles (large) + doughnut distribution cours (compact) + datatable charge horaire enseignants
- Sparkline 4 semaines conflits (SVG custom léger)

**Onglet Rapports** :
- Gauche : `p-select` type, `p-calendar` période, `p-togglebutton` format + bouton Générer
- Droite : `p-datatable` rapports existants (titre, type, date, format, statut, actions)
- Loading skeleton, empty state stylisé

---

## 9. Admin — Pages Secondaires & Nouvelles

### 9.1 Teachers (Enseignants)

**Layout** : Header + filtres + `p-datatable`

**Colonnes datatable** :
- Avatar (squircle initiales) + Nom complet + email
- Département / École
- Charge horaire (h/semaine) — mono
- Statut emploi (badge)
- Actions : Voir détail, Modifier disponibilités

**Drawer Détail Enseignant** :
- Onglet "Infos" : profil complet
- Onglet "Disponibilités" : grille compacte 6×8
- Onglet "Cours assignés" : liste cards compactes

### 9.2 Students (Étudiants)

**Layout** : Filtres (école, filière, classe) + `p-datatable`

**Colonnes** : Avatar + Nom + Matricule + Filière + Classe + Statut

### 9.3 Courses (Cours)

**Layout** : Filtres (école, filière, enseignant, type) + `p-datatable`

**Colonnes** : Code + Intitulé + Type badge (CM/TD/TP) + Vol. horaire (mono) + Enseignant + Statut planification

### 9.4 Academic (Structure Académique)

**Layout** : Tabs internes "Filières" / "Classes" / "UEs"

**Onglet Filières** : Grid cards (nom, cycleType badge, nb classes)
**Onglet Classes** : Datatable (nom, filière, yearIndex, nb étudiants)
**Onglet UEs** : Datatable (code, intitulé, filière, crédits)

### 9.5 Rooms (Salles)

**Layout** : Vue toggle Grid/Table

**Vue Grid** : Cards 3 colonnes — nom, capacité, type, taux occupation sparkline
**Vue Table** : Datatable avec toutes les colonnes

### 9.6 Resources (Ressources)

**Layout** : Tabs "Matériels" / "Équipements"

Chaque onglet : table avec CRUD (ajouter, modifier, supprimer) via drawers.

### 9.7 Settings (Paramètres)

**Layout** : Sidebar interne (5 sections) + contenu à droite

**Sections** :
1. **Profil** — nom, email, photo (upload), téléphone
2. **Sécurité** — changement mot de passe (3 champs), sessions actives
3. **Préférences** — thème (bouton toggle light/dark), langue
4. **Notifications** — toggles par type d'événement
5. **À propos** — version app, infos établissement

---

## 10. Enseignant — Toutes les Pages

### 10.1 Dashboard "Vue Semaine"

**Concept** : Page centrée sur le planning de la semaine courante. Pas un dashboard générique.

**Layout** :
```
┌──────────────────────────────────────────────┐
│  "Bonjour, [Prénom]" (Fraunces) + date auj.  │
├──────────────┬───────────────────────────────┤
│  Mini-grille │  Prochains cours              │
│  EDT semaine │  (liste timeline 5 items)     │
│  (compact    ├───────────────────────────────┤
│   5×8)       │  Stats rapides (3 KPIs)       │
│              │  Cours cette semaine / Total h │
│              │  / Prochaine dispo            │
└──────────────┴───────────────────────────────┘
```

**Animations** :
- Greeting fade-up
- Mini-grille : colonnes staggered
- Timeline items : staggered LIST_ITEM

### 10.2 Mon EDT Complet

**Identique au Schedule Viewer admin** mais :
- Filtré sur l'enseignant connecté (lecture seule)
- Navigateur semaine en haut
- Bouton "Exporter en iCal" (téléchargement fichier .ics)
- Pas de bouton "Publier", pas de filtres multi-école

### 10.3 Mes Cours (NOUVELLE IMPLÉMENTATION)

Route : `/teacher/courses`

**Concept** : Liste des cours dont l'enseignant est responsable, avec détails pédagogiques.

**Layout** : Header + filtres (filière, type) + cards en grid

**Card cours** :
- Code cours (mono) + Intitulé (600 weight)
- Badge type : CM / TD / TP (couleurs sémantiques)
- Filière + Classe(s)
- Volume horaire total / planifié (barre de progression)
- Prochain créneau (date + heure + salle)

**Empty state** : "Aucun cours assigné pour le moment."

**Données** : `teacher.service.ts` → `getTeacherCourses(teacherId)`

### 10.4 Mes Disponibilités

**Déjà refactorisé**. Ajustements mineurs :
- Remplacer icônes Material par Phosphor
- Aligner font sur Plus Jakarta Sans
- Ajouter `ngmMotion` `FADE_UP` aux onglets et à la grille

### 10.5 Notifications (NOUVELLE IMPLÉMENTATION)

Route : `/teacher/notifications`

**Concept** : Centre de notifications avec filtrage et gestion de l'état lu/non-lu.

**Header** : PageHeader + bouton "Tout marquer comme lu" + filtre (toutes / non lues / type)

**Layout** : Liste groupée par date

**Groupes** :
- Aujourd'hui
- Cette semaine
- Plus ancien

**Item notification** :
- Dot coloré (type) + icône phosphor
- Titre en 500weight + description en muted
- Timestamp relatif (mono)
- Actions au hover : "Marquer lu" (check), "Voir détail" (arrow)
- Fond légèrement teinté si non lue (`accent-50`)

**Animations** :
- Items en LIST_ITEM stagger au mount
- `[exit]` quand marqué lu avec `height: 0` (collapsing exit)

**Types de notifications** :
- EDT publié (vert, CalendarCheck)
- Conflit détecté (rouge, Warning)
- Override de disponibilité confirmé (bleu, Clock)
- Cours modifié (orange, BookOpen)

**Données** : `notification-service` via RabbitMQ / polling

### 10.6 Mon Profil (NOUVELLE IMPLÉMENTATION)

Route : `/teacher/profile`

**Concept** : Page profil complète avec modification des informations personnelles.

**Layout** : Deux sections

**Section profil** :
- Avatar large (96px, squircle, fond accent-light, initiales ou photo)
- Nom complet (Fraunces 24px)
- Email + département + école
- Badge rôle "Enseignant"

**Formulaire de modification** (`p-inputtext` PrimeNG) :
- Prénom / Nom (readonly si géré par admin)
- Email professionnel
- Téléphone (optionnel)
- Bio / Spécialité (textarea)

**Section Sécurité** :
- Changement de mot de passe (3 champs)
- Bouton "Mettre à jour le mot de passe"

**États** :
- Sauvegarde : bouton en loading + message de succès (toast)
- Erreur validation : inline sous chaque champ

**Données** : `user.service.ts` → `getCurrentUser()` + `updateProfile()`

---

## 11. Pages Globales

### 11.1 Page 404 (NOUVELLE)

Route : `**` dans `app.routes.ts`

**Concept** : Page d'erreur brandée, utile, jamais frustrante.

**Layout** : Centré vertical et horizontal, fond canvas

**Contenu** :
- "404" en Fraunces 120px, tracking -0.04em, couleur `accent-100` (très pâle)
- Superposé : "Page introuvable" en Fraunces 24px indigo
- Description : "Cette page n'existe pas ou a été déplacée."
- Bouton "Retour au tableau de bord" (indigo) + lien "Retour" (text link)

**Animation** :
- Le "404" entre en `SCALE_IN` avec spring
- Le texte entre en `FADE_UP` avec delay 200ms

---

## 12. Roadmap d'Implémentation

### Ordre strict (sprints atomiques)

```
Sprint 0 — Fondations (1.5h)
├── git checkout -b feature/ui-redesign
├── bun add primeng @primeng/themes @primeuix/themes @phosphor-icons/angular
├── Créer timely-preset.ts
├── Mettre à jour app.config.ts
├── Mettre à jour styles.scss + tailwind.config.js
├── Ajouter fonts dans index.html
├── Créer motion.variants.ts
└── commit: chore(ui): bootstrap PrimeNG preset, Phosphor, fonts and motion config

Sprint 1 — Layout & Composants Partagés (3h)
├── Composant Sidebar unifié (admin + teacher groupes)
├── Composant TopHeader (breadcrumb + notif + avatar)
├── Layouts admin-layout / teacher-layout mis à jour
├── Composant PageHeader
├── Composant StatCard avec ngMotion
├── Composant SkeletonLoader
├── Composant EmptyState
├── Composant StatusBadge
├── Mise à jour admin.routes.ts + teacher.routes.ts
└── commit: feat(ui): unified sidebar, shared components, and updated routes

Sprint 2 — Auth Pages (1.5h)
├── Login (deux colonnes brand panel + form)
├── Forgot Password / Reset Password / Verify Code (card centered)
└── commit: feat(ui): redesign auth pages with split-panel login

Sprint 3 — Admin Dashboard (2h)
├── Layout bento asymétrique
├── KPI cards staggered + vraies données
├── Chart PrimeNG câblé
├── Panel alertes avec exit animations
├── Activité récente
└── commit: feat(ui): redesign admin dashboard with bento layout

Sprint 4 — Admin Conflicts (page nouvelle) (2h)
├── Créer conflicts.component.ts + html + scss
├── Ajouter route /admin/conflicts
├── Datatable conflits + drawer résolution
├── Actions résolution (réassigner salle, déplacer créneau)
├── Empty state "Aucun conflit"
└── commit: feat(admin): implement conflicts management page

Sprint 5 — Schedule (Generator + Explorer + Viewer) (3h)
├── Generator : stepper + progress bar MotionValue
├── Explorer/Liste : cards EDT + navigation
├── Viewer : grille EDT 6×8 + cascade animation + drawer détail
└── commit: feat(ui): redesign schedule pages (generator, explorer, viewer)

Sprint 6 — Analytics (fusion Statistics + Reports) (2.5h)
├── Créer analytics.component.ts + html + scss
├── Onglet Statistiques : bento graphiques
├── Onglet Rapports : configuration + datatable
├── Mise à jour route /admin/analytics
└── commit: feat(admin): create analytics page (statistics + reports merged)

Sprint 7 — Admin Pages Secondaires (3h)
├── Teachers (datatable + drawer 3 onglets)
├── Students (datatable + filtres)
├── Courses (datatable + filtres)
├── Academic (tabs filières/classes/UEs)
├── Rooms (toggle grid/table)
├── Resources (tabs matériels/équipements)
├── Settings (sidebar interne 5 sections)
└── commit: feat(ui): redesign all admin secondary pages

Sprint 8 — Teacher Courses (implémentation nouvelle) (2h)
├── Réécrire teacher-courses.component entièrement
├── Cards cours (code, type, vol. horaire, prochain créneau)
├── Barre progression planification
├── Empty state
└── commit: feat(teacher): implement courses page with planning progress

Sprint 9 — Teacher Notifications (nouvelle) (2h)
├── Réécrire teacher-notifications.component
├── Groupement par date (Aujourd'hui / Semaine / Ancien)
├── Item notification animé avec exit collapsing
├── Filtre + "Tout marquer lu"
└── commit: feat(teacher): implement notifications center

Sprint 10 — Teacher Profile (nouvelle) (1.5h)
├── Réécrire teacher-profile.component
├── Section profil + formulaire modification
├── Section sécurité (changement MDP)
├── Validation inline + toast succès
└── commit: feat(teacher): implement profile page

Sprint 11 — Teacher Dashboard & Schedule (2h)
├── Teacher Dashboard "Vue semaine" restructuré
├── Teacher Schedule (viewer simplifié + export iCal)
├── Teacher Availability améliorations mineures (Phosphor, font)
└── commit: feat(ui): redesign teacher planning pages

Sprint 12 — Page 404 + Polish Global (2h)
├── Créer not-found.component
├── Ajouter route ** dans app.routes.ts
├── Vérification mobile < 768px toutes les pages
├── Audit animations (CPU, GPU only)
├── Cohérence typographique finale
├── Vérification états loading/empty/error partout
└── commit: feat(ui): add 404 page and global polish pass
```

**Durée totale estimée** : ~28h

---

## Annexe A — Logo ISJ — Stratégie d'Usage

### Fichier retenu

**`docs/isj_logo.png`** — Logo "Université Saint Jean" avec fond transparent. Le PNG est obligatoire pour un usage multi-surface sans artefact blanc. Copier vers `timely-frontend/src/assets/images/isj-logo.png`.

> Si le nom officiel actuel est "Institut Saint Jean", utiliser `Logo ISJ.jpg` à la place après extraction du fond (outil online ou Figma). Dans tous les cas, l'asset final doit être un PNG à fond transparent.

### Dualité de marque

L'application distingue deux identités visuelles complémentaires :

| Identité | Usage | Représentation |
|----------|-------|----------------|
| **Timely** | Nom du logiciel | Icône calendrier SVG + texte "Timely" |
| **ISJ** | Nom de l'institution | Logo `isj-logo.png` |

Ces deux identités **ne se remplacent pas** — elles coexistent selon le contexte.

### Emplacements d'utilisation

**1. Page Login — Brand Panel (gauche, fond indigo)**

Le logo ISJ sera affiché en version **blanche** (filter CSS `brightness(0) invert(1)`) sur le fond indigo `#6366F1`. Taille : 80px de hauteur. Positionné en haut du panel brand, centré.

```html
<img src="assets/images/isj-logo.png"
     alt="Université Saint Jean"
     class="h-20 w-auto brightness-0 invert opacity-90" />
```

**2. Sidebar — Zone Logo**

Deux éléments côte à côte dans la zone logo :
- Logo ISJ : 28px de hauteur, couleurs naturelles (sur fond blanc la transparence fonctionne nativement)
- Texte "Timely" : Plus Jakarta Sans Bold 18px, couleur `#111827`

```html
<div class="flex items-center gap-2.5 px-6 py-5 border-b border-border">
  <img src="assets/images/isj-logo.png" alt="ISJ" class="h-7 w-auto" />
  <span class="font-sans font-bold text-lg text-text-primary tracking-tight">Timely</span>
</div>
```

**3. En-têtes de Rapports PDF**

Le logo ISJ est intégré dans les templates PDF générés par `FileGenerationService`. Taille : 48px hauteur, aligné à gauche, avec le nom de l'institution et la date de génération à droite.

**4. Page "À propos" (Settings)**

Logo ISJ en taille normale (120px), centré, avec le nom officiel de l'institution, l'année de fondation, et la version de l'application en dessous.

**5. Favicon**

Extraire l'aigle seul du logo (sans texte) et créer un favicon 32×32 et 180×180 (Apple touch icon). L'aigle centré sur fond indigo `#6366F1`.

> **Note technique** : Ne jamais utiliser le logo JPG directement dans l'app — toujours le PNG. Si une version dark/monochrome est nécessaire, utiliser le filter CSS `brightness(0) invert(1)` plutôt que créer un asset séparé.

---

## Annexe B — Composants PrimeNG utilisés

| Composant PrimeNG | Usage |
|-------------------|-------|
| `p-button` | Tous les CTAs |
| `p-inputtext` | Champs texte |
| `p-textarea` | Bio / description |
| `p-select` / `p-multiselect` | Filtres, sélecteurs |
| `p-datepicker` | Sélecteurs de dates |
| `p-datatable` | Listes tabulaires |
| `p-drawer` | Panneaux latéraux |
| `p-dialog` | Modales confirmation |
| `p-toast` | Notifications toast |
| `p-chart` | Graphiques (bar, doughnut) |
| `p-progressbar` | Génération EDT |
| `p-tabs` / `p-tabpanel` | Onglets internes |
| `p-tag` / `p-chip` | Badges sémantiques |
| `p-skeleton` | Placeholders loading |
| `p-togglebutton` | Format export |
| `p-breadcrumb` | Fil d'ariane |
| `p-avatar` | Avatars utilisateurs |
| `p-steps` | Stepper génération |

---

## Annexe B — Anti-patterns INTERDITS

- ❌ Font `Inter` — Plus Jakarta Sans uniquement
- ❌ `material-icons` CSS class — Phosphor Icons
- ❌ SVG inline éparpillés — utiliser `@phosphor-icons/angular`
- ❌ Fond coloré plein sur KPI cards (`bg-blue-500`)
- ❌ 3 colonnes égales en feature row
- ❌ `h-screen` — `min-h-[100dvh]`
- ❌ Shadow Tailwind par défaut (`shadow-xl`) — custom shadows tintées
- ❌ `#000000` pur — `#111827`
- ❌ Gradient purple/blue "AI aesthetic"
- ❌ Animations sur `top`, `left`, `width`, `height`
- ❌ `will-change: transform` manuel systématique
- ❌ `window.addEventListener('scroll')`
- ❌ Commentaires dans le code source
- ❌ `::ng-deep` pour styler PrimeNG — design tokens uniquement
- ❌ Modales pour chaque action simple — drawer ou inline editing
- ❌ Menu plat sans groupes logiques
- ❌ Pages stub (1 ligne) en production

---

## Annexe C — Pages à Créer (Résumé)

| Page | Route | Priorité | Sprint |
|------|-------|----------|--------|
| Admin Conflicts | `/admin/conflicts` | Haute (démo) | 4 |
| Admin Analytics | `/admin/analytics` | Haute (démo) | 6 |
| Teacher Courses | `/teacher/courses` | Haute | 8 |
| Teacher Notifications | `/teacher/notifications` | Haute | 9 |
| Teacher Profile | `/teacher/profile` | Moyenne | 10 |
| Page 404 | `**` | Basse | 12 |
