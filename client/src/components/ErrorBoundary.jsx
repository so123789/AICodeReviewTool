import { Component } from "react";

// Catches render-time errors anywhere below it in the tree so a bug in one
// page (e.g. a malformed AI response breaking the markdown renderer)
// shows a recoverable screen instead of a blank white page.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // In production this is where you'd forward to an error-tracking
    // service (Sentry, etc.) instead of just logging.
    console.error("Unhandled UI error:", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            padding: 24,
            textAlign: "center",
          }}
        >
          <h2>Something went wrong</h2>
          <p style={{ color: "#888", maxWidth: 360 }}>
            An unexpected error occurred. Try going back to the homepage — if this keeps
            happening, please refresh or clear your browser storage.
          </p>
          <button onClick={this.handleReset} style={{ padding: "10px 20px" }}>
            Go to Home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
