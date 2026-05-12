import { Component, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
}
interface State {
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: unknown) {
    // eslint-disable-next-line no-console
    console.error("[ErrorBoundary]", error, info);
  }

  handleReset = () => this.setState({ error: null });

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="max-w-md w-full text-center space-y-5 p-8 rounded-2xl border border-border bg-card shadow-card">
          <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-semibold text-foreground">Something went wrong</h1>
            <p className="text-sm text-muted-foreground break-words">
              {this.state.error.message || "An unexpected error occurred."}
            </p>
          </div>
          <div className="flex gap-2 justify-center">
            <Button onClick={() => window.location.reload()} variant="default">
              Reload
            </Button>
            <Button
              onClick={() => {
                this.handleReset();
                window.location.assign("/");
              }}
              variant="outline"
            >
              Go home
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
