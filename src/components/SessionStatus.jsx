import React, {useState, useEffect, useRef} from 'react';
import '../styles/SessionStatus.css';
import {Link, useNavigate} from "react-router-dom";
import {googleLogout} from "@react-oauth/google";
import { useProfilePhoto } from '../hooks/useProfilePhoto';
import DEFAULT_PHOTO from '../utils/defaultAvatar';
import axios from '../api/axiosInstance';

const SessionStatus = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [profilePhotoUrl, setProfilePhotoUrl] = useState(DEFAULT_PHOTO);
    const { getProfilePhoto } = useProfilePhoto();
    const photoRef = useRef(null);
    const userMenuRef = useRef(null);
    const navigate = useNavigate();

    const userId = localStorage.getItem('user_id');
    const firstName = localStorage.getItem('first_name');

    useEffect(() => {
        if (userId) {
            setIsLoggedIn(true);
            const photoUrl = getProfilePhoto();
            setProfilePhotoUrl(photoUrl);
        } else {
            setIsLoggedIn(false);
            setProfilePhotoUrl(DEFAULT_PHOTO);
        }
    }, [userId]);

    useEffect(() => {
        const handleProfilePhotoUpdate = () => {
            const photoUrl = getProfilePhoto();
            setProfilePhotoUrl(photoUrl);
        };

        window.addEventListener('profilePhotoUpdated', handleProfilePhotoUpdate);
        return () => {
            window.removeEventListener('profilePhotoUpdated', handleProfilePhotoUpdate);
        };
    }, []);

    const handleImageError = () => {
        console.log('Image failed to load, using default');
        setProfilePhotoUrl(DEFAULT_PHOTO);
    };

    const handleLogout = async () => {
        try {
            await axios.post('/api/auth/logout');
            googleLogout()
            localStorage.clear();
            // localStorage.removeItem('user_id');
            // localStorage.removeItem('first_name');
            // localStorage.removeItem('user_email');
            // localStorage.removeItem('profile_photo_url');
            // localStorage.removeItem('role');
            // document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
            // document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
            setIsLoggedIn(false);
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                photoRef.current &&
                !photoRef.current.contains(event.target) &&
                userMenuRef.current &&
                !userMenuRef.current.contains(event.target)
            ) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="SessionStatus">
            {isLoggedIn ? (
                <div className="hello">
                    <span onClick={toggleDropdown}>
                        Hello, {firstName || "Loading..."}
                    </span>
                    <span className="profile-icon">
                        <img
                            src={profilePhotoUrl}
                            className="profile-photo"
                            referrerPolicy="no-referrer"
                            alt="Profile"
                            onClick={toggleDropdown}
                            ref={photoRef}
                            onError={handleImageError}
                        />
                    </span>
                </div>
            ) : (
                <div className="guest">
                    <span onClick={toggleDropdown}>
                        LOGIN
                    </span>
                    <span className="profile-icon">
                        <img
                            src={DEFAULT_PHOTO}
                            className="profile-photo"
                            alt="Guest"
                            onClick={toggleDropdown}
                            ref={photoRef}
                        />
                    </span>
                </div>
            )}

            {dropdownOpen && (
                <div className="dropdown" ref={userMenuRef}>
                    {isLoggedIn ? (
                        <div onClick={() => console.log('View Profile')}>
                            <ul>
                                <li><Link to="/settings">Settings</Link></li>
                                <li onClick={handleLogout}><Link to="/login">Logout</Link></li>
                            </ul>
                        </div>
                    ) : (
                        <div onClick={() => console.log('Login')}>
                            <ul>
                                <li><Link to="/login">Login</Link></li>
                                <li><Link to="/register">Register</Link></li>
                            </ul>
                        </div>
                    )}
                </div>
            )}

            <div
                className={`user-icon ${dropdownOpen ? 'open' : ''}`}
                onClick={toggleDropdown}
                ref={photoRef}
            >

            <div
                className={`user-icon-menu ${dropdownOpen ? 'open' : ''}`}
                ref={userMenuRef}
            >

                </div>
            </div>
        </div>
    );
};

export default SessionStatus;


