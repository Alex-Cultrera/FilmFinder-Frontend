import axios from 'axios';

// Create an instance of axios
const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
    withCredentials: true,
});

// Attach a response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        // If it's a 2xx status code, just return the response
        return response;
    },
    (error) => {
        if (error?.response?.status === 401 || error?.response?.status === 403) {
            // Handle unauthorized or forbidden
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;