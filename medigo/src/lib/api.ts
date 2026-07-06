const API_BASE_URL = 'http://localhost:5000';

interface RequestOptions extends RequestInit {
  body?: any;
  silent?: boolean;
}

export const api = {
  getTokens() {
    if (typeof window === 'undefined') return { accessToken: null, refreshToken: null };
    return {
      accessToken: localStorage.getItem('medigo_access_token'),
      refreshToken: localStorage.getItem('medigo_refresh_token'),
    };
  },

  setTokens(accessToken: string, refreshToken: string) {
    if (typeof window === 'undefined') return;
    localStorage.setItem('medigo_access_token', accessToken);
    localStorage.setItem('medigo_refresh_token', refreshToken);
  },

  clearTokens() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('medigo_access_token');
    localStorage.removeItem('medigo_refresh_token');
    localStorage.removeItem('medigo_simulated_role');
  },

  async request(endpoint: string, options: RequestOptions = {}) {
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const { accessToken } = this.getTokens();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    if (options.body && typeof options.body === 'object') {
      config.body = JSON.stringify(options.body);
    }

    try {
      let response = await fetch(url, config);

      // Handle token expiration and automatic refresh
      if (response.status === 401) {
        const refreshed = await this.handleTokenRefresh();
        if (refreshed) {
          // Retry original request with new token
          const { accessToken: newAccessToken } = this.getTokens();
          if (newAccessToken) {
            (config.headers as Record<string, string>)['Authorization'] = `Bearer ${newAccessToken}`;
          }
          response = await fetch(url, config);
        }
      }

      const json = await response.json();

      if (!response.ok) {
        // Standardized backend error format uses an array of strings in the 'errors' key
        const errMsg = json.message || (json.errors && json.errors[0]) || 'An unexpected error occurred';
        throw new Error(errMsg);
      }

      return json; // Returns standard envelope: { success, message, data }
    } catch (error: any) {
      if (!options.silent) {
        console.error('[API Request Error]:', error);
      }
      throw error;
    }
  },

  async handleTokenRefresh(): Promise<boolean> {
    const { refreshToken } = this.getTokens();
    if (!refreshToken) {
      this.clearTokens();
      return false;
    }

    try {
      const url = `${API_BASE_URL}/api/v1/auth/refresh-token`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        this.clearTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/login?expired=true';
        }
        return false;
      }

      const json = await response.json();
      if (json.success && json.data) {
        this.setTokens(json.data.accessToken, json.data.refreshToken);
        return true;
      }

      this.clearTokens();
      return false;
    } catch {
      this.clearTokens();
      return false;
    }
  },

  get(endpoint: string, options: RequestOptions = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  },

  post(endpoint: string, body: any, options: RequestOptions = {}) {
    return this.request(endpoint, { ...options, method: 'POST', body });
  },

  put(endpoint: string, body: any, options: RequestOptions = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', body });
  },

  patch(endpoint: string, body: any, options: RequestOptions = {}) {
    return this.request(endpoint, { ...options, method: 'PATCH', body });
  },

  delete(endpoint: string, options: RequestOptions = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  },
};
