import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Mensagem enviada! Responderemos em breve.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="pt-24 md:pt-28 pb-16">
      <div className="container max-w-2xl">
        <motion.h1
          className="font-heading text-4xl md:text-5xl font-light mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Contato
        </motion.h1>
        <p className="text-muted-foreground font-body text-sm mb-10">
          Estamos aqui para você. Fale conosco por onde preferir.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <a
            href="https://wa.me/5511999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-6 bg-card rounded-lg border border-border hover:border-foreground/20 transition-colors"
          >
            <MessageCircle size={24} className="text-foreground" />
            <div>
              <p className="font-body text-sm font-medium">WhatsApp</p>
              <p className="text-muted-foreground text-xs font-body">Resposta rápida</p>
            </div>
          </a>
          <a
            href="mailto:contato@succubus.com"
            className="flex items-center gap-4 p-6 bg-card rounded-lg border border-border hover:border-foreground/20 transition-colors"
          >
            <Mail size={24} className="text-foreground" />
            <div>
              <p className="font-body text-sm font-medium">Email</p>
              <p className="text-muted-foreground text-xs font-body">contato@succubus.com</p>
            </div>
          </a>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Seu nome"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="bg-secondary border-border font-body"
          />
          <Input
            type="email"
            placeholder="Seu email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="bg-secondary border-border font-body"
          />
          <Textarea
            placeholder="Sua mensagem"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            required
            rows={5}
            className="bg-secondary border-border font-body"
          />
          <Button
            type="submit"
            className="w-full bg-foreground text-primary-foreground hover:bg-foreground/90 font-body text-xs tracking-[0.15em] uppercase h-12"
          >
            Enviar Mensagem
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
