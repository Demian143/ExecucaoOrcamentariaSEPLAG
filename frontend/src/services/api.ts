import axios, { type AxiosInstance } from "axios";
import authStore from "../store/authStore";
import type {
  DashboardResponse,
  GraficosResponse,
  ListOrcamentosParams,
  ListOrgaosParams,
  LoginResponse,
  Orcamento,
  Orgao,
  PaginatedResponse,
} from "./types";

const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? "";

class ApiService {
  private client: AxiosInstance;

  constructor(baseUrl: string = API_BASE_URL) {
    this.client = axios.create({
      baseURL: baseUrl,
    });

    this.client.interceptors.request.use((config) => {
      const { accessToken, tokenType } = authStore.getState();

      if (accessToken) {
        config.headers.Authorization = `${this.formatTokenType(tokenType)} ${accessToken}`;
      }

      return config;
    });
  }

  public async login(email: string, password: string): Promise<boolean> {
    const response = await this.client.post<LoginResponse>("/api/auth/login", {
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

  public async revisarOrcamento(orcamentoId: number): Promise<Orcamento> {
    const response = await this.client.patch<Orcamento>(
      `/api/orcamentos/${orcamentoId}/revisao`,
    );

    return response.data;
  }

  private formatTokenType(tokenType: string | null): string {
    if (!tokenType) {
      return "Bearer";
    }

    return tokenType.charAt(0).toUpperCase() + tokenType.slice(1);
  }
}

export default ApiService;
