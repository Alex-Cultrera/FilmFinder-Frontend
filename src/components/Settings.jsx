import React, {useState} from 'react';
import { usePassword } from '../hooks/usePassword';
import NavBar from "./NavBar";
import axios from "../api/axiosInstance";
import SessionStatus from "./SessionStatus";
import '../styles/Settings.css';

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
    const [selectedFile, setSelectedFile] = useState(null);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const previewUrl = URL.createObjectURL(file);
            setProfilePhotoUrl(previewUrl);
        }
    };

    const handlePhotoUpload = async () => {
        if (!selectedFile) {
            alert('No file selected.');
            return;
        }

        const formData = new FormData();
        const userId = localStorage.getItem('user_id');
        const accessToken = localStorage.getItem('access_token');

        if (!userId || !accessToken) {
            alert('Authentication required.');
            return;
        }

        formData.append('file', selectedFile);
        formData.append('userId', userId);

        setLoading(true);

        try {
            await axios.post(
                '/api/auth/uploadProfilePhoto',
                formData,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${accessToken}`,
                    },

                }
            );
            alert('Profile photo upload successful.');
        } catch (error) {
            console.error('Error uploading photo:', error.response || error.message);
            alert('Failed to upload profile photo.');
        } finally {
            setLoading(false);
        }
    };



    //         // Assuming the backend returns the URL of the uploaded profile photo
    //         // const photoUrl = response.data.photoUrl;
    //         const photoUrl = 'https://lh3.googleusercontent.com/a/ACg8ocJA8alnJkImlJmPmDtDPBd4nhaG7UcrZN-rAlGvoKca_fuKUdLv=s96-c'
    //         setProfilePhotoUrl(photoUrl);
    //         localStorage.setItem('profile_photo_url', photoUrl); // Store the URL in localStorage
    //     })
    //     .catch((error) => {
    //         console.error('Error uploading photo:', error);
    //     })
    //     .finally(() => {
    //         setLoading(false);
    //     });
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (!validatePasswords()) {
            setLoading(false);
            return;
        }

        // Call backend API to update the password here
        try {
            console.log('Password updated successfully');
        } catch (error) {
            console.error('Error updating password:', error);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div>
            <div className="nav-container">
                <span className="nav">
                    <NavBar/>
                    <SessionStatus/>
                </span>
                <h2>Update Password</h2>
                <div className="password-container">
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
                </div>
                <h2>Update Profile Photo</h2>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                />
                {profilePhotoUrl && (
                    <div>
                        <h3>Preview</h3>
                        <img src={profilePhotoUrl} alt="Profile Preview" width="100"/>
                    </div>
                )}
                <button
                    onClick={handlePhotoUpload}
                    disabled={loading || !selectedFile}
                >
                    {loading ? 'Uploading...' : 'Upload Photo'}
                </button>
            </div>
        </div>
    );
};

export default Settings;