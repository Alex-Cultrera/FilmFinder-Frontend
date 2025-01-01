import React, {useState} from 'react';
import NavBar from "./NavBar";
import SessionStatus from "./SessionStatus";

const Watched = () => {

    return (
        <div>
            <div className="nav-container">
                <span className="nav">
                    <NavBar/>
                    <SessionStatus/>
                </span>
            <h2>Watched</h2>
            </div>
        </div>
    );
};
export default Watched;