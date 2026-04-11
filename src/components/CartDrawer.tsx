import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";

const CartDrawer = () => {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, total, clearCart } = useCart();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-md bg-background border-border">
        <SheetHeader>
          <SheetTitle className="font-heading text-2xl font-light tracking-[0.1em]">
            Seu Carrinho
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center py-20">
            <p className="text-muted-foreground font-body text-sm">Seu carrinho está vazio</p>
          </div>
        ) : (
          <div className="flex flex-col h-full mt-6">
            <div className="flex-1 overflow-auto space-y-4">
              {items.map((item) => (
                <div key={`${item.product.id}-${item.size}`} className="flex gap-4 p-3 bg-card rounded-lg">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-24 object-cover rounded"
                    loading="lazy"
                    width={80}
                    height={96}
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-body text-sm font-medium">{item.product.name}</h4>
                      <p className="text-muted-foreground text-xs font-body">Tam: {item.size}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                          className="p-1 text-muted-foreground hover:text-foreground"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="font-body text-sm w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                          className="p-1 text-muted-foreground hover:text-foreground"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-body text-sm font-medium">
                          R$ {(item.product.price * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeItem(item.product.id, item.size)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 mt-4 space-y-4 pb-8">
              <div className="flex justify-between font-body">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">R$ {total.toFixed(2)}</span>
              </div>
              <Button className="w-full bg-foreground text-background hover:bg-foreground/90 font-body text-xs tracking-[0.15em] uppercase h-12">
                Finalizar Compra
              </Button>
              <button
                onClick={clearCart}
                className="w-full text-center text-muted-foreground text-xs font-body hover:text-foreground transition-colors"
              >
                Limpar carrinho
              </button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
