import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logo from "@/assets/flavorai-logo.png";
import { useAuth } from "@/contexts/AuthProvider";
import { Button } from "@/components/ui/button";
import ProfileMenu from "@/components/auth/ProfileMenu";
import { Sparkles } from "lucide-react";

const Header = () => {
  const { user, loading } = useAuth();
  const { t } = useTranslation();

  return (
    <header className="w-full py-4 px-6 bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 group">
          <img
            src={logo}
            alt="FlavorAI logo"
            width={36}
            height={36}
            className="w-9 h-9 drop-shadow-sm transition-transform group-hover:scale-105"
          />
          <span className="text-xl font-bold tracking-tight text-foreground">
            Flavor<span className="text-primary">AI</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
            {t("nav.home")}
          </Link>
          <Link to="/recipes" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
            {t("nav.recipes", "Recipes")}
          </Link>
          <Link to="/explore" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
            {t("nav.explore")}
          </Link>
          <Link to="/collections" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
            {t("nav.collections", "Collections")}
          </Link>
          {user && (
            <Link to="/favorites" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
              {t("nav.favorites", "Favorites")}
            </Link>
          )}
          <Link to="/ai-generator" className="text-muted-foreground hover:text-foreground transition-colors font-medium inline-flex items-center gap-1">
            <Sparkles className="h-4 w-4" />
            {t("nav.aiGenerator")}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {loading ? null : user ? (
            <ProfileMenu />
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link to="/auth">{t("nav.login")}</Link>
              </Button>
              <Button asChild size="sm" className="rounded-full shadow-sm hover:shadow-md transition-shadow">
                <Link to="/auth" state={{ from: "/" }}>{t("nav.signup")}</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
