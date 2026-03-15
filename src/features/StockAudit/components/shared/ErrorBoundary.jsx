import React from 'react'
import { AlertTriangle } from 'lucide-react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800/40 rounded-xl p-6 md:p-8 text-center">
          <AlertTriangle className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-red-500 dark:text-red-400" />
          <h2 className="text-lg md:text-xl font-bold text-red-800 dark:text-red-300 mb-2">Something went wrong</h2>
          <p className="text-sm md:text-base text-red-600 dark:text-red-400 mb-4">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors text-sm md:text-base"
          >
            Reload Page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
