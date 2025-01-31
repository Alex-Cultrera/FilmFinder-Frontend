import React, {useState, useEffect, useRef } from 'react';
import '../styles/HamburgerMenu.css';
import {Link, useLocation, useNavigate} from "react-router-dom";

const HamburgerMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const hamburgerRef = useRef(null);
    const menuRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

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

    const handleLinkClick = (e, path) => {
        if (location.pathname === path) {
            e.preventDefault();
            window.location.reload(); // Refresh the page
        } else {
            navigate(path);
        }
    };

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
                    <li><Link to="/" onClick={(e) => handleLinkClick(e, '/')}>Home</Link></li>
                    <li><Link to="/queue" onClick={(e) => handleLinkClick(e, '/queue')}>Queue</Link></li>
                    <li><Link to="/watched" onClick={(e) => handleLinkClick(e, '/watched')}>Watched</Link></li>
                    <li><Link to="/favorites" onClick={(e) => handleLinkClick(e, '/favorites')}>Favorites</Link></li>
                    <li><Link to="/reviews" onClick={(e) => handleLinkClick(e, '/reviews')}>Reviews</Link></li>
                </ul>
            </div>
        </div>
    );
};

export default HamburgerMenu;