import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = __DEV__ ? '/api' : 'https://api.karajo.com/api';

const TOKEN_KEY = '@karajo_auth_token';
const REFRESH_TOKEN_KEY = '@karajo_refresh_token';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.timeout = 15000;
  }

  async getToken() {
    return await AsyncStorage.getItem(TOKEN_KEY);
  }

  async getRefreshToken() {
    return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  }

  async setTokens(token, refreshToken) {
    await AsyncStorage.setItem(TOKEN_KEY, token);
    if (refreshToken) {
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  }

  async clearTokens() {
    await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY]);
  }

  async request(endpoint, options = {}) {
    const { method = 'GET', body, headers = {}, requiresAuth = true } = options;

    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (requiresAuth) {
      const token = await this.getToken();
      if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
      }
    }

    const config = {
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
          config.headers['Authorization'] = `Bearer ${newToken}`;
          const retryController = new AbortController();
          const retryTimeout = setTimeout(() => retryController.abort(), this.timeout);
          config.signal = retryController.signal;
          const retryResponse = await fetch(url, config);
          clearTimeout(retryTimeout);
          return this.handleResponse(retryResponse);
        }
        await this.clearTokens();
        throw new ApiError('Session expired. Please login again.', 401);
      }

      return this.handleResponse(response);
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new ApiError('Request timed out. Please check your connection.', 408);
      }
      throw error;
    }
  }

  async handleResponse(response) {
    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      throw new ApiError(
        data?.message || data?.error || `HTTP ${response.status}`,
        response.status,
        data
      );
    }

    return data;
  }

  async refreshToken() {
    try {
      const refreshToken = await this.getRefreshToken();
      if (!refreshToken) return false;

      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        await this.setTokens(data.token, data.refreshToken);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', body });
  }

  put(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', body });
  }

  patch(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PATCH', body });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }

  async uploadFile(endpoint, formData, options = {}) {
    const token = await this.getToken();
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });

    return this.handleResponse(response);
  }
}

class ApiError extends Error {
  constructor(message, statusCode, data) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.data = data;
  }
}

export const api = new ApiService();
export { ApiError };
export default api;
