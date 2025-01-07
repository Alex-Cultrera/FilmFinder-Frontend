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

function App () {

    const ProtectedRoute = ({ children }) => {
        const token = localStorage.getItem('access_token');

        if (!token) {
            return <Navigate to="/login" />;
        }

        return children;
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/movie/:imdbID" element={<MovieDetail/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/password" element={<PasswordPage/>} />
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