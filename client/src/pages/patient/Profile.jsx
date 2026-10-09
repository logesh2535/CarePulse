import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { patientService } from '../../services/patientService';
import { User, Mail, Phone, Calendar, MapPin, Heart, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [patientProfile, setPatientProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    dateOfBirth: '',
    gender: 'Male',
    address: '',
    bloodGroup: 'Unknown',
    medicalInformation: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      if (user?.patientId) {
        const res = await patientService.getPatientById(user.patientId);
        if (res.success && res.data) {
          const p = res.data;
          setPatientProfile(p);
          setFormData({
            name: p.userId?.name || user.name || '',
            phone: p.userId?.phone || user.phone || '',
            dateOfBirth: p.dateOfBirth ? new Date(p.dateOfBirth).toISOString().split('T')[0] : '',
            gender: p.gender || 'Male',
            address: p.address || '',
            bloodGroup: p.bloodGroup || 'Unknown',
            medicalInformation: p.medicalInformation || ''
          });
        }
      }
    } catch (err) {
      console.error('Failed to load patient profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!user?.patientId) {
      setError('Patient profile ID missing.');
      return;
    }

    setSaving(true);
    try {
      const res = await patientService.updatePatient(user.patientId, formData);
      if (res.success) {
        setMessage('Profile updated successfully!');
        fetchProfile();
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="spinner-container"><div className="spinner"></div></div>;
  }

  return (
    <div style={{ maxWidth: '750px' }}>
      <div className="card" style={{ padding: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' }}>
          <div style={{
            width: '60px', height: '60px', borderRadius: '50%',
            backgroundColor: 'var(--primary-100)', color: 'var(--primary-700)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '24px', fontWeight: 800
          }}>
            {user?.name?.charAt(0) || 'P'}
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800 }}>Manage Patient Profile</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              Update your personal demographic data and medical background
            </p>
          </div>
        </div>

        {message && (
          <div style={{
            backgroundColor: '#d1fae5', color: '#065f46',
            padding: '12px 16px', borderRadius: 'var(--radius-md)',
            marginBottom: '20px', fontSize: '14px',
            display: 'flex', alignItems: 'center', gap: '8px'
          }}>
            <CheckCircle2 size={18} />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div style={{
            backgroundColor: '#fee2e2', color: '#991b1b',
            padding: '12px 16px', borderRadius: 'var(--radius-md)',
            marginBottom: '20px', fontSize: '14px',
            display: 'flex', alignItems: 'center', gap: '8px'
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                className="form-control"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address (Account ID)</label>
              <input
                type="email"
                className="form-control"
                value={user?.email || ''}
                disabled
                style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed' }}
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input
                type="text"
                className="form-control"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Date of Birth</label>
              <input
                type="date"
                className="form-control"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Gender</label>
              <select
                className="form-select"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Blood Group</label>
              <select
                className="form-select"
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="Unknown">Unknown</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Residential Address</label>
            <input
              type="text"
              className="form-control"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Prior Medical Conditions / Allergies</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="List any known allergies, chronic illnesses, or current medications..."
              value={formData.medicalInformation}
              onChange={(e) => setFormData({ ...formData, medicalInformation: e.target.value })}
            ></textarea>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving}
            style={{ width: '100%', marginTop: '10px' }}
          >
            {saving ? 'Saving Changes...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
