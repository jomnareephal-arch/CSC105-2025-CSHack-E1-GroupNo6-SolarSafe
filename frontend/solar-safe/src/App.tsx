import { useState } from "react";
import AppLayout from "./components/AppLayout";
import ProductRecommendPage from "./modules/ProductRecommend/pages/ProductRecommendPage";
import CalculatePage from "./modules/calculate/pages/CalculatePage";
import LoginPage from "./modules/auth/LoginPage";
import SignupPage from "./modules/auth/SignupPage";
import SettingPage from "./modules/auth/SettingPage";
import PlannerPage from "./modules/Planner/pages/PlannerPage";
import AdminPage from "./modules/Admin/pages/AdminPage";
import { useAuth } from "./contexts/AuthContext";
import type { Product, ProductCategory } from "./modules/ProductRecommend/types/productRecommend.type";

type AuthScreen = "login" | "signup";

export default function App() {
  const { isLoggedIn, isAdmin } = useAuth();
  const [activeNav, setActiveNav] = useState("product");
  const [authScreen, setAuthScreen] = useState<AuthScreen>("login");

  // Selected products: one per category, shared between ProductRecommend and Calculate
  const [selectedProducts, setSelectedProducts] = useState<Map<ProductCategory, Product>>(new Map());
  // When navigating from Calculate → Product, remember which category to pre-select and to go back
  const [productPageInitialCategory, setProductPageInitialCategory] = useState<ProductCategory | null>(null);
  const [returnToCalculate, setReturnToCalculate] = useState(false);

  const handleSelectProduct = (product: Product) => {
    setSelectedProducts(prev => {
      const next = new Map(prev);
      next.set(product.category, product);
      return next;
    });
  };

  const handleClearSelectedProducts = () => {
    setSelectedProducts(new Map());
  };

  const handleNavigateToProductForCategory = (category: ProductCategory) => {
    setProductPageInitialCategory(category);
    setReturnToCalculate(true);
    setActiveNav("product");
  };

  const handleDoneSelectingProduct = () => {
    setReturnToCalculate(false);
    setProductPageInitialCategory(null);
    setActiveNav("calculate");
  };

  // Show auth screens if not logged in
  if (!isLoggedIn) {
    if (authScreen === "signup") {
      return <SignupPage onGoLogin={() => setAuthScreen("login")} />;
    }
    return <LoginPage onGoSignup={() => setAuthScreen("signup")} />;
  }

  return (
    <AppLayout activeNav={activeNav} onNavChange={(nav) => {
      setReturnToCalculate(false);
      setProductPageInitialCategory(null);
      setActiveNav(nav);
    }}>
      {activeNav === "product"   && (
        <ProductRecommendPage
          selectedProducts={selectedProducts}
          onSelectProduct={handleSelectProduct}
          initialCategory={productPageInitialCategory ?? undefined}
          returnToCalculate={returnToCalculate}
          onDone={handleDoneSelectingProduct}
        />
      )}
      {activeNav === "planner"   && <PlannerPage />}
      {activeNav === "calculate" && (
        <CalculatePage
          selectedProducts={selectedProducts}
          onNavigateToProductForCategory={handleNavigateToProductForCategory}
          onClearSelectedProducts={handleClearSelectedProducts}
        />
      )}
      {activeNav === "admin"     && isAdmin && <AdminPage />}
      {activeNav === "setting"   && <SettingPage />}
    </AppLayout>
  );
}
