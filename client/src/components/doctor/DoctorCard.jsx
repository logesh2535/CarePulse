import React from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, Award, Calendar, DollarSign, Clock, ArrowRight } from 'lucide-react';

const DoctorCard = ({ doctor }) => {
  const doctorName = doctor.userId?.name || 'Dr. Specialist';
  const specializationName = doctor.specialization?.name || 'General Medicine';

  return (
    <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header Profile Image & Badge */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '16px' }}>
        <img
          src={doctor.profileImage || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80'}
          alt={doctorName}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80';
          }}
          style={{
            width: '74px',
            height: '74px',
            borderRadius: '16px',
            objectFit: 'cover',
            border: '2px solid var(--primary-100)'
          }}
        />
        <div style={{ flex: 1 }}>
          <span style={{
            fontSize: '12px',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: 'var(--primary-700)',
            backgroundColor: 'var(--primary-100)',
            padding: '4px 10px',
            borderRadius: '12px',
            display: 'inline-block',
            marginBottom: '6px'
          }}>
            {specializationName}
          </span>
          <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>{doctorName}</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{doctor.qualification}</p>
        </div>
      </div>

      {/* Details List */}
      <div style={{
        backgroundColor: '#f8fafc',
        borderRadius: '12px',
        padding: '12px 14px',
        margin: '12px 0 20px 0',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        fontSize: '13px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
            <Award size={15} style={{ color: 'var(--primary-600)' }} /> Experience
          </span>
          <span style={{ fontWeight: 700 }}>{doctor.experience} Years</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
            <DollarSign size={15} style={{ color: 'var(--accent-green)' }} /> Consultation Fee
          </span>
          <span style={{ fontWeight: 700, color: 'var(--primary-700)', fontSize: '15px' }}>
            ${doctor.consultationFee}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
            <Clock size={15} style={{ color: 'var(--primary-600)' }} /> Working Days
          </span>
          <span style={{ fontWeight: 600 }}>Mon - Fri</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
        <Link to={`/doctors/${doctor._id}`} className="btn btn-outline btn-sm" style={{ flex: 1 }}>
          View Profile
        </Link>
        <Link to={`/patient/book/${doctor._id}`} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
          Book Slot <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};

export default DoctorCard;
