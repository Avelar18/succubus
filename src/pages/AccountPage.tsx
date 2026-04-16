import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { User, Package, Heart, LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const AccountPage = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [orderCount, setOrderCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }
    try {
      const orders = JSON.parse(localStorage.getItem("succubus-orders") || "[]");
      setOrderCount(orders.length);
      const wishlist = JSON.parse(localStorage.getItem("succubus-wishlist") || "[]");
      setWishlistCount(wishlist.length);
    } catch {}
  }, [user, navigate]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="pt-24 md:pt-28 pb-16">
      <div className="container max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
              <User size={28} className="text-muted-foreground" />
            </div>
            <div>
              <h1 className="font-heading text-2xl md:text-3xl font-light">{user.name}</h1>
              <p className="font-body text-sm text-muted-foreground">{user.email}</p>
              {isAdmin && (
                <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-foreground text-primary-foreground rounded-sm font-body text-[10px] tracking-wider uppercase">
                  <Shield size={10} /> Admin
                </span>
              )}
            </div>
          </div>

          <div className="grid gap-3">
            <Link
              to="/meus-pedidos"
              className="flex items-center gap-4 p-5 bg-card border border-border rounded-xl hover:border-foreground/20 transition-all group"
              style={{ boxShadow: "var(--card-shadow)" }}
            >
              <Package size={22} className="text-muted-foreground group-hover:text-foreground transition-colors" />
              <div className="flex-1">
                <p className="font-body text-sm font-medium">Meus Pedidos</p>
                <p className="font-body text-xs text-muted-foreground">{orderCount} pedido(s)</p>
              </div>
            </Link>

            <Link
              to="/favoritos"
              className="flex items-center gap-4 p-5 bg-card border border-border rounded-xl hover:border-foreground/20 transition-all group"
              style={{ boxShadow: "var(--card-shadow)" }}
            >
              <Heart size={22} className="text-muted-foreground group-hover:text-foreground transition-colors" />
              <div className="flex-1">
                <p className="font-body text-sm font-medium">Favoritos</p>
                <p className="font-body text-xs text-muted-foreground">{wishlistCount} item(ns)</p>
              </div>
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-4 p-5 bg-card border border-border rounded-xl hover:border-foreground/20 transition-all group"
                style={{ boxShadow: "var(--card-shadow)" }}
              >
                <Shield size={22} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                <div className="flex-1">
                  <p className="font-body text-sm font-medium">Painel Admin</p>
                  <p className="font-body text-xs text-muted-foreground">Gerenciar loja</p>
                </div>
              </Link>
            )}

            <div className="pt-4">
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full font-body text-xs tracking-[0.15em] uppercase h-12 gap-2 border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
              >
                <LogOut size={16} />
                Sair da conta
              </Button>
            </div>
          </div>

          <p className="font-body text-[10px] text-muted-foreground text-center mt-8">
            Membro desde {new Date(user.createdAt).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AccountPage;
