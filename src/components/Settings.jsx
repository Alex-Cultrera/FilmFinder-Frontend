import React, {useState} from 'react';
import { usePassword } from '../hooks/usePassword';
import NavBar from "./NavBar";
import axios from "axios";

const Settings = () => {
    const {
        password,
        confirmPassword,
        error,
        handlePasswordChange,
        handleConfirmPasswordChange,
        validatePasswords
    } = usePassword();

    const [loading, setLoading] = useState(false);
    const [profilePhotoUrl, setProfilePhotoUrl] = useState(null);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            setLoading(true);

            axios.post('/api/auth/postProfilePhoto', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
                .then((response) => {
                    // Assuming the backend returns the URL of the uploaded profile photo
                    // const photoUrl = response.data.photoUrl;
                    const photoUrl = 'https://lh3.googleusercontent.com/a/ACg8ocJA8alnJkImlJmPmDtDPBd4nhaG7UcrZN-rAlGvoKca_fuKUdLv=s96-c'
                    setProfilePhotoUrl(photoUrl);
                    localStorage.setItem('profile_photo_url', photoUrl); // Store the URL in localStorage
                })
                .catch((error) => {
                    console.error('Error uploading photo:', error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (!validatePasswords()) {
            setLoading(false);
            return;
        }

        // Call your backend API to update the password here
        try {
            // Perform the update request to your backend
            console.log('Password updated successfully');
        } catch (error) {
            console.error('Error updating password:', error);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div>
            <NavBar/>
            <h2>Update Password</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={handlePasswordChange}
                />
                <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                />
                {error && <div className="error-message">{error}</div>}
                <button type="submit" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Password'}
                </button>
            </form>
            <h2>Profile Photo</h2>
            <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
            />
            {profilePhotoUrl && (
                <div>
                    <h3>Preview</h3>
                    <img src={profilePhotoUrl} alt="Profile Preview" width="100" />
                </div>
            )}
        </div>
    );
};

export default Settings;