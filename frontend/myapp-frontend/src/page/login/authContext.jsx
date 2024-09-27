import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

// provide user's information
// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
    const [auth, setAuth] =  useState(() => {
        const savedAuth = localStorage.getItem('authToken');
        return savedAuth ? JSON.parse(savedAuth) : null;
    });

    //login
    const login = (userData) => {
        setAuth(userData);
        localStorage.setItem('authToken', JSON.stringify(userData));
        localStorage.setItem('username', userData.username)
        localStorage.setItem('tell',userData.tell)
        localStorage.setItem('password',userData.password)
        console.log('authToken :', userData);
    };

    //logout
    const logout = () => {
        setAuth(null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
        localStorage.removeItem('tell');
        localStorage.removeItem('password');
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);




