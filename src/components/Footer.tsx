import { Link } from "react-router-dom";
import logo from "@/assets/flavorai-logo.png";

const Footer = () => (
  <footer className="border-t border-border mt-20">
    <div className="max-w-6xl mx-auto px-5 py-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
      <Link to="/" className="flex items-center gap-2">
        <img src={logo} alt="FlavorAI logo" width={24} height={24} className="w-6 h-6" />
        <span className="font-bold tracking-tight text-foreground">
          Flavor<span className="text-primary">AI</span>
        </span>
      </Link>

      <nav aria-label="Legal" className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
          Privacy Policy
        </Link>
        <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
          Terms &amp; Conditions
        </Link>
        <Link to="/refund" className="text-muted-foreground hover:text-foreground transition-colors">
          Refund Policy
        </Link>
      </nav>

      <p className="text-xs text-muted-foreground">
        Recipes and images are AI-generated. Check ingredients against your own dietary needs.
      </p>
    </div>
  </footer>
);

export default Footer;
