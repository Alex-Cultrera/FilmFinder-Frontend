import React, {useState, useEffect} from 'react';
import {useGoogleLogin} from "@react-oauth/google";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import '../styles/ContinueWithGoogle.css';
import GoogleIcon from "../images/googleIcon.svg";

const ContinueWithGoogle = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [isSdkLoaded, setIsSdkLoaded] = useState(false);

    const loginWithGoogle = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setLoading(true);
            try {
                console.log('Token response:', tokenResponse);

                const googleApiUrl = 'https://www.googleapis.com/oauth2/v3/userinfo';

                const userInfo = await axios.get(googleApiUrl, {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });

                const userEmail = userInfo.data.email;
                const firstName = userInfo.data.given_name;
                const lastName = userInfo.data.family_name;
                const userPhoto = userInfo.data.picture;

                try {
                    const backendAuthEndpoint = 'http://localhost:8080/api/auth/google';
                    const response = await axios.post(backendAuthEndpoint, {
                        firstName,
                        lastName,
                        userEmail,
                        userPhoto,
                    });
                    const { access_jwt, user_id, first_name } = response.data
                    if (response.data) {
                        localStorage.setItem('access_token', access_jwt);
                        localStorage.setItem('user_id', user_id);
                        localStorage.setItem('user_email', userEmail);
                        localStorage.setItem('first_name', first_name);
                        setLoading(false);
                        navigate('/dashboard');
                    }
                } catch (error) {
                    setError(error.response?.data?.message || 'An error occurred while registering.');
                } finally {
                    setLoading(false);
                }
            } catch (error) {
                console.error('Google login error:', error);
                setError('Google login failed. Please try again.');
            } finally {
                setLoading(false);
            }
        },
        onError: (error) => {
            console.error('Login error:', error);
            setError('Google login failed. Please try again.');
            setLoading(false);
        },
    });

    useEffect (() => {
        setIsSdkLoaded(true);
    }, []);

    const handleGoogleLoginClick = () => {
        setLoading(true);
        setError(null);
        loginWithGoogle();
    };

    return (
        <div>
            {error && <div className="error-message">{error}</div>}

            <button
                onClick={handleGoogleLoginClick}
                disabled={loading || !isSdkLoaded}
                className="google-btn"
            >
                <img
                    src={GoogleIcon}
                    alt="Google"
                    className="google-btn-img"
                />
                <span>
                    {loading ? 'Waiting for Google authorization...' : (isSdkLoaded ? 'Continue with Google' : 'Loading...')}
                </span>
            </button>

        </div>
    );
};
export default ContinueWithGoogle;