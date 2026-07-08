import { create } from "zustand";

type AuthTokenData = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

// 1. Definimos o contrato (Interface) da nossa Store
interface AuthState {
  userName: string | null;
  accessToken: string | null;
  expiresAt: number | null;
  tokenType: string | null;
  isAuthenticated: boolean;
  login: (data: AuthTokenData & { email: string }) => void;
  updateToken: (data: AuthTokenData) => void;
  logout: () => void;
}

const TOKEN_STORAGE_KEY = "seplag_jwt";
const USERNAME_STORAGE_KEY = "seplag_username";
const TOKEN_TYPE_STORAGE_KEY = "seplag_token_type";
const EXPIRES_AT_STORAGE_KEY = "seplag_expires_at";

const storedExpiresAt = Number(localStorage.getItem(EXPIRES_AT_STORAGE_KEY));
const initialExpiresAt = Number.isFinite(storedExpiresAt) && storedExpiresAt > 0
  ? storedExpiresAt
  : null;
const initialAccessToken = localStorage.getItem(TOKEN_STORAGE_KEY);
const initialTokenType = localStorage.getItem(TOKEN_TYPE_STORAGE_KEY) ?? "bearer";
const initialIsAuthenticated = !!initialAccessToken
  && (!initialExpiresAt || Date.now() < initialExpiresAt);

function tokenExpiresAt(expiresIn: number): number {
  return Date.now() + expiresIn * 1000;
}

const authStore = create<AuthState>((set) => ({
  // Estado inicial tentando recuperar o token persistido para não deslogar no F5
  userName: localStorage.getItem(USERNAME_STORAGE_KEY),
  accessToken: initialAccessToken,
  expiresAt: initialExpiresAt,
  tokenType: initialTokenType,
  isAuthenticated: initialIsAuthenticated,

  login: (data) => {
    const expiresAt = tokenExpiresAt(data.expires_in);

    localStorage.setItem(TOKEN_STORAGE_KEY, data.access_token);
    localStorage.setItem(USERNAME_STORAGE_KEY, data.email);
    localStorage.setItem(TOKEN_TYPE_STORAGE_KEY, data.token_type);
    localStorage.setItem(EXPIRES_AT_STORAGE_KEY, String(expiresAt));

    set({
      accessToken: data.access_token,
      tokenType: data.token_type,
      expiresAt,
      userName: data.email,
      isAuthenticated: true,
    });
  },

  updateToken: (data) => {
    const expiresAt = tokenExpiresAt(data.expires_in);

    localStorage.setItem(TOKEN_STORAGE_KEY, data.access_token);
    localStorage.setItem(TOKEN_TYPE_STORAGE_KEY, data.token_type);
    localStorage.setItem(EXPIRES_AT_STORAGE_KEY, String(expiresAt));

    set({
      accessToken: data.access_token,
      tokenType: data.token_type,
      expiresAt,
      isAuthenticated: true,
    });
  },

  // Limpa o estado e os rastros do navegador no logout
  logout: () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USERNAME_STORAGE_KEY);
    localStorage.removeItem(TOKEN_TYPE_STORAGE_KEY);
    localStorage.removeItem(EXPIRES_AT_STORAGE_KEY);

    set({
      userName: null,
      accessToken: null,
      expiresAt: null,
      tokenType: null,
      isAuthenticated: false,
    });
  },
}));

export default authStore;
