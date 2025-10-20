import { useState } from 'react';

const useAuth = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };
    return { user, login, logout };
};

export default useAuth;