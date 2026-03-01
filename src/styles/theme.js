// Centralized theme configuration for consistent UI across the app

export const theme = {
  // Background styles
  background: {
    main: "bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900",
    card: "bg-slate-800/50 backdrop-blur-xl border border-slate-700/50",
    input: "bg-slate-900/50 border border-slate-700",
    overlay: "bg-slate-900/50 backdrop-blur-xl",
  },

  // Input field styles
  input: {
    base: "w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
    withPrefix: "w-full pl-14 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
    label: "block text-slate-300 text-sm font-medium mb-2",
  },

  // Button styles
  button: {
    primary: "w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20",
    secondary: "px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors",
    text: "text-blue-400 hover:text-blue-300 transition-colors",
  },

  // Alert/Message styles
  alert: {
    error: "bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl text-sm",
    success: "bg-green-500/10 border border-green-500/30 text-green-300 px-4 py-3 rounded-xl text-sm",
    info: "bg-blue-500/10 border border-blue-500/30 text-blue-300 px-4 py-3 rounded-xl text-xs flex items-start gap-2",
    warning: "bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 px-4 py-3 rounded-xl text-sm",
  },

  // Card styles
  card: {
    base: "bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6",
    hover: "bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-slate-600 transition-all cursor-pointer",
  },

  // Text styles
  text: {
    heading: "text-white font-bold",
    subheading: "text-slate-300 font-semibold",
    body: "text-slate-400",
    muted: "text-slate-500",
    link: "text-blue-400 hover:text-blue-300 transition-colors",
  },

  // Icon container styles
  icon: {
    primary: "w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center",
    success: "w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center",
    warning: "w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center",
    danger: "w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center",
  },

  // Border styles
  border: {
    default: "border border-slate-700",
    hover: "border border-slate-700 hover:border-slate-600",
    active: "border-2 border-blue-500",
  },

  // Shadow styles
  shadow: {
    card: "shadow-2xl",
    button: "shadow-lg shadow-blue-500/20",
  },
}

// Reusable className strings
export const classes = {
  pageContainer: "fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 overflow-y-auto",
  contentWrapper: "relative z-10 min-h-screen flex flex-col",
  header: "sticky top-0 z-20 border-b border-white/10 bg-slate-900/50 backdrop-blur-xl",
  footer: "sticky bottom-0 z-20 border-t border-white/10 bg-slate-900/50 backdrop-blur-xl",
  formCard: "bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl",
}
