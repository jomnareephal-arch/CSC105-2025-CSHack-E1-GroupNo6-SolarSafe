import type { ReactNode } from "react";
import { useAuth } from "../contexts/AuthContext";

const NAV_ITEMS = [
  {
    id: "product",
    label: "Product Recommendation",
    icon: (
      <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" strokeLinejoin="round"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
    ),
  },
  {
    id: "planner",
    label: "Planner",
    icon: (
      <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
  },
  {
    id: "calculate",
    label: "Sun Safety Calculate",
    icon: (
      <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="5"/>
        <line x1="12" y1="1" x2="12" y2="3"/>
        <line x1="12" y1="21" x2="12" y2="23"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="1" y1="12" x2="3" y2="12"/>
        <line x1="21" y1="12" x2="23" y2="12"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
      </svg>
    ),
  },
  {
    id: "setting",
    label: "Setting",
    icon: (
      <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
      </svg>
    ),
  },
];

interface AppLayoutProps {
  children: ReactNode;
  activeNav?: string;
  onNavChange?: (id: string) => void;
}

export default function AppLayout({ children, activeNav = "product", onNavChange }: AppLayoutProps) {
  const { username } = useAuth();
  return (
    <div className="flex h-screen w-full overflow-hidden">

      {/* ── Sidebar ──────────────────────────────────────────────
          mobile : icon-only (w-14)
          desktop: full with labels (w-56)                       */}
      <aside
        className="flex shrink-0 flex-col py-5 w-14 md:w-56"
        style={{ backgroundColor: "#F4AE5E" }}
      >
        {/* Brand — hidden on mobile */}
        <div className="mb-6 hidden md:block px-4">
          <p className="text-xl font-bold leading-tight" style={{ color: "#5F2900" }}>SolarSafe</p>
          <p className="text-sm truncate" style={{ color: "#5F2900" }}>👋 {username}</p>
        </div>

        {/* Mobile brand — just initials */}
        <div className="mb-4 flex justify-center md:hidden">
          <span className="text-lg font-bold" style={{ color: "#5F2900" }}>SS</span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 px-1 md:px-2">
          {NAV_ITEMS.map((item) => {
            const isActive = item.id === activeNav;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavChange?.(item.id)}
                title={item.label}
                className="flex items-center gap-2 rounded-lg py-2.5 transition-colors
                           justify-center px-2
                           md:justify-start md:px-3"
                style={
                  isActive
                    ? { backgroundColor: "#934A15", color: "#ffffff" }
                    : { backgroundColor: "transparent", color: "#5F2900" }
                }
              >
                {item.icon}
                {/* Label — hidden on mobile */}
                <span className="hidden md:block text-xs font-medium leading-tight">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* ── Main content ─────────────────────────────────────── */}
      <main
        className="flex-1 overflow-y-auto"
        style={{
          backgroundImage: "url('/background.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {children}
      </main>
    </div>
  );
}
