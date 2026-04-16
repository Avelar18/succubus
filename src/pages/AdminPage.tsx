import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { products as staticProducts, Product } from "@/data/products";
import { Package, ShoppingBag, DollarSign, Eye, Edit, Trash2, Plus, X, LogOut, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface Order {
  id: string;
  items: { name: string; size: string; quantity: number; price: number }[];
  customer: { name: string; email: string };
  total: number;
  status: string;
  createdAt: string;
  payment: string;
}

const AdminPage = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"orders" | "products" | "users">("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [users, setUsers] = useState<Array<{ id: string; name: string; email: string; role: string; createdAt: string }>>([]);

  const [customProducts, setCustomProducts] = useState<Product[]>(() => {
    try { return JSON.parse(localStorage.getItem("succubus-custom-products") || "[]"); }
    catch { return []; }
  });

  const allProducts = useMemo(() => [...staticProducts, ...customProducts], [customProducts]);

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate("/login", { state: { from: "/admin" }, replace: true });
      return;
    }
    localStorage.setItem("succubus-custom-products", JSON.stringify(customProducts));
  }, [customProducts, user, isAdmin, navigate]);

  useEffect(() => {
    setOrders(JSON.parse(localStorage.getItem("succubus-orders") || "[]").reverse());
    try {
      const allUsers = JSON.parse(localStorage.getItem("succubus-users") || "[]")
        .map((u: any) => ({ id: u.id, name: u.name, email: u.email, role: u.role, createdAt: u.createdAt }));
      setUsers(allUsers);
    } catch {}
  }, []);

  if (!user || !isAdmin) return null;

  const updateOrderStatus = (orderId: string, status: string) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status } : o));
    setOrders(updated);
    localStorage.setItem("succubus-orders", JSON.stringify(updated));
    toast.success(`Pedido ${orderId} → ${status}`);
  };

  const saveProduct = () => {
    if (!editingProduct?.name || !editingProduct?.price) {
      toast.error("Nome e preço são obrigatórios");
      return;
    }
    const prod: Product = {
      id: editingProduct.id || `custom-${Date.now()}`,
      name: editingProduct.name || "",
      price: editingProduct.price || 0,
      image: editingProduct.image || "/placeholder.svg",
      category: editingProduct.category || "lingerie",
      style: editingProduct.style || "dark",
      description: editingProduct.description || "",
      sizes: editingProduct.sizes || ["P", "M", "G"],
      rating: editingProduct.rating || 5,
      reviews: editingProduct.reviews || 0,
      isNew: editingProduct.isNew,
      isBestseller: editingProduct.isBestseller,
      limitedStock: editingProduct.limitedStock,
    };
    setCustomProducts((prev) => {
      const exists = prev.findIndex((p) => p.id === prod.id);
      if (exists >= 0) {
        const updated = [...prev];
        updated[exists] = prod;
        return updated;
      }
      return [...prev, prod];
    });
    setEditingProduct(null);
    toast.success("Produto salvo!");
  };

  const deleteProduct = (id: string) => {
    setCustomProducts((prev) => prev.filter((p) => p.id !== id));
    toast.success("Produto removido");
  };

  const totalRevenue = orders.filter((o) => o.status === "paid").reduce((s, o) => s + o.total, 0);

  return (
    <div className="pt-24 md:pt-28 pb-16">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <motion.h1
            className="font-heading text-3xl md:text-4xl font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Painel Admin
          </motion.h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => { logout(); navigate("/"); }}
            className="font-body text-xs gap-2"
          >
            <LogOut size={14} /> Sair
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Pedidos", value: orders.length, icon: ShoppingBag },
            { label: "Produtos", value: allProducts.length, icon: Package },
            { label: "Receita", value: `R$ ${totalRevenue.toFixed(0)}`, icon: DollarSign },
            { label: "Usuários", value: users.length, icon: Users },
          ].map((stat) => (
            <div key={stat.label} className="bg-card border border-border rounded-xl p-5" style={{ boxShadow: "var(--card-shadow)" }}>
              <stat.icon size={18} className="text-muted-foreground mb-2" />
              <p className="font-body text-2xl font-medium">{stat.value}</p>
              <p className="font-body text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {(["orders", "products", "users"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2.5 rounded-lg font-body text-xs tracking-[0.1em] uppercase transition-colors whitespace-nowrap ${
                tab === t ? "bg-foreground text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"
              }`}
            >
              {t === "orders" ? "Pedidos" : t === "products" ? "Produtos" : "Usuários"}
            </button>
          ))}
        </div>

        {/* Orders Tab */}
        {tab === "orders" && (
          <div className="space-y-3">
            {orders.length === 0 && <p className="text-muted-foreground font-body text-sm">Nenhum pedido.</p>}
            {orders.map((order) => (
              <div key={order.id} className="bg-card border border-border rounded-xl p-5" style={{ boxShadow: "var(--card-shadow)" }}>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <p className="font-body text-sm font-medium">{order.id}</p>
                    <p className="font-body text-xs text-muted-foreground">
                      {order.customer?.name} • {order.customer?.email}
                    </p>
                    <p className="font-body text-xs text-muted-foreground mt-1">
                      {order.items.map((i) => `${i.name} (${i.size}) x${i.quantity}`).join(", ")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-body text-sm font-medium">R$ {order.total.toFixed(2)}</p>
                    <p className="font-body text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border flex-wrap">
                  <span className="font-body text-xs text-muted-foreground mr-2">Status:</span>
                  {["pending", "paid", "shipped", "canceled"].map((s) => (
                    <button
                      key={s}
                      onClick={() => updateOrderStatus(order.id, s)}
                      className={`px-3 py-1 rounded-lg font-body text-[10px] tracking-wider uppercase transition-colors ${
                        order.status === s
                          ? "bg-foreground text-primary-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-accent"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Products Tab */}
        {tab === "products" && (
          <div>
            <Button
              onClick={() => setEditingProduct({ style: "dark", category: "lingerie", sizes: ["P", "M", "G", "GG"] })}
              className="mb-4 bg-foreground text-primary-foreground font-body text-xs tracking-[0.1em] uppercase gap-2"
            >
              <Plus size={14} /> Novo produto
            </Button>

            {editingProduct && (
              <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-auto space-y-4" style={{ boxShadow: "var(--card-shadow)" }}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading text-xl font-light">
                      {editingProduct.id ? "Editar" : "Novo"} Produto
                    </h3>
                    <button onClick={() => setEditingProduct(null)}><X size={18} /></button>
                  </div>
                  <Input placeholder="Nome" value={editingProduct.name || ""} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} className="bg-secondary border-border font-body" maxLength={100} />
                  <Input type="number" placeholder="Preço" value={editingProduct.price || ""} onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })} className="bg-secondary border-border font-body" min={0} max={99999} />
                  <Input placeholder="URL da imagem" value={editingProduct.image || ""} onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })} className="bg-secondary border-border font-body" maxLength={500} />
                  <Textarea placeholder="Descrição" value={editingProduct.description || ""} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })} className="bg-secondary border-border font-body" maxLength={500} />
                  <div className="flex gap-2">
                    <select value={editingProduct.category || "lingerie"} onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as Product["category"] })} className="flex-1 bg-secondary border border-border rounded-lg px-3 py-2 font-body text-sm">
                      <option value="lingerie">Lingerie</option>
                      <option value="harness">Harness</option>
                      <option value="acessorio">Acessório</option>
                    </select>
                    <select value={editingProduct.style || "dark"} onChange={(e) => setEditingProduct({ ...editingProduct, style: e.target.value as Product["style"] })} className="flex-1 bg-secondary border border-border rounded-lg px-3 py-2 font-body text-sm">
                      <option value="dark">Dark</option>
                      <option value="white">White</option>
                    </select>
                  </div>
                  <Button onClick={saveProduct} className="w-full bg-foreground text-primary-foreground font-body text-xs tracking-[0.15em] uppercase h-10">
                    Salvar
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {allProducts.map((p) => (
                <div key={p.id} className="flex items-center gap-4 bg-card border border-border rounded-xl p-3">
                  <img src={p.image} alt={p.name} className="w-12 h-16 object-cover rounded-lg" loading="lazy" />
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm font-medium truncate">{p.name}</p>
                    <p className="font-body text-xs text-muted-foreground">{p.style} • {p.category} • R$ {p.price.toFixed(2)}</p>
                  </div>
                  {p.id.startsWith("custom-") && (
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => setEditingProduct(p)} className="p-2 text-muted-foreground hover:text-foreground"><Edit size={14} /></button>
                      <button onClick={() => deleteProduct(p.id)} className="p-2 text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {tab === "users" && (
          <div className="space-y-2">
            {users.length === 0 && <p className="text-muted-foreground font-body text-sm">Nenhum usuário.</p>}
            {users.map((u) => (
              <div key={u.id} className="flex items-center gap-4 bg-card border border-border rounded-xl p-4" style={{ boxShadow: "var(--card-shadow)" }}>
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                  <Users size={16} className="text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm font-medium truncate">{u.name}</p>
                  <p className="font-body text-xs text-muted-foreground">{u.email}</p>
                </div>
                <span className={`px-2 py-1 rounded-lg font-body text-[10px] tracking-wider uppercase ${
                  u.role === "admin" ? "bg-foreground text-primary-foreground" : "bg-secondary text-secondary-foreground"
                }`}>
                  {u.role}
                </span>
                <span className="font-body text-xs text-muted-foreground hidden md:block">
                  {new Date(u.createdAt).toLocaleDateString("pt-BR")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
