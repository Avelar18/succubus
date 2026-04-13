import { Instagram, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import logoGold from "@/assets/succubus-logo-gold.png";
import logoDark from "@/assets/succubus-logo-dark.png";

const Footer = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <img
              src={isDark ? logoGold : logoDark}
              alt="Succubus"
              className="h-14 w-auto mb-4"
              width={56}
              height={56}
            />
            <p className="text-muted-foreground font-body text-sm leading-relaxed max-w-sm">
              Duas versões de uma mesma essência. Luz e sombra coexistem em cada peça que criamos.
            </p>
            <div className="flex items-center gap-4 mt-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="mailto:contato@succubus.com" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Email">
                <Mail size={18} />
              </a>
              <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="WhatsApp">
                <Phone size={18} />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-body text-xs tracking-[0.15em] uppercase mb-4 font-medium">Navegação</h4>
            <div className="flex flex-col gap-2">
              <Link to="/loja" className="text-muted-foreground text-sm font-body hover:text-foreground transition-colors">Loja</Link>
              <Link to="/sobre" className="text-muted-foreground text-sm font-body hover:text-foreground transition-colors">Sobre</Link>
              <Link to="/contato" className="text-muted-foreground text-sm font-body hover:text-foreground transition-colors">Contato</Link>
              <Link to="/faq" className="text-muted-foreground text-sm font-body hover:text-foreground transition-colors">FAQ</Link>
              <Link to="/meus-pedidos" className="text-muted-foreground text-sm font-body hover:text-foreground transition-colors">Meus Pedidos</Link>
            </div>
          </div>
          <div>
            <h4 className="font-body text-xs tracking-[0.15em] uppercase mb-4 font-medium">Informações</h4>
            <div className="flex flex-col gap-2">
              <Link to="/faq" className="text-muted-foreground text-sm font-body hover:text-foreground transition-colors">Trocas e Devoluções</Link>
              <Link to="/faq" className="text-muted-foreground text-sm font-body hover:text-foreground transition-colors">Política de Privacidade</Link>
              <Link to="/faq" className="text-muted-foreground text-sm font-body hover:text-foreground transition-colors">Termos de Uso</Link>
              <p className="text-muted-foreground text-sm font-body">CNPJ: 00.000.000/0001-00</p>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-xs font-body">© 2026 Succubus. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground text-xs font-body">Pagamento seguro</span>
            <span className="text-muted-foreground text-xs font-body">•</span>
            <span className="text-muted-foreground text-xs font-body">Frete grátis acima de R$ 299</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
