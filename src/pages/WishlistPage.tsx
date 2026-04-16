import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    try {
      setWishlist(JSON.parse(localStorage.getItem("succubus-wishlist") || "[]"));
    } catch {}
  }, []);

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="pt-24 md:pt-28 pb-16">
      <div className="container">
        <motion.h1
          className="font-heading text-4xl md:text-5xl font-light mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Favoritos
        </motion.h1>
        <p className="text-muted-foreground font-body text-sm mb-10">
          Suas peças favoritas em um só lugar.
        </p>

        {wishlistProducts.length === 0 ? (
          <div className="text-center py-20">
            <Heart size={48} className="mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground font-body mb-4">Nenhum favorito ainda.</p>
            <Link
              to="/loja"
              className="inline-flex items-center gap-2 bg-foreground text-primary-foreground px-6 py-3 font-body text-xs tracking-[0.15em] uppercase rounded-sm hover:bg-foreground/90 transition-colors"
            >
              Explorar loja
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {wishlistProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
