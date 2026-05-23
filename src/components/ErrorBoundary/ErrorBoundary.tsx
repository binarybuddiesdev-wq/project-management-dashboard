import { Component, type ErrorInfo, type ReactNode } from 'react'
import { logger } from '@/utils'

export interface IErrorBoundaryProps {
  children: ReactNode
}

export interface IErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<IErrorBoundaryProps, IErrorBoundaryState> {
  constructor(props: IErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  public static getDerivedStateFromError(error: Error): IErrorBoundaryState {
    return { hasError: true, error }
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error({ error, errorInfo }, 'ErrorBoundary caught an uncaught error')
  }

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-background text-foreground p-6 font-sans">
          <div className="max-w-md w-full border border-destructive/20 bg-destructive/5 rounded-2xl p-8 text-center space-y-4 shadow-lg">
            <h1 className="text-2xl font-bold text-destructive">Something went wrong</h1>
            <p className="text-muted-foreground text-sm">
              An unexpected error has occurred. Please reload the page or contact support if the issue persists.
            </p>
            {this.state.error && (
              <pre className="text-xs text-left bg-card p-4 rounded-lg border border-border overflow-auto max-h-40">
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={() => window.location.reload()}
              type="button"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity cursor-pointer text-sm"
            >
              Reload Application
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
