import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HeartPulse, Lock, Mail, ArrowRight, AlertCircle, Key } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await login({ email, password });
      if (res.success) {
        const userRole = res.user?.role;
        if (userRole === 'PATIENT') navigate('/patient/dashboard');
        else if (userRole === 'DOCTOR') navigate('/doctor/dashboard');
        else if (userRole === 'ADMIN') navigate('/admin/dashboard');
        else navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  // Demo Login Helper for Viva Review
  const fillDemoAccount = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="section-padding" style={{ backgroundColor: 'var(--bg-slate)', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container">
        <div style={{ maxWidth: '460px', margin: '0 auto' }}>
          <div className="card" style={{ padding: '36px' }}>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, var(--primary-600), var(--primary-700))',
                color: '#ffffff',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px'
              }}>
                <HeartPulse size={28} />
              </div>
              <h2 style={{ fontSize: '26px', fontWeight: 800 }}>Sign In to CarePulse</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
                Enter your registered credentials to access your dashboard
              </p>
            </div>

            {error && (
              <div style={{
                backgroundColor: '#fee2e2',
                color: '#991b1b',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '20px',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
                  <input
                    type="email"
                    className="form-control"
                    placeholder="name@example.com"
                    style={{ paddingLeft: '42px' }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
                  <input
                    type="password"
                    className="form-control"
                    placeholder="••••••••"
                    style={{ paddingLeft: '42px' }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginTop: '10px' }}
                disabled={loading}
              >
                {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={18} />
              </button>
            </form>

            {/* Quick Demo Fill Credentials for College Viva Evaluation */}
            <div style={{
              marginTop: '28px',
              paddingTop: '20px',
              borderTop: '1px solid var(--border-color)',
              fontSize: '12px',
              textAlign: 'center'
            }}>
              <span style={{ fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                <Key size={14} style={{ display: 'inline', marginRight: '4px' }} /> QUICK DEMO LOGIN (VIVA ACCELERATOR)
              </span>
              <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={() => fillDemoAccount('patient123@gmail.com', 'patient123')}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '11px', padding: '4px 8px' }}
                >
                  Patient
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoAccount('dr.robert@medicalapp.com', 'doctor123')}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '11px', padding: '4px 8px' }}
                >
                  Doctor
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoAccount('admin@medicalapp.com', 'admin123')}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '11px', padding: '4px 8px' }}
                >
                  Admin
                </button>
              </div>
            </div>

            <p style={{ textAlign: 'center', fontSize: '14px', marginTop: '20px', color: 'var(--text-muted)' }}>
              Don't have a patient account?{' '}
              <Link to="/register" style={{ fontWeight: 700, color: 'var(--primary-600)' }}>
                Register Patient
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
