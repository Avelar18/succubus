import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

const ShopPage = () => {
  const { theme } = useTheme();
  const [category, setCategory] = useState<"all" | "harness" | "lingerie" | "acessorio">("all");
  const [styleFilter, setStyleFilter] = useState<"all" | "white" | "dark">(theme || "all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"default" | "price-asc" | "price-desc" | "rating">("default");

  let filtered = products.filter((p) => {
    if (category !== "all" && p.category !== category) return false;
    if (styleFilter !== "all" && p.style !== styleFilter) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (sort === "price-asc") filtered = [...filtered].sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") filtered = [...filtered].sort((a, b) => b.price - a.price);
  else if (sort === "rating") filtered = [...filtered].sort((a, b) => b.rating - a.rating);

  const categories = [
    { label: "Todos", value: "all" as const },
    { label: "Harness", value: "harness" as const },
    { label: "Lingerie", value: "lingerie" as const },
    { label: "Acessórios", value: "acessorio" as const },
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
        <p className="text-muted-foreground font-body text-sm mb-8">
          {theme === "dark" ? "Peças que falam por você." : "Peças feitas para sentir."}
        </p>

        {/* Search */}
        <div className="relative mb-6">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-80 pl-10 pr-4 py-2.5 bg-secondary border border-border rounded-sm font-body text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {categories.map((f) => (
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

          <div className="w-px h-6 bg-border mx-1" />

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

        {/* Sort */}
        <div className="flex items-center gap-3 mb-10">
          <span className="text-muted-foreground font-body text-xs">Ordenar:</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="bg-secondary border border-border rounded-sm px-3 py-1.5 font-body text-xs focus:outline-none"
          >
            <option value="default">Relevância</option>
            <option value="price-asc">Menor preço</option>
            <option value="price-desc">Maior preço</option>
            <option value="rating">Melhor avaliação</option>
          </select>
          <span className="text-muted-foreground font-body text-xs ml-auto">
            {filtered.length} {filtered.length === 1 ? "produto" : "produtos"}
          </span>
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
