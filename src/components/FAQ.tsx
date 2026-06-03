import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Is FlavorAI free to use?",
    a: "Yes — you can generate recipes, plans, and grocery lists without a credit card. Premium AI features unlock with a free account.",
  },
  {
    q: "How does the AI personalize meals?",
    a: "It uses your ingredients, dietary preferences, cuisine, calorie goal, and prep-time constraints to build recipes tuned just for you.",
  },
  {
    q: "Can I use it for Indian, Keto, or Vegetarian diets?",
    a: "Absolutely. Pick a collection or set your preference once — every recommendation respects it.",
  },
  {
    q: "Is my data secure?",
    a: "Your account is protected with industry-standard encryption and we never sell your data. You can delete your account anytime.",
  },
  {
    q: "Does it work on mobile?",
    a: "FlavorAI is mobile-first. Add it to your home screen for a native-feeling app experience.",
  },
];

const FAQ = () => (
  <section className="relative max-w-3xl mx-auto px-5 sm:px-6 py-14 md:py-20 border-t border-border">
    <div className="text-center mb-8">
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
        Frequently asked questions
      </h2>
    </div>

    <Accordion type="single" collapsible className="space-y-2">
      {faqs.map((f, i) => (
        <AccordionItem
          key={i}
          value={`item-${i}`}
          className="rounded-2xl border border-border bg-card/70 backdrop-blur px-5"
        >
          <AccordionTrigger className="text-left text-base font-medium hover:no-underline">
            {f.q}
          </AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
            {f.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </section>
);

export default FAQ;
