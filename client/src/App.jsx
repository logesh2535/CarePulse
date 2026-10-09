import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public Pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import DoctorList from './pages/public/DoctorList';
import DoctorDetails from './pages/public/DoctorDetails';
import Login from './pages/public/Login';
import Register from './pages/public/Register';

// Patient Pages
import PatientDashboard from './pages/patient/PatientDashboard';
import BookAppointment from './pages/patient/BookAppointment';
import MyAppointments from './pages/patient/MyAppointments';
import Profile from './pages/patient/Profile';

// Doctor Pages
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorAppointments from './pages/doctor/DoctorAppointments';
import AvailabilityManager from './pages/doctor/AvailabilityManager';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageDoctors from './pages/admin/ManageDoctors';
import ManagePatients from './pages/admin/ManagePatients';
import Specializations from './pages/admin/Specializations';
import ManageAppointments from './pages/admin/ManageAppointments';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          {/* Public Layout Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/doctors" element={<DoctorList />} />
            <Route path="/doctors/:id" element={<DoctorDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Protected Patient Routes */}
          <Route element={<ProtectedRoute allowedRoles={['PATIENT']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/patient/dashboard" element={<PatientDashboard />} />
              <Route path="/patient/book/:doctorId?" element={<BookAppointment />} />
              <Route path="/patient/appointments" element={<MyAppointments />} />
              <Route path="/patient/profile" element={<Profile />} />
            </Route>
          </Route>

          {/* Protected Doctor Routes */}
          <Route element={<ProtectedRoute allowedRoles={['DOCTOR']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
              <Route path="/doctor/appointments" element={<DoctorAppointments />} />
              <Route path="/doctor/availability" element={<AvailabilityManager />} />
            </Route>
          </Route>

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/doctors" element={<ManageDoctors />} />
              <Route path="/admin/patients" element={<ManagePatients />} />
              <Route path="/admin/specializations" element={<Specializations />} />
              <Route path="/admin/appointments" element={<ManageAppointments />} />
            </Route>
          </Route>

          {/* Catch-all Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
