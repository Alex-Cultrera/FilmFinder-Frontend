import React, {useState, useEffect, useRef} from 'react';
import '../styles/LoginIndicator.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCircleUser} from '@fortawesome/free-solid-svg-icons';
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";

const LoginIndicator = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const photoRef = useRef(null);
    const userMenuRef = useRef(null);
    const navigate = useNavigate();

    const userId = localStorage.getItem('user_id');
    const email = localStorage.getItem('user_email');
    const token = localStorage.getItem('access_token');
    const getNameApiUrl = 'http://localhost:8080/api/auth/name';

    const getName = async () => {
        try {
            console.log('Fetching name for:', email);
            if (!token) {
                console.error('No token found');
                return;
            }
            const response = await axios.post(getNameApiUrl,
            {
                    email
                },
            {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
            if (response.data) {
                const {first_name} = response.data;
                localStorage.setItem('user_first_name', first_name);
                setFirstName(first_name);
            } else {
                console.error('First name not found in response:');
            }
        } catch (error) {
            console.error('Error fetching name:', error);
        }
    };

    useEffect(() => {
        const fetchUserName = async () => {
            if (userId && email && token) {
            setIsLoggedIn(true);
                try {
                    await getName();
                } catch (error) {
                    console.error("Error fetching user name:", error);
                }
            } else {
                setIsLoggedIn(false);
            }
        };
        fetchUserName();
    }, [userId, email, token]);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_first_name');
        localStorage.removeItem('user_email');
        setIsLoggedIn(false);
        setFirstName('');
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
        <div className="loginIndicator">
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

export default LoginIndicator;


