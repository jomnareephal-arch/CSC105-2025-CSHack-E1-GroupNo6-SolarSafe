import { useState } from "react";
import AppLayout from "./components/AppLayout";
import ProductRecommendPage from "./modules/ProductRecommend/pages/ProductRecommendPage";
import CalculatePage from "./modules/calculate/pages/CalculatePage";
import LoginPage from "./modules/auth/LoginPage";
import SignupPage from "./modules/auth/SignupPage";
import SettingPage from "./modules/auth/SettingPage";
import { useAuth } from "./contexts/AuthContext";

type AuthScreen = "login" | "signup";

export default function App() {
  const { isLoggedIn } = useAuth();
  const [activeNav, setActiveNav] = useState("product");
  const [authScreen, setAuthScreen] = useState<AuthScreen>("login");

  // Show auth screens if not logged in
  if (!isLoggedIn) {
    if (authScreen === "signup") {
      return <SignupPage onGoLogin={() => setAuthScreen("login")} />;
    }
    return <LoginPage onGoSignup={() => setAuthScreen("signup")} />;
  }

  return (
    <AppLayout activeNav={activeNav} onNavChange={setActiveNav}>
      {activeNav === "product"   && <ProductRecommendPage />}
      {activeNav === "planner"   && (
        <div className="flex h-full items-center justify-center text-gray-500">
          Planner — Coming soon
        </div>
      )}
      {activeNav === "calculate" && <CalculatePage />}
      {activeNav === "setting"   && <SettingPage />}
    </AppLayout>
  );
}
