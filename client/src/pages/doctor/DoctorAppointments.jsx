import React, { useState, useEffect } from 'react';
import { appointmentService } from '../../services/appointmentService';
import AppointmentCard from '../../components/appointment/AppointmentCard';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await appointmentService.getAppointments();
      if (res.success) {
        setAppointments(res.data);
      }
    } catch (err) {
      console.error('Failed to load appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await appointmentService.updateAppointmentStatus(id, { status });
      if (res.success) {
        fetchAppointments();
      }
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  };

  const filtered = activeTab === 'All'
    ? appointments
    : appointments.filter(a => a.status === activeTab);

  const tabs = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled', 'Rejected'];

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800 }}>Patient Appointment Requests</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Approve, reject, or mark consultation status updates for patient bookings.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '20px' }}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="btn btn-sm"
            style={{
              backgroundColor: activeTab === tab ? 'var(--primary-600)' : '#ffffff',
              color: activeTab === tab ? '#ffffff' : 'var(--text-dark)',
              border: '1px solid',
              borderColor: activeTab === tab ? 'var(--primary-600)' : 'var(--border-color)'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="spinner-container"><div className="spinner"></div></div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No appointments matching tab filter '{activeTab}'.</p>
        </div>
      ) : (
        filtered.map((appt) => (
          <AppointmentCard
            key={appt._id}
            appointment={appt}
            userRole="DOCTOR"
            onUpdateStatus={handleUpdateStatus}
          />
        ))
      )}
    </div>
  );
};

export default DoctorAppointments;
