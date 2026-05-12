import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthProvider";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import LanguageGate from "@/components/auth/LanguageGate";
import "@/i18n";
import ErrorBoundary from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import RecipeDetail from "./pages/RecipeDetail";
import Auth from "./pages/Auth";
import AIGenerator from "./pages/AIGenerator";
import Explore from "./pages/Explore";
import Settings from "./pages/Settings";
import SelectLanguage from "./pages/SelectLanguage";
import Favorites from "./pages/Favorites";
import Recipes from "./pages/Recipes";
import Collections from "./pages/Collections";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ErrorBoundary>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/select-language" element={<SelectLanguage />} />
              <Route path="/" element={<LanguageGate><Index /></LanguageGate>} />
              <Route path="/recipe/:id" element={<LanguageGate><RecipeDetail /></LanguageGate>} />
              <Route path="/explore" element={<LanguageGate><Explore /></LanguageGate>} />
              <Route path="/recipes" element={<LanguageGate><Recipes /></LanguageGate>} />
              <Route path="/collections" element={<LanguageGate><Collections /></LanguageGate>} />
              <Route
                path="/favorites"
                element={
                  <ProtectedRoute>
                    <LanguageGate><Favorites /></LanguageGate>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <LanguageGate><Settings /></LanguageGate>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ai-generator"
                element={
                  <ProtectedRoute>
                    <LanguageGate><AIGenerator /></LanguageGate>
                  </ProtectedRoute>
                }
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ErrorBoundary>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
