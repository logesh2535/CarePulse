import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import {
  LayoutDashboard,
  Calendar,
  User,
  Search,
  Clock,
  Users,
  Stethoscope,
  Layers,
  LogOut,
  Shield,
  FilePlus
} from 'lucide-react';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getSidebarNavLinks = () => {
    if (!user) return [];

    if (user.role === 'PATIENT') {
      return [
        { label: 'Patient Dashboard', path: '/patient/dashboard', icon: <LayoutDashboard size={18} /> },
        { label: 'Find Doctors', path: '/doctors', icon: <Search size={18} /> },
        { label: 'My Appointments', path: '/patient/appointments', icon: <Calendar size={18} /> },
        { label: 'My Profile', path: '/patient/profile', icon: <User size={18} /> }
      ];
    }

    if (user.role === 'DOCTOR') {
      return [
        { label: 'Doctor Dashboard', path: '/doctor/dashboard', icon: <LayoutDashboard size={18} /> },
        { label: 'Patient Requests', path: '/doctor/appointments', icon: <Calendar size={18} /> },
        { label: 'Time Slots & Schedule', path: '/doctor/availability', icon: <Clock size={18} /> }
      ];
    }

    if (user.role === 'ADMIN') {
      return [
        { label: 'Admin Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={18} /> },
        { label: 'Manage Doctors', path: '/admin/doctors', icon: <Stethoscope size={18} /> },
        { label: 'Manage Patients', path: '/admin/patients', icon: <Users size={18} /> },
        { label: 'Specializations', path: '/admin/specializations', icon: <Layers size={18} /> },
        { label: 'System Appointments', path: '/admin/appointments', icon: <Calendar size={18} /> }
      ];
    }

    return [];
  };

  const links = getSidebarNavLinks();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
      <Navbar />

      <div className="container" style={{ flex: 1, padding: '30px 20px', display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
        {/* Sidebar */}
        <aside style={{
          width: '260px',
          flexShrink: 0,
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)',
          height: 'fit-content'
        }}>
          {/* User Info Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            paddingBottom: '20px',
            marginBottom: '20px',
            borderBottom: '1px solid var(--border-color)'
          }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-100)',
              color: 'var(--primary-800)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '18px'
            }}>
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <h4 style={{ fontSize: '15px', margin: 0, color: 'var(--text-dark)' }}>{user?.name}</h4>
              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: 'var(--primary-700)',
                backgroundColor: 'var(--primary-50)',
                padding: '2px 8px',
                borderRadius: '10px',
                display: 'inline-block',
                marginTop: '4px'
              }}>
                {user?.role} PORTAL
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {links.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '14px',
                    color: isActive ? 'var(--primary-700)' : 'var(--text-dark)',
                    backgroundColor: isActive ? 'var(--primary-50)' : 'transparent',
                    borderLeft: isActive ? '4px solid var(--primary-600)' : '4px solid transparent',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {link.icon}
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="btn btn-outline"
            style={{
              width: '100%',
              marginTop: '30px',
              justifyContent: 'flex-start',
              borderColor: '#e2e8f0',
              color: '#64748b'
            }}
          >
            <LogOut size={16} /> Log Out
          </button>
        </aside>

        {/* Main Content Area */}
        <main style={{ flex: 1, minWidth: '300px' }}>
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default DashboardLayout;
