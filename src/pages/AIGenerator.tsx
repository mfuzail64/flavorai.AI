import Header from "@/components/Header";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthProvider";

const AIGenerator = () => {
  const { profile, user } = useAuth();
  const name = profile?.name || user?.email?.split("@")[0] || "chef";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-amber-500 text-primary-foreground mb-6">
            <Sparkles className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            Hi {name}, your AI Generator is ready
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Generate brand-new recipes from any ingredients, cuisines, or moods.
            This protected workspace will host the AI generator soon.
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default AIGenerator;
