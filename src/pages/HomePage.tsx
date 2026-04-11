import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import whiteHero from "@/assets/white-hero.jpg";
import darkHero from "@/assets/dark-hero.jpg";

const HomePage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const filtered = products.filter((p) => p.style === theme);
  const newProducts = filtered.filter((p) => p.isNew);
  const bestsellers = filtered.filter((p) => p.isBestseller);
  const heroImage = isDark ? darkHero : whiteHero;

  const copy = isDark
    ? {
        headline: "Poder que vem de dentro",
        sub: "Peças que não pedem permissão. Para quem sabe exatamente quem é.",
        cta: "Explorar coleção",
        newTitle: "Recém-chegados",
        bestTitle: "Os mais desejados",
        midPhrase: "Atitude não se compra. Mas pode se vestir.",
        promoTitle: "Coleção Dominion",
        promoSub: "Novos harnesses e acessórios com até 20% off.",
      }
    : {
        headline: "Onde a leveza encontra a pele",
        sub: "Cada peça é um convite ao conforto, à elegância e à sua versão mais suave.",
        cta: "Descobrir coleção",
        newTitle: "Novidades",
        bestTitle: "Mais amados",
        midPhrase: "Delicadeza é uma forma de poder.",
        promoTitle: "Coleção Aurora",
        promoSub: "Sedas e rendas com frete grátis nesta semana.",
      };

  return (
    <div className="pt-16 md:pt-20">
      {/* Hero */}
      <section className="relative h-[85vh] md:h-[90vh] overflow-hidden">
        <img src={heroImage} alt="Hero" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "var(--hero-gradient)" }} />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 md:pb-24 px-6 text-center">
          <motion.h1
            className="font-heading text-4xl md:text-6xl lg:text-7xl font-light tracking-[0.05em] max-w-3xl mb-4"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {copy.headline}
          </motion.h1>
          <motion.p
            className="font-body text-sm md:text-base text-muted-foreground max-w-lg mb-8"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            {copy.sub}
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Link
              to="/loja"
              className="inline-flex items-center gap-3 bg-foreground text-primary-foreground px-8 py-4 font-body text-xs tracking-[0.2em] uppercase hover:bg-foreground/90 transition-colors rounded-sm"
            >
              {copy.cta}
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Promo banner */}
      <div className="bg-foreground text-primary-foreground py-3 text-center">
        <p className="font-body text-xs tracking-[0.15em] uppercase">
          Frete grátis acima de R$ 299 • Até 3x sem juros • Troca grátis
        </p>
      </div>

      {/* New products */}
      {newProducts.length > 0 && (
        <section className="container py-16 md:py-24">
          <div className="flex items-end justify-between mb-10">
            <h2 className="font-heading text-3xl md:text-4xl font-light">{copy.newTitle}</h2>
            <Link to="/loja" className="font-body text-xs tracking-[0.1em] uppercase text-muted-foreground hover:text-foreground flex items-center gap-2">
              Ver tudo <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {newProducts.slice(0, 3).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Mid phrase */}
      <section className="py-16 md:py-20 text-center">
        <motion.p
          className="font-heading text-2xl md:text-4xl font-light italic max-w-2xl mx-auto px-6 text-muted-foreground"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          "{copy.midPhrase}"
        </motion.p>
      </section>

      {/* Promo section */}
      <section className="container pb-16">
        <motion.div
          className="relative overflow-hidden rounded-lg bg-card border border-border p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div>
            <span className="font-body text-xs tracking-[0.15em] uppercase text-muted-foreground">Promoção exclusiva</span>
            <h3 className="font-heading text-2xl md:text-3xl font-light mt-2">{copy.promoTitle}</h3>
            <p className="text-muted-foreground font-body text-sm mt-2 max-w-md">{copy.promoSub}</p>
          </div>
          <Link
            to="/loja"
            className="shrink-0 inline-flex items-center gap-3 bg-foreground text-primary-foreground px-8 py-4 font-body text-xs tracking-[0.2em] uppercase hover:bg-foreground/90 transition-colors rounded-sm"
          >
            Ver ofertas
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>

      {/* Bestsellers */}
      {bestsellers.length > 0 && (
        <section className="container pb-16 md:pb-24">
          <div className="flex items-end justify-between mb-10">
            <h2 className="font-heading text-3xl md:text-4xl font-light">{copy.bestTitle}</h2>
            <Link to="/loja" className="font-body text-xs tracking-[0.1em] uppercase text-muted-foreground hover:text-foreground flex items-center gap-2">
              Ver tudo <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {bestsellers.slice(0, 3).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Instagram CTA */}
      <section className="container pb-16 md:pb-24 text-center">
        <h2 className="font-heading text-2xl md:text-3xl font-light mb-3">Siga-nos no Instagram</h2>
        <p className="text-muted-foreground font-body text-sm mb-6">
          @succubus — Inspiração diária para quem vive entre luz e sombra.
        </p>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 border border-border px-8 py-4 font-body text-xs tracking-[0.2em] uppercase hover:bg-secondary transition-colors rounded-sm"
        >
          @succubus
        </a>
      </section>
    </div>
  );
};

export default HomePage;
