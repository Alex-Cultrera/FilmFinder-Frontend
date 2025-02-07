import { useState, useEffect } from 'react';

const useCurrentUser = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const getCurrentUser = () => {
            const first_name = localStorage.getItem('first_name');
            const profile_photo_url = localStorage.getItem('profile_photo_url');
            const user_email = localStorage.getItem('user_email');
            const user_id = localStorage.getItem('user_id');
            const role = localStorage.getItem('role');

            if (first_name && user_id) {
                return {
                    user_id: user_id,
                    first_name: first_name,
                    email: user_email,
                    profilePhoto: profile_photo_url,
                    role: role
                };
            }
            return null;
        };

        const user = getCurrentUser();
        setCurrentUser(user);
        setIsAdmin(user?.role === 'ADMIN');
    }, []);

    return { currentUser, isAdmin };
};

export default useCurrentUser; 