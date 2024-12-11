import React from 'react';
import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import PasswordPage from "./components/PasswordPage";
import Dashboard from "./components/Dashboard";
import Register from "./components/Register";
import Settings from "./components/Settings";

function App () {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home/>}/>
                {/*<Route path="/movie" element={<Movie/>}/>*/}
                <Route path="/register" element={<Register/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/password" element={<PasswordPage/>} />
                <Route path="/dashboard" element={<Dashboard/>} />
                <Route path="/settings" element={<Settings/>}/>
            </Routes>
        </Router>
    );
}

export default App;