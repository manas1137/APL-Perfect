import { Component } from "react";
import { Link } from "react-router-dom";
import { Button } from "../buttons";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-white dark:bg-secondary-900 px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-secondary-900 dark:text-white mb-2">Oops!</h1>
            <p className="text-secondary-600 dark:text-secondary-400 mb-6">
              Something went wrong
            </p>
            <Link to="/">
              <Button variant="primary">
                Reload App
              </Button>
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;