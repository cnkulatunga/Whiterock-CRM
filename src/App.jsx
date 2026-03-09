import React, { useState } from 'react';
import Login from './pages/login/Login';
import ClientLayout from './layout/ClientLayout';
import SuperAdminLayout from './layout/AppLayout';
import TeleAgentLayout from './layout/TeleAgentLayout';
import './App.css';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('user'));

    // Real login transition
    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        setIsLoggedIn(false);
    };

    const renderLayout = () => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const role = user.role || 'client';

        switch (role) {
            case 'super_admin':
                return <SuperAdminLayout onLogout={handleLogout} />;
            case 'tele_agent':
                return <TeleAgentLayout onLogout={handleLogout} />;
            case 'client':
            default:
                return <ClientLayout onLogout={handleLogout} />;
        }
    };

    return (
        <div className="App">
            {isLoggedIn ? renderLayout() : <Login onLogin={handleLogin} />}
        </div>
    );
}

export default App;
