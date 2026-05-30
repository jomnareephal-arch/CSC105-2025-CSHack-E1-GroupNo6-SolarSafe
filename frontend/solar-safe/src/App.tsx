import { useState } from "react";
import Sidebar from "./components/Sidebar";
import PlannerPage from "./pages/PlannerPage";

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="font-display text-4xl text-amber-700 opacity-40">{title}</h1>
    </div>
  );
}

export default function App() {
  const [activeNav, setActiveNav] = useState("planner");

  const renderPage = () => {
    switch (activeNav) {
      case "planner":
        return <PlannerPage />;
      case "recommendation":
        return <PlaceholderPage title="Product Recommendation" />;
      case "calculator":
        return <PlaceholderPage title="Sun Safety Calculate" />;
      case "settings":
        return <PlaceholderPage title="Settings" />;
      default:
        return <PlannerPage />;
    }
  };

  return (
    <Sidebar activeId={activeNav} onNav={setActiveNav}>
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/bg.png')", opacity: 0.8 }}
      />
      <div className="absolute inset-0 bg-amber-50/40" />
      <div className="relative z-10">{renderPage()}</div>
    </Sidebar>
  );
}
