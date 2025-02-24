import axios from 'axios';

// Create an instance of axios
const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'https://filmfinder-backend-production.up.railway.app',
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
                alert('Please log in to access this feature');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;