import { type ReactNode, useMemo, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import authStore from "../store/authStore";

type JwtPayload = {
  email?: string;
  preferred_username?: string;
  sub?: string;
};

type NavigationItem = {
  label: string;
  path: string;
  icon: (className: string) => ReactNode;
};

const navigationItems: NavigationItem[] = [
  {
    label: "Dashboard",
    path: "/home",
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

function decodeJwtPayload(token: string | null): JwtPayload | null {
  if (!token) {
    return null;
  }

  const payload = token.split(".")[1];

  if (!payload) {
    return null;
  }

  try {
    const normalizedPayload = payload
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(payload.length / 4) * 4, "=");
    const decodedPayload = atob(normalizedPayload);

    return JSON.parse(decodedPayload) as JwtPayload;
  } catch {
    return null;
  }
}

function DashboardLayout() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const accessToken = authStore((state) => state.accessToken);
  const fallbackUserName = authStore((state) => state.userName);
  const logout = authStore((state) => state.logout);

  const analystEmail = useMemo(() => {
    const payload = decodeJwtPayload(accessToken);

    return payload?.preferred_username
      ?? payload?.email
      ?? fallbackUserName
      ?? "analista@seplag.gov.br";
  }, [accessToken, fallbackUserName]);

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  const sidebar = (
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
            end={item.path === "/home"}
            key={item.path}
            onClick={() => setIsSidebarOpen(false)}
            to={item.path}
          >
            {item.icon("h-5 w-5 shrink-0")}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );

  return (
    <div className="min-h-screen bg-gov-light text-gov-dark">
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:block">
        {sidebar}
      </div>

      {isSidebarOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            aria-label="Fechar menu"
            className="absolute inset-0 bg-slate-950/50"
            onClick={() => setIsSidebarOpen(false)}
            type="button"
          />
          <div className="relative h-full shadow-2xl">{sidebar}</div>
        </div>
      ) : null}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex min-h-16 items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                aria-label="Abrir menu"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-blue-100 lg:hidden"
                onClick={() => setIsSidebarOpen(true)}
                type="button"
              >
                <svg
                  aria-hidden="true"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M4 6h16" />
                  <path d="M4 12h16" />
                  <path d="M4 18h16" />
                </svg>
              </button>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gov-dark">
                  {analystEmail}
                </p>
                <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                  <span className="h-2 w-2 rounded-full bg-status-muted" />
                  <span>Última sincronização: aguardando dados</span>
                </div>
              </div>
            </div>

            <button
              className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-gov-dark transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-blue-100"
              onClick={handleLogout}
              type="button"
            >
              <svg
                aria-hidden="true"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <path d="M16 17l5-5-5-5" />
                <path d="M21 12H9" />
              </svg>
              <span>Sair</span>
            </button>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
