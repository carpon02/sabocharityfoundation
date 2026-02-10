# Sabo Youth Foundation | Premium Charity Design Guide

This document serves as the **source of truth** for all visual and technical implementations within the Sabo Youth Foundation project. Any AI agent or developer working on this codebase must adhere to these standards to maintain brand integrity and trust.

---

## 🎨 Professional Color Palette

| Usage                 | Variable                | Hex Code  | Description                              |
| :-------------------- | :---------------------- | :-------- | :--------------------------------------- |
| **Primary (Emerald)** | `--color-primary-500`   | `#10b981` | Success, growth, and hope.               |
| **Secondary (Amber)** | `--color-secondary-500` | `#f59e0b` | Warmth, energy, and urgency.             |
| **Dark (Gunmetal)**   | `--color-dark`          | `#111827` | Authority, sophistication, and depth.    |
| **Paper (Light)**     | `--color-paper`         | `#f8fafc` | Clean, modern alternative to pure white. |
| **Paper Dark**        | `--color-paper-dark`    | `#f1f5f9` | Subtle contrast for sectioning.          |

---

## ✍️ Typography Strategy

- **Headings:** Use `Outfit` (Sans-serif).
  - _Weights:_ 700 (Bold), 800 (ExtraBold), 900 (Black).
  - _Style:_ Tight letter-spacing (`tracking-tighter`), often combined with heavy line-height (`leading-[0.9]`).
- **Body Text:** Use `Inter` (Sans-serif).
  - _Weights:_ 400 (Regular), 500 (Medium), 600 (SemiBold).
  - _Style:_ High readability, gentle tracking.

---

## ✨ Visual Elements & UI Patterns

### 1. Glassmorphism

Use the `glass-card` and `glass-card-dark` utilities for floating badges and high-end interactive elements.

```css
.glass-card {
  @apply bg-white/80 backdrop-blur-md border border-white/20 shadow-xl;
}
.glass-card-dark {
  @apply bg-dark/40 backdrop-blur-md border border-white/10 shadow-2xl;
}
```

### 2. Geometries

- **Corners:** Standardize on **40px to 80px** (`rounded-[3rem]` to `rounded-[5rem]`) for major sections and cards.
- **Borders:** Use subtle `border-gray-100` for light sections and `border-white/5` for dark sections.

### 3. Gradients

- **Premium Emerald:** `var(--gradient-premium)` (Primary-900 to Primary-700).
- **Secondary Gold:** `var(--gradient-gold)` (Secondary-400 to Secondary-600).

---

## 🛠️ Technical Protocols

### 📂 File Structure

- **Components:** Modular, reusable, and stored in `src/components`.
- **Pages:** Feature-driven layouts in `src/pages/public`.
- **Assets:** Centralized in `src/assets/assets.js`.

### 🛡️ Development Rules

1. **Clean Imports:** Always remove unused imports and variables before finalizing a file.
2. **Standard Headers:** Every major page/section should use a `SectionHeader` or a variation of the Hero design established (e.g., `HeroModern`).
3. **No Placeholders:** Use high-quality images from the project assets or Unsplash.
4. **Animation:** Use `animate-fade-in-up`, `animate-float`, and `stagger` classes for a "Living UI" feel.

---

## 🏛️ Aesthetic Philosophies

- **The "Legacy" Theme:** Used for history and about sections. Editorial-style layouts with high-contrast mission/vision blocks.
- **The "Control Center" Theme:** Used for authentication and FAQs. High-security, tech-forward, utilizing dark backgrounds and glowing indicators.
- **The "Impact" Theme:** Used for campaigns and media. Grid-heavy, data-driven, highlighting real people and progress bars.

---

> [!IMPORTANT]
> When creating new features, always ask: **"Does this look like a premium global charity, or a generic template?"** If it's the latter, redesign it using the Paper/Gunmetal contrast and Glassmorphism.
