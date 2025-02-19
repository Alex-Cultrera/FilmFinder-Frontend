import { useState } from 'react';
import axios from '../api/axiosInstance';
import { uploadPhoto } from '../services/photoService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import DEFAULT_PHOTO from '../utils/defaultAvatar';

export const useProfilePhoto = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateProfilePhoto = async (file) => {
        setLoading(true);
        setError(null);

        try {
            // 1. Validate file
            if (!file.type.startsWith('image/')) {
                throw new Error('File must be an image');
            }

            const MAX_SIZE = 5 * 1024 * 1024; // 5MB
            if (file.size > MAX_SIZE) {
                throw new Error('File size must be less than 5MB');
            }

            // 2. Upload to S3
            const photoUrl = await uploadPhoto(file);

            // 3. Update backend with new URL
            await axios.post(`/user/uploadProfilePhoto`, {
                profilePhotoUrl: photoUrl
            });

            // 4. Update local storage
            localStorage.setItem('profile_photo_url', photoUrl);

            // 5. Notify other components
            window.dispatchEvent(new Event('profilePhotoUpdated'));

            return photoUrl;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getProfilePhoto = () => {
        return localStorage.getItem('profile_photo_url') || DEFAULT_PHOTO;
    };

    return {
        updateProfilePhoto,
        getProfilePhoto,
        loading,
        error,
        DEFAULT_PHOTO
    };
}; 