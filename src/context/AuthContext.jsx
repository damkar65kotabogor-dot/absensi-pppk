import { createContext, useContext, useState, useEffect } from 'react';
import { userStorage, initializeStorage } from '../utils/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Initialize storage with seed data
        initializeStorage();

        // Check for existing session
        const currentUser = userStorage.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
        }
        setLoading(false);
    }, []);

    const login = async (nip, password) => {
        const loggedInUser = userStorage.login(nip, password);
        if (loggedInUser) {
            setUser(loggedInUser);
            return { success: true, user: loggedInUser };
        }
        return { success: false, error: 'NIP atau password salah' };
    };

    const logout = () => {
        userStorage.logout();
        setUser(null);
    };

    const updateUser = (updates) => {
        if (user) {
            const updatedUser = { ...user, ...updates };
            setUser(updatedUser);
            localStorage.setItem('pppk_current_user', JSON.stringify(updatedUser));
        }
    };

    const value = {
        user,
        loading,
        login,
        logout,
        updateUser,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin'
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
