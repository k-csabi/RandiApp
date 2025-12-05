import { createContext, useState, useEffect } from 'react';
import api from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        }
    }, [token]);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, name, coupleCode } = response.data;

            localStorage.setItem('token', token);
            setToken(token);
            setUser({ name, coupleCode });
            return true;
        } catch (error) {
            console.error("Login hiba:", error);
            return false;
        }
    };

    const register = async (name, email, password, inviteCode) => {
        try {
            const response = await api.post('/auth/register', { name, email, password, inviteCode });
            const { token, name: userName, coupleCode } = response.data;

            localStorage.setItem('token', token);
            setToken(token);
            setUser({ name: userName, coupleCode });
            return true;
        } catch (error) {
            console.error("Regisztráció hiba:", error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

