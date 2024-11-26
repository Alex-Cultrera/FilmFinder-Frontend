import React, { useState } from 'react';
import HamburgerMenu from "./HamburgerMenu";
import '../styles/Login.css';
import {Link} from "react-router-dom";
import GoogleIcon from '../images/googleIcon.svg';
import FacebookIcon from '../images/facebookIcon.svg';


function Login() {
    const [email, setEmail] = useState('');
    // const [password, setPassword] = useState('');

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:8080/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('jwt', data); // Store JWT in localStorage
            alert('Login successful');
        } else {
            alert('Invalid credentials');
        }
    };

    const handleGoogleLogin = () => {
        // alert('Continue with Google');
        // Add actual Google login logic here
    };

    const handleFacebookLogin = () => {
        // alert('Continue with Facebook');
        // Add actual Facebook login logic here
    };

    return (
        <div>
            <div className="header">
                <h1>
                    FilmFind<HamburgerMenu/>r
                </h1>
            </div>

            <div className="login">
                <form className="form-signin" onSubmit={handleSubmit}>
                    <h2>
                        Welcome back
                    </h2>
                    <input
                        className="email"
                        type="text"
                        placeholder="Email address"
                        value={email}
                        onChange={handleEmailChange}
                    />
                    {/*<input*/}
                    {/*    type="password"*/}
                    {/*    placeholder="Password"*/}
                    {/*    value={password}*/}
                    {/*    onChange={(e) => setPassword(e.target.value)}*/}
                    {/*/>*/}
                    <button type="submit" className="btn continue-btn">Continue</button>
                    {/*<button type="submit">Forgot Password?</button>*/}
                </form>

                <div className="needToRegister">
                    <span className="account">Don't have an account?</span>
                    <Link className="registerLink" to="/register">Register</Link>
                </div>

                <div className="line-with-text">
                    <hr className="line-left"/>
                    <span className="text">OR</span>
                    <hr className="line-right"/>
                </div>

                <div className="social-login">
                    <button onClick={handleGoogleLogin} className="btn google-btn">
                        <img
                            src={GoogleIcon}
                            alt="Google"
                        />
                        <span>
                            Continue with Google
                        </span>
                    </button>
                    <button onClick={handleFacebookLogin} className="btn facebook-btn">
                        <img
                            src={FacebookIcon}
                            alt="Facebook"
                        />
                        <span>
                            Continue with Facebook
                        </span>
                    </button>
                </div>

            </div>
        </div>
    );
}

export default Login;