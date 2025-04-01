import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('App crashed:', error, info);
    // Consider sending error to monitoring service (Sentry, etc.)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h1>Something went wrong</h1>
          <button 
            onClick={() => window.location.reload()}
            className="reload-button"
          >
            Reload App
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const Root = () => (
  <BrowserRouter basename="/">
    <App />
  </BrowserRouter>
);

createRoot(document.getElementById('root')).render(
  process.env.NODE_ENV === 'development' ? (
    <React.StrictMode>
      <ErrorBoundary>
        <Root />
      </ErrorBoundary>
    </React.StrictMode>
  ) : (
    <ErrorBoundary>
      <Root />
    </ErrorBoundary>
  )
);