import React, {useState} from 'react';
import NavBar from "./NavBar";
import SessionStatus from "./SessionStatus";

const Favorites = () => {

    return (
        <div>
            <div className="nav-container">
                <span className="nav">
                    <NavBar/>
                    <SessionStatus/>
                </span>
            <h2>Favorites</h2>
            </div>
        </div>
    );
};
export default Favorites;