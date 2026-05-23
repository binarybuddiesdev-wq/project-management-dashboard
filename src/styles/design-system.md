# Design System — Project Management Dashboard

A premium, Linear-inspired design system tailored for high-productivity workspace applications. Built on Tailwind CSS v4 and designed for an immersive dark-first visual experience with a clean light-mode toggle.

---

## 1. Color Palette

The color system uses deep dark tones and highly legible, contrasting light mode alternatives, powered by Tailwind HSL color tokens.

### Dark Mode (Default)
- **Background (Main)**: `hsl(240 10% 3.9%)` (Zinc 950 - `#09090b`)
- **Background (Panel/Card)**: `hsl(240 10% 5.9%)` (Zinc 900 - `#18181b`)
- **Border**: `hsl(240 3.7% 15.9%)` (Zinc 800 - `#27272a`)
- **Foreground (Primary Text)**: `hsl(0 0% 98%)` (Zinc 50 - `#fafafa`)
- **Foreground (Secondary Text)**: `hsl(240 5% 64.9%)` (Zinc 400 - `#a1a1aa`)
- **Primary / Accent**: `indigo-500` (`#6366f1`) to `purple-500` (`#a855f7`)

### Light Mode
- **Background (Main)**: `hsl(0 0% 100%)` (White - `#ffffff`)
- **Background (Panel/Card)**: `hsl(240 4.8% 95.9%)` (Zinc 50 - `#f4f4f5`)
- **Border**: `hsl(240 5.9% 90%)` (Zinc 200 - `#e4e4e7`)
- **Foreground (Primary Text)**: `hsl(240 10% 3.9%)` (Zinc 950 - `#09090b`)
- **Foreground (Secondary Text)**: `hsl(240 3.8% 46.1%)` (Zinc 500 - `#71717a`)

---

## 2. Typography Scale

Default Font: Inter / Geist Sans. Modern sans-serif typography optimized for density and readability.

| Size Name | Size | Line Height | CSS class | Usage |
|-----------|------|-------------|-----------|-------|
| XS | 12px (0.75rem) | 16px (1rem) | `text-xs` | Badges, small metadata, dates |
| SM | 14px (0.875rem) | 20px (1.25rem) | `text-sm` | Body text, sidebar navigation, form inputs |
| Base | 16px (1rem) | 24px (1.5rem) | `text-base` | Content pages, chat items, descriptions |
| LG | 18px (1.125rem) | 28px (1.75rem) | `text-lg` | Card headers, table titles |
| XL | 20px (1.25rem) | 28px (1.75rem) | `text-xl` | Main section titles |
| 2XL | 24px (1.5rem) | 32px (2rem) | `text-2xl` | Header elements |
| 3XL | 30px (1.875rem) | 36px (2.25rem) | `text-3xl` | Welcome headings, empty states |

---

## 3. Spacing Scale

Strict adherence to a 4px (0.25rem) grid system:

- **1** (4px / 0.25rem) - Subtle inner item padding, icon-text gap
- **2** (8px / 0.5rem) - Buttons internal padding, list-gap
- **3** (12px / 0.75rem) - Input fields, navigation items
- **4** (16px / 1rem) - Default container padding, small cards
- **6** (24px / 1.5rem) - Layout columns, dashboard panels gap
- **8** (32px / 2rem) - Section headers, outer page margins

---

## 4. Border Radius, Shadow & Motion

### Border Radius
- `rounded-md`: 6px (0.375rem) — Inputs, tag badges
- `rounded-lg`: 8px (0.5rem) — Buttons, small containers
- `rounded-xl`: 12px (0.75rem) — Cards, panels, dropdowns
- `rounded-2xl`: 16px (1rem) — Modals, main page segments

### Shadows
- **Card Shadow (Dark)**: `0 4px 30px rgba(0, 0, 0, 0.4)` (Deep ambient)
- **Modal Shadow**: `0 10px 50px rgba(0, 0, 0, 0.5)` (High elevation)
- **Glow Accent**: `0 0 15px rgba(99, 102, 241, 0.15)` (Active selections)

### Motion & Transitions
Use Framer Motion with standard easings:
- **Default Ease**: `[0.16, 1, 0.3, 1]` (Custom spring/ease-out)
- **Duration (Fast)**: `0.15s` (Hover states)
- **Duration (Medium)**: `0.3s` (Modal fade, sidebar expand)
- **Micro-interactions**: Scale down to `0.98` on click; translateY `-2px` with border-color glow on hover.

---

## 5. Component Design Guidelines

### Buttons
- **Primary**: Indigo/purple gradient backdrop, text-white. Flat or subtle border. Scale on active tap.
- **Secondary**: Transparent with border. White text (dark mode) or dark text (light mode). Glowing border on hover.
- **Destructive**: Red-500 to dark-red-600 background, text-white.

### Cards
- Bordered container with subtle overlay background (`bg-zinc-900/50`).
- Hover translates card `translate-y-[-2px]` and increases border brightness.

### Modals
- Backdrop filter `backdrop-blur-md` with semi-transparent overlay.
- Modal card slides up from `y: 20` and scales up from `0.95`.
