/**
 * LedgerX Global Theme Tokens
 *
 * Usage in any component:
 *   import { t } from '../../theme'
 *   const { isDark } = useTheme()
 *
 *   style={t.card(isDark)}          → glass card
 *   style={{ color: t.text.primary(isDark) }}
 *   style={{ borderColor: t.divider(isDark) }}
 */

// ─── Page background ───────────────────────────────────────────────────────
export const pageBg = (isDark) =>
  isDark ? '#010c1a' : '#f0f6ff'

// ─── Background layers ─────────────────────────────────────────────────────
export const radialTop = (isDark) => ({
  background: isDark
    ? 'radial-gradient(ellipse 90% 65% at 50% -10%, rgba(17,43,99,0.55) 0%, transparent 68%)'
    : 'radial-gradient(ellipse 90% 65% at 50% -10%, rgba(147,197,253,0.45) 0%, transparent 68%)',
})

export const radialBottomRight = (isDark) => ({
  background: isDark
    ? 'radial-gradient(ellipse 60% 50% at 85% 90%, rgba(29,20,85,0.4) 0%, transparent 60%)'
    : 'radial-gradient(ellipse 60% 50% at 85% 90%, rgba(167,139,250,0.28) 0%, transparent 60%)',
})

export const gridBg = (isDark) => ({
  backgroundImage: isDark
    ? 'linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px)'
    : 'linear-gradient(rgba(59,130,246,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.07) 1px, transparent 1px)',
  backgroundSize: '36px 36px',
})

// ─── Surface / card styles ─────────────────────────────────────────────────

/** Standard content card — used for data panels, list items, etc. */
export const card = (isDark) => ({
  background: isDark
    ? 'rgba(10,20,46,0.85)'
    : 'rgba(255,255,255,0.88)',
  border: isDark
    ? '1px solid rgba(255,255,255,0.07)'
    : '1px solid rgba(59,130,246,0.12)',
  backdropFilter: 'blur(20px)',
  transition: 'background 0.4s ease, border-color 0.4s ease',
})

/** Stronger glass card — login panels, modals */
export const glassCard = (isDark) => ({
  background: isDark
    ? 'linear-gradient(145deg, rgba(10,20,46,0.85) 0%, rgba(5,12,32,0.92) 100%)'
    : 'linear-gradient(145deg, rgba(255,255,255,0.97) 0%, rgba(248,250,255,0.99) 100%)',
  border: isDark
    ? '1px solid rgba(59,130,246,0.2)'
    : '1px solid rgba(59,130,246,0.15)',
  backdropFilter: 'blur(24px)',
  transition: 'background 0.4s ease, border-color 0.4s ease',
})

/** Subtle row / section inside a card */
export const innerRow = (isDark) => ({
  background: isDark
    ? 'rgba(255,255,255,0.03)'
    : 'rgba(59,130,246,0.04)',
  border: isDark
    ? '1px solid rgba(255,255,255,0.05)'
    : '1px solid rgba(59,130,246,0.08)',
  borderRadius: '12px',
})

// ─── Header / Nav / Sidebar ────────────────────────────────────────────────

export const header = (isDark) => ({
  background: isDark ? 'rgba(1,12,26,0.6)' : 'rgba(255,255,255,0.82)',
  backdropFilter: 'blur(20px)',
  borderBottom: isDark
    ? '1px solid rgba(255,255,255,0.07)'
    : '1px solid rgba(59,130,246,0.12)',
  transition: 'background 0.4s ease, border-color 0.4s ease',
})

export const sidebar = (isDark) => ({
  background: isDark ? 'rgba(10,20,46,0.85)' : 'rgba(255,255,255,0.88)',
  backdropFilter: 'blur(20px)',
  borderRight: isDark
    ? '1px solid rgba(255,255,255,0.07)'
    : '1px solid rgba(59,130,246,0.12)',
  transition: 'background 0.4s ease, border-color 0.4s ease',
})

// ─── Text ──────────────────────────────────────────────────────────────────
export const text = {
  /** Bold headings */
  primary:   (isDark) => isDark ? '#ffffff' : '#1e293b',
  /** Body copy */
  secondary: (isDark) => isDark ? '#94a3b8' : '#64748b',
  /** Labels, timestamps, captions */
  muted:     (isDark) => isDark ? '#64748b' : '#94a3b8',
  /** Heading sub-label (e.g. "Last updated") */
  label:     (isDark) => isDark ? '#475569' : '#94a3b8',
}

// ─── Divider / border line ─────────────────────────────────────────────────
export const divider = (isDark) =>
  isDark ? 'rgba(255,255,255,0.07)' : 'rgba(59,130,246,0.12)'

// ─── Input fields ──────────────────────────────────────────────────────────
export const input = (isDark) => ({
  background: isDark ? 'rgba(2,12,28,0.7)' : 'rgba(255,255,255,0.92)',
  border: isDark ? '1px solid rgba(71,85,105,0.5)' : '1px solid rgba(203,213,225,0.8)',
  color: isDark ? '#ffffff' : '#1e293b',
})

// ─── Pill badges (user name chips, role tags) ───────────────────────────────
export const pill = (isDark) => ({
  background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(59,130,246,0.08)',
  border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(59,130,246,0.15)',
})

// ─── Nav item states ───────────────────────────────────────────────────────
export const navItem = {
  active: {
    background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
    color: '#ffffff',
    boxShadow: '0 4px 20px rgba(59,130,246,0.3)',
  },
  idle: (isDark) => ({
    color: isDark ? '#94a3b8' : '#64748b',
    background: 'transparent',
  }),
  hover: (isDark) => ({
    background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(59,130,246,0.07)',
    color: isDark ? '#ffffff' : '#1e293b',
  }),
}

// ─── Theme toggle button ───────────────────────────────────────────────────
export const themeToggle = (isDark) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '6px 12px',
  borderRadius: '999px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(99,102,241,0.08)',
  border: isDark ? '1px solid rgba(255,255,255,0.13)' : '1px solid rgba(99,102,241,0.22)',
})

// ─── Convenience bundle ────────────────────────────────────────────────────
export const t = {
  pageBg, radialTop, radialBottomRight, gridBg,
  card, glassCard, innerRow,
  header, sidebar,
  text, divider, input, pill, navItem, themeToggle,
}

export default t
