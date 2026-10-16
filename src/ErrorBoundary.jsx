import React from 'react';

export class ErrorBoundary extends React.Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <main className="setup-page">
        <section className="setup-card">
          <h1>The page needs a fresh start.</h1>
          <p>Your saved progress is still in this browser. Reload to return to the main menu.</p>
          <button className="button primary" onClick={() => window.location.reload()}>
            Reload the game
          </button>
        </section>
      </main>
    );
  }
}
