import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <nav className="navbar">
            <div className="navbar-inner">
                <Link to="/" className="nav-link-brand" onClick={closeMenu}>
                    LuxuryRentals,com
                </Link>

                <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle navigation">
                    <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
                </button>

                <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                    <Link to="/" className="nav-link" onClick={closeMenu}>Home</Link>
                    {user ? (
                        <>
                            <Link to="/dashboard" className="nav-link" onClick={closeMenu}>Dashboard</Link>
                            {user.role === 'admin' && (
                                <Link to="/admin" className="nav-link" onClick={closeMenu}>Admin</Link>
                            )}
                            <button
                                onClick={() => {
                                    logout();
                                    closeMenu();
                                }}
                                className="logout-btn"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link" onClick={closeMenu}>Login</Link>
                            <Link to="/signup" className="btn-primary" style={{ padding: '0.5rem 1rem', textDecoration: 'none', marginTop: 0 }} onClick={closeMenu}>Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav >
    );
};

export default Navbar;
