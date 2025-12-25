import { ChefHat } from "lucide-react";

const Header = () => {
  return (
    <header className="w-full py-4 px-6 bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 gradient-hero rounded-lg shadow-glow">
            <ChefHat className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">
            Recipe<span className="text-primary">Finder</span>
          </span>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
            Home
          </a>
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
