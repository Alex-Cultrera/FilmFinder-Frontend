import { useState } from 'react';

export const usePassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const validatePasswords = () => {
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return false;
        }
        setError('');
        return true;
    };

    return {
        password,
        confirmPassword,
        error,
        setError,
        handlePasswordChange,
        handleConfirmPasswordChange,
        validatePasswords,
    };
};