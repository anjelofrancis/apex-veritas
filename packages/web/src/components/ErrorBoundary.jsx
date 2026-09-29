import { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', fontFamily: 'monospace', background: '#0A0F1C', color: '#F9FAFB', minHeight: '100vh' }}>
          <h1 style={{ color: '#EF4444' }}>Something went wrong</h1>
          <pre style={{ color: '#9CA3AF', whiteSpace: 'pre-wrap', marginTop: '1rem' }}>
            {this.state.error?.toString()}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
