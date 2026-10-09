import React, { useState, useEffect } from 'react';
import { specializationService } from '../../services/specializationService';
import { Layers, Plus, Trash2, X, Stethoscope } from 'lucide-react';

const Specializations = () => {
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('stethoscope');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSpecializations();
  }, []);

  const fetchSpecializations = async () => {
    setLoading(true);
    try {
      const res = await specializationService.getSpecializations();
      if (res.success) {
        setSpecializations(res.data);
      }
    } catch (err) {
      console.error('Failed to load specializations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) return;

    setSubmitting(true);
    try {
      const res = await specializationService.createSpecialization({ name, description, icon });
      if (res.success) {
        setName('');
        setDescription('');
        setShowModal(false);
        fetchSpecializations();
      }
    } catch (err) {
      setError(err.message || 'Failed to create specialization');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this specialization?')) {
      try {
        const res = await specializationService.deleteSpecialization(id);
        if (res.success) fetchSpecializations();
      } catch (err) {
        alert(err.message || 'Failed to delete specialization');
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800 }}>Medical Specializations</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Manage medical departments, consultation categories, and descriptions.
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus size={18} /> Add Specialization
        </button>
      </div>

      {loading ? (
        <div className="spinner-container"><div className="spinner"></div></div>
      ) : (
        <div className="grid-3">
          {specializations.map((spec) => (
            <div key={spec._id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '12px',
                  backgroundColor: 'var(--primary-100)', color: 'var(--primary-700)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Stethoscope size={22} />
                </div>
                <button onClick={() => handleDelete(spec._id)} className="btn btn-danger btn-sm">
                  <Trash2 size={14} />
                </button>
              </div>

              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>{spec.name}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{spec.description}</p>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px' }}>Add Specialization</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            {error && <div style={{ color: '#991b1b', backgroundColor: '#fee2e2', padding: '10px', borderRadius: '6px', marginBottom: '14px', fontSize: '13px' }}>{error}</div>}

            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="form-label">Specialization Name *</label>
                <input type="text" className="form-control" placeholder="e.g. Ophthalmology" required value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-control" rows="3" placeholder="Description of medical field..." value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }} disabled={submitting}>
                {submitting ? 'Adding...' : 'Add Specialization'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Specializations;
