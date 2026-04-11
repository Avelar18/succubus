import { Instagram } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <h3 className="font-heading text-2xl font-light tracking-[0.2em] mb-4">LUMIÈRE</h3>
            <p className="text-muted-foreground font-body text-sm leading-relaxed max-w-sm">
              Duas versões de uma mesma essência. Luz e sombra coexistem em cada peça que criamos.
            </p>
          </div>
          <div>
            <h4 className="font-body text-xs tracking-[0.15em] uppercase mb-4 font-medium">Navegação</h4>
            <div className="flex flex-col gap-2">
              <Link to="/loja" className="text-muted-foreground text-sm font-body hover:text-foreground transition-colors">Loja</Link>
              <Link to="/sobre" className="text-muted-foreground text-sm font-body hover:text-foreground transition-colors">Sobre</Link>
              <Link to="/contato" className="text-muted-foreground text-sm font-body hover:text-foreground transition-colors">Contato</Link>
            </div>
          </div>
          <div>
            <h4 className="font-body text-xs tracking-[0.15em] uppercase mb-4 font-medium">Social</h4>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <Instagram size={18} />
              <span className="font-body text-sm">@lumiere</span>
            </a>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-border text-center">
          <p className="text-muted-foreground text-xs font-body">© 2026 Lumière. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
