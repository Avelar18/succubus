import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, QrCode, Truck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const CEP_REGEX = /^\d{5}-?\d{3}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CheckoutPage = () => {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "card">("pix");
  const [cep, setCep] = useState("");
  const [shipping, setShipping] = useState<number | null>(null);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (items.length === 0) {
    return (
      <div className="pt-28 pb-16 container text-center">
        <p className="text-muted-foreground font-body mb-4">Seu carrinho está vazio.</p>
        <Link to="/loja" className="text-foreground underline font-body text-sm">
          Ir para a loja
        </Link>
      </div>
    );
  }

  const calcShipping = () => {
    if (!CEP_REGEX.test(cep.replace("-", ""))) {
      toast.error("CEP inválido");
      return;
    }
    const val = total >= 299 ? 0 : 19.9;
    setShipping(val);
    toast.success(val === 0 ? "Frete grátis!" : `Frete: R$ ${val.toFixed(2)}`);
  };

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (code === "SUCCUBUS10") {
      setDiscount(0.1);
      toast.success("Cupom aplicado! 10% de desconto.");
    } else if (code === "PRIMEIRA") {
      setDiscount(0.15);
      toast.success("Cupom aplicado! 15% de desconto.");
    } else {
      setDiscount(0);
      toast.error("Cupom inválido.");
    }
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.name.trim() || form.name.length < 3) e.name = "Nome completo obrigatório";
    if (!EMAIL_REGEX.test(form.email)) e.email = "Email inválido";
    if (!form.phone.trim() || form.phone.replace(/\D/g, "").length < 10) e.phone = "Telefone inválido";
    if (!form.address.trim()) e.address = "Endereço obrigatório";
    if (!form.city.trim()) e.city = "Cidade obrigatória";
    if (!form.state.trim()) e.state = "Estado obrigatório";
    if (shipping === null) e.cep = "Calcule o frete primeiro";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const subtotal = total;
  const discountAmount = subtotal * discount;
  const finalTotal = subtotal - discountAmount + (shipping || 0);

  const handleCheckout = async () => {
    if (!validate()) return;
    setLoading(true);

    // Simulate order creation
    await new Promise((r) => setTimeout(r, 1500));

    const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`;

    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem("succubus-orders") || "[]");
    orders.push({
      id: orderId,
      items: items.map((i) => ({
        productId: i.product.id,
        name: i.product.name,
        size: i.size,
        quantity: i.quantity,
        price: i.product.price,
      })),
      customer: form,
      payment: paymentMethod,
      subtotal,
      discount: discountAmount,
      shipping: shipping || 0,
      total: finalTotal,
      status: "pending",
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem("succubus-orders", JSON.stringify(orders));

    clearCart();
    setLoading(false);
    navigate(`/pedido/sucesso?id=${orderId}`);
  };

  return (
    <div className="pt-24 md:pt-28 pb-16">
      <div className="container max-w-4xl">
        <Link
          to="/loja"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground font-body text-xs tracking-[0.1em] uppercase mb-8"
        >
          <ArrowLeft size={14} /> Continuar comprando
        </Link>

        <motion.h1
          className="font-heading text-3xl md:text-4xl font-light mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Checkout
        </motion.h1>

        <div className="grid md:grid-cols-5 gap-8">
          {/* Form */}
          <div className="md:col-span-3 space-y-6">
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <h2 className="font-heading text-xl font-light">Dados pessoais</h2>
              {(["name", "email", "phone", "address", "city", "state"] as const).map((field) => (
                <div key={field}>
                  <Input
                    placeholder={
                      { name: "Nome completo", email: "Email", phone: "Telefone", address: "Endereço completo", city: "Cidade", state: "Estado" }[field]
                    }
                    value={form[field]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    className="bg-secondary border-border font-body"
                    maxLength={field === "state" ? 2 : 255}
                  />
                  {errors[field] && <p className="text-destructive text-xs font-body mt-1">{errors[field]}</p>}
                </div>
              ))}
            </div>

            {/* Shipping */}
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <h2 className="font-heading text-xl font-light flex items-center gap-2">
                <Truck size={18} /> Frete
              </h2>
              <div className="flex gap-2">
                <Input
                  placeholder="CEP"
                  value={cep}
                  onChange={(e) => setCep(e.target.value.replace(/\D/g, "").slice(0, 8))}
                  className="bg-secondary border-border font-body flex-1"
                  maxLength={9}
                />
                <Button
                  onClick={calcShipping}
                  variant="outline"
                  className="font-body text-xs tracking-[0.1em] uppercase"
                >
                  Calcular
                </Button>
              </div>
              {errors.cep && <p className="text-destructive text-xs font-body">{errors.cep}</p>}
              {shipping !== null && (
                <p className="text-sm font-body">
                  {shipping === 0 ? "🎉 Frete grátis!" : `Frete: R$ ${shipping.toFixed(2)}`}
                </p>
              )}
            </div>

            {/* Payment */}
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <h2 className="font-heading text-xl font-light">Pagamento</h2>
              <div className="flex gap-3">
                {([
                  { value: "pix" as const, label: "PIX", icon: QrCode },
                  { value: "card" as const, label: "Cartão", icon: CreditCard },
                ]).map((m) => (
                  <button
                    key={m.value}
                    onClick={() => setPaymentMethod(m.value)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-sm border font-body text-sm transition-all ${
                      paymentMethod === m.value
                        ? "border-foreground bg-foreground text-primary-foreground"
                        : "border-border hover:border-foreground/30"
                    }`}
                  >
                    <m.icon size={16} />
                    {m.label}
                  </button>
                ))}
              </div>
              {paymentMethod === "pix" && (
                <p className="text-muted-foreground text-xs font-body">
                  Você receberá o QR Code após confirmar o pedido.
                </p>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="md:col-span-2">
            <div className="bg-card border border-border rounded-lg p-6 space-y-4 sticky top-24">
              <h2 className="font-heading text-xl font-light">Resumo</h2>

              <div className="space-y-3 max-h-60 overflow-auto">
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.size}`} className="flex justify-between text-sm font-body">
                    <span className="text-muted-foreground">
                      {item.product.name} ({item.size}) x{item.quantity}
                    </span>
                    <span>R$ {(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-2 text-sm font-body">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>R$ {subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Desconto ({Math.round(discount * 100)}%)</span>
                    <span>-R$ {discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Frete</span>
                  <span>{shipping === null ? "—" : shipping === 0 ? "Grátis" : `R$ ${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between font-medium text-base pt-2 border-t border-border">
                  <span>Total</span>
                  <span>R$ {finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Coupon */}
              <div className="flex gap-2">
                <Input
                  placeholder="Cupom"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value.slice(0, 20))}
                  className="bg-secondary border-border font-body flex-1"
                  maxLength={20}
                />
                <Button
                  onClick={applyCoupon}
                  variant="outline"
                  className="font-body text-xs"
                >
                  Aplicar
                </Button>
              </div>

              <Button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-foreground text-primary-foreground hover:bg-foreground/90 font-body text-xs tracking-[0.15em] uppercase h-12"
              >
                {loading ? "Processando..." : "Confirmar pedido"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
