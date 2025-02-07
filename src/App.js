import React from 'react';
import {Navigate, Route, BrowserRouter as Router, Routes} from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import PasswordPage from "./components/PasswordPage";
import Dashboard from "./components/Dashboard";
import Register from "./components/Register";
import Settings from "./components/Settings";
import Queued from "./components/Queued";
import Favorites from "./components/Favorites";
import Watched from "./components/Watched";
import Reviews from "./components/Reviews";
import MovieDetail from "./components/MovieDetail";
import axios from "./api/axiosInstance";
import {jwtDecode} from "jwt-decode";

function App () {

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/movie/:imdbID" element={<MovieDetail/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/password" element={<PasswordPage/>} />
                <Route path="/dashboard" element={<Dashboard/>} />
                <Route path="/settings" element={<Settings/>}/>
                <Route path="/queue" element={<Queued/>}/>
                <Route path="/watched" element={<Watched/>}/>
                <Route path="/favorites" element={<Favorites/>}/>
                <Route path="/reviews" element={<Reviews/>}/>
            </Routes>
        </Router>
    );
}

export default App;