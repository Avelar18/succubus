import { Instagram, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";

const Footer = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <footer className="border-t border-border bg-card">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <span className={`font-heading text-2xl font-light tracking-[0.15em] ${isDark ? "text-gradient-gold" : "text-foreground"}`}>
              SUCCUBUS
            </span>
            <p className="text-muted-foreground text-sm font-body mt-4 leading-relaxed">
              Luz e sombra. Duas faces da mesma beleza.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <Instagram size={18} />
              </a>
              <a href="mailto:contato@succubus.com" className="text-muted-foreground hover:text-foreground transition-colors">
                <Mail size={18} />
              </a>
              <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <Phone size={18} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-body text-xs tracking-[0.15em] uppercase font-medium mb-4">Navegação</h4>
            <div className="flex flex-col gap-3">
              {[
                { to: "/loja", label: "Loja" },
                { to: "/sobre", label: "Sobre" },
                { to: "/contato", label: "Contato" },
                { to: "/faq", label: "FAQ" },
                { to: "/favoritos", label: "Favoritos" },
              ].map((link) => (
                <Link key={link.to} to={link.to} className="text-muted-foreground hover:text-foreground text-sm font-body transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-body text-xs tracking-[0.15em] uppercase font-medium mb-4">Conta</h4>
            <div className="flex flex-col gap-3">
              {[
                { to: "/login", label: "Entrar" },
                { to: "/cadastro", label: "Criar Conta" },
                { to: "/meus-pedidos", label: "Meus Pedidos" },
                { to: "/conta", label: "Minha Conta" },
              ].map((link) => (
                <Link key={link.to} to={link.to} className="text-muted-foreground hover:text-foreground text-sm font-body transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-body text-xs tracking-[0.15em] uppercase font-medium mb-4">Informações</h4>
            <div className="flex flex-col gap-3">
              {[
                { to: "/faq", label: "Entregas" },
                { to: "/faq", label: "Trocas e Devoluções" },
                { to: "/faq", label: "Guia de Medidas" },
                { to: "/faq", label: "Cuidados" },
              ].map((link, i) => (
                <Link key={i} to={link.to} className="text-muted-foreground hover:text-foreground text-sm font-body transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
            <p className="text-muted-foreground text-[10px] font-body mt-4">
              CNPJ: 00.000.000/0001-00
            </p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-muted-foreground text-xs font-body">
          <p>© {new Date().getFullYear()} Succubus. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <span>Frete grátis acima de R$ 299</span>
            <span>Até 3x sem juros</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
