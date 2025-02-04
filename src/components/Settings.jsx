import React, { useState } from 'react';
import { usePassword } from '../hooks/usePassword';
import { useProfilePhoto } from '../hooks/useProfilePhoto';
import NavBar from "./NavBar";
import axios from "../api/axiosInstance";
import SessionStatus from "./SessionStatus";
import '../styles/Settings.css';

const Settings = () => {
    const {
        password,
        confirmPassword,
        error: passwordError,
        handlePasswordChange,
        handleConfirmPasswordChange,
        validatePasswords
    } = usePassword();

    const { 
        updateProfilePhoto, 
        loading, 
        error: photoError,
        DEFAULT_PHOTO,
        getProfilePhoto
    } = useProfilePhoto();

    const [previewUrl, setPreviewUrl] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            // Create temporary preview URL
            const preview = URL.createObjectURL(file);
            setPreviewUrl(preview);
        }
    };

    const handlePhotoUpload = async () => {
        if (!selectedFile) return;

        try {
            await updateProfilePhoto(selectedFile);
            // Clean up preview URL
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
            setPreviewUrl(null);
            setSelectedFile(null);
            alert('Profile photo updated successfully!');
        } catch (err) {
            alert(err.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validatePasswords()) {
            return;
        }

        // Call backend API to update the password here
        try {
            console.log('Password updated successfully');
        } catch (error) {
            console.error('Error updating password:', error);
        }
    };

    return (
        <div>
            <div className="nav-container">
                <span className="nav">
                    <NavBar/>
                    <SessionStatus/>
                </span>
                
                <div className="settings-container">
                    <section className="photo-section">
                        <h2>Profile Photo</h2>
                        
                        {/* Current or Preview Photo */}
                        <div className="photo-preview">
                            <img 
                                src={previewUrl || getProfilePhoto()} 
                                alt="Profile" 
                                className="preview-image"
                            />
                        </div>

                        {/* Upload Controls */}
                        <div className="upload-controls">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoChange}
                                className="file-input"
                            />
                            {selectedFile && (
                                <button 
                                    onClick={handlePhotoUpload}
                                    disabled={loading}
                                >
                                    {loading ? 'Uploading...' : 'Upload Photo'}
                                </button>
                            )}
                            {photoError && (
                                <div className="error-message">{photoError}</div>
                            )}
                        </div>
                    </section>

                    {/* Password section */}
                    <section className="password-section">
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
                                {passwordError && <div className="error-message">{passwordError}</div>}
                                <button type="submit" disabled={loading}>
                                    {loading ? 'Updating...' : 'Update Password'}
                                </button>
                            </form>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Settings;