import axios from 'axios';

// Create an instance of axios
const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
    withCredentials: true,
});

// Paths that should redirect to login when unauthorized
const protectedPaths = [
    '/addQueued',
    '/removeQueued',
    '/addWatched',
    '/removeWatched',
    '/addFavorite',
    '/removeFavorite',
];

// Attach a response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        // If it's a 2xx status code, just return the response
        return response;
    },
    (error) => {
        if (error?.response?.status === 401 || error?.response?.status === 403) {
            // Only redirect for protected paths
            const requestPath = error.config.url;
            if (protectedPaths.some(path => requestPath.includes(path))) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;