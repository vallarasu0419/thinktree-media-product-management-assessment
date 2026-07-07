import axios from 'axios';
import { tokenStore } from '../utils/storage';

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL });

// Attach access token to every request.
api.interceptors.request.use((config) => {
  const token = tokenStore.getAccess();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 by trying a single refresh, then retrying the original request.
let isRefreshing = false;
let queue = [];

function flushQueue(error, token = null) {
  queue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  queue = [];
}

function forceLogout() {
  tokenStore.clear();
  if (window.location.pathname.startsWith('/admin')) {
    window.location.assign('/login');
  }
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const original = error.config;
    const status = error.response ? error.response.status : null;

    if (status !== 401 || original._retry || original._skipRefresh) {
      return Promise.reject(error);
    }

    const refreshToken = tokenStore.getRefresh();
    if (!refreshToken) {
      forceLogout();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({ resolve, reject });
      }).then((token) => {
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      });
    }

    original._retry = true;
    isRefreshing = true;

    return new Promise((resolve, reject) => {
      axios
        .post(`${baseURL}/auth/refresh`, { refreshToken })
        .then(({ data }) => {
          const payload = data.data;
          tokenStore.set(payload);
          api.defaults.headers.common.Authorization = `Bearer ${payload.accessToken}`;
          original.headers.Authorization = `Bearer ${payload.accessToken}`;
          flushQueue(null, payload.accessToken);
          resolve(api(original));
        })
        .catch((refreshErr) => {
          flushQueue(refreshErr, null);
          forceLogout();
          reject(refreshErr);
        })
        .finally(() => {
          isRefreshing = false;
        });
    });
  }
);

export default api;
