import React, {useState, useEffect, useRef} from 'react';
import '../styles/SessionStatus.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCircleUser} from '@fortawesome/free-solid-svg-icons';
import {Link, useNavigate} from "react-router-dom";
import {googleLogout} from "@react-oauth/google";

const SessionStatus = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const photoRef = useRef(null);
    const userMenuRef = useRef(null);
    const navigate = useNavigate();

    const userId = localStorage.getItem('user_id');
    const token = localStorage.getItem('access_token');
    const firstName = localStorage.getItem('first_name');

    useEffect(() => {
            if (userId && token) {
            setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
            }
    }, [userId, token]);

    const handleLogout = () => {
        googleLogout()
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('first_name');
        localStorage.removeItem('user_email');
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
                        <FontAwesomeIcon
                            icon={faCircleUser}
                            onClick={toggleDropdown}
                            ref={photoRef}
                        />
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


