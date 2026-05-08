import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiUser, FiSearch, FiSun, FiMoon, FiMenu, FiX, FiLogOut, FiPackage, FiSettings } from 'react-icons/fi';
import { MdAdminPanelSettings } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const { darkMode, toggleTheme } = useTheme();
  const [search, setSearch] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) { navigate(`/products?keyword=${search.trim()}`); setSearch(''); }
  };

  return (
    <nav className="navbar" data-cy="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand" data-cy="brand-logo">ShopZone</Link>

        <form className="navbar-search" onSubmit={handleSearch}>
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-cy="search-input"
          />
        </form>

        <div className="navbar-actions">
          <button className="nav-icon-btn" onClick={toggleTheme} data-cy="theme-toggle" title="Toggle theme">
            {darkMode ? <FiSun /> : <FiMoon />}
          </button>

          <Link to="/cart" className="nav-icon-btn" data-cy="cart-icon">
            <FiShoppingCart />
            {cartCount > 0 && <span className="cart-badge" data-cy="cart-count">{cartCount}</span>}
          </Link>

          {user && (
            <Link to="/wishlist" className="nav-icon-btn" data-cy="wishlist-icon">
              <FiHeart />
            </Link>
          )}

          {user ? (
            <div className="nav-dropdown" ref={dropdownRef}>
              <button className="nav-icon-btn" onClick={() => setDropdownOpen((o) => !o)} data-cy="user-menu">
                <FiUser />
              </button>
              {dropdownOpen && (
                <div className="nav-dropdown-menu" data-cy="user-dropdown">
                  <Link to="/profile" onClick={() => setDropdownOpen(false)}><FiSettings /> Profile</Link>
                  <Link to="/orders" onClick={() => setDropdownOpen(false)}><FiPackage /> My Orders</Link>
                  {isAdmin && <Link to="/admin" onClick={() => setDropdownOpen(false)}><MdAdminPanelSettings /> Admin Panel</Link>}
                  <button onClick={() => { logout(); setDropdownOpen(false); }} data-cy="logout-btn"><FiLogOut /> Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm" data-cy="login-btn">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
