import React, { Component, ErrorInfo, ReactNode } from 'react';
import '../styles/ErrorBoundary.css';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error en el componente:', error);
    console.error('Stack trace:', errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Algo salió mal</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()}>
            Recargar aplicación
          </button>
          <p className="error-hint">
            Si el error persiste, por favor contacta con soporte
          </p>
        </div>
      );
    }

    return this.props.children;
  }
} 