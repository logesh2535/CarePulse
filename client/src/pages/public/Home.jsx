import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { doctorService } from '../../services/doctorService';
import { specializationService } from '../../services/specializationService';
import DoctorCard from '../../components/doctor/DoctorCard';
import {
  HeartPulse,
  Search,
  CalendarCheck,
  ShieldCheck,
  Award,
  Users,
  Clock,
  ArrowRight,
  CheckCircle2,
  Stethoscope
} from 'lucide-react';

const Home = () => {
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [docRes, specRes] = await Promise.all([
          doctorService.getDoctors(),
          specializationService.getSpecializations()
        ]);
        if (docRes.success) setDoctors(docRes.data.slice(0, 3)); // Featured 3
        if (specRes.success) setSpecializations(specRes.data);
      } catch (err) {
        console.error('Home data load error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #0f766e 0%, #134e4a 100%)',
        color: '#ffffff',
        padding: '90px 0 100px 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '750px' }}>
            <span style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(8px)',
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '20px',
              letterSpacing: '0.5px'
            }}>
              <HeartPulse size={16} /> 24/7 ONLINE APPOINTMENT SYSTEM
            </span>

            <h1 style={{
              fontSize: '48px',
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: '20px',
              color: '#ffffff'
            }}>
              Book Your Medical Appointment Easily
            </h1>

            <p style={{
              fontSize: '19px',
              color: '#ccfbf1',
              marginBottom: '36px',
              lineHeight: 1.6,
              fontWeight: 400
            }}>
              Find the right doctor, choose your preferred time and book your appointment in a few simple steps. Conflict-free booking guaranteed.
            </p>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Link to="/doctors" className="btn btn-primary btn-lg">
                <Search size={20} /> Find a Doctor
              </Link>
              <Link to="/register" className="btn btn-secondary btn-lg" style={{ backgroundColor: '#ffffff', color: '#0f766e' }}>
                <CalendarCheck size={20} /> Book Appointment Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Specializations */}
      <section className="section-padding" style={{ backgroundColor: '#ffffff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 50px auto' }}>
            <span style={{ color: 'var(--primary-600)', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase' }}>
              Specialist Departments
            </span>
            <h2 style={{ fontSize: '32px', marginTop: '6px' }}>Popular Medical Specializations</h2>
          </div>

          <div className="grid-3">
            {specializations.map((spec) => (
              <div key={spec._id} className="card card-hover" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '14px',
                  backgroundColor: 'var(--primary-100)',
                  color: 'var(--primary-700)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Stethoscope size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>{spec.name}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{spec.description}</p>
                  <Link to={`/doctors?specialization=${spec._id}`} style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '13px',
                    fontWeight: 700,
                    marginTop: '10px'
                  }}>
                    View Doctors <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Doctors */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-slate)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span style={{ color: 'var(--primary-600)', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase' }}>
                Certified Practitioners
              </span>
              <h2 style={{ fontSize: '32px', marginTop: '6px' }}>Featured Specialist Doctors</h2>
            </div>
            <Link to="/doctors" className="btn btn-outline">
              View All Doctors <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="spinner-container"><div className="spinner"></div></div>
          ) : (
            <div className="grid-3">
              {doctors.map((doc) => (
                <DoctorCard key={doc._id} doctor={doc} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding" style={{ backgroundColor: '#ffffff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 50px auto' }}>
            <span style={{ color: 'var(--primary-600)', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase' }}>
              4 Simple Steps
            </span>
            <h2 style={{ fontSize: '32px', marginTop: '6px' }}>How CarePulse Works</h2>
          </div>

          <div className="grid-4">
            {[
              { step: '01', title: 'Search Doctor', desc: 'Filter by medical specialization, name, or experience.' },
              { step: '02', title: 'Pick Date & Slot', desc: 'View real-time available daily consultation slots.' },
              { step: '03', title: 'Enter Reason', desc: 'Describe symptoms or routine checkup requirement.' },
              { step: '04', title: 'Instant Booking', desc: 'Receive instant appointment ID & status tracking.' }
            ].map((st) => (
              <div key={st.step} className="card" style={{ textAlign: 'center', position: 'relative' }}>
                <span style={{
                  fontSize: '36px',
                  fontWeight: 800,
                  color: 'var(--primary-200)',
                  fontFamily: 'var(--font-heading)',
                  display: 'block',
                  marginBottom: '10px'
                }}>
                  {st.step}
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>{st.title}</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us & Patient Benefits */}
      <section className="section-padding" style={{ backgroundColor: 'var(--primary-50)' }}>
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center' }}>
            <div>
              <span style={{ color: 'var(--primary-700)', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase' }}>
                Why Choose CarePulse
              </span>
              <h2 style={{ fontSize: '36px', marginTop: '8px', marginBottom: '20px' }}>
                Modern Healthcare Designed Around Your Convenience
              </h2>
              <p style={{ fontSize: '16px', color: 'var(--text-muted)', marginBottom: '30px' }}>
                Our 3-tier architecture guarantees immediate slot confirmation, preventing double bookings while giving you full access to doctor qualifications and consultation fees upfront.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  'Zero Double-Booking Guarantee via Server Slot Lock',
                  '24/7 Access to Specialist Doctor Schedules',
                  'Role-Based Secure Patient & Doctor Dashboards',
                  'Transparent Consultation Fees & Doctor Reviews',
                  'Easy Cancellation & Status Tracking'
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', fontWeight: 600 }}>
                    <CheckCircle2 size={20} style={{ color: 'var(--primary-600)', flexShrink: 0 }} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{ padding: '40px', textAlign: 'center', backgroundColor: '#ffffff', boxShadow: 'var(--shadow-lg)' }}>
              <ShieldCheck size={64} style={{ color: 'var(--primary-600)', marginBottom: '16px' }} />
              <h3 style={{ fontSize: '24px', marginBottom: '12px' }}>Ready to Schedule Your Appointment?</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '15px' }}>
                Create a patient account in less than 2 minutes and book your first specialist consultation today.
              </p>
              <Link to="/register" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                Get Started — Register Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
