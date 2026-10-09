import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { appointmentService } from '../../services/appointmentService';
import AppointmentCard from '../../components/appointment/AppointmentCard';
import { Calendar, Clock, CheckCircle2, AlertCircle, PlusCircle, Search, ArrowRight } from 'lucide-react';

const PatientDashboard = () => {
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
      console.error('Failed to load patient appointments:', err);
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

  const pendingCount = appointments.filter(a => a.status === 'Pending').length;
  const confirmedCount = appointments.filter(a => a.status === 'Confirmed').length;
  const completedCount = appointments.filter(a => a.status === 'Completed').length;

  return (
    <div>
      {/* Welcome Header */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        padding: '28px',
        border: '1px solid var(--border-color)',
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800 }}>Welcome back, {user?.name}! 👋</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
            Manage your medical appointments, track consultation status, or search new specialists.
          </p>
        </div>
        <Link to="/doctors" className="btn btn-primary">
          <PlusCircle size={18} /> Book New Appointment
        </Link>
      </div>

      {/* Summary KPI Cards */}
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
              Pending Doctor Review
            </span>
            <h3 style={{ fontSize: '24px', fontWeight: 800 }}>{pendingCount}</h3>
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
              Confirmed Upcoming
            </span>
            <h3 style={{ fontSize: '24px', fontWeight: 800 }}>{confirmedCount}</h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            backgroundColor: '#e0e7ff', color: '#3730a3',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Calendar size={24} />
          </div>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Completed Visits
            </span>
            <h3 style={{ fontSize: '24px', fontWeight: 800 }}>{completedCount}</h3>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700 }}>Recent Appointments History</h2>
          <Link to="/patient/appointments" style={{ fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
            View Full List <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="spinner-container"><div className="spinner"></div></div>
        ) : appointments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <Calendar size={40} style={{ color: 'var(--text-light)', marginBottom: '12px' }} />
            <h4 style={{ fontSize: '18px', marginBottom: '6px' }}>No Appointments Scheduled</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '16px' }}>
              You haven't booked any medical consultations yet.
            </p>
            <Link to="/doctors" className="btn btn-primary btn-sm">
              <Search size={16} /> Search Specialist Doctors
            </Link>
          </div>
        ) : (
          appointments.slice(0, 5).map((appt) => (
            <AppointmentCard
              key={appt._id}
              appointment={appt}
              userRole="PATIENT"
              onCancel={handleCancel}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
