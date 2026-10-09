import React, { useState, useEffect } from 'react';
import { patientService } from '../../services/patientService';
import { Users, User, Phone, MapPin, Calendar, Heart } from 'lucide-react';

const ManagePatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await patientService.getPatients();
      if (res.success) {
        setPatients(res.data);
      }
    } catch (err) {
      console.error('Failed to load patients list:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800 }}>Registered Patient Records</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Inspect all registered patient accounts, demographic details, and medical backgrounds.
        </p>
      </div>

      {loading ? (
        <div className="spinner-container"><div className="spinner"></div></div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Contact Info</th>
                  <th>Gender</th>
                  <th>Blood Group</th>
                  <th>Address</th>
                  <th>Medical Notes</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((pat) => (
                  <tr key={pat._id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{pat.userId?.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{pat.userId?.email}</div>
                    </td>
                    <td>{pat.userId?.phone}</td>
                    <td>{pat.gender}</td>
                    <td><span style={{ fontWeight: 700, color: 'var(--accent-red)' }}>{pat.bloodGroup || 'N/A'}</span></td>
                    <td>{pat.address || 'N/A'}</td>
                    <td style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '250px' }}>
                      {pat.medicalInformation || 'None'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePatients;
