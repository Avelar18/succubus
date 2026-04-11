import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";

const AboutPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="pt-24 md:pt-28 pb-16">
      <div className="container max-w-3xl">
        <motion.h1
          className="font-heading text-4xl md:text-5xl font-light mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Nossa História
        </motion.h1>

        <motion.div
          className="space-y-6 font-body text-sm leading-relaxed text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-lg font-heading italic text-foreground">
            {isDark
              ? "Nascemos da convicção de que vestir-se é um ato de poder."
              : "Nascemos da crença de que vestir-se é um ato de cuidado."}
          </p>

          <p>
            A Succubus surgiu de uma dualidade que existe em cada pessoa: a suavidade e a intensidade,
            a luz e a sombra, o conforto e a ousadia. Acreditamos que essas forças não se opõem —
            elas se completam.
          </p>

          <p>
            Nossa coleção <strong>WHITE</strong> celebra a elegância serena, o toque delicado da seda
            contra a pele, a beleza que não grita, mas encanta. Cada peça é um convite ao romance,
            ao conforto e à sua versão mais leve.
          </p>

          <p>
            Nossa coleção <strong>DARK</strong> é para quem se expressa sem pedir licença. Couro,
            fivelas, estrutura — peças que não sugerem, afirmam. Para quem conhece sua própria força
            e não tem medo de mostrá-la.
          </p>

          <p>
            Cada peça Succubus é desenhada com obsessão pelo detalhe, produzida com materiais premium
            e pensada para fazer você sentir exatamente quem você é.
          </p>

          <div className="pt-8 border-t border-border">
            <p className="font-heading text-xl italic text-foreground">
              "Luz e sombra. Duas faces da mesma beleza."
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;
