import axios from 'axios';

const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: import.meta.env.VITE_APP_API_URL,
});

// axios response interceptor
axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (
      error?.response?.status === 401 &&
      error?.config?.url !== '/auth/login'
    ) {
      localStorage.removeItem('user');
      window.location.href = '/login';
      return;
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
