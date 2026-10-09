const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config({ path: '../.env' });

const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Specialization = require('../models/Specialization');
const Appointment = require('../models/Appointment');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/medical_appointment_db';
  await mongoose.connect(uri);
  console.log('[Seed DB Connected]:', uri);
};

const defaultAvailability = [
  { dayOfWeek: 'Monday', startTime: '09:00', endTime: '13:00', slotDurationMinutes: 30, isAvailable: true },
  { dayOfWeek: 'Tuesday', startTime: '09:00', endTime: '13:00', slotDurationMinutes: 30, isAvailable: true },
  { dayOfWeek: 'Wednesday', startTime: '10:00', endTime: '15:00', slotDurationMinutes: 30, isAvailable: true },
  { dayOfWeek: 'Thursday', startTime: '09:00', endTime: '13:00', slotDurationMinutes: 30, isAvailable: true },
  { dayOfWeek: 'Friday', startTime: '10:00', endTime: '14:00', slotDurationMinutes: 30, isAvailable: true }
];

const seedData = async () => {
  try {
    await connectDB();

    await User.deleteMany({});
    await Doctor.deleteMany({});
    await Patient.deleteMany({});
    await Specialization.deleteMany({});
    await Appointment.deleteMany({});

    console.log('[Seeding]: Cleared old data');

    // 1. Create Specializations
    const specsData = [
      { name: 'Cardiology', description: 'Heart, blood vessels, and cardiovascular healthcare.', icon: 'heart-pulse' },
      { name: 'Dermatology', description: 'Skin, hair, nails, and cosmetic treatments.', icon: 'sparkles' },
      { name: 'Pediatrics', description: 'Comprehensive medical care for infants, children, and teens.', icon: 'baby' },
      { name: 'General Physician', description: 'Primary health diagnosis, fever, and routine wellness care.', icon: 'stethoscope' },
      { name: 'Dentistry', description: 'Dental checkups, oral surgery, teeth whitening, and hygiene.', icon: 'smile' },
      { name: 'Neurology', description: 'Brain, spinal cord, and nervous system disorders.', icon: 'brain' }
    ];

    const insertedSpecs = await Specialization.insertMany(specsData);
    console.log(`[Seeding]: Created ${insertedSpecs.length} specializations`);

    const specMap = {};
    insertedSpecs.forEach(spec => {
      specMap[spec.name] = spec._id;
    });

    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const doctorPassword = await bcrypt.hash('doctor123', salt);
    const patientPassword = await bcrypt.hash('patient123', salt);

    // 2. Create Admin
    const adminUser = await User.create({
      name: 'System Administrator',
      email: 'admin@medicalapp.com',
      password: adminPassword,
      role: 'ADMIN',
      phone: '+1 (555) 019-2831'
    });
    console.log('[Seeding]: Created Admin Account (admin@medicalapp.com / admin123)');

    // 3. Create Doctors
    const doctorsList = [
      {
        name: 'Dr. Robert Chen',
        email: 'dr.robert@medicalapp.com',
        phone: '+1 (555) 234-5678',
        specialization: specMap['Cardiology'],
        qualification: 'MD, FACC - Senior Cardiologist',
        experience: 14,
        consultationFee: 120,
        description: 'Specialist in interventional cardiology, heart failure prevention, and hypertension management.',
        profileImage: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80'
      },
      {
        name: 'Dr. Sarah Jenkins',
        email: 'dr.sarah@medicalapp.com',
        phone: '+1 (555) 345-6789',
        specialization: specMap['Dermatology'],
        qualification: 'MBBS, MD (Dermatology)',
        experience: 9,
        consultationFee: 95,
        description: 'Board-certified dermatologist focusing on medical acne treatments, skin allergy, and laser therapies.',
        profileImage: 'https://images.unsplash.com/photo-1594824813566-78a9c8114f6b?w=400&auto=format&fit=crop&q=80'
      },
      {
        name: 'Dr. Michael Taylor',
        email: 'dr.michael@medicalapp.com',
        phone: '+1 (555) 456-7890',
        specialization: specMap['Pediatrics'],
        qualification: 'MD (Pediatrics), DCH',
        experience: 11,
        consultationFee: 85,
        description: 'Compassionate pediatrician dedicated to newborn growth tracking, child vaccination, and pediatric wellness.',
        profileImage: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=80'
      },
      {
        name: 'Dr. Emily Watson',
        email: 'dr.emily@medicalapp.com',
        phone: '+1 (555) 567-8901',
        specialization: specMap['General Physician'],
        qualification: 'MBBS, FRCP',
        experience: 7,
        consultationFee: 70,
        description: 'Experienced primary physician providing preventive care, diabetes management, and seasonal health consultations.',
        profileImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80'
      },
      {
        name: 'Dr. David Miller',
        email: 'dr.david@medicalapp.com',
        phone: '+1 (555) 678-9012',
        specialization: specMap['Dentistry'],
        qualification: 'BDS, MDS (Orthodontics)',
        experience: 10,
        consultationFee: 110,
        description: 'Expert dental surgeon offering root canal treatments, invisible aligners, teeth cleaning, and smile designing.',
        profileImage: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&auto=format&fit=crop&q=80'
      }
    ];

    const createdDoctorDocs = [];
    for (const docData of doctorsList) {
      const u = await User.create({
        name: docData.name,
        email: docData.email,
        password: doctorPassword,
        role: 'DOCTOR',
        phone: docData.phone
      });

      const d = await Doctor.create({
        userId: u._id,
        specialization: docData.specialization,
        qualification: docData.qualification,
        experience: docData.experience,
        consultationFee: docData.consultationFee,
        description: docData.description,
        profileImage: docData.profileImage,
        availability: defaultAvailability
      });

      createdDoctorDocs.push(d);
    }
    console.log(`[Seeding]: Created ${createdDoctorDocs.length} Doctors`);

    // 4. Create Patients
    const patientsList = [
      {
        name: 'John Doe',
        email: 'john.doe@gmail.com',
        phone: '+1 (555) 789-0123',
        gender: 'Male',
        dateOfBirth: '1992-06-15',
        address: '742 Evergreen Terrace, Springfield',
        bloodGroup: 'O+',
        medicalInfo: 'No known drug allergies. Mild hypertension.'
      },
      {
        name: 'Alice Smith',
        email: 'alice.smith@gmail.com',
        phone: '+1 (555) 890-1234',
        gender: 'Female',
        dateOfBirth: '1995-11-20',
        address: '123 Main Street, New York, NY',
        bloodGroup: 'A+',
        medicalInfo: 'Allergic to Penicillin.'
      }
    ];

    const createdPatientDocs = [];
    for (const patData of patientsList) {
      const u = await User.create({
        name: patData.name,
        email: patData.email,
        password: patientPassword,
        role: 'PATIENT',
        phone: patData.phone
      });

      const p = await Patient.create({
        userId: u._id,
        gender: patData.gender,
        dateOfBirth: new Date(patData.dateOfBirth),
        address: patData.address,
        bloodGroup: patData.bloodGroup,
        medicalInformation: patData.medicalInfo
      });

      createdPatientDocs.push(p);
    }
    console.log(`[Seeding]: Created ${createdPatientDocs.length} Patients`);

    // 5. Create Sample Appointments
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];

    await Appointment.create({
      patientId: createdPatientDocs[0]._id,
      doctorId: createdDoctorDocs[0]._id,
      appointmentDate: dateStr,
      appointmentTime: '10:00',
      reason: 'Regular cardiac health checkup and BP evaluation.',
      status: 'Pending'
    });

    await Appointment.create({
      patientId: createdPatientDocs[1]._id,
      doctorId: createdDoctorDocs[1]._id,
      appointmentDate: dateStr,
      appointmentTime: '11:30',
      reason: 'Skin rash inspection and dermatological prescription.',
      status: 'Confirmed'
    });

    console.log('[Seeding]: Created initial test appointments');
    console.log('=====================================================');
    console.log('SEEDING COMPLETE! Demo Credentials:');
    console.log('Admin:   admin@medicalapp.com / admin123');
    console.log('Doctor:  dr.robert@medicalapp.com / doctor123');
    console.log('Patient: john.doe@gmail.com / patient123');
    console.log('=====================================================');

    process.exit(0);
  } catch (error) {
    console.error('[Seeding Error]:', error);
    process.exit(1);
  }
};

seedData();
