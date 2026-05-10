import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthProvider";
import { Loader2 } from "lucide-react";

/**
 * Wraps the public app shell. If user is signed in but hasn't picked a language,
 * redirect to /select-language. Anonymous users pass through.
 */
const LanguageGate = ({ children }: { children: React.ReactNode }) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user && profile && !profile.preferred_language) {
    return <Navigate to="/select-language" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};

export default LanguageGate;
