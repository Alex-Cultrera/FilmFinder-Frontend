import React, {useState, useEffect, useRef} from 'react';
import '../styles/SessionStatus.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCircleUser} from '@fortawesome/free-solid-svg-icons';
import {Link, useNavigate} from "react-router-dom";
import {googleLogout} from "@react-oauth/google";

const SessionStatus = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [profilePhotoUrl, setProfilePhotoUrl] = useState('');
    const photoRef = useRef(null);
    const userMenuRef = useRef(null);
    const navigate = useNavigate();

    const userId = localStorage.getItem('user_id');
    const firstName = localStorage.getItem('first_name');

    useEffect(() => {
        const savedPhotoUrl = localStorage.getItem('profile_photo_url');
        if (savedPhotoUrl) {
            setProfilePhotoUrl(savedPhotoUrl);
            setIsLoggedIn(true);
        } else {
            if (userId) {
                console.log("settingIsLoggedIn")
                setIsLoggedIn(true);
                fetchProfilePhoto();
            } else {
                setIsLoggedIn(false);
            }
        }
    }, [userId]);

    const fetchProfilePhoto = () => {
        try {
            const photoUrl = 'https://lh3.googleusercontent.com/a/ACg8ocJA8alnJkImlJmPmDtDPBd4nhaG7UcrZN-rAlGvoKca_fuKUdLv=s96-c';
            setProfilePhotoUrl(photoUrl);
            localStorage.setItem('profile_photo_url', photoUrl);
        } catch (error) {
                    console.error('Error fetching profile photo:', error);
                }

    }

    const handleImageError = () => {
        setProfilePhotoUrl('path-to-default-image.jpg'); // Fallback image
    };


    // const fetchProfilePhoto = async () => {
    //     try {
    //         const response = await axios.get(`/api/users/${userId}/profilePhoto`, {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         });
    //
    //         const { photoUrl } = response.data; // Assuming the backend returns { photoUrl: "image-url" }
    //         setProfilePhotoUrl(photoUrl);
    //     } catch (error) {
    //         console.error('Error fetching profile photo:', error);
    //     }
    // };




    const handleLogout = () => {
        googleLogout()
        localStorage.removeItem('user_id');
        localStorage.removeItem('first_name');
        localStorage.removeItem('user_email');
        localStorage.removeItem('profile_photo_url');
        document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
        document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
        setIsLoggedIn(false);
        navigate('/login');
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
                    <span className="profile-icon">
                        {profilePhotoUrl ? (
                            <img
                                src={profilePhotoUrl}
                                className="profile-photo"
                                referrerPolicy={"no-referrer"}
                                alt="Profile"
                                onClick={toggleDropdown}
                                ref={photoRef}
                                onError={handleImageError}
                            />
                        ) : (
                            <FontAwesomeIcon
                                icon={faCircleUser}
                                onClick={toggleDropdown}
                                ref={photoRef}
                            />
                        )}
                    </span>
                    <span>
                        Hello, {firstName ? firstName : "Loading..."}
                    </span>
                </div>
            ) : (
                <div className="guest">
                    <span className="profile-icon">
                        <FontAwesomeIcon
                            icon={faCircleUser}
                            onClick={toggleDropdown}
                            ref={photoRef}
                        />
                    </span>
                    <span>
                        Welcome, Guest
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


