import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = __DEV__ ? '/api' : 'https://api.karajo.com/api';

const TOKEN_KEY = '@karajo_auth_token';
const REFRESH_TOKEN_KEY = '@karajo_refresh_token';

export interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  error?: string;
  [key: string]: unknown;
}

export interface ApiRequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  requiresAuth?: boolean;
}

export interface RefreshTokensResponse {
  token: string;
  refreshToken: string;
}

export class ApiError extends Error {
  public statusCode: number;
  public data: unknown;

  constructor(message: string, statusCode: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.data = data;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

class ApiService {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.timeout = 15000;
  }

  async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem(TOKEN_KEY);
  }

  async getRefreshToken(): Promise<string | null> {
    return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  }

  async setTokens(token: string, refreshToken?: string): Promise<void> {
    await AsyncStorage.setItem(TOKEN_KEY, token);
    if (refreshToken) {
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  }

  async clearTokens(): Promise<void> {
    await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY]);
  }

  async request<T = ApiResponse>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
    const { method = 'GET', body, headers = {}, requiresAuth = true } = options;

    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (requiresAuth) {
      const token = await this.getToken();
      if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
      }
    }

    const config: RequestInit = {
      method,
      headers: { ...defaultHeaders, ...headers },
    };

    if (body) {
      config.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    config.signal = controller.signal;

    try {
      const url = `${this.baseURL}${endpoint}`;
      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      if (response.status === 401 && requiresAuth) {
        const refreshed = await this.refreshToken();
        if (refreshed) {
          const newToken = await this.getToken();
          (config.headers as Record<string, string>)['Authorization'] = `Bearer ${newToken}`;
          const retryController = new AbortController();
          const retryTimeout = setTimeout(() => retryController.abort(), this.timeout);
          config.signal = retryController.signal;
          const retryResponse = await fetch(url, config);
          clearTimeout(retryTimeout);
          return this.handleResponse<T>(retryResponse);
        }
        await this.clearTokens();
        throw new ApiError('Session expired. Please login again.', 401);
      }

      return this.handleResponse<T>(response);
    } catch (error) {
      clearTimeout(timeoutId);
      if ((error as Error).name === 'AbortError') {
        throw new ApiError('Request timed out. Please check your connection.', 408);
      }
      throw error;
    }
  }

  async handleResponse<T = ApiResponse>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');
    let data: unknown;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      throw new ApiError(
        (data as Record<string, string>)?.message || (data as Record<string, string>)?.error || `HTTP ${response.status}`,
        response.status,
        data
      );
    }

    return data as T;
  }

  async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = await this.getRefreshToken();
      if (!refreshToken) return false;

      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json() as RefreshTokensResponse;
        await this.setTokens(data.token, data.refreshToken);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  get<T = ApiResponse>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T = ApiResponse>(endpoint: string, body?: unknown, options: ApiRequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  }

  put<T = ApiResponse>(endpoint: string, body?: unknown, options: ApiRequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body });
  }

  patch<T = ApiResponse>(endpoint: string, body?: unknown, options: ApiRequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body });
  }

  delete<T = ApiResponse>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  async uploadFile<T = ApiResponse>(endpoint: string, formData: FormData, options: ApiRequestOptions = {}): Promise<T> {
    const token = await this.getToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });

    return this.handleResponse<T>(response);
  }
}

export const api = new ApiService();
export default api;
