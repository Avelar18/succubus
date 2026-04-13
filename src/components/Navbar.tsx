import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, Menu, X, Sun, Moon, User } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logoGold from "@/assets/succubus-logo-gold.png";
import logoDark from "@/assets/succubus-logo-dark.png";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const { itemCount, setIsOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isDark = theme === "dark";

  const links = [
    { to: "/", label: "Home" },
    { to: "/loja", label: "Loja" },
    { to: "/sobre", label: "Sobre" },
    { to: "/contato", label: "Contato" },
    { to: "/faq", label: "FAQ" },
  ];

  const toggleTheme = () => setTheme(theme === "dark" ? "white" : "dark");

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center gap-2">
          <img
            src={isDark ? logoGold : logoDark}
            alt="Succubus"
            className="h-10 md:h-12 w-auto"
            width={48}
            height={48}
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`font-body text-xs tracking-[0.15em] uppercase transition-colors hover:text-foreground ${
                location.pathname === l.to ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Alternar tema"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <Link
            to="/meus-pedidos"
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Meus pedidos"
          >
            <User size={18} />
          </Link>

          <button
            onClick={() => setIsOpen(true)}
            className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Carrinho"
          >
            <ShoppingBag size={18} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-foreground text-primary-foreground text-[10px] flex items-center justify-center font-body">
                {itemCount}
              </span>
            )}
          </button>

          <button
            className="md:hidden p-2 text-muted-foreground"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-background border-b border-border"
          >
            <div className="container py-6 flex flex-col gap-4">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setMenuOpen(false)}
                  className="font-body text-sm tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                to="/meus-pedidos"
                onClick={() => setMenuOpen(false)}
                className="font-body text-sm tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground"
              >
                Meus Pedidos
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
