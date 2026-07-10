import { type ReactNode } from "react";
import { NavLink } from "react-router-dom";

type NavigationItem = {
  label: string;
  path: string;
  icon: (className: string) => ReactNode;
};

type SidebarProps = {
  onNavigate?: () => void;
};

const navigationItems: NavigationItem[] = [
  {
    label: "Dashboard",
    path: "/",
    icon: (className) => (
      <svg
        aria-hidden="true"
        className={className}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M3 13h8V3H3z" />
        <path d="M13 21h8V11h-8z" />
        <path d="M13 3h8v4h-8z" />
        <path d="M3 21h8v-4H3z" />
      </svg>
    ),
  },
  {
    label: "Orçamentos",
    path: "/orcamentos",
    icon: (className) => (
      <svg
        aria-hidden="true"
        className={className}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M8 6h13" />
        <path d="M8 12h13" />
        <path d="M8 18h13" />
        <path d="M3 6h.01" />
        <path d="M3 12h.01" />
        <path d="M3 18h.01" />
      </svg>
    ),
  },
  {
    label: "Gráficos",
    path: "/graficos",
    icon: (className) => (
      <svg
        aria-hidden="true"
        className={className}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M3 3v18h18" />
        <path d="m19 9-5 5-4-4-3 3" />
      </svg>
    ),
  },
];

function Sidebar({ onNavigate }: SidebarProps) {
  return (
    <aside className="flex h-full w-72 flex-col bg-gov-dark text-white">
      <div className="border-b border-white/10 px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-200">
          SEPLAG
        </p>
        <p className="mt-2 text-lg font-semibold leading-6">
          Execução Orçamentária
        </p>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-5" aria-label="Menu principal">
        {navigationItems.map((item) => (
          <NavLink
            className={({ isActive }) =>
              [
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition",
                isActive
                  ? "bg-gov-primary text-white shadow-sm"
                  : "text-slate-200 hover:bg-white/10 hover:text-white",
              ].join(" ")
            }
            end={item.path === "/"}
            key={item.path}
            onClick={onNavigate}
            to={item.path}
          >
            {item.icon("h-5 w-5 shrink-0")}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
