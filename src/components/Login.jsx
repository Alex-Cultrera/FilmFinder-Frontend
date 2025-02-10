import React, { useState, useEffect } from 'react';
import {Link, useNavigate} from "react-router-dom";
// import axios from "/src/api/axiosInstance";
import NavBar from "./NavBar";
import '../styles/Login.css';
import FacebookIcon from '../images/facebookIcon.svg';
import ContinueWithGoogle from "./ContinueWithGoogle";
import axios from "../api/axiosInstance";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setError(null);
    };
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const loginApiUrl = '/api/auth/login';

        try {
            const response = await axios.post(loginApiUrl, {
                email,
                password
            });

            console.log(response);
            if (response.data) {
                const { userId, firstName, photo, role } = response.data;
                localStorage.setItem('user_id', userId);
                localStorage.setItem('first_name', firstName);
                localStorage.setItem('user_email', email);
                localStorage.setItem('profile_photo_url', photo);
                localStorage.setItem('role', role);
                navigate('/dashboard');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleFacebookLogin = () => {
        // alert('Continue with Facebook');
        // Add actual Facebook login logic here
    };

    const isFormValid = email && password && !loading;

    return (
        <div>
            <span className="nav">
                <NavBar/>
            </span>

            <div className="login">
                <form className="form-signin" onSubmit={handleSubmit}>
                    <h2>
                        Welcome back
                    </h2>
                    <input
                        className="email"
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={handleEmailChange}
                        required
                    />
                    <input
                        className="password"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                    />

                    {error && <div className="error">{error}</div>}

                    <button
                        type="submit"
                        className="btn continue-btn"
                        disabled={loading || !isFormValid}
                    >
                        {loading ? 'Logging in...' : 'Continue'}
                    </button>
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

                    <ContinueWithGoogle/>

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