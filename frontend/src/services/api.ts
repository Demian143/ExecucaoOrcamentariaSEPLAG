import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import authStore from "../store/authStore";
import type {
  DashboardResponse,
  GraficosResponse,
  ListOrcamentosParams,
  ListOrgaosParams,
  LoginResponse,
  Orcamento,
  OrcamentoFiltrosResponse,
  Orgao,
  PaginatedResponse,
} from "./types";

const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? "";
const REFRESH_THRESHOLD_MS = 2 * 60 * 1000;
const AUTH_LOGIN_URL = "/api/auth/login";
const AUTH_REFRESH_URL = "/api/auth/refresh";

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  hasRetried?: boolean;
};

class ApiService {
  private client: AxiosInstance;
  private refreshClient: AxiosInstance;
  private refreshPromise: Promise<void> | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.client = axios.create({
      baseURL: baseUrl,
    });
    this.refreshClient = axios.create({
      baseURL: baseUrl,
    });

    this.client.interceptors.request.use(async (config) => {
      if (!this.isAuthRoute(config.url)) {
        await this.refreshTokenIfNeeded();
      }

      const { accessToken, tokenType } = authStore.getState();

      if (accessToken && !this.isPublicAuthRoute(config.url)) {
        config.headers.Authorization = this.getAuthorizationHeader(
          accessToken,
          tokenType,
        );
      }

      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as RetryableRequestConfig | undefined;

        if (
          error.response?.status !== 401
          || !originalRequest
          || originalRequest.hasRetried
          || this.isAuthRoute(originalRequest.url)
        ) {
          return Promise.reject(error);
        }

        originalRequest.hasRetried = true;
        await this.refreshToken();

        const { accessToken, tokenType } = authStore.getState();

        if (accessToken) {
          originalRequest.headers.Authorization = this.getAuthorizationHeader(
            accessToken,
            tokenType,
          );
        }

        return this.client(originalRequest);
      },
    );
  }

  public async login(email: string, password: string): Promise<boolean> {
    const response = await this.client.post<LoginResponse>(AUTH_LOGIN_URL, {
      email,
      password,
    });

    authStore.getState().login({
      email,
      access_token: response.data.access_token,
      token_type: response.data.token_type,
      expires_in: response.data.expires_in,
    });

    return true;
  }

  public async getDashboard(): Promise<DashboardResponse> {
    const response = await this.client.get<DashboardResponse>("/api/dashboard");

    return response.data;
  }

  public async getGraficos(): Promise<GraficosResponse> {
    const response = await this.client.get<GraficosResponse>("/api/graficos");

    return response.data;
  }

  public async getOrgaos(
    params?: ListOrgaosParams,
  ): Promise<PaginatedResponse<Orgao>> {
    const response = await this.client.get<PaginatedResponse<Orgao>>(
      "/api/orgaos",
      { params },
    );

    return response.data;
  }

  public async getOrcamentos(
    params?: ListOrcamentosParams,
  ): Promise<PaginatedResponse<Orcamento>> {
    const response = await this.client.get<PaginatedResponse<Orcamento>>(
      "/api/orcamentos",
      { params },
    );

    return response.data;
  }

  public async getOrcamentoFiltros(): Promise<OrcamentoFiltrosResponse> {
    const response = await this.client.get<OrcamentoFiltrosResponse>(
      "/api/orcamentos/filtros",
    );

    return response.data;
  }

  public async getOrcamento(orcamentoId: number): Promise<Orcamento> {
    const response = await this.client.get<Orcamento>(
      `/api/orcamentos/${orcamentoId}`,
    );

    return response.data;
  }

  public async revisarOrcamento(
    orcamentoId: number,
    observacao: string,
  ): Promise<Orcamento> {
    const response = await this.client.patch<Orcamento>(
      `/api/orcamentos/${orcamentoId}/revisao`,
      { observacao },
    );

    return response.data;
  }

  private formatTokenType(tokenType: string | null): string {
    if (!tokenType) {
      return "Bearer";
    }

    return tokenType.charAt(0).toUpperCase() + tokenType.slice(1);
  }

  private getAuthorizationHeader(
    accessToken: string,
    tokenType: string | null,
  ): string {
    return `${this.formatTokenType(tokenType)} ${accessToken}`;
  }

  private async refreshTokenIfNeeded(): Promise<void> {
    const { accessToken, expiresAt } = authStore.getState();

    if (!accessToken || !expiresAt || Date.now() < expiresAt - REFRESH_THRESHOLD_MS) {
      return;
    }

    await this.refreshToken();
  }

  private async refreshToken(): Promise<void> {
    if (!this.refreshPromise) {
      this.refreshPromise = this.fetchRefreshToken()
        .catch((error: unknown) => {
          authStore.getState().logout();

          throw error;
        })
        .finally(() => {
          this.refreshPromise = null;
        });
    }

    await this.refreshPromise;
  }

  private async fetchRefreshToken(): Promise<void> {
    const { accessToken, tokenType } = authStore.getState();

    if (!accessToken) {
      return;
    }

    const response = await this.refreshClient.post<LoginResponse>(
      AUTH_REFRESH_URL,
      undefined,
      {
        headers: {
          Authorization: this.getAuthorizationHeader(accessToken, tokenType),
        },
      },
    );

    authStore.getState().updateToken(response.data);
  }

  private isAuthRoute(url: string | undefined): boolean {
    return this.isPublicAuthRoute(url) || url?.endsWith(AUTH_REFRESH_URL) === true;
  }

  private isPublicAuthRoute(url: string | undefined): boolean {
    return url?.endsWith(AUTH_LOGIN_URL) === true;
  }
}

export default ApiService;
