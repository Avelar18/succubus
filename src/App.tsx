import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { lazy, Suspense } from "react";
import ScrollToTop from "@/components/ScrollToTop";

const Index = lazy(() => import("./pages/Index"));
const ShopPage = lazy(() => import("./pages/ShopPage"));
const ProductPage = lazy(() => import("./pages/ProductPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const FAQPage = lazy(() => import("./pages/FAQPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const OrderSuccessPage = lazy(() => import("./pages/OrderSuccessPage"));
const OrdersPage = lazy(() => import("./pages/OrdersPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const AccountPage = lazy(() => import("./pages/AccountPage"));
const WishlistPage = lazy(() => import("./pages/WishlistPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
  </div>
);

const AppLayout = () => {
  const { hasChosen } = useTheme();

  return (
    <>
      <ScrollToTop />
      {hasChosen && <Navbar />}
      {hasChosen && <CartDrawer />}
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/loja" element={<ShopPage />} />
          <Route path="/produto/:id" element={<ProductPage />} />
          <Route path="/sobre" element={<AboutPage />} />
          <Route path="/contato" element={<ContactPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/pedido/sucesso" element={<OrderSuccessPage />} />
          <Route path="/meus-pedidos" element={<OrdersPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<RegisterPage />} />
          <Route path="/conta" element={<AccountPage />} />
          <Route path="/favoritos" element={<WishlistPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      {hasChosen && <Footer />}
    </>
  );
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <AppLayout />
              </BrowserRouter>
            </TooltipProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
