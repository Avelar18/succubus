import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";

const WISHLIST_KEY = "succubus-wishlist";

const getWishlist = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY) || "[]");
  } catch {
    return [];
  }
};

interface WishlistButtonProps {
  productId: string;
  size?: number;
  className?: string;
}

const WishlistButton = ({ productId, size = 18, className = "" }: WishlistButtonProps) => {
  const [isWished, setIsWished] = useState(false);

  useEffect(() => {
    setIsWished(getWishlist().includes(productId));
  }, [productId]);

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const list = getWishlist();
    let newList: string[];
    if (list.includes(productId)) {
      newList = list.filter((id) => id !== productId);
      toast.success("Removido da lista de desejos");
    } else {
      newList = [...list, productId];
      toast.success("Adicionado à lista de desejos ♥");
    }
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(newList));
    setIsWished(!isWished);
  };

  return (
    <button
      onClick={toggle}
      className={`p-2 transition-colors ${className}`}
      aria-label={isWished ? "Remover da lista de desejos" : "Adicionar à lista de desejos"}
    >
      <Heart
        size={size}
        className={isWished ? "fill-destructive text-destructive" : "text-muted-foreground hover:text-foreground"}
      />
    </button>
  );
};

export default WishlistButton;
