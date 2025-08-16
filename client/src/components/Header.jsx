import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X, Palette } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="header fade-in">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo" onClick={closeMenu}>
            <Palette className="logo-icon float" />
            <span className="logo-text">Irina Vinokur</span>
          </Link>

          <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
            <Link to="/" className="nav-link" onClick={closeMenu}>
              Home
            </Link>
            <Link to="/portfolio" className="nav-link" onClick={closeMenu}>
              Portfolio
            </Link>
            
            {isAuthenticated ? (
              <>
                {isAdmin() && (
                  <Link to="/admin" className="nav-link admin-link" onClick={closeMenu}>
                    Dashboard
                  </Link>
                )}
                <div className="user-menu">
                  <span className="user-greeting">
                    <User className="icon" />
                    {user?.name}
                  </span>
                  <button onClick={handleLogout} className="logout-btn">
                    <LogOut className="icon" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="auth-links">
                <Link to="/login" className="nav-link" onClick={closeMenu}>
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary" onClick={closeMenu}>
                  Register
                </Link>
              </div>
            )}
          </nav>

          <div className="header-actions">
            {isAuthenticated && (
              <Link to="/checkout" className="cart-btn" onClick={closeMenu}>
                <ShoppingCart className="icon" />
                {getTotalItems() > 0 && (
                  <span className="cart-badge">{getTotalItems()}</span>
                )}
              </Link>
            )}
            
            <button
              className="menu-toggle"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;