import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { doctorService } from '../../services/doctorService';
import { Clock, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

const daysOfWeekList = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const AvailabilityManager = () => {
  const { user } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [newSlot, setNewSlot] = useState({
    dayOfWeek: 'Monday',
    startTime: '09:00',
    endTime: '13:00',
    slotDurationMinutes: 30
  });

  useEffect(() => {
    fetchDoctorInfo();
  }, []);

  const fetchDoctorInfo = async () => {
    setLoading(true);
    try {
      if (user?.doctorId) {
        const res = await doctorService.getDoctorById(user.doctorId);
        if (res.success && res.data) {
          setDoctor(res.data);
          setAvailability(res.data.availability || []);
        }
      }
    } catch (err) {
      console.error('Failed to load doctor info:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSlot = () => {
    setAvailability([...availability, { ...newSlot, isAvailable: true }]);
  };

  const handleRemoveSlot = (index) => {
    const updated = [...availability];
    updated.splice(index, 1);
    setAvailability(updated);
  };

  const handleSaveAvailability = async () => {
    setMessage('');
    setError('');
    setSaving(true);
    try {
      if (user?.doctorId) {
        const res = await doctorService.updateDoctor(user.doctorId, { availability });
        if (res.success) {
          setMessage('Availability schedule saved successfully!');
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to update availability schedule.');
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            backgroundColor: 'var(--primary-100)', color: 'var(--primary-700)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Clock size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800 }}>Manage Available Time Slots</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              Define weekly day intervals and consultation hours for patient booking
            </p>
          </div>
        </div>

        {message && (
          <div style={{ backgroundColor: '#d1fae5', color: '#065f46', padding: '12px 16px', borderRadius: 'var(--radius-md)', marginBottom: '20px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={18} /> <span>{message}</span>
          </div>
        )}

        {error && (
          <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '12px 16px', borderRadius: 'var(--radius-md)', marginBottom: '20px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={18} /> <span>{error}</span>
          </div>
        )}

        {/* Add New Time Slot Row */}
        <div style={{ backgroundColor: 'var(--primary-50)', borderRadius: 'var(--radius-md)', padding: '20px', marginBottom: '24px', border: '1px solid var(--primary-200)' }}>
          <h4 style={{ fontSize: '15px', color: 'var(--primary-800)', marginBottom: '14px' }}>Add Consultation Shift Interval</h4>
          <div className="grid-4" style={{ alignItems: 'end' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Day</label>
              <select className="form-select" value={newSlot.dayOfWeek} onChange={(e) => setNewSlot({ ...newSlot, dayOfWeek: e.target.value })}>
                {daysOfWeekList.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Start Time</label>
              <input type="time" className="form-control" value={newSlot.startTime} onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })} />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">End Time</label>
              <input type="time" className="form-control" value={newSlot.endTime} onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })} />
            </div>

            <div>
              <button type="button" onClick={handleAddSlot} className="btn btn-primary" style={{ width: '100%' }}>
                <Plus size={16} /> Add Slot
              </button>
            </div>
          </div>
        </div>

        {/* Existing Schedule List */}
        <h4 style={{ fontSize: '16px', marginBottom: '14px' }}>Current Active Availability Shifts</h4>
        {availability.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No availability shifts defined yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
            {availability.map((slot, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', backgroundColor: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontWeight: 700, color: 'var(--text-dark)' }}>{slot.dayOfWeek}</div>
                <div style={{ fontSize: '14px', color: 'var(--primary-700)', fontWeight: 600 }}>{slot.startTime} - {slot.endTime}</div>
                <button type="button" onClick={() => handleRemoveSlot(index)} className="btn btn-danger btn-sm">
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            ))}
          </div>
        )}

        <button type="button" onClick={handleSaveAvailability} className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={saving}>
          {saving ? 'Updating Schedule...' : 'Save Availability Schedule'}
        </button>
      </div>
    </div>
  );
};

export default AvailabilityManager;
