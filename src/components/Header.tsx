import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logo from "@/assets/flavorai-logo.png";
import { useAuth } from "@/contexts/AuthProvider";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ProfileMenu from "@/components/auth/ProfileMenu";
import { Sparkles, Menu } from "lucide-react";

const Header = () => {
  const { user, loading } = useAuth();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const navItems = [
    { to: "/", label: t("nav.home") },
    { to: "/recipes", label: t("nav.recipes", "Recipes") },
    { to: "/explore", label: t("nav.explore") },
    { to: "/collections", label: t("nav.collections", "Collections") },
    ...(user ? [{ to: "/favorites", label: t("nav.favorites", "Favorites") }] : []),
  ];

  return (
    <header className="w-full py-3 px-5 sm:px-6 bg-background/70 backdrop-blur-xl border-b border-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <img
            src={logo}
            alt="FlavorAI logo"
            width={32}
            height={32}
            className="w-8 h-8 drop-shadow-sm transition-transform group-hover:scale-105"
          />
          <span className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
            Flavor<span className="text-primary">AI</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              {n.label}
            </Link>
          ))}
          <Link
            to="/ai-generator"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium inline-flex items-center gap-1"
          >
            <Sparkles className="h-4 w-4" />
            {t("nav.aiGenerator")}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {loading ? null : user ? (
            <ProfileMenu />
          ) : (
            <Button
              asChild
              size="sm"
              className="rounded-full gradient-primary text-primary-foreground hover:opacity-95 transition-opacity"
            >
              <Link to="/auth">Start Free</Link>
            </Button>
          )}

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-background border-border">
              <div className="flex flex-col gap-1 mt-8">
                {navItems.map((n) => (
                  <Link
                    key={n.to}
                    to={n.to}
                    onClick={() => setOpen(false)}
                    className="px-3 py-3 rounded-xl text-base font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    {n.label}
                  </Link>
                ))}
                <Link
                  to="/ai-generator"
                  onClick={() => setOpen(false)}
                  className="px-3 py-3 rounded-xl text-base font-medium text-foreground hover:bg-muted transition-colors inline-flex items-center gap-2"
                >
                  <Sparkles className="h-4 w-4 text-primary" />
                  {t("nav.aiGenerator")}
                </Link>
                {!user && (
                  <Button
                    asChild
                    className="mt-4 h-11 rounded-full gradient-primary text-primary-foreground"
                    onClick={() => setOpen(false)}
                  >
                    <Link to="/auth">Start Free</Link>
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
