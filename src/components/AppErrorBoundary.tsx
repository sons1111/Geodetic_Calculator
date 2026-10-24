import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  hasError: boolean;
}

export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unexpected application error:', error, info.componentStack);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <main className="grid min-h-screen place-items-center bg-slate-950 p-6 text-slate-100">
          <section className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 p-6 text-center shadow-2xl">
            <AlertTriangle className="mx-auto mb-3 h-9 w-9 text-amber-400" />
            <h1 className="text-lg font-bold">앱을 정상적으로 표시하지 못했습니다</h1>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              저장된 정보는 가능한 한 보존되며, 앱을 다시 시작하면 대부분 복구됩니다.
            </p>
            <button
              type="button"
              onClick={this.handleReload}
              className="mt-5 rounded-lg bg-emerald-600 px-5 py-2.5 font-semibold text-slate-950"
            >
              앱 다시 시작
            </button>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}
