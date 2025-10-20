import React, { useState } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import API_BASE from '../config/api';
import '../styles/register.css';

const Register = () => {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const { showNotification } = useNotifications();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Client-side validation
        if (!form.name.trim()) {
            setError('Please enter your name');
            return;
        }

        if (!form.email.trim()) {
            setError('Please enter your email address');
            return;
        }

        if (!form.password.trim()) {
            setError('Please enter a password');
            return;
        }

        if (form.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
            setError('Please enter a valid email address');
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                mode: 'cors',
                body: JSON.stringify(form)
            });
            const data = await res.json();
            if (data.success) {
                showNotification('Registered successfully! Please log in with your new account.', 'success');
                window.location.href = '/login';
            } else {
                setError(data.error || 'Registration failed');
            }
        } catch (error) {
            setError('Network error occurred. Please check your connection and try again.');
        }
    };

    return (
        <div className="register-wrap">
            <div className="register-card">
                <h2 className="register-title">Register</h2>
                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input
                            type="text"
                            id="name"
                            value={form.name}
                            onChange={(e) => { setForm({ ...form, name: e.target.value }); if (error) setError(''); }}
                            placeholder="Enter your name"
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={form.email}
                            onChange={(e) => { setForm({ ...form, email: e.target.value }); if (error) setError(''); }}
                            placeholder="Enter your email"
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={form.password}
                            onChange={(e) => { setForm({ ...form, password: e.target.value }); if (error) setError(''); }}
                            placeholder="Create a password"
                            className="form-control"
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-success w-100">Register</button>
                </form>
                <div className="register-footer">
                    <span>Already have an account?</span>
                    <a className="register-link" href="/login">Log in</a>
                </div>
            </div>
        </div>
    );
};

export default Register;