# LedgerX Theme System

Reference this file before touching any page's dark/light mode.

## Core Files

| File | Purpose |
|---|---|
| `src/theme.js` | All design tokens as JS functions — import `{ t }` |
| `src/contexts/ThemeContext.jsx` | `isDark` state + `toggleTheme` — persisted to localStorage |
| `src/components/PublicPageShell.jsx` | Shell for public pages (background + header + footer) |
| `src/components/Layout.jsx` | Shell for authenticated pages (background only — Nav + Sidebar handle theming) |
| `src/components/Navigation.jsx` | Sticky top nav with theme toggle button |
| `src/components/Sidebar.jsx` | Left sidebar — themed |

---

## How to Theme a Page

### Authenticated pages (inside Layout)
The background is handled by Layout. You only need to theme the content:

```jsx
import { useTheme } from '../../contexts/ThemeContext'
import { t } from '../../theme'

const MyPage = () => {
  const { isDark } = useTheme()

  return (
    <div style={t.card(isDark)}>
      <h1 style={{ color: t.text.primary(isDark) }}>Title</h1>
      <p style={{ color: t.text.secondary(isDark) }}>Body</p>
    </div>
  )
}
```

### Public pages (no Layout)
Wrap with `PublicPageShell` — it handles everything:

```jsx
import { useTheme } from '../../contexts/ThemeContext'
import PublicPageShell from '../../components/PublicPageShell'
import { t } from '../../theme'

const MyPublicPage = () => {
  const { isDark } = useTheme()
  return (
    <PublicPageShell>
      <main className="flex-1 px-4 py-10">
        <div style={t.card(isDark)}>...</div>
      </main>
    </PublicPageShell>
  )
}
```

---

## Design Token Reference

```js
import { t } from '../theme'
const { isDark } = useTheme()

// Backgrounds
t.pageBg(isDark)           // '#010c1a'  | '#f0f6ff'

// Cards / Surfaces
t.card(isDark)             // glass card — most content panels
t.glassCard(isDark)        // stronger glass — modals, login panels
t.innerRow(isDark)         // subtle inner section / table row tint

// Header / Sidebar
t.header(isDark)           // nav header style object
t.sidebar(isDark)          // sidebar panel style object

// Text
t.text.primary(isDark)     // '#ffffff'  | '#1e293b'  — headings
t.text.secondary(isDark)   // '#94a3b8'  | '#64748b'  — body copy
t.text.muted(isDark)       // '#64748b'  | '#94a3b8'  — captions, labels
t.text.label(isDark)       // '#475569'  | '#94a3b8'  — sub-labels

// Dividers
t.divider(isDark)          // returns a color string for borderColor / borderBottom

// Inputs
t.input(isDark)            // { background, border, color } for input fields

// Pills / chips
t.pill(isDark)             // { background, border } for user name chips

// Nav items
t.navItem.active           // gradient blue — active route
t.navItem.idle(isDark)     // transparent — default
t.navItem.hover(isDark)    // subtle tint — on hover

// Theme toggle button
t.themeToggle(isDark)      // full style object for Sun/Moon toggle button
```

---

## Color Palette (accent colors for icons/badges)

```
blue    #60a5fa   bg rgba(59,130,246,0.08)   border rgba(59,130,246,0.2)
indigo  #818cf8   bg rgba(99,102,241,0.08)   border rgba(99,102,241,0.2)
violet  #a78bfa   bg rgba(139,92,246,0.08)   border rgba(139,92,246,0.2)
emerald #34d399   bg rgba(16,185,129,0.08)   border rgba(16,185,129,0.2)
amber   #fbbf24   bg rgba(245,158,11,0.08)   border rgba(245,158,11,0.2)
rose    #fb7185   bg rgba(244,63,94,0.08)    border rgba(244,63,94,0.2)
cyan    #22d3ee   bg rgba(6,182,212,0.08)    border rgba(6,182,212,0.2)
green   #4ade80   bg rgba(34,197,94,0.08)    border rgba(34,197,94,0.2)
purple  #c084fc   bg rgba(168,85,247,0.08)   border rgba(168,85,247,0.2)
```

---

## Rules

1. **Never use `useState` for darkMode** — always `useTheme()`.
2. **Never hardcode** `bg-slate-900`, `text-white`, `border-slate-700` — use `t.*` or pair with light equivalent.
3. **All inline `style` props** that deal with color must be `t.text.*(isDark)` or `isDark ? dark : light`.
4. **All Tailwind class colors** used for theming must have a `dark:` pair, e.g. `bg-white dark:bg-slate-900`.
5. **Transitions** — always add `transition: 'color 0.4s ease'` and `transition: 'background 0.4s ease, border-color 0.4s ease'` for smooth mode switching.
6. **Public pages** → use `PublicPageShell`. **Authenticated pages** → use `Layout` (already themed globally).
