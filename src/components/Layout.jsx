import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, LogOut, PenTool, Home, BookOpen } from 'lucide-react';

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
                    <span className="gradient-text">ghasblog</span>
                </Link>

                <div className="nav-container">
                    <nav className="nav">
                        <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                            <Home size={20} />
                            <span>Home</span>
                        </NavLink>
                        <NavLink to="/blog" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                            <BookOpen size={20} />
                            <span>Posts</span>
                        </NavLink>

                        {user ? (
                            <Link to="/write" className="btn btn-primary btn-sm mobile-write-btn">
                                <PenTool size={18} />
                                <span>Write</span>
                            </Link>
                        ) : (
                            <Link to="/login" className="nav-link mobile-login-link">
                                <LogIn size={20} />
                                <span>Login</span>
                            </Link>
                        )}
                    </nav>

                    <div className="user-actions">
                        {user ? (
                            <div className="user-menu">
                                <Link to="/write" className="btn btn-primary btn-sm desktop-write-btn">
                                    <PenTool size={18} />
                                    <span>Write</span>
                                </Link>
                                <button onClick={handleLogout} className="btn-icon" title="Logout">
                                    <LogOut size={20} />
                                </button>
                                <img
                                    src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}&background=random`}
                                    alt={user.displayName}
                                    className="avatar"
                                />
                            </div>
                        ) : (
                            <Link to="/login" className="btn btn-primary btn-sm desktop-login-btn">
                                <LogIn size={18} />
                                <span>Login</span>
                            </Link>
                        )}
                    </div>
                </div>
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
                    <p>&copy; 2026 ghasblog. Built with React & Firebase.</p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
