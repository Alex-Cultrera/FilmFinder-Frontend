import React, { useState, useEffect } from 'react';
import {Link, useNavigate} from "react-router-dom";
import axios from 'axios';
import NavBar from "./NavBar";
import '../styles/Login.css';
import GoogleIcon from '../images/googleIcon.svg';
import FacebookIcon from '../images/facebookIcon.svg';
import {GoogleLogin} from "@react-oauth/google";


function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            navigate('/dashboard');
        }
    }, [navigate]);

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

        const loginApiUrl = 'http://localhost:8080/api/auth/login';

        try {
            const response = await axios.post(loginApiUrl, {
                email,
                password
            });
            const { access_jwt, user_id, first_name } = response.data;
            if (response.data) {
                localStorage.setItem('access_token', access_jwt);
                localStorage.setItem('user_id', user_id);
                localStorage.setItem('user_email', email);
                localStorage.setItem('first_name', first_name);
                navigate('/dashboard');
            }
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message || 'Invalid credentials');
            } else {
                setError('Something went wrong. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = (credentialResponse) => {
        console.log(credentialResponse);
        // Process the credential response (e.g., send to backend)
    }

    const handleGoogleLoginError = () => {
        console.log("Login failed");
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
                    <button className="btn google-btn">
                        <GoogleLogin
                            onSuccess={handleGoogleLogin}
                            onError={handleGoogleLoginError}
                        />
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