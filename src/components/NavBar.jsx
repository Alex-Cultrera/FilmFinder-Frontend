import React, { useState, useEffect } from 'react';
import HamburgerMenu from "./HamburgerMenu";

const NavBar = () => {
    const [isMobile, setIsMobile] = useState(false);

    const handleResize = () => {
        setIsMobile(window.innerWidth <= 768); // Set your breakpoint here
    };

    useEffect(() => {
        handleResize(); // Check on mount
        window.addEventListener('resize', handleResize); // Add event listener

        return () => {
            window.removeEventListener('resize', handleResize); // Cleanup on unmount
        };
    }, []);

    return (
        <div>
            {isMobile ? (
                <HamburgerMenu/>
            ) : (
            <h1>
                FilmFind<HamburgerMenu/>r
            </h1>
            )}
        </div>
    );
}

export default NavBar;