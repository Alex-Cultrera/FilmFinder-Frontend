import React, { useState } from 'react';
import HamburgerMenu from "./HamburgerMenu";
import '../styles/Register.css';
import {Link} from "react-router-dom";


function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:8080/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('jwt', data); // Store JWT in localStorage
            alert('Login successful');
        } else {
            alert('Invalid credentials');
        }
    };

    return (

        <div className="register">

            <h1>
                FilmFind<HamburgerMenu/>r
            </h1>

            <h2>
                Create an account
            </h2>


            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Email address"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Continue</button>
            </form>

            <h4>
                Already have an account?
            </h4>
            <Link to="/login">Login</Link>

            <h3>
                OR
            </h3>

            <div>
                Continue with Google
            </div>
            <div>
                Continue with Facebook
            </div>

        </div>
    );
}

export default Register;