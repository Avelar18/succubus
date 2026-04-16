import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Eye, EyeOff, LogIn } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      toast.success("Bem-vindo(a) de volta!");
      navigate(from, { replace: true });
    } else {
      toast.error(result.error || "Erro ao fazer login");
    }
  };

  return (
    <div className="pt-24 md:pt-28 pb-16 min-h-screen flex items-center justify-center">
      <div className="container max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-xl p-8 md:p-10"
          style={{ boxShadow: "var(--card-shadow)" }}
        >
          <div className="text-center mb-8">
            <h1 className="font-heading text-3xl font-light mb-2">Entrar</h1>
            <p className="font-body text-sm text-muted-foreground">
              Acesse sua conta Succubus
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="font-body text-xs tracking-[0.1em] uppercase text-muted-foreground mb-2 block">
                Email
              </label>
              <Input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                maxLength={255}
                className="bg-secondary border-border font-body h-12"
              />
            </div>

            <div>
              <label className="font-body text-xs tracking-[0.1em] uppercase text-muted-foreground mb-2 block">
                Senha
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  maxLength={128}
                  className="bg-secondary border-border font-body h-12 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-foreground text-primary-foreground hover:bg-foreground/90 font-body text-xs tracking-[0.15em] uppercase h-12 gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={16} />
                  Entrar
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <p className="font-body text-sm text-muted-foreground">
              Não tem conta?{" "}
              <Link to="/cadastro" className="text-foreground underline underline-offset-4 hover:text-foreground/80">
                Criar conta
              </Link>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="font-body text-[10px] text-muted-foreground text-center">
              Admin: admin@succubus.com / Admin@2026
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
