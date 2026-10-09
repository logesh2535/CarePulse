import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doctorService } from '../../services/doctorService';
import { appointmentService } from '../../services/appointmentService';
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  DollarSign,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

const timeSlotsList = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '14:00', '14:30', '15:00', '15:30', '16:00'
];

const BookAppointment = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState(doctorId || '');
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [appointmentDate, setAppointmentDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });

  const [appointmentTime, setAppointmentTime] = useState('10:00');
  const [reason, setReason] = useState('');

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [bookingResult, setBookingResult] = useState(null);

  useEffect(() => {
    const fetchDoctorsList = async () => {
      setLoading(true);
      try {
        const res = await doctorService.getDoctors();
        if (res.success) {
          setDoctors(res.data);
          if (!selectedDoctorId && res.data.length > 0) {
            setSelectedDoctorId(res.data[0]._id);
          }
        }
      } catch (err) {
        setError('Failed to fetch doctor list');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctorsList();
  }, []);

  useEffect(() => {
    if (selectedDoctorId && doctors.length > 0) {
      const doc = doctors.find(d => d._id === selectedDoctorId);
      setSelectedDoctor(doc || null);
    }
  }, [selectedDoctorId, doctors]);

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!selectedDoctorId) {
      setError('Please select a doctor.');
      return;
    }

    if (!appointmentDate) {
      setError('Please select an appointment date.');
      return;
    }

    if (!appointmentTime) {
      setError('Please select an available time slot.');
      return;
    }

    if (!reason.trim()) {
      setError('Please enter a brief reason for your appointment visit.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        doctorId: selectedDoctorId,
        appointmentDate,
        appointmentTime,
        reason
      };

      const res = await appointmentService.bookAppointment(payload);
      if (res.success) {
        setSuccessMsg(res.message);
        setBookingResult(res.data);
      }
    } catch (err) {
      setError(err.message || 'Selected slot is unavailable. Please choose another time.');
    } finally {
      setSubmitting(false);
    }
  };

  const minDateString = new Date().toISOString().split('T')[0];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="card" style={{ padding: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '12px',
            backgroundColor: 'var(--primary-100)', color: 'var(--primary-700)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Calendar size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800 }}>Schedule Medical Appointment</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              6-Step Guided Booking Wizard with Instant Conflict Prevention
            </p>
          </div>
        </div>

        {/* Success Confirmation Modal / Banner */}
        {bookingResult ? (
          <div style={{
            backgroundColor: '#d1fae5',
            border: '2px solid #059669',
            borderRadius: 'var(--radius-lg)',
            padding: '30px',
            textAlign: 'center'
          }}>
            <CheckCircle2 size={60} style={{ color: '#059669', marginBottom: '16px' }} />
            <h2 style={{ fontSize: '24px', color: '#065f46', marginBottom: '8px' }}>
              Appointment Booked Successfully!
            </h2>
            <p style={{ color: '#047857', fontSize: '15px', marginBottom: '20px' }}>
              Your request has been submitted to the doctor for confirmation.
            </p>

            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              textAlign: 'left',
              marginBottom: '24px',
              border: '1px solid #a7f3d0'
            }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)' }}>
                APPOINTMENT ID: #{bookingResult._id.toUpperCase()}
              </div>
              <div style={{ fontSize: '16px', fontWeight: 700, margin: '6px 0' }}>
                Doctor: {bookingResult.doctorId?.userId?.name || 'Specialist'}
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-dark)' }}>
                📅 <strong>Date:</strong> {bookingResult.appointmentDate} &nbsp;&nbsp;| &nbsp;&nbsp;⏰ <strong>Time:</strong> {bookingResult.appointmentTime}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <Link to="/patient/appointments" className="btn btn-primary">
                View My Appointments
              </Link>
              <button onClick={() => setBookingResult(null)} className="btn btn-outline">
                Book Another Slot
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitBooking}>
            {error && (
              <div style={{
                backgroundColor: '#fee2e2', color: '#991b1b',
                padding: '12px 16px', borderRadius: 'var(--radius-md)',
                marginBottom: '20px', fontSize: '14px',
                display: 'flex', alignItems: 'center', gap: '8px'
              }}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {/* Step 1: Doctor Selection */}
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 700 }}>Step 1: Select Specialist Doctor *</label>
              <select
                className="form-select"
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                required
              >
                <option value="">-- Choose Doctor --</option>
                {doctors.map((doc) => (
                  <option key={doc._id} value={doc._id}>
                    {doc.userId?.name} ({doc.specialization?.name}) — Fee: ${doc.consultationFee}
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Doctor Preview Card */}
            {selectedDoctor && (
              <div style={{
                backgroundColor: 'var(--primary-50)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                marginBottom: '20px',
                display: 'flex',
                gap: '16px',
                alignItems: 'center',
                border: '1px solid var(--primary-200)'
              }}>
                <img
                  src={selectedDoctor.profileImage}
                  alt={selectedDoctor.userId?.name}
                  style={{ width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover' }}
                />
                <div>
                  <h4 style={{ fontSize: '16px', margin: 0 }}>{selectedDoctor.userId?.name}</h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    {selectedDoctor.specialization?.name} • {selectedDoctor.qualification}
                  </p>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary-700)' }}>
                    Consultation Fee: ${selectedDoctor.consultationFee}
                  </span>
                </div>
              </div>
            )}

            {/* Step 2 & 3: Date & Time Slot */}
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700 }}>Step 2: Select Date *</label>
                <input
                  type="date"
                  className="form-control"
                  min={minDateString}
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700 }}>Step 3: Select Available Time Slot *</label>
                <select
                  className="form-select"
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  required
                >
                  {timeSlotsList.map((slot) => (
                    <option key={slot} value={slot}>
                      ⏰ {slot} {parseInt(slot.split(':')[0]) >= 12 ? 'PM' : 'AM'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Step 4: Reason for Visit */}
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 700 }}>Step 4: Reason for Appointment *</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="e.g. Regular health checkup, persistent headache, fever diagnosis..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              ></textarea>
            </div>

            {/* Step 5 & 6: Summary & Confirm */}
            <div style={{
              backgroundColor: '#f8fafc',
              borderRadius: 'var(--radius-md)',
              padding: '18px',
              marginTop: '20px',
              border: '1px solid var(--border-color)'
            }}>
              <h4 style={{ fontSize: '14px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                Step 5: Booking Summary Review
              </h4>
              <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
                <div><strong>Doctor:</strong> {selectedDoctor?.userId?.name || 'Selected Doctor'}</div>
                <div><strong>Date & Time:</strong> {appointmentDate} at {appointmentTime}</div>
                <div><strong>Estimated Consultation Fee:</strong> ${selectedDoctor?.consultationFee || 0}</div>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '24px' }}
              disabled={submitting}
            >
              {submitting ? 'Checking Conflict & Booking...' : 'Step 6: Confirm & Submit Booking'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default BookAppointment;
