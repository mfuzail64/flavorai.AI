import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GoogleButton from "@/components/auth/GoogleButton";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import logo from "@/assets/flavorai-logo.png";

const Auth = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const from = (location.state as { from?: string } | null)?.from ?? "/";

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [magicLoading, setMagicLoading] = useState(false);

  useEffect(() => {
    if (user) navigate(from, { replace: true });
  }, [user, from, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(t("auth.loginFailed"), { description: error.message });
    toast.success(t("auth.welcomeToast"));
    navigate(from, { replace: true });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { name },
      },
    });
    setLoading(false);
    if (error) return toast.error(t("auth.signupFailed"), { description: error.message });
    toast.success(t("auth.accountCreatedToast"));
    navigate(from, { replace: true });
  };

  const handleMagicLink = async () => {
    if (!email) return toast.error("Enter your email first");
    setMagicLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/` },
    });
    setMagicLoading(false);
    if (error) return toast.error("Couldn't send link", { description: error.message });
    toast.success("Check your inbox", { description: "We sent you a magic sign-in link." });
  };


  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4 py-10">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-400/30 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="backdrop-blur-xl bg-card/70 border border-border/50 rounded-3xl shadow-2xl p-8">
          <Link to="/" className="flex items-center justify-center gap-2 mb-6">
            <img src={logo} alt="FlavorAI" className="w-10 h-10" />
            <span className="text-2xl font-bold tracking-tight">
              Flavor<span className="text-primary">AI</span>
            </span>
          </Link>

          <Tabs value={mode} onValueChange={(v) => setMode(v as "login" | "signup")}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">{t("nav.login")}</TabsTrigger>
              <TabsTrigger value="signup">{t("nav.signup")}</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <h1 className="text-2xl font-bold mb-1">{t("auth.welcomeBack")}</h1>
              <p className="text-sm text-muted-foreground mb-6">{t("auth.signInDesc")}</p>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">{t("auth.email")}</Label>
                  <Input id="login-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("auth.emailPlaceholder")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">{t("auth.password")}</Label>
                  <Input id="login-password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t("auth.passwordPlaceholder")} />
                </div>
                <Button type="submit" className="w-full h-11 rounded-xl" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("auth.login")}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <h1 className="text-2xl font-bold mb-1">{t("auth.createAccount")}</h1>
              <p className="text-sm text-muted-foreground mb-6">{t("auth.signupDesc")}</p>
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">{t("auth.name")}</Label>
                  <Input id="signup-name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={t("auth.namePlaceholder")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">{t("auth.email")}</Label>
                  <Input id="signup-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("auth.emailPlaceholder")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">{t("auth.password")}</Label>
                  <Input id="signup-password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t("auth.passwordHint")} />
                </div>
                <Button type="submit" className="w-full h-11 rounded-xl" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("auth.createAccountBtn")}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/60" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card/0 px-2 text-muted-foreground">{t("common.or")}</span>
            </div>
          </div>

          <GoogleButton />

          <Button
            type="button"
            variant="outline"
            onClick={handleMagicLink}
            disabled={magicLoading}
            className="w-full h-11 rounded-xl mt-3"
          >
            {magicLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Email me a magic link"}
          </Button>

          <p className="text-center text-xs text-muted-foreground mt-6">
            {t("auth.terms")}
          </p>

        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
