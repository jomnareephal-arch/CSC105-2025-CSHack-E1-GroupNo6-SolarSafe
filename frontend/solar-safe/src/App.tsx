import { useState } from "react";
import AppLayout from "./components/AppLayout";
import PlannerPage from "./modules/Planner/pages/PlannerPage";

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-4xl text-amber-700 opacity-40">{title}</h1>
    </div>
  );
}

export default function App() {
  const [activeNav, setActiveNav] = useState("planner");

  const renderPage = () => {
    switch (activeNav) {
      case "planner":   return <PlannerPage />;
      case "product":   return <PlaceholderPage title="Product Recommendation" />;
      case "calculate": return <PlaceholderPage title="Sun Safety Calculate" />;
      case "setting":   return <PlaceholderPage title="Setting" />;
      default:          return <PlannerPage />;
    }
  };

  return (
    <AppLayout activeNav={activeNav} onNavChange={setActiveNav}>
      {renderPage()}
    </AppLayout>
  );
}
