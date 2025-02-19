import axios from "../api/axiosInstance";

// photoService.js
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

export const uploadPhoto = async (file) => {
    // Frontend validation for immediate user feedback
    if (!ALLOWED_TYPES.includes(file.type)) {
        throw new Error('Invalid file type. Please upload a JPEG, PNG, or GIF.');
    }
    
    if (file.size > MAX_SIZE) {
        throw new Error('File too large. Maximum size is 5MB.');
    }
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
        const response = await axios.post('/api/photos/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        
        return response.data.url;
    } catch (error) {
        throw new Error('Failed to upload photo: ' + error.message);
    }
};