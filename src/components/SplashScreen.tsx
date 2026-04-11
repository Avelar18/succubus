import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import whiteHero from "@/assets/white-hero.jpg";
import darkHero from "@/assets/dark-hero.jpg";

const SplashScreen = () => {
  const { setTheme } = useTheme();

  return (
    <div className="fixed inset-0 z-50 flex flex-col md:flex-row h-screen w-screen overflow-hidden">
      {/* WHITE side */}
      <motion.div
        className="relative flex-1 cursor-pointer group overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        onClick={() => setTheme("white")}
      >
        <img
          src={whiteHero}
          alt="White collection"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[hsla(30,25%,97%,0.9)]" />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 md:pb-24 px-8">
          <motion.h2
            className="font-heading text-5xl md:text-7xl lg:text-8xl font-light tracking-[0.3em] mb-4"
            style={{ color: "hsl(30, 10%, 15%)" }}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            WHITE
          </motion.h2>
          <motion.p
            className="font-body text-sm md:text-base tracking-[0.2em] uppercase"
            style={{ color: "hsl(30, 8%, 35%)" }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            Descubra sua versão mais leve
          </motion.p>
          <motion.div
            className="mt-6 w-12 h-[1px]"
            style={{ backgroundColor: "hsl(30, 10%, 15%)" }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.1, duration: 0.6 }}
          />
        </div>
      </motion.div>

      {/* Divider */}
      <div className="hidden md:block w-px bg-gradient-to-b from-transparent via-[hsl(0,0%,50%)] to-transparent" />
      <div className="md:hidden h-px bg-gradient-to-r from-transparent via-[hsl(0,0%,50%)] to-transparent" />

      {/* DARK side */}
      <motion.div
        className="relative flex-1 cursor-pointer group overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        onClick={() => setTheme("dark")}
      >
        <img
          src={darkHero}
          alt="Dark collection"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[hsla(0,0%,5%,0.9)]" />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 md:pb-24 px-8">
          <motion.h2
            className="font-heading text-5xl md:text-7xl lg:text-8xl font-light tracking-[0.3em] mb-4"
            style={{ color: "hsl(0, 0%, 92%)" }}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            DARK
          </motion.h2>
          <motion.p
            className="font-body text-sm md:text-base tracking-[0.2em] uppercase"
            style={{ color: "hsl(0, 0%, 60%)" }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            Explore seu lado mais intenso
          </motion.p>
          <motion.div
            className="mt-6 w-12 h-[1px]"
            style={{ backgroundColor: "hsl(0, 0%, 92%)" }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.3, duration: 0.6 }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default SplashScreen;
