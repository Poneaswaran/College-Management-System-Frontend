import { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
        this.setState({ errorInfo });
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
        window.location.reload();
    };

    handleGoHome = () => {
        window.location.href = '/#/student/dashboard';
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-8">
                    <div className="max-w-2xl w-full bg-[var(--color-card)] rounded-2xl shadow-xl border-2 border-[var(--color-border)] overflow-hidden">
                        {/* Header with gradient */}
                        <div className="bg-gradient-to-r from-red-500 to-orange-500 p-8 text-white">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                                    <AlertTriangle size={32} />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold">Oops! Something Went Wrong</h1>
                                    <p className="text-white/90 mt-1">We're experiencing technical difficulties</p>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-8">
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-[var(--color-foreground)] mb-3">
                                    What happened?
                                </h2>
                                <p className="text-[var(--color-foreground-secondary)] leading-relaxed">
                                    The application encountered an unexpected error and couldn't continue. 
                                    This has been automatically logged and our team will look into it.
                                </p>
                            </div>

                            {/* Error details (only in development) */}
                            {process.env.NODE_ENV === 'development' && this.state.error && (
                                <div className="mb-6 p-4 bg-[var(--color-background-secondary)] rounded-lg border border-[var(--color-border)]">
                                    <h3 className="text-sm font-semibold text-[var(--color-foreground)] mb-2">
                                        Technical Details:
                                    </h3>
                                    <pre className="text-xs text-[var(--color-error)] overflow-auto max-h-40">
                                        {this.state.error.toString()}
                                        {this.state.errorInfo && this.state.errorInfo.componentStack}
                                    </pre>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="space-y-3">
                                <button
                                    onClick={this.handleReset}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                                >
                                    <RefreshCw size={20} />
                                    Reload Page
                                </button>
                                <button
                                    onClick={this.handleGoHome}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[var(--color-background-secondary)] text-[var(--color-foreground)] rounded-lg font-medium hover:bg-[var(--color-border)] transition-colors"
                                >
                                    <Home size={20} />
                                    Go to Dashboard
                                </button>
                            </div>

                            {/* Help text */}
                            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                                <h3 className="text-sm font-semibold text-blue-600 mb-2">
                                    Need Help?
                                </h3>
                                <p className="text-xs text-[var(--color-foreground-secondary)]">
                                    If this problem persists, please contact support with the error details above.
                                    We apologize for the inconvenience.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
