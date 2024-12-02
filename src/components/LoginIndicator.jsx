import React, {useState, useEffect, useRef} from 'react';
import '../styles/LoginIndicator.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCircleUser} from '@fortawesome/free-solid-svg-icons';
import {Link} from "react-router-dom";

const LoginIndicator = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const photoRef = useRef(null);
    const userMenuRef = useRef(null);

    useEffect(() => {
        // modify this for real authentication logic
        // Below assumes user info is stored in localStorage
        const user = JSON.parse(localStorage.getItem('user'));

        if (user) {
            setIsLoggedIn(true);
            setFirstName(user.firstName);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const handleLogout = () => {
        // Remove user data from localStorage and update state
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setFirstName('');
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
                        Hello, {firstName}
                    </span>
                    <button onClick={handleLogout}>
                        Logout
                    </button>
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
                        <>
                            <div onClick={() => console.log('View Profile')}>View Profile</div>
                            <div onClick={handleLogout}>Logout</div>
                        </>
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


