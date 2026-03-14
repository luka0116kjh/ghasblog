import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen } from 'lucide-react';

const Header = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <header className="header">
            <div className="container header-content">
                <Link to="/" className="logo">
                    <BookOpen className="logo-icon" />
                    <span className="gradient-text">ghas</span>
                </Link>

				<nav className="nav">
					<NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
						Home
					</NavLink>
					<NavLink to="/blog" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
						Posts
					</NavLink>

					{user ? (
						<>
							<NavLink to="/write" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
								Write
							</NavLink>
							<button type="button" onClick={handleLogout} className="nav-link nav-button">
								Log out
							</button>
						</>
					) : (
						<NavLink to="/login" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
							Login
						</NavLink>
					)}
				</nav>
            </div>
        </header>
    );
};

const Layout = ({ children }) => {
    return (
        <div className="layout">
            <Header />
            <main className="main-content">
                {children}
            </main>
            <footer className="footer">
                <div className="container">
                    <p>&copy; 2026 ghas. Built with React & Firebase.</p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
