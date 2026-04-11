import { useTheme } from "@/contexts/ThemeContext";
import SplashScreen from "@/components/SplashScreen";
import HomePage from "@/pages/HomePage";

const Index = () => {
  const { hasChosen } = useTheme();

  if (!hasChosen) return <SplashScreen />;
  return <HomePage />;
};

export default Index;
