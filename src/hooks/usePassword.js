import { useState } from 'react';

export const usePassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handlePasswordChange = (value) => {
        // Accept either event object or direct value
        const newValue = typeof value === 'object' ? value.target.value : value;
        setPassword(newValue);
    };

    const handleConfirmPasswordChange = (value) => {
        // Accept either event object or direct value
        const newValue = typeof value === 'object' ? value.target.value : value;
        setConfirmPassword(newValue);
    };

    const validatePasswords = () => {
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return false;
        }
        setError('');
        return true;
    };

    const clearPasswords = () => {
        setPassword('');
        setConfirmPassword('');
        setError('');
    };

    return {
        password,
        confirmPassword,
        error,
        setError,
        handlePasswordChange,
        handleConfirmPasswordChange,
        validatePasswords,
        clearPasswords
    };
};