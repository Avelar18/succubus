import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const OrderSuccessPage = () => {
  const [params] = useSearchParams();
  const orderId = params.get("id") || "—";

  return (
    <div className="pt-28 pb-16 container max-w-lg text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-4"
      >
        <CheckCircle size={64} className="text-green-500" />
        <h1 className="font-heading text-3xl md:text-4xl font-light">Pedido confirmado!</h1>
        <p className="text-muted-foreground font-body text-sm">
          Seu pedido <strong className="text-foreground">{orderId}</strong> foi recebido com sucesso.
        </p>
        <p className="text-muted-foreground font-body text-xs">
          Você receberá uma confirmação por email em breve.
        </p>
        <div className="flex gap-4 mt-6">
          <Link
            to="/loja"
            className="px-8 py-3 bg-foreground text-primary-foreground font-body text-xs tracking-[0.15em] uppercase rounded-sm hover:bg-foreground/90 transition-colors"
          >
            Continuar comprando
          </Link>
          <Link
            to="/meus-pedidos"
            className="px-8 py-3 border border-border font-body text-xs tracking-[0.15em] uppercase rounded-sm hover:bg-secondary transition-colors"
          >
            Meus pedidos
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccessPage;
