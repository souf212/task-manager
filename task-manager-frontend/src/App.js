import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { authService } from './services/api';
import Login from './components/Login';
import Register from './components/Register';
import TaskList from './components/TaskList';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
});

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Vérifier si l'utilisateur est déjà connecté
        const isLoggedIn = authService.isAuthenticated();
        setIsAuthenticated(isLoggedIn);
        setLoading(false);
    }, []);

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
    };

    const switchToRegister = () => {
        setShowRegister(true);
    };

    const switchToLogin = () => {
        setShowRegister(false);
    };

    if (loading) {
        return <div>Chargement...</div>;
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {isAuthenticated ? (
                <TaskList onLogout={handleLogout} />
            ) : showRegister ? (
                <Register switchToLogin={switchToLogin} />
            ) : (
                <Login onLogin={handleLogin} switchToRegister={switchToRegister} />
            )}
        </ThemeProvider>
    );
}

export default App;