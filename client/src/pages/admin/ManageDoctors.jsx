import React, { useState, useEffect } from 'react';
import { doctorService } from '../../services/doctorService';
import { specializationService } from '../../services/specializationService';
import { Stethoscope, Plus, Trash2, X, CheckCircle2, AlertCircle } from 'lucide-react';

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: 'doctor123',
    phone: '',
    specialization: '',
    qualification: '',
    experience: 5,
    consultationFee: 100,
    description: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [docRes, specRes] = await Promise.all([
        doctorService.getDoctors(),
        specializationService.getSpecializations()
      ]);
      if (docRes.success) setDoctors(docRes.data);
      if (specRes.success) {
        setSpecializations(specRes.data);
        if (specRes.data.length > 0) {
          setFormData(prev => ({ ...prev, specialization: specRes.data[0]._id }));
        }
      }
    } catch (err) {
      console.error('Fetch data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDoctor = async (id) => {
    if (window.confirm('Are you sure you want to remove this doctor account?')) {
      try {
        const res = await doctorService.deleteDoctor(id);
        if (res.success) {
          fetchData();
        }
      } catch (err) {
        alert(err.message || 'Failed to delete doctor');
      }
    }
  };

  const handleCreateDoctor = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name || !formData.email || !formData.phone || !formData.qualification) {
      setError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await doctorService.createDoctor(formData);
      if (res.success) {
        setSuccess('Doctor profile created successfully!');
        setShowModal(false);
        fetchData();
      }
    } catch (err) {
      setError(err.message || 'Failed to create doctor account.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800 }}>Doctor Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Register new doctors, configure specializations, fees, and view active accounts.
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus size={18} /> Register New Doctor
        </button>
      </div>

      {loading ? (
        <div className="spinner-container"><div className="spinner"></div></div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Doctor Name</th>
                  <th>Specialization</th>
                  <th>Qualification</th>
                  <th>Experience</th>
                  <th>Fee</th>
                  <th>Phone</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doc) => (
                  <tr key={doc._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img src={doc.profileImage} alt="" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                        <div>
                          <div style={{ fontWeight: 700 }}>{doc.userId?.name}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{doc.userId?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td><span style={{ fontWeight: 600, color: 'var(--primary-700)' }}>{doc.specialization?.name}</span></td>
                    <td>{doc.qualification}</td>
                    <td>{doc.experience} Yrs</td>
                    <td><strong style={{ color: 'var(--accent-green)' }}>${doc.consultationFee}</strong></td>
                    <td>{doc.userId?.phone}</td>
                    <td>
                      <button onClick={() => handleDeleteDoctor(doc._id)} className="btn btn-danger btn-sm">
                        <Trash2 size={14} /> Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Dialog for Registering Doctor */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px' }}>Register New Doctor</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {error && <div style={{ color: '#991b1b', backgroundColor: '#fee2e2', padding: '10px', borderRadius: '6px', marginBottom: '14px', fontSize: '13px' }}>{error}</div>}

            <form onSubmit={handleCreateDoctor}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Doctor Name *</label>
                  <input type="text" className="form-control" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input type="email" className="form-control" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input type="text" className="form-control" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Specialization *</label>
                  <select className="form-select" value={formData.specialization} onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}>
                    {specializations.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid-3">
                <div className="form-group">
                  <label className="form-label">Qualification *</label>
                  <input type="text" className="form-control" placeholder="MD, MBBS..." required value={formData.qualification} onChange={(e) => setFormData({ ...formData, qualification: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Experience (Yrs)</label>
                  <input type="number" className="form-control" min="0" value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: Number(e.target.value) })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Fee ($)</label>
                  <input type="number" className="form-control" min="0" value={formData.consultationFee} onChange={(e) => setFormData({ ...formData, consultationFee: Number(e.target.value) })} />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }} disabled={submitting}>
                {submitting ? 'Creating Doctor Account...' : 'Create Doctor Account'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageDoctors;
