import React from 'react';
import { HeartPulse, Shield, Layers, Award, CheckCircle2 } from 'lucide-react';

const About = () => {
  return (
    <div className="section-padding">
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 60px auto' }}>
          <span style={{ color: 'var(--primary-600)', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase' }}>
            About CarePulse Platform
          </span>
          <h1 style={{ fontSize: '38px', marginTop: '8px', marginBottom: '16px' }}>
            Automating Healthcare Appointments for Modern Hospitals & Clinics
          </h1>
          <p style={{ fontSize: '17px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            CarePulse is an academic-standard 3-tier Software Engineering project designed to streamline patient-doctor interactions, eliminate waiting queues, and guarantee conflict-free medical appointment scheduling.
          </p>
        </div>

        <div className="grid-3" style={{ marginBottom: '60px' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: 'var(--primary-100)', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
              <Layers size={28} />
            </div>
            <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>3-Tier Architecture</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              Built using React.js Single Page Application on the frontend, Node.js + Express REST API on the backend, and MongoDB database persistence.
            </p>
          </div>

          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: 'var(--primary-100)', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
              <Shield size={28} />
            </div>
            <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>Role-Based Access Control</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              Strict JWT-authenticated roles separating Patient features, Doctor schedule management, and Admin oversight.
            </p>
          </div>

          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: 'var(--primary-100)', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
              <Award size={28} />
            </div>
            <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>Zero Double-Booking</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              Atomic compound index locking on doctor, date, and time ensures no two patients can book the same slot simultaneously.
            </p>
          </div>
        </div>

        {/* Project Tech Stack Details */}
        <div className="card" style={{ padding: '40px', backgroundColor: '#ffffff' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '20px', textAlign: 'center' }}>Technology Stack Specification</h2>
          <div className="grid-2">
            <div>
              <h4 style={{ color: 'var(--primary-700)', marginBottom: '10px' }}>Frontend Layer</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
                <li><CheckCircle2 size={16} style={{ color: 'var(--primary-600)', display: 'inline', marginRight: '6px' }} /> React.js v18 SPA & Vite Bundler</li>
                <li><CheckCircle2 size={16} style={{ color: 'var(--primary-600)', display: 'inline', marginRight: '6px' }} /> React Router v6 Client-side Navigation</li>
                <li><CheckCircle2 size={16} style={{ color: 'var(--primary-600)', display: 'inline', marginRight: '6px' }} /> Axios HTTP Client with JWT Interceptors</li>
                <li><CheckCircle2 size={16} style={{ color: 'var(--primary-600)', display: 'inline', marginRight: '6px' }} /> Custom Vanilla CSS Healthcare Design System</li>
              </ul>
            </div>

            <div>
              <h4 style={{ color: 'var(--primary-700)', marginBottom: '10px' }}>Backend & Database Layer</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
                <li><CheckCircle2 size={16} style={{ color: 'var(--primary-600)', display: 'inline', marginRight: '6px' }} /> Node.js & Express.js RESTful API Framework</li>
                <li><CheckCircle2 size={16} style={{ color: 'var(--primary-600)', display: 'inline', marginRight: '6px' }} /> JSON Web Tokens (JWT) & bcrypt Hashing</li>
                <li><CheckCircle2 size={16} style={{ color: 'var(--primary-600)', display: 'inline', marginRight: '6px' }} /> MongoDB Document Store & Mongoose ODM</li>
                <li><CheckCircle2 size={16} style={{ color: 'var(--primary-600)', display: 'inline', marginRight: '6px' }} /> Partial Unique Compound Indexes for Slot Locking</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
