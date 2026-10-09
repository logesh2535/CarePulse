import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HeartPulse, User, Mail, Lock, Phone, MapPin, Calendar, ArrowRight, AlertCircle } from 'lucide-react';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    gender: 'Male',
    dateOfBirth: '',
    address: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!formData.name || !formData.email || !formData.password || !formData.phone) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const res = await register(formData);
      if (res.success) {
        navigate('/patient/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please check input values.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-padding" style={{ backgroundColor: 'var(--bg-slate)', minHeight: '85vh', display: 'flex', alignItems: 'center' }}>
      <div className="container">
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
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
              <h2 style={{ fontSize: '26px', fontWeight: 800 }}>Create Patient Account</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
                Join CarePulse to search specialist doctors and manage your appointments
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
                <label className="form-label">Full Name *</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="John Doe"
                    style={{ paddingLeft: '42px' }}
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="john@example.com"
                      style={{ paddingLeft: '42px' }}
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      name="phone"
                      className="form-control"
                      placeholder="+1 (555) 000-0000"
                      style={{ paddingLeft: '42px' }}
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Password * (min 6 chars)</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      placeholder="••••••••"
                      style={{ paddingLeft: '42px' }}
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select
                    name="gender"
                    className="form-select"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <div style={{ position: 'relative' }}>
                  <Calendar size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
                  <input
                    type="date"
                    name="dateOfBirth"
                    className="form-control"
                    style={{ paddingLeft: '42px' }}
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Address</label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    name="address"
                    className="form-control"
                    placeholder="City, State, Zip"
                    style={{ paddingLeft: '42px' }}
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginTop: '10px' }}
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Complete Registration'} <ArrowRight size={18} />
              </button>
            </form>

            <p style={{ textAlign: 'center', fontSize: '14px', marginTop: '20px', color: 'var(--text-muted)' }}>
              Already registered?{' '}
              <Link to="/login" style={{ fontWeight: 700, color: 'var(--primary-600)' }}>
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
