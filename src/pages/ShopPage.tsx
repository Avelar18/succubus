import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";

const ShopPage = () => {
  const { theme } = useTheme();
  const [category, setCategory] = useState<"all" | "harness" | "lingerie">("all");
  const [styleFilter, setStyleFilter] = useState<"all" | "white" | "dark">(theme || "all");

  const filtered = products.filter((p) => {
    if (category !== "all" && p.category !== category) return false;
    if (styleFilter !== "all" && p.style !== styleFilter) return false;
    return true;
  });

  const filters = [
    { label: "Todos", value: "all" as const },
    { label: "Harness", value: "harness" as const },
    { label: "Lingerie", value: "lingerie" as const },
  ];

  return (
    <div className="pt-24 md:pt-28 pb-16">
      <div className="container">
        <motion.h1
          className="font-heading text-4xl md:text-5xl font-light mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Loja
        </motion.h1>
        <p className="text-muted-foreground font-body text-sm mb-10">
          {theme === "dark" ? "Peças que falam por você." : "Peças feitas para sentir."}
        </p>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-10">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setCategory(f.value)}
              className={`px-5 py-2 rounded-sm font-body text-xs tracking-[0.1em] uppercase transition-colors ${
                category === f.value
                  ? "bg-foreground text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-accent"
              }`}
            >
              {f.label}
            </button>
          ))}

          <div className="w-px bg-border mx-2" />

          {(["all", "white", "dark"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStyleFilter(s)}
              className={`px-5 py-2 rounded-sm font-body text-xs tracking-[0.1em] uppercase transition-colors ${
                styleFilter === s
                  ? "bg-foreground text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-accent"
              }`}
            >
              {s === "all" ? "Ambos" : s === "white" ? "White" : "Dark"}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {filtered.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground font-body">Nenhum produto encontrado.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;
