import { Link } from "react-router-dom";
import logo from "@/assets/flavorai-logo.png";

const Header = () => {
  return (
    <header className="w-full py-4 px-6 bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
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
            Home
          </Link>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
            Browse Recipes
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
            Favorites
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
