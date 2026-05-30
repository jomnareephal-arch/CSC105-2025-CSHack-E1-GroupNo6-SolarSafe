import { type ReactNode } from "react";

interface NavItem {
  id: string;
  label: string;
  icon: ReactNode;
}

const navItems: NavItem[] = [
  {
    id: "recommendation",
    label: "Product Recommendation",
    icon: (
      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M5 3l14 9-14 9V3z" />
      </svg>
    ),
  },
  {
    id: "planner",
    label: "Planner",
    icon: (
      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: "calculator",
    label: "Sun Safety Calculate",
    icon: (
      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="4" y="2" width="16" height="20" rx="2" strokeWidth={2} />
        <line x1="8" y1="7" x2="16" y2="7" strokeWidth={2} strokeLinecap="round" />
        <line x1="8" y1="11" x2="10" y2="11" strokeWidth={2} strokeLinecap="round" />
        <line x1="12" y1="11" x2="14" y2="11" strokeWidth={2} strokeLinecap="round" />
        <line x1="8" y1="15" x2="10" y2="15" strokeWidth={2} strokeLinecap="round" />
        <line x1="12" y1="15" x2="14" y2="15" strokeWidth={2} strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "settings",
    label: "Setting",
    icon: (
      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <circle cx="12" cy="12" r="3" strokeWidth={2} />
      </svg>
    ),
  },
];

interface Props {
  activeId: string;
  onNav: (id: string) => void;
  children: ReactNode;
}

export default function Sidebar({ activeId, onNav, children }: Props) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 flex flex-col py-0 shadow-lg z-10" style={{ backgroundColor: "#E8891A" }}>
        {/* Logo */}
        <div className="px-5 py-6">
          <div className="text-white font-bold text-xl leading-tight">AppName</div>
          <div className="text-orange-100 text-xs mt-0.5">Welcome</div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-0.5 px-2 mt-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNav(item.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left w-full ${
                activeId === item.id
                  ? "text-white shadow-md"
                  : "text-orange-100 hover:bg-orange-600/40"
              }`}
              style={activeId === item.id ? { backgroundColor: "#7B3F10" } : {}}
            >
              <span>{item.icon}</span>
              <span className="truncate leading-snug">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 relative overflow-auto">{children}</main>
    </div>
  );
}
