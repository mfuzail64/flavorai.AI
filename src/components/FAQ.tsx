import { useTranslation } from "react-i18next";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const KEYS = [1, 2, 3, 4, 5];

const FAQ = () => {
  const { t } = useTranslation();
  return (
    <section className="relative max-w-3xl mx-auto px-5 sm:px-6 py-14 md:py-20 border-t border-border">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{t("faq.title")}</h2>
      </div>
      <Accordion type="single" collapsible className="space-y-2">
        {KEYS.map((i) => (
          <AccordionItem key={i} value={`item-${i}`} className="rounded-2xl border border-border bg-card/70 backdrop-blur px-5">
            <AccordionTrigger className="text-start text-base font-medium hover:no-underline">{t(`faq.q${i}`)}</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground leading-relaxed">{t(`faq.a${i}`)}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};

export default FAQ;
