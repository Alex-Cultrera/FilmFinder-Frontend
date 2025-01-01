import React, {useState} from 'react';
import NavBar from "./NavBar";
import SessionStatus from "./SessionStatus";

const Reviews = () => {



    return (
        <div>
            <div className="nav-container">
                <span className="nav">
                    <NavBar/>
                    <SessionStatus/>
                </span>
            <h2>Reviews</h2>
            </div>
        </div>
    );
};
export default Reviews;