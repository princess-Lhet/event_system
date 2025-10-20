import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { useNotifications } from '../contexts/NotificationContext';
import API_BASE from '../config/api';
import '../styles/login.css';

const Login = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const { showNotification } = useNotifications();

    useEffect(() => {}, []);

    const handleEvent = (name) => (e) => {
        console.log(name, e.type, (e.target && (e.target.id || e.target.name || e.target.tagName)));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Client-side validation
        if (!form.email.trim()) {
            setError('Please enter your email address');
            return;
        }

        if (!form.password.trim()) {
            setError('Please enter your password');
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
            setError('Please enter a valid email address');
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/auth/login`, {
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
            if (data.success && data.user) {
                login(data.user);
                showNotification('Logged in successfully');
                window.location.href = '/dashboard';
            } else {
                setError(data.error || 'Invalid credentials');
            }
        } catch (error) {
            setError('Network error occurred. Please check your connection and try again.');
        }
    };

    return (
        <div 
            className="auth-wrap"
            onMouseEnter={handleEvent('auth-wrap')}
            onMouseLeave={handleEvent('auth-wrap')}
            onMouseMove={handleEvent('auth-wrap')}
            onMouseDown={handleEvent('auth-wrap')}
            onMouseUp={handleEvent('auth-wrap')}
        >
            <div 
                className="auth-card"
                onMouseEnter={handleEvent('auth-card')}
                onMouseLeave={handleEvent('auth-card')}
                onMouseMove={handleEvent('auth-card')}
                onMouseDown={handleEvent('auth-card')}
                onMouseUp={handleEvent('auth-card')}
            >
                <h2 className="auth-title">Login</h2>
                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}
                <form 
                    onSubmit={handleSubmit}
                    onKeyDown={handleEvent('form')}
                    onKeyUp={handleEvent('form')}
                    onKeyPress={handleEvent('form')}
                    onMouseEnter={handleEvent('form')}
                    onMouseLeave={handleEvent('form')}
                    onMouseMove={handleEvent('form')}
                    onMouseDown={handleEvent('form')}
                    onMouseUp={handleEvent('form')}
                    onClick={handleEvent('form')}
                >
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={form.email}
                            onChange={(e) => { setForm({ ...form, email: e.target.value }); if (error) setError(''); }}
                            onKeyDown={handleEvent('email')}
                            onKeyUp={handleEvent('email')}
                            onKeyPress={handleEvent('email')}
                            onClick={handleEvent('email')}
                            onMouseDown={handleEvent('email')}
                            onMouseUp={handleEvent('email')}
                            onMouseEnter={handleEvent('email')}
                            onMouseLeave={handleEvent('email')}
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
                            onKeyDown={handleEvent('password')}
                            onKeyUp={handleEvent('password')}
                            onKeyPress={handleEvent('password')}
                            onClick={handleEvent('password')}
                            onMouseDown={handleEvent('password')}
                            onMouseUp={handleEvent('password')}
                            onMouseEnter={handleEvent('password')}
                            onMouseLeave={handleEvent('password')}
                            placeholder="Enter your password"
                            className="form-control"
                            required
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="btn btn-primary w-100"
                        onClick={handleEvent('submit')}
                        onMouseDown={handleEvent('submit')}
                        onMouseUp={handleEvent('submit')}
                        onMouseEnter={handleEvent('submit')}
                        onMouseLeave={handleEvent('submit')}
                        onKeyDown={handleEvent('submit')}
                        onKeyUp={handleEvent('submit')}
                        onKeyPress={handleEvent('submit')}
                    >
                        Login
                    </button>
                </form>
                <div 
                    className="auth-footer"
                    onMouseEnter={handleEvent('auth-footer')}
                    onMouseLeave={handleEvent('auth-footer')}
                    onMouseMove={handleEvent('auth-footer')}
                    onMouseDown={handleEvent('auth-footer')}
                    onMouseUp={handleEvent('auth-footer')}
                >
                    <span>Don't have an account?</span>
                    <a 
                        className="auth-link" 
                        href="/register"
                        onClick={handleEvent('register-link')}
                        onMouseDown={handleEvent('register-link')}
                        onMouseUp={handleEvent('register-link')}
                        onMouseEnter={handleEvent('register-link')}
                        onMouseLeave={handleEvent('register-link')}
                        onKeyDown={handleEvent('register-link')}
                        onKeyUp={handleEvent('register-link')}
                        onKeyPress={handleEvent('register-link')}
                    >
                        Create one
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Login;