import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";
import '../styles/ContinueWithFacebook.css';
import FacebookIcon from "../images/facebookIcon.svg"; 

const ContinueWithFacebook = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [isSdkLoaded, setIsSdkLoaded] = useState(false);

    useEffect(() => {
        // Load Facebook SDK
        window.fbAsyncInit = function() {
            window.FB.init({
                appId: process.env.REACT_APP_FACEBOOK_APP_ID,
                cookie: true,
                xfbml: true,
                version: 'v18.0' // Use latest version
            });
            setIsSdkLoaded(true);
        };

        // Load the SDK asynchronously
        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }, []);

    const loginWithFacebook = () => {
        setLoading(true);
        window.FB.login(async function(response) {
            if (response.authResponse) {
                try {
                    // Get user info from Facebook
                    const userInfo = await new Promise((resolve, reject) => {
                        window.FB.api('/me', { fields: 'email,first_name,last_name,picture' }, 
                            (response) => {
                                if (response.error) reject(response.error);
                                resolve(response);
                            }
                        );
                    });

                    // Send to backend
                    const backendResponse = await axios.post('/api/auth/facebook', {
                        firstName: userInfo.first_name,
                        lastName: userInfo.last_name,
                        userEmail: userInfo.email,
                        userPhoto: userInfo.picture?.data?.url,
                    });

                    if (backendResponse.data) {
                        localStorage.setItem('user_id', backendResponse.data.userId);
                        localStorage.setItem('first_name', backendResponse.data.firstName);
                        localStorage.setItem('user_email', userInfo.email);
                        localStorage.setItem('profile_photo_url', backendResponse.data.photo);
                        localStorage.setItem('role', backendResponse.data.role);
                        
                        navigate('/dashboard');
                    }
                } catch (error) {
                    console.error('Facebook login error:', error);
                    setError(error.response?.data?.message || 'An error occurred while registering.');
                }
            } else {
                setError('Facebook login cancelled or failed.');
            }
            setLoading(false);
        }, { scope: 'email,public_profile' });
    };

    const handleFacebookLoginClick = () => {
        setLoading(true);
        setError(null);
        loginWithFacebook();
    };

    return (
        <div>
            {error && <div className="error-message">{error}</div>}

            <button
                onClick={handleFacebookLoginClick}
                disabled={loading || !isSdkLoaded}
                className="facebook-btn"
            >
                <img
                    src={FacebookIcon}
                    alt="Facebook"
                    className="facebook-btn-img"
                />
                <span>
                    {loading ? 'Connecting to Facebook...' : (isSdkLoaded ? 'Continue with Facebook' : 'Loading...')}
                </span>
            </button>
        </div>
    );
};

export default ContinueWithFacebook; 