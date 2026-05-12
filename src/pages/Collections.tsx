import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import RecipeImage from "@/components/recipe/RecipeImage";

interface Collection {
  key: string;
  labelKey: string;
  category?: string;
  cuisine?: string;
}

const COLLECTIONS: Collection[] = [
  { key: "trending2026", labelKey: "collections.trending2026", category: "Main Course" },
  { key: "viral", labelKey: "collections.viral", category: "Snack" },
  { key: "quick15", labelKey: "collections.quick15", category: "Lunch" },
  { key: "student", labelKey: "collections.student", category: "Dinner" },
  { key: "budget", labelKey: "collections.budget", category: "Main Course" },
  { key: "highProtein", labelKey: "collections.highProtein", category: "Main Course" },
  { key: "keto", labelKey: "collections.keto", category: "Dinner" },
  { key: "vegan", labelKey: "collections.vegan", category: "Salad" },
  { key: "vegetarian", labelKey: "collections.vegetarian", category: "Main Course" },
  { key: "desserts", labelKey: "collections.desserts", category: "Dessert" },
  { key: "drinks", labelKey: "collections.drinks", category: "Drink" },
  { key: "streetFood", labelKey: "collections.streetFood", cuisine: "Mexican" },
];

const Collections = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="px-6 pt-10 pb-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            {t("collectionsPage.title", "Collections")}
          </h1>
          <p className="text-muted-foreground">
            {t("collectionsPage.subtitle", "Hand-picked recipe sets to fit any mood or moment.")}
          </p>
        </div>
      </section>

      <section className="px-6 py-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {COLLECTIONS.map((c, i) => (
            <motion.div
              key={c.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i, 8) * 0.04, duration: 0.35 }}
            >
              <Link
                to={`/explore?collection=${c.key}`}
                className="group relative block rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <RecipeImage
                  src={null}
                  alt={t(c.labelKey)}
                  category={c.category}
                  cuisine={c.cuisine}
                  aspect="wide"
                  imgClassName="group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 backdrop-blur-sm">
                  <h3 className="text-xl font-bold text-foreground drop-shadow-sm">
                    {t(c.labelKey)}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Collections;
