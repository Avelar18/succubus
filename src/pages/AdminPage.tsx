import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { products as staticProducts, Product } from "@/data/products";
import {
  Package,
  ShoppingBag,
  DollarSign,
  Edit,
  Trash2,
  Plus,
  X,
  LogOut,
  Users,
  AlertTriangle,
  MessageSquare,
  RotateCcw,
  TrendingUp,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface Order {
  id: string;
  items: { name: string; size: string; quantity: number; price: number; productId?: string }[];
  customer: { name: string; email: string };
  total: number;
  status: string;
  createdAt: string;
  payment: string;
}

interface SupportTicket {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "open" | "in_progress" | "resolved";
  createdAt: string;
  reply?: string;
}

interface ReturnRequest {
  id: string;
  orderId: string;
  customerEmail: string;
  customerName: string;
  reason: string;
  status: "requested" | "approved" | "rejected" | "refunded";
  createdAt: string;
  notes?: string;
}

type TabKey = "dashboard" | "orders" | "products" | "stock" | "users" | "support" | "returns";

const STOCK_KEY = "succubus-stock";
const SUPPORT_KEY = "succubus-support-tickets";
const RETURNS_KEY = "succubus-returns";
const CUSTOM_PRODUCTS_KEY = "succubus-custom-products";
const ORDERS_KEY = "succubus-orders";
const USERS_KEY = "succubus-users";

const loadJSON = <T,>(key: string, fallback: T): T => {
  try { return JSON.parse(localStorage.getItem(key) || "null") ?? fallback; }
  catch { return fallback; }
};

const AdminPage = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabKey>("dashboard");
  const [orders, setOrders] = useState<Order[]>([]);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [users, setUsers] = useState<Array<{ id: string; name: string; email: string; role: string; createdAt: string }>>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [stockMap, setStockMap] = useState<Record<string, number>>(() => loadJSON(STOCK_KEY, {}));
  const [search, setSearch] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const [customProducts, setCustomProducts] = useState<Product[]>(() => loadJSON(CUSTOM_PRODUCTS_KEY, []));

  const allProducts = useMemo(() => [...staticProducts, ...customProducts], [customProducts]);

  // Auth guard
  useEffect(() => {
    if (!user || !isAdmin) {
      navigate("/login", { state: { from: "/admin" }, replace: true });
    }
  }, [user, isAdmin, navigate]);

  // Persist custom products
  useEffect(() => {
    localStorage.setItem(CUSTOM_PRODUCTS_KEY, JSON.stringify(customProducts));
  }, [customProducts]);

  // Persist stock
  useEffect(() => {
    localStorage.setItem(STOCK_KEY, JSON.stringify(stockMap));
  }, [stockMap]);

  // Load data
  useEffect(() => {
    setOrders(loadJSON<Order[]>(ORDERS_KEY, []).reverse());
    setTickets(loadJSON<SupportTicket[]>(SUPPORT_KEY, []).reverse());
    setReturns(loadJSON<ReturnRequest[]>(RETURNS_KEY, []).reverse());
    try {
      const allUsers = loadJSON<any[]>(USERS_KEY, [])
        .map((u) => ({ id: u.id, name: u.name, email: u.email, role: u.role, createdAt: u.createdAt }));
      setUsers(allUsers);
    } catch {}
  }, []);

  if (!user || !isAdmin) return null;

  // Helpers
  const getStock = (id: string) => stockMap[id] ?? 0;
  const setStock = (id: string, val: number) => {
    const safe = Math.max(0, Math.min(9999, Math.floor(val) || 0));
    setStockMap((prev) => ({ ...prev, [id]: safe }));
  };

  const updateOrderStatus = (orderId: string, status: string) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status } : o));
    setOrders(updated);
    localStorage.setItem(ORDERS_KEY, JSON.stringify([...updated].reverse()));
    toast.success(`Pedido atualizado → ${status}`);
  };

  const saveProduct = () => {
    const name = editingProduct?.name?.trim();
    const price = Number(editingProduct?.price);
    if (!name || name.length < 2) return toast.error("Nome inválido");
    if (!price || price <= 0) return toast.error("Preço inválido");

    const prod: Product = {
      id: editingProduct!.id || `custom-${Date.now()}`,
      name,
      price,
      image: editingProduct?.image || "/placeholder.svg",
      category: editingProduct?.category || "lingerie",
      style: editingProduct?.style || "dark",
      description: (editingProduct?.description || "").trim(),
      sizes: editingProduct?.sizes?.length ? editingProduct.sizes : ["P", "M", "G"],
      rating: editingProduct?.rating || 5,
      reviews: editingProduct?.reviews || 0,
      isNew: editingProduct?.isNew,
      isBestseller: editingProduct?.isBestseller,
      limitedStock: editingProduct?.limitedStock,
      sku: editingProduct?.sku,
      stock: editingProduct?.stock ?? 10,
    };

    setCustomProducts((prev) => {
      const idx = prev.findIndex((p) => p.id === prod.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = prod;
        return updated;
      }
      return [...prev, prod];
    });

    if (prod.stock !== undefined) setStock(prod.id, prod.stock);
    setEditingProduct(null);
    toast.success("Produto salvo!");
  };

  const deleteProduct = (id: string) => {
    if (!confirm("Remover este produto?")) return;
    setCustomProducts((prev) => prev.filter((p) => p.id !== id));
    setStockMap((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    toast.success("Produto removido");
  };

  const updateTicket = (id: string, status: SupportTicket["status"], reply?: string) => {
    const updated = tickets.map((t) => (t.id === id ? { ...t, status, ...(reply ? { reply } : {}) } : t));
    setTickets(updated);
    localStorage.setItem(SUPPORT_KEY, JSON.stringify([...updated].reverse()));
    toast.success("Ticket atualizado");
  };

  const sendReply = (ticketId: string) => {
    if (replyText.trim().length < 5) return toast.error("Resposta muito curta");
    updateTicket(ticketId, "resolved", replyText.trim());
    setReplyingTo(null);
    setReplyText("");
  };

  const updateReturn = (id: string, status: ReturnRequest["status"]) => {
    const updated = returns.map((r) => (r.id === id ? { ...r, status } : r));
    setReturns(updated);
    localStorage.setItem(RETURNS_KEY, JSON.stringify([...updated].reverse()));
    toast.success(`Devolução → ${status}`);
  };

  const promoteUser = (userId: string) => {
    const all = loadJSON<any[]>(USERS_KEY, []);
    const updated = all.map((u) => (u.id === userId ? { ...u, role: u.role === "admin" ? "user" : "admin" } : u));
    localStorage.setItem(USERS_KEY, JSON.stringify(updated));
    setUsers(updated.map((u) => ({ id: u.id, name: u.name, email: u.email, role: u.role, createdAt: u.createdAt })));
    toast.success("Permissão alterada");
  };

  // Stats
  const totalRevenue = orders.filter((o) => o.status === "paid" || o.status === "shipped").reduce((s, o) => s + o.total, 0);
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const lowStock = allProducts.filter((p) => getStock(p.id) > 0 && getStock(p.id) <= 3);
  const outOfStock = allProducts.filter((p) => getStock(p.id) === 0);
  const openTickets = tickets.filter((t) => t.status !== "resolved").length;
  const pendingReturns = returns.filter((r) => r.status === "requested").length;

  const filteredProducts = allProducts.filter((p) =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase())
  );

  const tabs: { key: TabKey; label: string; badge?: number }[] = [
    { key: "dashboard", label: "Dashboard" },
    { key: "orders", label: "Pedidos", badge: pendingOrders },
    { key: "products", label: "Produtos" },
    { key: "stock", label: "Estoque", badge: lowStock.length + outOfStock.length },
    { key: "users", label: "Usuários" },
    { key: "support", label: "Suporte", badge: openTickets },
    { key: "returns", label: "Devoluções", badge: pendingReturns },
  ];

  return (
    <div className="pt-24 md:pt-28 pb-16 min-h-screen">
      <div className="container">
        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <div>
            <motion.h1
              className="font-heading text-3xl md:text-4xl font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Painel Admin
            </motion.h1>
            <p className="font-body text-xs text-muted-foreground mt-1">{user.email}</p>
          </div>
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
          {[
            { label: "Pedidos", value: orders.length, icon: ShoppingBag, color: "text-foreground" },
            { label: "Produtos", value: allProducts.length, icon: Package, color: "text-foreground" },
            { label: "Receita", value: `R$ ${totalRevenue.toFixed(0)}`, icon: DollarSign, color: "text-emerald-500" },
            { label: "Estoque baixo", value: lowStock.length + outOfStock.length, icon: AlertTriangle, color: lowStock.length + outOfStock.length > 0 ? "text-amber-500" : "text-foreground" },
          ].map((stat) => (
            <div key={stat.label} className="bg-card border border-border rounded-xl p-4 md:p-5" style={{ boxShadow: "var(--card-shadow)" }}>
              <stat.icon size={18} className={`${stat.color} mb-2`} />
              <p className="font-body text-xl md:text-2xl font-medium">{stat.value}</p>
              <p className="font-body text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`relative px-4 md:px-5 py-2.5 rounded-lg font-body text-[11px] tracking-[0.1em] uppercase transition-colors whitespace-nowrap ${
                tab === t.key ? "bg-foreground text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"
              }`}
            >
              {t.label}
              {t.badge !== undefined && t.badge > 0 && (
                <span className="ml-2 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1.5 rounded-full bg-destructive text-destructive-foreground text-[9px] font-medium">
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Dashboard */}
        {tab === "dashboard" && (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-xl p-5" style={{ boxShadow: "var(--card-shadow)" }}>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={16} className="text-emerald-500" />
                <h3 className="font-heading text-lg font-light">Atividade recente</h3>
              </div>
              <ul className="space-y-2 font-body text-sm">
                <li className="flex justify-between"><span className="text-muted-foreground">Pedidos pendentes</span><span className="font-medium">{pendingOrders}</span></li>
                <li className="flex justify-between"><span className="text-muted-foreground">Tickets abertos</span><span className="font-medium">{openTickets}</span></li>
                <li className="flex justify-between"><span className="text-muted-foreground">Devoluções a tratar</span><span className="font-medium">{pendingReturns}</span></li>
                <li className="flex justify-between"><span className="text-muted-foreground">Usuários cadastrados</span><span className="font-medium">{users.length}</span></li>
              </ul>
            </div>
            <div className="bg-card border border-border rounded-xl p-5" style={{ boxShadow: "var(--card-shadow)" }}>
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle size={16} className="text-amber-500" />
                <h3 className="font-heading text-lg font-light">Alertas de estoque</h3>
              </div>
              {outOfStock.length === 0 && lowStock.length === 0 ? (
                <p className="font-body text-sm text-muted-foreground">Tudo em ordem.</p>
              ) : (
                <ul className="space-y-1.5 font-body text-sm max-h-48 overflow-auto">
                  {outOfStock.slice(0, 5).map((p) => (
                    <li key={p.id} className="flex justify-between gap-2">
                      <span className="truncate">{p.name}</span>
                      <span className="text-destructive shrink-0">Esgotado</span>
                    </li>
                  ))}
                  {lowStock.slice(0, 5).map((p) => (
                    <li key={p.id} className="flex justify-between gap-2">
                      <span className="truncate">{p.name}</span>
                      <span className="text-amber-500 shrink-0">{getStock(p.id)} un</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* Orders */}
        {tab === "orders" && (
          <div className="space-y-3">
            {orders.length === 0 && <p className="text-muted-foreground font-body text-sm">Nenhum pedido.</p>}
            {orders.map((order) => (
              <div key={order.id} className="bg-card border border-border rounded-xl p-5" style={{ boxShadow: "var(--card-shadow)" }}>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="min-w-0">
                    <p className="font-body text-sm font-medium">{order.id}</p>
                    <p className="font-body text-xs text-muted-foreground">
                      {order.customer?.name} • {order.customer?.email}
                    </p>
                    <p className="font-body text-xs text-muted-foreground mt-1">
                      {order.items.map((i) => `${i.name} (${i.size}) x${i.quantity}`).join(", ")}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-body text-sm font-medium">R$ {order.total.toFixed(2)}</p>
                    <p className="font-body text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                    <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider mt-1">{order.payment}</p>
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

        {/* Products */}
        {tab === "products" && (
          <div>
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <Button
                onClick={() => setEditingProduct({ style: "dark", category: "lingerie", sizes: ["P", "M", "G", "GG"], stock: 10 })}
                className="bg-foreground text-primary-foreground font-body text-xs tracking-[0.1em] uppercase gap-2"
              >
                <Plus size={14} /> Novo produto
              </Button>
              <div className="relative flex-1 min-w-[200px]">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar produto..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 bg-secondary border-border font-body"
                  maxLength={50}
                />
              </div>
            </div>

            {editingProduct && (
              <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setEditingProduct(null)}>
                <div onClick={(e) => e.stopPropagation()} className="bg-card border border-border rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-auto space-y-3" style={{ boxShadow: "var(--card-shadow)" }}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading text-xl font-light">
                      {editingProduct.id ? "Editar" : "Novo"} Produto
                    </h3>
                    <button onClick={() => setEditingProduct(null)} aria-label="Fechar"><X size={18} /></button>
                  </div>
                  <Input placeholder="Nome *" value={editingProduct.name || ""} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} className="bg-secondary border-border font-body" maxLength={100} />
                  <Input placeholder="SKU" value={editingProduct.sku || ""} onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })} className="bg-secondary border-border font-body" maxLength={50} />
                  <div className="grid grid-cols-2 gap-2">
                    <Input type="number" placeholder="Preço *" value={editingProduct.price || ""} onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })} className="bg-secondary border-border font-body" min={0} max={99999} />
                    <Input type="number" placeholder="Estoque" value={editingProduct.stock ?? ""} onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })} className="bg-secondary border-border font-body" min={0} max={9999} />
                  </div>
                  <Input placeholder="URL da imagem" value={editingProduct.image || ""} onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })} className="bg-secondary border-border font-body" maxLength={500} />
                  <Textarea placeholder="Descrição" value={editingProduct.description || ""} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })} className="bg-secondary border-border font-body" maxLength={500} rows={3} />
                  <div className="grid grid-cols-2 gap-2">
                    <select value={editingProduct.category || "lingerie"} onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as Product["category"] })} className="bg-secondary border border-border rounded-lg px-3 py-2 font-body text-sm h-10">
                      <option value="lingerie">Lingerie</option>
                      <option value="harness">Harness</option>
                      <option value="acessorio">Acessório</option>
                    </select>
                    <select value={editingProduct.style || "dark"} onChange={(e) => setEditingProduct({ ...editingProduct, style: e.target.value as Product["style"] })} className="bg-secondary border border-border rounded-lg px-3 py-2 font-body text-sm h-10">
                      <option value="dark">Dark</option>
                      <option value="white">White</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-body">
                    <label className="flex items-center gap-1.5"><input type="checkbox" checked={!!editingProduct.isNew} onChange={(e) => setEditingProduct({ ...editingProduct, isNew: e.target.checked })} /> Novo</label>
                    <label className="flex items-center gap-1.5"><input type="checkbox" checked={!!editingProduct.isBestseller} onChange={(e) => setEditingProduct({ ...editingProduct, isBestseller: e.target.checked })} /> Bestseller</label>
                  </div>
                  <Button onClick={saveProduct} className="w-full bg-foreground text-primary-foreground font-body text-xs tracking-[0.15em] uppercase h-10">
                    Salvar
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {filteredProducts.map((p) => {
                const stock = getStock(p.id);
                return (
                  <div key={p.id} className="flex items-center gap-3 bg-card border border-border rounded-xl p-3">
                    <img src={p.image} alt={p.name} className="w-12 h-16 object-cover rounded-lg" loading="lazy" />
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm font-medium truncate">{p.name}</p>
                      <p className="font-body text-xs text-muted-foreground">
                        {p.style} • {p.category} • R$ {p.price.toFixed(2)}
                      </p>
                      <p className={`font-body text-[10px] uppercase tracking-wider mt-0.5 ${stock === 0 ? "text-destructive" : stock <= 3 ? "text-amber-500" : "text-muted-foreground"}`}>
                        {stock === 0 ? "Esgotado" : `${stock} em estoque`}
                      </p>
                    </div>
                    {p.id.startsWith("custom-") && (
                      <div className="flex gap-1 shrink-0">
                        <button onClick={() => setEditingProduct({ ...p, stock })} className="p-2 text-muted-foreground hover:text-foreground" aria-label="Editar"><Edit size={14} /></button>
                        <button onClick={() => deleteProduct(p.id)} className="p-2 text-muted-foreground hover:text-destructive" aria-label="Remover"><Trash2 size={14} /></button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Stock */}
        {tab === "stock" && (
          <div>
            <div className="bg-card border border-border rounded-xl p-4 mb-4" style={{ boxShadow: "var(--card-shadow)" }}>
              <p className="font-body text-xs text-muted-foreground mb-1">Resumo</p>
              <div className="flex gap-6 flex-wrap">
                <div><span className="font-body text-2xl font-medium">{outOfStock.length}</span> <span className="font-body text-xs text-muted-foreground">esgotados</span></div>
                <div><span className="font-body text-2xl font-medium text-amber-500">{lowStock.length}</span> <span className="font-body text-xs text-muted-foreground">baixo</span></div>
                <div><span className="font-body text-2xl font-medium">{allProducts.length - outOfStock.length - lowStock.length}</span> <span className="font-body text-xs text-muted-foreground">ok</span></div>
              </div>
            </div>

            <div className="space-y-2">
              {allProducts.map((p) => {
                const stock = getStock(p.id);
                return (
                  <div key={p.id} className="flex items-center gap-3 bg-card border border-border rounded-xl p-3">
                    <img src={p.image} alt={p.name} className="w-10 h-14 object-cover rounded-lg" loading="lazy" />
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm font-medium truncate">{p.name}</p>
                      <p className="font-body text-xs text-muted-foreground">{p.id}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => setStock(p.id, stock - 1)} className="w-8 h-8 rounded-lg bg-secondary hover:bg-accent font-body text-sm" aria-label="-">−</button>
                      <input
                        type="number"
                        value={stock}
                        onChange={(e) => setStock(p.id, Number(e.target.value))}
                        className={`w-16 h-8 text-center bg-secondary border border-border rounded-lg font-body text-sm ${stock === 0 ? "text-destructive" : stock <= 3 ? "text-amber-500" : ""}`}
                        min={0}
                        max={9999}
                      />
                      <button onClick={() => setStock(p.id, stock + 1)} className="w-8 h-8 rounded-lg bg-secondary hover:bg-accent font-body text-sm" aria-label="+">+</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Users */}
        {tab === "users" && (
          <div className="space-y-2">
            {users.length === 0 && <p className="text-muted-foreground font-body text-sm">Nenhum usuário.</p>}
            {users.map((u) => (
              <div key={u.id} className="flex items-center gap-3 bg-card border border-border rounded-xl p-4" style={{ boxShadow: "var(--card-shadow)" }}>
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <Users size={16} className="text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm font-medium truncate">{u.name}</p>
                  <p className="font-body text-xs text-muted-foreground truncate">{u.email}</p>
                </div>
                <span className={`px-2 py-1 rounded-lg font-body text-[10px] tracking-wider uppercase shrink-0 ${
                  u.role === "admin" ? "bg-foreground text-primary-foreground" : "bg-secondary text-secondary-foreground"
                }`}>
                  {u.role}
                </span>
                {u.id !== user.id && (
                  <button
                    onClick={() => promoteUser(u.id)}
                    className="font-body text-[10px] tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors shrink-0"
                  >
                    {u.role === "admin" ? "Rebaixar" : "Promover"}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Support */}
        {tab === "support" && (
          <div className="space-y-3">
            {tickets.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare size={32} className="mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground font-body text-sm">Nenhum ticket de suporte.</p>
              </div>
            )}
            {tickets.map((t) => (
              <div key={t.id} className="bg-card border border-border rounded-xl p-5" style={{ boxShadow: "var(--card-shadow)" }}>
                <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                  <div className="min-w-0">
                    <p className="font-body text-sm font-medium">{t.subject}</p>
                    <p className="font-body text-xs text-muted-foreground">{t.name} • {t.email}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-lg font-body text-[10px] tracking-wider uppercase shrink-0 ${
                    t.status === "resolved" ? "bg-emerald-500/10 text-emerald-500" :
                    t.status === "in_progress" ? "bg-amber-500/10 text-amber-500" :
                    "bg-destructive/10 text-destructive"
                  }`}>
                    {t.status === "open" ? "Aberto" : t.status === "in_progress" ? "Em andamento" : "Resolvido"}
                  </span>
                </div>
                <p className="font-body text-sm text-muted-foreground bg-secondary/50 rounded-lg p-3 mb-3">{t.message}</p>
                {t.reply && (
                  <p className="font-body text-sm bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3 mb-3">
                    <span className="text-[10px] uppercase tracking-wider text-emerald-500 block mb-1">Resposta enviada</span>
                    {t.reply}
                  </p>
                )}
                <div className="flex items-center gap-2 flex-wrap">
                  {(["open", "in_progress", "resolved"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => updateTicket(t.id, s)}
                      className={`px-3 py-1 rounded-lg font-body text-[10px] tracking-wider uppercase transition-colors ${
                        t.status === s ? "bg-foreground text-primary-foreground" : "bg-secondary hover:bg-accent"
                      }`}
                    >
                      {s.replace("_", " ")}
                    </button>
                  ))}
                  {replyingTo !== t.id && t.status !== "resolved" && (
                    <button onClick={() => { setReplyingTo(t.id); setReplyText(""); }} className="ml-auto font-body text-xs text-foreground hover:underline">
                      Responder
                    </button>
                  )}
                </div>
                {replyingTo === t.id && (
                  <div className="mt-3 space-y-2">
                    <Textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Sua resposta..." className="bg-secondary border-border font-body text-sm" maxLength={1000} rows={3} />
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" size="sm" onClick={() => setReplyingTo(null)} className="font-body text-xs">Cancelar</Button>
                      <Button size="sm" onClick={() => sendReply(t.id)} className="font-body text-xs bg-foreground text-primary-foreground">Enviar</Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Returns */}
        {tab === "returns" && (
          <div className="space-y-3">
            {returns.length === 0 && (
              <div className="text-center py-12">
                <RotateCcw size={32} className="mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground font-body text-sm">Nenhuma solicitação de devolução.</p>
              </div>
            )}
            {returns.map((r) => (
              <div key={r.id} className="bg-card border border-border rounded-xl p-5" style={{ boxShadow: "var(--card-shadow)" }}>
                <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                  <div className="min-w-0">
                    <p className="font-body text-sm font-medium">Pedido {r.orderId}</p>
                    <p className="font-body text-xs text-muted-foreground">{r.customerName} • {r.customerEmail}</p>
                    <p className="font-body text-xs text-muted-foreground mt-0.5">{new Date(r.createdAt).toLocaleDateString("pt-BR")}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-lg font-body text-[10px] tracking-wider uppercase shrink-0 ${
                    r.status === "refunded" ? "bg-emerald-500/10 text-emerald-500" :
                    r.status === "approved" ? "bg-blue-500/10 text-blue-500" :
                    r.status === "rejected" ? "bg-destructive/10 text-destructive" :
                    "bg-amber-500/10 text-amber-500"
                  }`}>
                    {r.status}
                  </span>
                </div>
                <p className="font-body text-sm text-muted-foreground bg-secondary/50 rounded-lg p-3 mb-3">{r.reason}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {(["requested", "approved", "rejected", "refunded"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => updateReturn(r.id, s)}
                      className={`px-3 py-1 rounded-lg font-body text-[10px] tracking-wider uppercase transition-colors ${
                        r.status === s ? "bg-foreground text-primary-foreground" : "bg-secondary hover:bg-accent"
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
      </div>
    </div>
  );
};

export default AdminPage;
