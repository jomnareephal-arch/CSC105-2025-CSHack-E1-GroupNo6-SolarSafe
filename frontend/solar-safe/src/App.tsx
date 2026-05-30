import { useState } from "react";
import AppLayout from "./components/AppLayout";
import ProductRecommendPage from "./module/ProductRecommend/pages/ProductRecommendPage";

export default function App() {
  const [activeNav, setActiveNav] = useState("product");

  return (
    <AppLayout activeNav={activeNav} onNavChange={setActiveNav}>
      {activeNav === "product"   && <ProductRecommendPage />}
      {activeNav === "planner"   && (
        <div className="flex h-full items-center justify-center text-gray-500">
          Planner — Coming soon
        </div>
      )}
      {activeNav === "calculate" && (
        <div className="flex h-full items-center justify-center text-gray-500">
          Sun Safety Calculate — Coming soon
        </div>
      )}
      {activeNav === "setting"   && (
        <div className="flex h-full items-center justify-center text-gray-500">
          Setting — Coming soon
        </div>
      )}
    </AppLayout>
  );
}
