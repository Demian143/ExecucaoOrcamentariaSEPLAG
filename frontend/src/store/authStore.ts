import { create } from "zustand";

// 1. Definimos o contrato (Interface) da nossa Store
interface AuthState {
  userName: string | null;
  accessToken: string | null;
  expirationTime: number | null;
  tokenType: string | null;
  isAuthenticated: boolean;
  login: (data: { access_token: string; token_type: string; expires_in: number; email: string }) => void;
  logout: () => void;
}

const authStore = create<AuthState>((set) => ({
  // Estado inicial tentando recuperar o token persistido para não deslogar no F5
  userName: localStorage.getItem("seplag_username"),
  accessToken: localStorage.getItem("seplag_jwt"),
  expirationTime: null,
  tokenType: "bearer",
  isAuthenticated: !!localStorage.getItem("seplag_jwt"),

  login: (data) => {
    localStorage.setItem("seplag_jwt", data.access_token);
    localStorage.setItem("seplag_username", data.email);

    set({
      accessToken: data.access_token,
      tokenType: data.token_type,
      expirationTime: data.expires_in,
      userName: data.email,
      isAuthenticated: true,
    });
  },

  // Limpa o estado e os rastros do navegador no logout
  logout: () => {
    localStorage.removeItem("seplag_jwt");
    localStorage.removeItem("seplag_username");
    
    set({
      userName: null,
      accessToken: null,
      expirationTime: null,
      tokenType: null,
      isAuthenticated: false,
    });
  },
}));

export default authStore;