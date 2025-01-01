import React, {useState} from 'react';
import NavBar from "./NavBar";
import SessionStatus from "./SessionStatus";
import axios from "axios";

const Queue = () => {

    const [error, setError] = useState(null);

    const getHello = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await axios.post('http://localhost:8080/api/auth/hello', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                },
            });

            if (response.data.message === "Hello") {
                alert('Hello movie lover')
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred while getting hello.');
        }
    };


    return (
        <div>
            <div className="nav-container">
                <span className="nav">
                    <NavBar/>
                    <SessionStatus/>
                </span>
            <h2>Queue</h2>
            </div>
        </div>
    );
};
export default Queue;