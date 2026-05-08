import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthProvider";
import { LogOut, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ProfileMenu = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const name = profile?.name || user?.email?.split("@")[0] || "User";
  const initials = name.slice(0, 2).toUpperCase();

  const handleLogout = async () => {
    await signOut();
    toast.success("Signed out");
    navigate("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
        <Avatar className="h-9 w-9 border-2 border-primary/20 hover:border-primary/50 transition-colors">
          <AvatarImage src={profile?.avatar_url ?? undefined} alt={name} />
          <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col">
          <span className="font-semibold">{name}</span>
          <span className="text-xs font-normal text-muted-foreground truncate">
            {user?.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate("/ai-generator")}>
          <Sparkles className="mr-2 h-4 w-4" />
          AI Generator
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileMenu;
