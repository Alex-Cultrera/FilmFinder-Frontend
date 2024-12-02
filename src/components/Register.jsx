import React, { useState } from 'react';
import axios from 'axios';
import {Link, useNavigate} from "react-router-dom";
import NavBar from "./NavBar";
import '../styles/Register.css';
import GoogleIcon from "../images/googleIcon.svg";
import FacebookIcon from "../images/facebookIcon.svg";



function Register() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();


    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('http://localhost:8080/api/auth/check-email', {
                email,
            });

            if (response.data.message === "Email is available") {
                navigate('/password', {state: {email}});
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred while checking the email.');
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


    return (
        <div>
            <span className="nav">
                <NavBar/>
            </span>

            <div className="register">
                <form className="form-signin" onSubmit={handleSubmit}>
                    <h2>
                        Create an account
                    </h2>
                    <input
                        className="email"
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={handleEmailChange}
                    />
                    {error && <div className="error-message">{error}</div>}
                    <button type="submit" className="btn continue-btn" disabled={loading}>
                        {loading ? 'Checking...' : 'Continue'}
                    </button>
                </form>

                <div className="needToLogin">
                    <span className="account">Already have an account?</span>
                    <Link className="loginLink" to="/login">Login</Link>
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

export default Register;

