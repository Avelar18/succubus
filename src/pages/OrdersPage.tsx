import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Package, RotateCcw, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface Order {
  id: string;
  items: { name: string; size: string; quantity: number; price: number }[];
  customer?: { name: string; email: string };
  total: number;
  status: string;
  createdAt: string;
  payment: string;
}

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: "Pendente", color: "text-yellow-500" },
  paid: { label: "Pago", color: "text-green-500" },
  canceled: { label: "Cancelado", color: "text-destructive" },
  shipped: { label: "Enviado", color: "text-blue-500" },
};

const RETURNS_KEY = "succubus-returns";

const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [returningOrder, setReturningOrder] = useState<Order | null>(null);
  const [reason, setReason] = useState("");
  const [returnedIds, setReturnedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const saved: Order[] = JSON.parse(localStorage.getItem("succubus-orders") || "[]");
    setOrders(saved.reverse());
    try {
      const reqs: { orderId: string }[] = JSON.parse(localStorage.getItem(RETURNS_KEY) || "[]");
      setReturnedIds(new Set(reqs.map((r) => r.orderId)));
    } catch {}
  }, []);

  const submitReturn = () => {
    if (!returningOrder) return;
    if (reason.trim().length < 10) return toast.error("Descreva o motivo (mín. 10 caracteres)");

    try {
      const list = JSON.parse(localStorage.getItem(RETURNS_KEY) || "[]");
      list.push({
        id: `ret-${Date.now()}`,
        orderId: returningOrder.id,
        customerEmail: returningOrder.customer?.email || user?.email || "",
        customerName: returningOrder.customer?.name || user?.name || "",
        reason: reason.trim(),
        status: "requested",
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem(RETURNS_KEY, JSON.stringify(list));
      setReturnedIds((prev) => new Set(prev).add(returningOrder.id));
      toast.success("Solicitação enviada! Nossa equipe entrará em contato.");
      setReturningOrder(null);
      setReason("");
    } catch {
      toast.error("Erro ao salvar. Tente novamente.");
    }
  };

  return (
    <div className="pt-24 md:pt-28 pb-16">
      <div className="container max-w-3xl">
        <motion.h1
          className="font-heading text-3xl md:text-4xl font-light mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Meus Pedidos
        </motion.h1>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <Package size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground font-body">Nenhum pedido encontrado.</p>
            <Link to="/loja" className="text-foreground underline font-body text-sm mt-2 inline-block">
              Ir para a loja
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const s = statusLabels[order.status] || statusLabels.pending;
              const canReturn = (order.status === "paid" || order.status === "shipped") && !returnedIds.has(order.id);
              return (
                <div key={order.id} className="bg-card border border-border rounded-xl p-5" style={{ boxShadow: "var(--card-shadow)" }}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="font-body text-xs text-muted-foreground">Pedido</span>
                      <p className="font-body text-sm font-medium">{order.id}</p>
                    </div>
                    <span className={`font-body text-xs font-medium ${s.color}`}>{s.label}</span>
                  </div>
                  <div className="space-y-1 mb-3">
                    {order.items.map((item, i) => (
                      <p key={i} className="font-body text-xs text-muted-foreground">
                        {item.name} ({item.size}) x{item.quantity} — R$ {(item.price * item.quantity).toFixed(2)}
                      </p>
                    ))}
                  </div>
                  <div className="flex items-center justify-between border-t border-border pt-3 gap-3 flex-wrap">
                    <span className="font-body text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("pt-BR")} • {order.payment === "pix" ? "PIX" : "Cartão"}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="font-body text-sm font-medium">R$ {order.total.toFixed(2)}</span>
                      {canReturn && (
                        <button
                          onClick={() => { setReturningOrder(order); setReason(""); }}
                          className="font-body text-[11px] tracking-wider uppercase text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5"
                        >
                          <RotateCcw size={12} /> Devolver
                        </button>
                      )}
                      {returnedIds.has(order.id) && (
                        <span className="font-body text-[11px] tracking-wider uppercase text-amber-500">Devolução solicitada</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {returningOrder && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setReturningOrder(null)}>
            <div onClick={(e) => e.stopPropagation()} className="bg-card border border-border rounded-xl p-6 w-full max-w-md space-y-4" style={{ boxShadow: "var(--card-shadow)" }}>
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-xl font-light">Solicitar devolução</h3>
                <button onClick={() => setReturningOrder(null)} aria-label="Fechar"><X size={18} /></button>
              </div>
              <p className="font-body text-xs text-muted-foreground">
                Pedido <span className="font-medium text-foreground">{returningOrder.id}</span> — R$ {returningOrder.total.toFixed(2)}
              </p>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Conte-nos o motivo da devolução..."
                rows={4}
                maxLength={500}
                className="bg-secondary border-border font-body"
              />
              <Button onClick={submitReturn} className="w-full bg-foreground text-primary-foreground font-body text-xs tracking-[0.15em] uppercase h-10">
                Enviar solicitação
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
