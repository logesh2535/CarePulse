import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HeartPulse, User, LogOut, LayoutDashboard, Calendar, Search, Shield } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'PATIENT') return '/patient/dashboard';
    if (user.role === 'DOCTOR') return '/doctor/dashboard';
    if (user.role === 'ADMIN') return '/admin/dashboard';
    return '/';
  };

  return (
    <header style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '74px'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--primary-600), var(--primary-700))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 10px rgba(13, 148, 136, 0.3)'
          }}>
            <HeartPulse size={24} />
          </div>
          <div>
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '22px',
              fontWeight: 800,
              color: 'var(--primary-700)',
              letterSpacing: '-0.5px'
            }}>CarePulse</span>
            <span style={{ fontSize: '11px', display: 'block', color: 'var(--text-muted)', marginTop: '-4px', fontWeight: 600 }}>
              MEDICAL SYSTEM
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <Link to="/" style={{
            fontWeight: location.pathname === '/' ? 700 : 500,
            color: location.pathname === '/' ? 'var(--primary-600)' : 'var(--text-dark)'
          }}>Home</Link>

          <Link to="/doctors" style={{
            fontWeight: location.pathname.startsWith('/doctors') ? 700 : 500,
            color: location.pathname.startsWith('/doctors') ? 'var(--primary-600)' : 'var(--text-dark)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Search size={16} /> Find Doctors
          </Link>

          <Link to="/about" style={{
            fontWeight: location.pathname === '/about' ? 700 : 500,
            color: location.pathname === '/about' ? 'var(--primary-600)' : 'var(--text-dark)'
          }}>About Us</Link>
        </nav>

        {/* User Auth Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link to={getDashboardLink()} className="btn btn-secondary btn-sm" style={{ gap: '6px' }}>
                <LayoutDashboard size={16} />
                Dashboard ({user.role})
              </Link>
              <button onClick={handleLogout} className="btn btn-outline btn-sm" style={{ gap: '6px', borderColor: '#cbd5e1', color: '#64748b' }}>
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Book Appointment</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
