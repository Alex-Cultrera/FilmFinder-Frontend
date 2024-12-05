import React, { useState, useEffect } from 'react';
import {Link, useNavigate} from "react-router-dom";
import axios from 'axios';
import NavBar from "./NavBar";
import '../styles/Login.css';
import GoogleIcon from '../images/googleIcon.svg';
import FacebookIcon from '../images/facebookIcon.svg';


function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
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
            if (response.data.token) {
                localStorage.setItem('jwt', response.data.token);
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

    const handleGoogleLogin = () => {
        // alert('Continue with Google');
        // Add actual Google login logic here
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