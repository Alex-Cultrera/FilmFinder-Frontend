import React, { useState } from 'react';
import { usePassword } from '../hooks/usePassword';
import { useProfilePhoto } from '../hooks/useProfilePhoto';
import NavBar from "./NavBar";
import axios from "../api/axiosInstance";
import SessionStatus from "./SessionStatus";
import '../styles/Settings.css';

const Settings = () => {
    const {
        confirmPassword,
        handleConfirmPasswordChange,
        clearPasswords
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

    // Only declare the states we need
    const [newPassword, setNewPassword] = useState('');
    const [passwordStatus, setPasswordStatus] = useState({
        loading: false,
        success: false,
        error: null
    });

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

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        
        // Validate passwords match
        if (newPassword !== confirmPassword) {
            setPasswordStatus({
                loading: false,
                success: false,
                error: 'New passwords do not match'
            });
            return;
        }

        try {
            setPasswordStatus({ loading: true, success: false, error: null });
            
            // Get the JWT token from localStorage
            const token = localStorage.getItem('token');
            
            // Only send the new password
            await axios.put('/user/password/update', 
                {
                    newPassword: newPassword
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            setPasswordStatus({
                loading: false,
                success: true,
                error: null
            });

            // Clear password fields
            setNewPassword('');
            clearPasswords();

            // Show success message and refresh after 2 seconds
            setTimeout(() => {
                window.location.reload();
            }, 2000);

        } catch (err) {
            console.error('Password update error:', err.response || err);
            setPasswordStatus({
                loading: false,
                success: false,
                error: err.response?.data?.message || 'Failed to update password'
            });
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

                    {/* Simplified Password section */}
                    <div className="settings-section">
                        <h3>Change Password</h3>
                        <form onSubmit={handlePasswordUpdate}>
                            <div className="form-group">
                                <label>New Password:</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    placeholder="Enter new password"
                                />
                            </div>
                            <div className="form-group">
                                <label>Confirm New Password:</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                                    required
                                    placeholder="Confirm new password"
                                />
                            </div>

                            {/* Status Messages */}
                            {passwordStatus.error && (
                                <div className="error-message">
                                    {passwordStatus.error}
                                </div>
                            )}
                            {passwordStatus.success && (
                                <div className="success-message">
                                    Password updated successfully! Page will refresh shortly...
                                </div>
                            )}

                            <button 
                                type="submit" 
                                disabled={passwordStatus.loading}
                                className={passwordStatus.loading ? 'loading' : ''}
                            >
                                {passwordStatus.loading ? 'Updating...' : 'Update Password'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;