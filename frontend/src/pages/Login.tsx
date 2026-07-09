
import { type SubmitEvent, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import ApiService from "../services/api";
import authStore from "../store/authStore";

const api = new ApiService();

function Login() {
  const navigate = useNavigate();
  const isAuthenticated = authStore((state) => state.isAuthenticated);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      await api.login(email, password);
      navigate("/home", { replace: true });
    } catch {
      setErrorMessage("Não foi possível entrar. Verifique seu login e senha.");
    } finally {
      setIsLoading(false);
    }
  }

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gov-light px-4 py-10 text-gov-dark sm:px-6 lg:px-8">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 text-left shadow-xl shadow-slate-200/70 sm:p-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-gov-primary">
            SEPLAG
          </p>
          <h1 className="mt-3 text-2xl font-semibold text-gov-dark">
            Execução Orçamentária
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Acesse o painel com suas credenciais institucionais.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              className="mb-2 block text-sm font-medium text-slate-700"
              htmlFor="email"
            >
              Login
            </label>
            <input
              autoComplete="username"
              className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-gov-dark outline-none transition placeholder:text-slate-400 focus:border-gov-primary focus:ring-4 focus:ring-blue-100"
              id="email"
              name="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="seu.email@governo.gov.br"
              required
              type="email"
              value={email}
            />
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-medium text-slate-700"
              htmlFor="password"
            >
              Senha
            </label>
            <input
              autoComplete="current-password"
              className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-gov-dark outline-none transition placeholder:text-slate-400 focus:border-gov-primary focus:ring-4 focus:ring-blue-100"
              id="password"
              name="password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Digite sua senha"
              required
              type="password"
              value={password}
            />
          </div>

          {errorMessage ? (
            <div
              className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-status-danger"
              role="alert"
            >
              {errorMessage}
            </div>
          ) : null}

          <button
            className="flex w-full items-center justify-center gap-2 rounded-md bg-gov-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-400"
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? (
              <span
                aria-hidden="true"
                className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
              />
            ) : null}
            {isLoading ? "Carregando..." : "Entrar"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default Login;
