import { ReactNode } from "react";
import { motion } from "framer-motion";

interface LegalLayoutProps {
  title: string;
  updated: string;
  children: ReactNode;
}

const LegalLayout = ({ title, updated, children }: LegalLayoutProps) => (
  <main className="max-w-3xl mx-auto px-5 py-12">
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="font-serif text-4xl sm:text-5xl text-foreground mb-2">{title}</h1>
      <p className="text-sm text-muted-foreground mb-10">Last updated: {updated}</p>
      <div
        className="space-y-5 text-[15px] leading-relaxed text-muted-foreground
        [&_h2]:text-foreground [&_h2]:font-semibold [&_h2]:text-lg [&_h2]:mt-10 [&_h2]:mb-2
        [&_strong]:text-foreground
        [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2
        [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-2"
      >
        {children}
      </div>
    </motion.div>
  </main>
);

export default LegalLayout;
