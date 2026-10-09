import React from 'react';
import StatusBadge from '../common/StatusBadge';
import { Calendar, Clock, User, Stethoscope, FileText, CheckCircle2, XCircle, Trash2 } from 'lucide-react';

const AppointmentCard = ({ appointment, userRole, onUpdateStatus, onCancel }) => {
  const doctorName = appointment.doctorId?.userId?.name || 'Dr. Specialist';
  const specializationName = appointment.doctorId?.specialization?.name || 'General Clinic';
  const patientName = appointment.patientId?.userId?.name || 'Patient';
  const patientPhone = appointment.patientId?.userId?.phone || 'N/A';

  return (
    <div className="card" style={{ borderLeft: '5px solid var(--primary-600)', marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
              ID: #{appointment._id.substring(appointment._id.length - 8).toUpperCase()}
            </span>
            <StatusBadge status={appointment.status} />
          </div>

          <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '4px 0' }}>
            {userRole === 'PATIENT' ? `Doctor: ${doctorName}` : `Patient: ${patientName}`}
          </h3>

          <p style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Stethoscope size={14} /> {specializationName}
            {userRole !== 'PATIENT' && ` • Phone: ${patientPhone}`}
          </p>
        </div>

        {/* Date & Time Slot Box */}
        <div style={{
          backgroundColor: 'var(--primary-50)',
          border: '1px solid var(--primary-200)',
          padding: '10px 16px',
          borderRadius: '12px',
          display: 'flex',
          gap: '16px',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary-900)', fontWeight: 600, fontSize: '14px' }}>
            <Calendar size={16} style={{ color: 'var(--primary-600)' }} />
            {appointment.appointmentDate}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary-900)', fontWeight: 700, fontSize: '14px' }}>
            <Clock size={16} style={{ color: 'var(--primary-600)' }} />
            {appointment.appointmentTime}
          </div>
        </div>
      </div>

      {/* Reason for Appointment */}
      <div style={{
        marginTop: '14px',
        paddingTop: '12px',
        borderTop: '1px dashed var(--border-color)',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '8px',
        color: 'var(--text-dark)'
      }}>
        <FileText size={16} style={{ color: 'var(--text-muted)', marginTop: '2px', flexShrink: 0 }} />
        <div>
          <span style={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: '12px', display: 'block' }}>REASON FOR VISIT</span>
          {appointment.reason}
        </div>
      </div>

      {/* Action Buttons depending on userRole & status */}
      <div style={{ marginTop: '16px', display: 'flex', gap: '10px', justifyContent: 'flex-end', alignItems: 'center' }}>
        {/* Doctor Actions */}
        {(userRole === 'DOCTOR' || userRole === 'ADMIN') && appointment.status === 'Pending' && (
          <>
            <button
              onClick={() => onUpdateStatus(appointment._id, 'Confirmed')}
              className="btn btn-primary btn-sm"
              style={{ backgroundColor: 'var(--accent-green)', borderColor: 'var(--accent-green)' }}
            >
              <CheckCircle2 size={15} /> Approve Appointment
            </button>
            <button
              onClick={() => onUpdateStatus(appointment._id, 'Rejected')}
              className="btn btn-danger btn-sm"
            >
              <XCircle size={15} /> Reject
            </button>
          </>
        )}

        {(userRole === 'DOCTOR' || userRole === 'ADMIN') && appointment.status === 'Confirmed' && (
          <button
            onClick={() => onUpdateStatus(appointment._id, 'Completed')}
            className="btn btn-primary btn-sm"
          >
            Mark as Completed
          </button>
        )}

        {/* Patient / Admin Cancel Action */}
        {(appointment.status === 'Pending' || appointment.status === 'Confirmed') && (
          <button
            onClick={() => onCancel(appointment._id)}
            className="btn btn-outline btn-sm"
            style={{ color: 'var(--accent-red)', borderColor: '#fca5a5' }}
          >
            <Trash2 size={14} /> Cancel Appointment
          </button>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;
