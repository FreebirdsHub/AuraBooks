import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to handle token refresh and unauthorized access
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Avoid infinite loop on refresh token endpoint
    if (originalRequest.url.includes('/auth/refresh-token')) {
      return Promise.reject(error);
    }

    // If 401 Unauthorized, try to refresh token
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await api.post('/auth/refresh-token');
        return api(originalRequest); // Retry original request
      } catch (refreshError) {
        // Refresh token failed, redirect to login or clear auth state
        // We will dispatch logout event in Redux store
        window.dispatchEvent(new Event('auth-logout'));
        return Promise.reject(refreshError);
      }
    }

    // Format error message for easier consumption in slices
    const errorMessage = error.response?.data?.message || 'Something went wrong. Please try again.';
    error.message = errorMessage;

    return Promise.reject(error);
  }
);

export default api;
