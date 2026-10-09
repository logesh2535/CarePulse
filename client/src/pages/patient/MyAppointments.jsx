import React, { useState, useEffect } from 'react';
import { appointmentService } from '../../services/appointmentService';
import AppointmentCard from '../../components/appointment/AppointmentCard';
import { Calendar, Filter } from 'lucide-react';

const MyAppointments = () => {
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

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        const res = await appointmentService.cancelAppointment(id);
        if (res.success) {
          fetchAppointments();
        }
      } catch (err) {
        alert(err.message || 'Failed to cancel appointment');
      }
    }
  };

  const filteredAppointments = activeTab === 'All'
    ? appointments
    : appointments.filter(a => a.status === activeTab);

  const tabs = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled', 'Rejected'];

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800 }}>My Appointment History</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          View and track the status of all your booked medical consultations.
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '12px',
        marginBottom: '20px'
      }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="btn btn-sm"
              style={{
                backgroundColor: isActive ? 'var(--primary-600)' : '#ffffff',
                color: isActive ? '#ffffff' : 'var(--text-dark)',
                border: '1px solid',
                borderColor: isActive ? 'var(--primary-600)' : 'var(--border-color)'
              }}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Appointment Cards Grid */}
      {loading ? (
        <div className="spinner-container"><div className="spinner"></div></div>
      ) : filteredAppointments.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '50px 20px' }}>
          <Calendar size={44} style={{ color: 'var(--text-light)', marginBottom: '12px' }} />
          <h3 style={{ fontSize: '18px', marginBottom: '6px' }}>No Appointments Found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            There are no {activeTab !== 'All' ? activeTab.toLowerCase() : ''} appointments in your history.
          </p>
        </div>
      ) : (
        filteredAppointments.map((appt) => (
          <AppointmentCard
            key={appt._id}
            appointment={appt}
            userRole="PATIENT"
            onCancel={handleCancel}
          />
        ))
      )}
    </div>
  );
};

export default MyAppointments;
