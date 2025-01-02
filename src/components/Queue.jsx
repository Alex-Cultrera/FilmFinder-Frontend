import React, {useState} from 'react';
import NavBar from "./NavBar";
import SessionStatus from "./SessionStatus";
import axios from "axios";

const Queue = () => {

    const [error, setError] = useState(null);

    const getHello = async (e) => {
        e.preventDefault();
        setError(null);

        const email = localStorage.getItem('user_email');

        try {
            const response = await axios.post(
            'http://localhost:8080/api/auth/hello',
            {email},
            {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                    },
                    withCredentials: true,
                }
            );

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
            <button onClick={getHello}>Say Hello</button>

            {error && <div className="error">{error}</div>}
            </div>
        </div>
    );
};
export default Queue;