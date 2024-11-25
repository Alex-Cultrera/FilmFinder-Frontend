import React, {useState, useEffect, useRef } from 'react';
import '../styles/HamburgerMenu.css';

const HamburgerMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const hamburgerRef = useRef(null);
    const menuRef = useRef(null);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                hamburgerRef.current &&
                !hamburgerRef.current.contains(event.target) &&
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ) {
                setIsOpen(false); // Close the menu if clicked outside
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="hamburger-container">
            <div
                className={`hamburger-icon ${isOpen ? 'open' : ''}`}
                onClick={toggleMenu}
                ref={hamburgerRef}
            >
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
            </div>

            <div
                className={`dropdown-menu ${isOpen ? 'open' : ''}`}
                ref={menuRef}
            >
                <ul>
                    <li><a href="#home">Home</a></li>
                    <li><a href="#login">Login</a></li>
                    <li><a href="#register">Register</a></li>
                    <li><a href="#settings">Settings</a></li>
                </ul>
            </div>
        </div>
    );
};

export default HamburgerMenu;