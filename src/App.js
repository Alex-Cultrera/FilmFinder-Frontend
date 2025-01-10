import React from 'react';
import {Navigate, Route, BrowserRouter as Router, Routes} from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import PasswordPage from "./components/PasswordPage";
import Dashboard from "./components/Dashboard";
import Register from "./components/Register";
import Settings from "./components/Settings";
import Queue from "./components/Queue";
import Favorites from "./components/Favorites";
import Watched from "./components/Watched";
import Reviews from "./components/Reviews";
import MovieDetail from "./components/MovieDetail";
import axios from "axios";
import {jwtDecode} from "jwt-decode";

export const getCookieValue = (name) => {
    const cookieString = document.cookie;
    const cookies = cookieString.split('; ');

    for (let cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
        if (cookieName === name) {
            return decodeURIComponent(cookieValue);
        }
    }
    return null; // Return null if the cookie is not found
};

const isTokenExpired = (token) => {
    if (!token) return true;

    try {
        const decodedToken = jwtDecode(token);
        return decodedToken.exp < Date.now() / 1000;  // Check if the expiration time is less than current time
    } catch (error) {
        return true;  // If the token is invalid or can't be decoded, treat it as expired
    }
};

const refreshAccessToken = async () => {
    const refreshToken = getCookieValue('refreshToken');  // Assuming the refresh token is stored in a cookie
    if (refreshToken) {
        try {
            const response = await axios.post('/api/auth/refresh-token', { refreshToken });
            if (response.data.accessToken) {
                document.cookie = `accessToken=${response.data.accessToken}; Secure; HttpOnly; SameSite=Strict`;
                return response.data.accessToken;  // Return the new access token
            }
        } catch (error) {
            console.error('Error refreshing access token:', error);
        }
    }
    return null;  // If refresh token is not available or refreshing fails, return null
};

function App () {

    const ProtectedRoute = ({ children }) => {
        const accessToken = getCookieValue('accessToken')
        if (!accessToken || isTokenExpired(accessToken)) {
            const newAccessToken = refreshAccessToken();
            if (!newAccessToken) {
                return <Navigate to="/login"/>;
            }
        }
        return children;
    };

    const AuthRoute = ({ children }) => {
        const accessToken = getCookieValue('accessToken');
        if (!isTokenExpired(accessToken)) {
            return <Navigate to="/" />;
        }
        return children;
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/movie/:imdbID" element={<MovieDetail/>}/>
                <Route path="/register" element={<AuthRoute><Register/></AuthRoute>}/>
                <Route path="/login" element={<AuthRoute><Login/></AuthRoute>}/>
                <Route path="/password" element={<AuthRoute><PasswordPage/></AuthRoute>} />
                <Route path="/dashboard" element={<Dashboard/>} />
                <Route path="/settings" element={<ProtectedRoute><Settings/></ProtectedRoute>}/>
                <Route path="/queue" element={<ProtectedRoute><Queue/></ProtectedRoute>}/>
                <Route path="/favorites" element={<ProtectedRoute><Favorites/></ProtectedRoute>}/>
                <Route path="/watched" element={<ProtectedRoute><Watched/></ProtectedRoute>}/>
                <Route path="/reviews" element={<ProtectedRoute><Reviews/></ProtectedRoute>}/>
            </Routes>
        </Router>
    );
}

export default App;