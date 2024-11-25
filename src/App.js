import React from 'react';
import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";

function App () {
    return (
        <Router>
            <Routes>
                <Route path="/home" element={<Home/>}/>
                {/*<Route path="/movie" element={<Movie/>}/>*/}
                <Route path="/login" element={<Login/>}/>
                {/*<Route path="/register" element={<Register/>}/>*/}
            </Routes>
        </Router>
    );
}

export default App;