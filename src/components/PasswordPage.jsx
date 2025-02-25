import React, {useState} from "react";
import NavBar from "./NavBar";
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Login.css';
import axios from "../api/axiosInstance";
import { usePassword } from '../hooks/usePassword';

const PasswordPage = () => {
    const {state} = useLocation();
    const {email} = state || {};
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const {password, confirmPassword, error, setError, handlePasswordChange, handleConfirmPasswordChange, validatePasswords} = usePassword();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleFirstNameChange = (e) => {
        setFirstName(e.target.value);
    };

    const handleLastNameChange = (e) => {
        setLastName(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!validatePasswords()) {
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('/api/auth/register', {
                firstName,
                lastName,
                email,
                password,
            });

            if (response.data.message === "Thank you for registering") {
                alert('Registration successful! You can now log in.');
                navigate('/login');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred while registering.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <NavBar/>
            <div className="login">

                <form className="form-signin" onSubmit={handleSubmit}>
                    <h2>Create an account</h2>
                    <h4>Just a few more details...</h4>
                    <input
                        className="firstName"
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        onChange={handleFirstNameChange}
                    />
                    <input
                        className="lastName"
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={handleLastNameChange}
                    />
                    <input
                        className="password"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                    <input
                        className="password"
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                    />

                    {error && <div className="error-message">{error}</div>}
                    <button type="submit" className="btn continue-btn" disabled={loading}>
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>
                <button className="btn back-btn" onClick={() => navigate(-1)}>Back</button>
            </div>
        </div>
    );
};

export default PasswordPage;

