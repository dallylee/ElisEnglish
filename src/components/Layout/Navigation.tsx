import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import './Navigation.css';

const Navigation: React.FC = () => {
    const { theme } = useTheme();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="navigation">
            <div className="nav-container container">
                <div className="nav-brand">
                    <Link to="/">
                        <h2>Eli's English 🌟</h2>
                    </Link>
                </div>

                <div className="nav-links">
                    <Link
                        to="/"
                        className={`nav-link ${isActive('/') ? 'active' : ''}`}
                    >
                        🏠 Home
                    </Link>
                    <Link
                        to="/lessons"
                        className={`nav-link ${isActive('/lessons') ? 'active' : ''}`}
                    >
                        📚 Lessons
                    </Link>
                    <Link
                        to="/badges"
                        className={`nav-link ${isActive('/badges') ? 'active' : ''}`}
                    >
                        🏅 Badges
                    </Link>
                    <Link
                        to="/settings"
                        className={`nav-link ${isActive('/settings') ? 'active' : ''}`}
                    >
                        ⚙️ Settings
                    </Link>
                    <Link
                        to="/tutor"
                        className={`nav-link ${isActive('/tutor') ? 'active' : ''}`}
                    >
                        👨‍🏫 Tutor
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
