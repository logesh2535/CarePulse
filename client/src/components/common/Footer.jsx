import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, Phone, Mail, MapPin, ShieldCheck } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#0f172a',
      color: '#94a3b8',
      paddingTop: '60px',
      paddingBottom: '30px',
      marginTop: '80px',
      borderTop: '1px solid #1e293b'
    }}>
      <div className="container">
        <div className="grid-4" style={{ marginBottom: '40px' }}>
          {/* Col 1 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'var(--primary-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}>
                <HeartPulse size={20} />
              </div>
              <span style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-heading)' }}>
                CarePulse
              </span>
            </div>
            <p style={{ fontSize: '14px', lineHeight: '1.6' }}>
              A modern healthcare portal connecting patients with certified specialist doctors. Fast, secure, and conflict-free medical appointment scheduling.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h4 style={{ color: '#ffffff', marginBottom: '16px', fontSize: '16px' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
              <li><Link to="/" style={{ color: '#94a3b8' }}>Home</Link></li>
              <li><Link to="/doctors" style={{ color: '#94a3b8' }}>Search Specialist Doctors</Link></li>
              <li><Link to="/about" style={{ color: '#94a3b8' }}>About Our Platform</Link></li>
              <li><Link to="/login" style={{ color: '#94a3b8' }}>Patient Portal Login</Link></li>
              <li><Link to="/register" style={{ color: '#94a3b8' }}>New Patient Registration</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 style={{ color: '#ffffff', marginBottom: '16px', fontSize: '16px' }}>Specializations</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
              <li>Cardiology & Heart Care</li>
              <li>Dermatology & Skin Clinic</li>
              <li>Pediatrics & Child Health</li>
              <li>General Wellness Physician</li>
              <li>Dentistry & Dental Surgery</li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 style={{ color: '#ffffff', marginBottom: '16px', fontSize: '16px' }}>Emergency Contact</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={16} style={{ color: 'var(--primary-500)' }} />
                <span>+1 (800) 555-CARE (2273)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={16} style={{ color: 'var(--primary-500)' }} />
                <span>support@carepulse-medical.com</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin size={16} style={{ color: 'var(--primary-500)' }} />
                <span>100 Health Sciences Plaza, Medical City</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid #1e293b',
          paddingTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '13px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <p>© 2026 CarePulse Medical Appointment Booking System — Academic Project.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary-400)' }}>
            <ShieldCheck size={16} /> Verified Role-Based Access Control System
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
