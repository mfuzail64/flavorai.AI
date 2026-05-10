import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

interface Props {
  instructions: string[];
}

const InstructionSteps = ({ instructions }: Props) => {
  const { t } = useTranslation();
  return (
    <section>
      <h2 className="text-2xl font-bold text-foreground mb-4">{t("recipe.instructions")}</h2>
      <ol className="space-y-4">
        {instructions.map((step, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="flex gap-4 p-4 rounded-xl bg-card border border-border shadow-sm"
          >
            <div className="flex-shrink-0 w-9 h-9 rounded-full gradient-hero flex items-center justify-center text-primary-foreground font-bold shadow-glow">
              {i + 1}
            </div>
            <p className="text-foreground leading-relaxed pt-1">{step}</p>
          </motion.li>
        ))}
      </ol>
    </section>
  );
};

export default InstructionSteps;
