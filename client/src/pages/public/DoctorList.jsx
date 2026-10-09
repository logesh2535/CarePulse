import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { doctorService } from '../../services/doctorService';
import { specializationService } from '../../services/specializationService';
import DoctorCard from '../../components/doctor/DoctorCard';
import { Search, Filter, Stethoscope, RefreshCw } from 'lucide-react';

const DoctorList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpec, setSelectedSpec] = useState(searchParams.get('specialization') || '');

  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const res = await specializationService.getSpecializations();
        if (res.success) setSpecializations(res.data);
      } catch (err) {
        console.error('Failed to load specializations:', err);
      }
    };
    fetchSpecializations();
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const params = {};
        if (selectedSpec) params.specialization = selectedSpec;
        if (searchQuery) params.search = searchQuery;

        const res = await doctorService.getDoctors(params);
        if (res.success) setDoctors(res.data);
      } catch (err) {
        console.error('Failed to load doctors:', err);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchDoctors, 300);
    return () => clearTimeout(debounceTimer);
  }, [selectedSpec, searchQuery]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSpec('');
    setSearchParams({});
  };

  return (
    <div className="section-padding" style={{ backgroundColor: 'var(--bg-slate)', minHeight: '80vh' }}>
      <div className="container">
        {/* Page Header */}
        <div style={{ marginBottom: '36px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 800 }}>Find & Book Specialist Doctors</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
            Browse through our verified medical specialists, inspect experience, consultation fees, and reserve your time slot.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="card" style={{ marginBottom: '30px', padding: '20px' }}>
          <div className="grid-3" style={{ alignItems: 'end' }}>
            {/* Search Input */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Search size={16} /> Search Doctor Name
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Dr. Robert, Dr. Sarah..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Specialization Filter */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Filter size={16} /> Filter by Specialization
              </label>
              <select
                className="form-select"
                value={selectedSpec}
                onChange={(e) => {
                  setSelectedSpec(e.target.value);
                  setSearchParams(e.target.value ? { specialization: e.target.value } : {});
                }}
              >
                <option value="">All Specializations</option>
                {specializations.map((spec) => (
                  <option key={spec._id} value={spec._id}>
                    {spec.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Button */}
            <div>
              <button
                onClick={handleResetFilters}
                className="btn btn-outline"
                style={{ width: '100%', borderColor: '#cbd5e1', color: '#64748b' }}
              >
                <RefreshCw size={16} /> Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Doctor Results Grid */}
        {loading ? (
          <div className="spinner-container">
            <div className="spinner"></div>
            <p style={{ color: 'var(--text-muted)' }}>Searching certified doctors...</p>
          </div>
        ) : doctors.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <Stethoscope size={48} style={{ color: 'var(--text-light)', marginBottom: '16px' }} />
            <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>No Doctors Found</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
              No doctor profile matches your search criteria. Try choosing a different specialization or clearing filters.
            </p>
            <button onClick={handleResetFilters} className="btn btn-primary btn-sm">
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid-3">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor._id} doctor={doctor} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorList;
