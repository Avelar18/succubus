import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Star } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";
import WishlistButton from "./WishlistButton";

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="group"
    >
      <Link to={`/produto/${product.id}`} className="block">
        <div className="relative overflow-hidden rounded-lg aspect-[3/4] mb-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            width={400}
            height={533}
          />
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300" />

          {/* Wishlist */}
          <div className="absolute top-3 right-3">
            <WishlistButton productId={product.id} size={16} />
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
              <span className="bg-foreground text-primary-foreground px-3 py-1 text-[10px] font-body tracking-[0.15em] uppercase rounded-sm">
                Novo
              </span>
            )}
            {product.limitedStock && (
              <span className="bg-destructive text-destructive-foreground px-3 py-1 text-[10px] font-body tracking-[0.15em] uppercase rounded-sm">
                Últimas peças
              </span>
            )}
            {product.originalPrice && (
              <span className="bg-accent text-accent-foreground px-3 py-1 text-[10px] font-body tracking-[0.15em] uppercase rounded-sm">
                -{Math.round((1 - product.price / product.originalPrice) * 100)}%
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="space-y-2">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={12}
              className={i < Math.floor(product.rating) ? "fill-foreground text-foreground" : "text-muted"}
            />
          ))}
          <span className="text-muted-foreground text-xs font-body ml-1">({product.reviews})</span>
        </div>

        <h3 className="font-heading text-lg font-medium">{product.name}</h3>

        <div className="flex items-center gap-2">
          <span className="font-body text-base font-medium">R$ {product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="text-muted-foreground text-sm line-through font-body">
              R$ {product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Quick size selector */}
        <div className="flex gap-1.5 pt-1">
          {product.sizes.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSize(s)}
              className={`w-8 h-8 rounded-sm text-[11px] font-body transition-all ${
                selectedSize === s
                  ? "bg-foreground text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-accent"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            addItem(product, selectedSize);
          }}
          className="w-full mt-2 flex items-center justify-center gap-2 py-3 bg-foreground text-primary-foreground font-body text-xs tracking-[0.15em] uppercase rounded-sm hover:bg-foreground/90 transition-colors"
        >
          <ShoppingBag size={14} />
          Adicionar
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
