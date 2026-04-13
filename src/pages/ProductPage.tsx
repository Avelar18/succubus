import { useParams, Link } from "react-router-dom";
import { products } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { Star, ShoppingBag, ArrowLeft, Shield, Truck, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import WishlistButton from "@/components/WishlistButton";

const ProductPage = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || "");
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!product) {
    return (
      <div className="pt-28 container text-center py-20">
        <p className="text-muted-foreground font-body">Produto não encontrado.</p>
        <Link to="/loja" className="text-foreground underline font-body text-sm mt-4 inline-block">
          Voltar à loja
        </Link>
      </div>
    );
  }

  const related = products.filter((p) => p.style === product.style && p.id !== product.id).slice(0, 4);
  const installments = (product.price / 3).toFixed(2);

  return (
    <div className="pt-24 md:pt-28 pb-16">
      <div className="container">
        <Link
          to="/loja"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground font-body text-xs tracking-[0.1em] uppercase mb-8"
        >
          <ArrowLeft size={14} /> Voltar
        </Link>

        <div className="grid md:grid-cols-2 gap-8 md:gap-16">
          {/* Image */}
          <motion.div
            className="aspect-[3/4] rounded-lg overflow-hidden bg-secondary"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <img
              src={product.image}
              alt={product.name}
              className={`w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
              width={600}
              height={800}
              onLoad={() => setImageLoaded(true)}
            />
          </motion.div>

          {/* Details */}
          <motion.div
            className="flex flex-col justify-center"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < Math.floor(product.rating) ? "fill-foreground text-foreground" : "text-muted"}
                  />
                ))}
                <span className="text-muted-foreground text-xs font-body ml-2">
                  {product.rating} ({product.reviews} avaliações)
                </span>
              </div>
              <WishlistButton productId={product.id} />
            </div>

            <h1 className="font-heading text-3xl md:text-4xl font-light mb-3">{product.name}</h1>

            <div className="flex items-center gap-3 mb-2">
              <span className="font-body text-2xl font-medium">R$ {product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-muted-foreground text-lg line-through font-body">
                  R$ {product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <p className="text-muted-foreground font-body text-xs mb-6">
              ou 3x de R$ {installments} sem juros
            </p>

            <p className="text-muted-foreground font-body text-sm leading-relaxed mb-8">
              {product.description}
            </p>

            {product.limitedStock && (
              <p className="text-destructive font-body text-xs tracking-[0.1em] uppercase mb-4 font-medium">
                ⚡ Estoque limitado — restam poucas unidades
              </p>
            )}

            {/* Size selector */}
            <div className="mb-6">
              <p className="font-body text-xs tracking-[0.1em] uppercase text-muted-foreground mb-3">Tamanho</p>
              <div className="flex gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`w-12 h-12 rounded-sm font-body text-sm transition-all ${
                      selectedSize === s
                        ? "bg-foreground text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-accent"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => addItem(product, selectedSize)}
              className="w-full flex items-center justify-center gap-3 py-4 bg-foreground text-primary-foreground font-body text-xs tracking-[0.2em] uppercase rounded-sm hover:bg-foreground/90 transition-colors"
            >
              <ShoppingBag size={16} />
              Adicionar ao carrinho
            </button>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              {[
                { icon: Truck, label: "Frete grátis acima de R$ 299" },
                { icon: RotateCcw, label: "Troca grátis em 30 dias" },
                { icon: Shield, label: "Pagamento 100% seguro" },
              ].map((badge) => (
                <div key={badge.label} className="flex flex-col items-center gap-1.5 p-3 bg-secondary rounded-lg text-center">
                  <badge.icon size={16} className="text-muted-foreground" />
                  <span className="font-body text-[10px] text-muted-foreground leading-tight">{badge.label}</span>
                </div>
              ))}
            </div>

            {/* Size guide */}
            <div className="mt-6 p-4 bg-secondary rounded-lg">
              <p className="font-body text-xs tracking-[0.1em] uppercase font-medium mb-3">Guia de Medidas</p>
              <div className="grid grid-cols-4 gap-2 text-xs font-body text-muted-foreground">
                <span className="font-medium text-foreground">P</span>
                <span className="font-medium text-foreground">M</span>
                <span className="font-medium text-foreground">G</span>
                <span className="font-medium text-foreground">GG</span>
                <span>34-36</span><span>38-40</span><span>42-44</span><span>46-48</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="font-heading text-2xl md:text-3xl font-light mb-8">Você também vai amar</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
