import React, {useState, useEffect} from 'react';
import {useGoogleLogin} from "@react-oauth/google";
import {useNavigate} from "react-router-dom";
import axios from "../api/axiosInstance";
import a from "axios";
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

                const userInfo = await a.get(googleApiUrl, {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });

                const userEmail = userInfo.data.email;
                const firstName = userInfo.data.given_name;
                const lastName = userInfo.data.family_name;
                const userPhoto = userInfo.data.picture;

                try {
                    const response = await axios.post('/api/auth/google', {
                        firstName,
                        lastName,
                        userEmail,
                        userPhoto,
                    });

                    console.log('Backend response:', response.data);
                    // const { userId, firstName, photo, role } = response.data;
                    if (response.data) {
                        localStorage.setItem('user_id', response.data.userId);
                        localStorage.setItem('first_name', response.data.firstName);
                        localStorage.setItem('user_email', userEmail);
                        localStorage.setItem('profile_photo_url', response.data.photo);
                        localStorage.setItem('role', response.data.role);
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

