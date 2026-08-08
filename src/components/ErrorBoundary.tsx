import React, { ReactNode } from 'react';
import { AlertOctagon, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends (React.Component as new (props: Props) => React.Component<Props, State>) {
  declare props: Props;
  declare state: State;
  declare setState: (state: Partial<State>) => void;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: any) {
    console.error('Uncaught error in Medihivi AI:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  private handleReturnHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-800">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-md w-full shadow-xl text-center space-y-6">
            <div className="w-16 h-16 bg-rose-50 border border-rose-200 text-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
              <AlertOctagon className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Something Went Wrong</h2>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                An unexpected error occurred in Medihivi AI. Please try refreshing or return to the home screen.
              </p>
              {this.state.error && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] text-slate-600 font-mono text-left overflow-x-auto max-h-28 mt-3">
                  {this.state.error.message}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={this.handleRetry}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try Again</span>
              </button>

              <button
                onClick={this.handleReturnHome}
                className="flex-1 bg-white hover:bg-slate-50 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs border border-slate-200 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Home className="w-4 h-4 text-slate-500" />
                <span>Return Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
