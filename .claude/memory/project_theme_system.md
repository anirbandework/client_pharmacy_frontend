---
name: theme_system
description: LedgerX dark/light mode system — files, tokens, usage patterns, rules for all pages
type: project
---

## Theme System is live

**Core files:**
- `src/theme.js` — all design tokens exported as `{ t }`, functions of `isDark`
- `src/contexts/ThemeContext.jsx` — `{ isDark, toggleTheme }`, persists to localStorage key `'theme'`, defaults to dark
- `src/components/PublicPageShell.jsx` — background + header + footer for public (unauthenticated) pages
- `src/components/Layout.jsx` — background for authenticated pages (themed)
- `src/components/Navigation.jsx` — sticky top nav with Sun/Moon toggle (reads ThemeContext)
- `src/components/Sidebar.jsx` — left nav (reads ThemeContext)
- `src/THEME.md` — full developer reference in the repo

**Infrastructure wired in:**
- `tailwind.config.js` → `darkMode: 'class'` ✓
- `App.jsx` → wrapped with `<ThemeProvider>` ✓
- `Welcome/index.jsx` → connected to `useTheme()` instead of local state ✓
- `PrivacyPolicy.jsx`, `TermsOfService.jsx`, `Support.jsx` → use `PublicPageShell` + `useTheme()` ✓

**How to apply to any new page:**

Authenticated page (inside Layout):
```jsx
import { useTheme } from '../../contexts/ThemeContext'
import { t } from '../../theme'
const { isDark } = useTheme()
// then: style={t.card(isDark)}, style={{ color: t.text.primary(isDark) }}
```

Public page (no Layout):
```jsx
import PublicPageShell from '../../components/PublicPageShell'
import { t } from '../../theme'
const { isDark } = useTheme()
// wrap content in <PublicPageShell>
```

**Key token quick-ref:**
- `t.card(isDark)` — standard glass card
- `t.glassCard(isDark)` — stronger glass (modals)
- `t.text.primary/secondary/muted/label(isDark)` — text colors
- `t.divider(isDark)` — border color string
- `t.input(isDark)` — form input style
- `t.pill(isDark)` — chip/badge style
- `t.pageBg(isDark)` — page root background

**Why:** User wants consistent Welcome-page dark/light aesthetic across entire app. All feature pages still need to be updated one by one (12 features pending).
