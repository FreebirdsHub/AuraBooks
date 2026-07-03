import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
          <div className="max-w-md w-full text-center p-8 rounded-2xl glass-card border border-slate-200 shadow-xl fade-in-slide">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            
            <h1 className="text-2xl font-bold text-slate-900 mb-2 font-display">
              Oops! Something went wrong
            </h1>
            
            <p className="text-slate-600 mb-6 text-sm">
              An unexpected error has occurred in the application. We apologize for the inconvenience.
            </p>

            <div className="bg-red-50 text-red-800 text-left p-4 rounded-xl mb-6 overflow-x-auto text-xs font-mono max-h-40 border border-red-100">
              {this.state.error && this.state.error.toString()}
            </div>

            <div className="flex gap-4">
              <button
                onClick={this.handleReset}
                className="flex-1 py-3 px-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg focus:outline-none"
              >
                Go to Homepage
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 py-3 px-4 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-medium transition-all focus:outline-none"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
