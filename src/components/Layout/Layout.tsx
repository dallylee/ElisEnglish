import React, { ReactNode } from 'react';
import Navigation from './Navigation';
import './Layout.css';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="layout">
            <Navigation />
            <main className="main-content">
                {children}
            </main>
            <footer className="footer">
                <p>Made with ❤️ for Eli</p>
            </footer>
        </div>
    );
};

export default Layout;
