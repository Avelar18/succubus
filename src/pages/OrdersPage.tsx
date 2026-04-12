import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Package } from "lucide-react";
import { Link } from "react-router-dom";

interface Order {
  id: string;
  items: { name: string; size: string; quantity: number; price: number }[];
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

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("succubus-orders") || "[]");
    setOrders(saved.reverse());
  }, []);

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
              return (
                <div key={order.id} className="bg-card border border-border rounded-lg p-5">
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
                  <div className="flex items-center justify-between border-t border-border pt-3">
                    <span className="font-body text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("pt-BR")} • {order.payment === "pix" ? "PIX" : "Cartão"}
                    </span>
                    <span className="font-body text-sm font-medium">R$ {order.total.toFixed(2)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
