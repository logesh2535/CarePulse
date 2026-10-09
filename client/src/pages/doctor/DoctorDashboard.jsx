import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { appointmentService } from '../../services/appointmentService';
import AppointmentCard from '../../components/appointment/AppointmentCard';
import { Calendar, Clock, CheckCircle2, AlertCircle, Users, Stethoscope } from 'lucide-react';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await appointmentService.getAppointments();
      if (res.success) {
        setAppointments(res.data);
      }
    } catch (err) {
      console.error('Doctor appointments load error:', err);
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

  const pendingRequests = appointments.filter(a => a.status === 'Pending');
  const confirmedAppointments = appointments.filter(a => a.status === 'Confirmed');
  const completedCount = appointments.filter(a => a.status === 'Completed').length;

  return (
    <div>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        padding: '28px',
        border: '1px solid var(--border-color)',
        marginBottom: '24px'
      }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800 }}>Doctor Console — Welcome, {user?.name}!</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
          Review incoming patient consultation requests, manage your daily schedule, and update appointment statuses.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid-3" style={{ marginBottom: '28px' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            backgroundColor: '#fef3c7', color: '#92400e',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Clock size={24} />
          </div>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Pending Requests
            </span>
            <h3 style={{ fontSize: '24px', fontWeight: 800 }}>{pendingRequests.length}</h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            backgroundColor: '#d1fae5', color: '#065f46',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Confirmed Schedule
            </span>
            <h3 style={{ fontSize: '24px', fontWeight: 800 }}>{confirmedAppointments.length}</h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            backgroundColor: '#e0e7ff', color: '#3730a3',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Stethoscope size={24} />
          </div>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Total Consulted
            </span>
            <h3 style={{ fontSize: '24px', fontWeight: 800 }}>{completedCount}</h3>
          </div>
        </div>
      </div>

      {/* Pending Requests Decision Section */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px', color: '#92400e' }}>
          Pending Patient Booking Requests ({pendingRequests.length})
        </h2>

        {loading ? (
          <div className="spinner-container"><div className="spinner"></div></div>
        ) : pendingRequests.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            No pending patient requests awaiting approval right now.
          </p>
        ) : (
          pendingRequests.map((appt) => (
            <AppointmentCard
              key={appt._id}
              appointment={appt}
              userRole="DOCTOR"
              onUpdateStatus={handleUpdateStatus}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
