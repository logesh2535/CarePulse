import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doctorService } from '../../services/doctorService';
import {
  Stethoscope,
  Award,
  DollarSign,
  Clock,
  Calendar,
  CheckCircle2,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

const DoctorDetails = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const res = await doctorService.getDoctorById(id);
        if (res.success) {
          setDoctor(res.data);
        }
      } catch (err) {
        setError(err.message || 'Failed to load doctor profile details');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctorDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="spinner-container" style={{ minHeight: '60vh' }}>
        <div className="spinner"></div>
        <p style={{ color: 'var(--text-muted)' }}>Loading doctor profile details...</p>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="container section-padding" style={{ textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <h3 style={{ color: 'var(--accent-red)', marginBottom: '10px' }}>Doctor Profile Not Found</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>{error || 'The requested doctor ID does not exist.'}</p>
          <Link to="/doctors" className="btn btn-primary btn-sm">
            Back to Doctors Search
          </Link>
        </div>
      </div>
    );
  }

  const doctorName = doctor.userId?.name || 'Dr. Specialist';
  const doctorEmail = doctor.userId?.email || 'N/A';
  const doctorPhone = doctor.userId?.phone || 'N/A';
  const specName = doctor.specialization?.name || 'General Medicine';

  return (
    <div className="section-padding" style={{ backgroundColor: 'var(--bg-slate)', minHeight: '85vh' }}>
      <div className="container">
        {/* Profile Card Header */}
        <div className="card" style={{ marginBottom: '30px', padding: '30px' }}>
          <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <img
              src={doctor.profileImage || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80'}
              alt={doctorName}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80';
              }}
              style={{
                width: '140px',
                height: '140px',
                borderRadius: '20px',
                objectFit: 'cover',
                border: '4px solid var(--primary-100)',
                boxShadow: 'var(--shadow-md)'
              }}
            />

            <div style={{ flex: 1 }}>
              <span style={{
                fontSize: '13px',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: 'var(--primary-700)',
                backgroundColor: 'var(--primary-100)',
                padding: '4px 12px',
                borderRadius: '12px',
                display: 'inline-block',
                marginBottom: '8px'
              }}>
                {specName}
              </span>

              <h1 style={{ fontSize: '30px', fontWeight: 800, margin: '4px 0 8px 0' }}>{doctorName}</h1>
              <p style={{ fontSize: '15px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                {doctor.qualification} • {doctor.experience} Years Medical Experience
              </p>

              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', fontSize: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-dark)' }}>
                  <DollarSign size={18} style={{ color: 'var(--accent-green)' }} />
                  <span>Consultation Fee: <strong>${doctor.consultationFee}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-dark)' }}>
                  <ShieldCheck size={18} style={{ color: 'var(--primary-600)' }} />
                  <span>Medical Council License Verified</span>
                </div>
              </div>
            </div>

            <div>
              <Link to={`/patient/book/${doctor._id}`} className="btn btn-primary btn-lg" style={{ padding: '14px 28px' }}>
                Book Appointment <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>

        {/* Doctor Biography & Weekly Available Schedule */}
        <div className="grid-2">
          {/* Biography & Specialities */}
          <div className="card">
            <h3 style={{ fontSize: '20px', marginBottom: '16px', borderBottom: '2px solid var(--primary-100)', paddingBottom: '10px' }}>
              About Doctor & Practice Overview
            </h3>
            <p style={{ color: 'var(--text-dark)', lineHeight: '1.7', fontSize: '15px', marginBottom: '24px' }}>
              {doctor.description || 'Dedicated medical specialist with extensive clinical experience in diagnosis, patient consultation, and treatment planning.'}
            </p>

            <h4 style={{ fontSize: '16px', marginBottom: '12px', color: 'var(--primary-800)' }}>Contact Information</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', color: 'var(--text-muted)' }}>
              <div><strong>Email:</strong> {doctorEmail}</div>
              <div><strong>Clinic Contact:</strong> {doctorPhone}</div>
            </div>
          </div>

          {/* Available Days & Time Slots */}
          <div className="card">
            <h3 style={{ fontSize: '20px', marginBottom: '16px', borderBottom: '2px solid var(--primary-100)', paddingBottom: '10px' }}>
              Weekly Available Time Slots
            </h3>

            {doctor.availability && doctor.availability.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {doctor.availability.map((slot, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 16px',
                    backgroundColor: 'var(--primary-50)',
                    borderRadius: '12px',
                    border: '1px solid var(--primary-200)'
                  }}>
                    <div style={{ fontWeight: 700, color: 'var(--primary-900)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar size={16} style={{ color: 'var(--primary-600)' }} />
                      {slot.dayOfWeek}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 600, color: 'var(--primary-700)' }}>
                      <Clock size={16} />
                      {slot.startTime} - {slot.endTime} ({slot.slotDurationMinutes} mins/slot)
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Standard hours: Monday to Friday (09:00 AM - 01:00 PM).</p>
            )}

            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <Link to={`/patient/book/${doctor._id}`} className="btn btn-primary" style={{ width: '100%' }}>
                Select Preferred Date & Book Slot
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetails;
