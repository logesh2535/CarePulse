import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { doctorService } from '../../services/doctorService';
import { patientService } from '../../services/patientService';
import { specializationService } from '../../services/specializationService';
import { appointmentService } from '../../services/appointmentService';
import { Stethoscope, Users, Layers, Calendar, ShieldCheck, PlusCircle } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    doctors: 0,
    patients: 0,
    specializations: 0,
    appointments: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const [docRes, patRes, specRes, apptRes] = await Promise.all([
          doctorService.getDoctors(),
          patientService.getPatients(),
          specializationService.getSpecializations(),
          appointmentService.getAppointments()
        ]);

        setStats({
          doctors: docRes.count || 0,
          patients: patRes.count || 0,
          specializations: specRes.count || 0,
          appointments: apptRes.count || 0
        });
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  return (
    <div>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        padding: '28px',
        border: '1px solid var(--border-color)',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary-700)', fontSize: '13px', fontWeight: 700 }}>
          <ShieldCheck size={18} /> FULL SYSTEM ADMINISTRATION
        </div>
        <h1 style={{ fontSize: '26px', fontWeight: 800, marginTop: '4px' }}>Administrator Command Center</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '2px' }}>
          Monitor system metrics, manage medical practitioners, patients, specializations, and global bookings.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid-4" style={{ marginBottom: '30px' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            backgroundColor: 'var(--primary-100)', color: 'var(--primary-800)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Stethoscope size={24} />
          </div>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Doctors
            </span>
            <h3 style={{ fontSize: '24px', fontWeight: 800 }}>{stats.doctors}</h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            backgroundColor: '#e0e7ff', color: '#3730a3',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Users size={24} />
          </div>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Patients
            </span>
            <h3 style={{ fontSize: '24px', fontWeight: 800 }}>{stats.patients}</h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            backgroundColor: '#d1fae5', color: '#065f46',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Layers size={24} />
          </div>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Specializations
            </span>
            <h3 style={{ fontSize: '24px', fontWeight: 800 }}>{stats.specializations}</h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            backgroundColor: '#fef3c7', color: '#92400e',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Calendar size={24} />
          </div>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Total Appointments
            </span>
            <h3 style={{ fontSize: '24px', fontWeight: 800 }}>{stats.appointments}</h3>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Administrative Modules</h3>
      <div className="grid-2">
        <Link to="/admin/doctors" className="card card-hover" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ fontSize: '18px', marginBottom: '4px' }}>Manage Doctors & Credentials</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Create new doctor profiles, assign specializations, and manage consultation fees.</p>
            </div>
            <PlusCircle size={24} style={{ color: 'var(--primary-600)' }} />
          </div>
        </Link>

        <Link to="/admin/specializations" className="card card-hover" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ fontSize: '18px', marginBottom: '4px' }}>Manage Specializations</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Add or edit medical departments and categories.</p>
            </div>
            <Layers size={24} style={{ color: 'var(--primary-600)' }} />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
