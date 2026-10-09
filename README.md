# Medical Appointment Booking System (CarePulse)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18-blue.svg)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-v6.0%2B-emerald.svg)](https://www.mongodb.com/)

A modern, full-stack college-level Software Engineering academic project for booking medical appointments online with zero double-booking concurrency protection, role-based access control (RBAC), and responsive healthcare user experience.

---

## 1. Project Overview

The **Medical Appointment Booking System (MABS)** bridges the communication gap between patients, specialist doctors, and clinic administrators. It replaces inefficient manual clinic queues and phone reservations with an automated 24/7 web platform.

### Core Highlights
- **Conflict-Free Scheduling:** Server-side atomic validation prevents double bookings for the exact same doctor, date, and time slot.
- **Role-Based Access Control (RBAC):** Tailored interfaces and API guards for **Patient**, **Doctor**, and **Admin** roles.
- **Transparent Doctor Discovery:** Filter specialist doctors by medical category, qualification, experience, and consultation fee.
- **Appointment Status Lifecycle:** Real-time state transitions (`Pending` $\rightarrow$ `Confirmed` / `Rejected` $\rightarrow$ `Completed` / `Cancelled`).

---

## 2. Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React.js v18 (Vite) | Single Page Application (SPA) User Interface |
| | React Router v6 | Client-side view routing & protected route guards |
| | Axios | HTTP REST client with JWT interceptors |
| | Vanilla CSS | Custom Healthcare Design System & Token framework |
| | Lucide React | Modern healthcare UI icons |
| **Backend** | Node.js & Express.js | 3-Tier RESTful API Web Server |
| | JSON Web Tokens (JWT) | Stateless authentication & role authorization |
| | bcryptjs | Secure password hashing (salt factor 10) |
| **Database** | MongoDB | Document database store |
| | Mongoose ODM | Object Data Modeling with compound index slot locks |

---

## 3. System Architecture & Folder Structure

### 3.1 3-Layer Architecture
```
 Patient / Doctor / Admin
          │
          ▼ (HTTPS / REST API)
   React.js Client (client/)
          │ (JSON over HTTP)
          ▼
   Express.js API (server/)
          │ (Mongoose ODM)
          ▼
   MongoDB Database
```

### 3.2 Directory Layout
```
Medical-Appointment-Booking-System/
 ├── client/                         # React Frontend SPA (Vite)
 │   ├── src/
 │   │   ├── assets/css/main.css     # Design tokens & Healthcare UI styles
 │   │   ├── components/             # Reusable UI components
 │   │   ├── context/AuthContext.jsx # Global Authentication Context
 │   │   ├── layouts/                # MainLayout & DashboardLayout
 │   │   ├── pages/                  # Public, Patient, Doctor & Admin Pages
 │   │   ├── services/               # Axios API Services
 │   │   ├── App.jsx                 # Router Configuration
 │   │   └── main.jsx                # React Entry point
 │   └── vite.config.js
 │
 ├── server/                         # Node.js + Express REST API
 │   ├── config/db.js                # Mongoose Database Connection
 │   ├── controllers/                # Request Handling & Business Rules
 │   ├── middleware/                 # JWT Auth & Error Handling
 │   ├── models/                     # Mongoose Schemas (User, Doctor, Patient, Appt, Spec)
 │   ├── routes/                     # Express Endpoint Routers
 │   ├── utils/seedData.js           # Initial Database Seeder
 │   ├── server.js                   # Express App Entry Point
 │   └── .env                        # Server Environment Configuration
 │
 └── docs/                           # Academic Project Documentation
     ├── PHASE1_REQUIREMENTS_AND_ARCHITECTURE.md
     ├── PHASE2_DATABASE_DESIGN.md
     ├── PHASE3_UML_DIAGRAMS.md
     ├── POSTMAN_TESTING_PLAN.md
     └── JIRA_PROJECT_TRACKING.md
```

---

## 4. User Roles & Access Control Matrix

| System Module / Feature | PATIENT | DOCTOR | ADMIN |
|---|:---:|:---:|:---:|
| Self Registration & Login | ✅ | ❌ (Created by Admin) | ❌ (Pre-seeded) |
| Search Doctors & Specializations | ✅ | ✅ | ✅ |
| Book Appointment Slot | ✅ | ❌ | ❌ |
| View Own Appointments | ✅ | ✅ | ✅ (View All) |
| Accept / Reject Requests | ❌ | ✅ | ✅ |
| Manage Available Time Slots | ❌ | ✅ | ✅ |
| Manage Doctors & Specializations | ❌ | ❌ | ✅ |

---

## 5. Installation & Setup Guide

### 5.1 Prerequisites
- **Node.js** (v18.x or v20.x installed)
- **MongoDB** (Local MongoDB server running on port 27017 or MongoDB Atlas connection URI)

### 5.2 Step 1: Clone Repository
```bash
git clone https://github.com/your-username/medical-appointment-booking-system.git
cd medical-appointment-booking-system
```

### 5.3 Step 2: Backend Setup
```bash
cd server
npm install
```

Configure `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/medical_appointment_db
JWT_SECRET=super_secret_jwt_key_medical_appointment_2026_college_project
JWT_EXPIRE=30d
NODE_ENV=development
```

### 5.4 Step 3: Seed Database (Demo Data)
Populate specializations, admin, doctors, patients, and test appointments:
```bash
npm run seed
```

### 5.5 Step 4: Start Backend Server
```bash
npm run dev
# Server active on http://localhost:5000
```

### 5.6 Step 5: Frontend Setup
In a new terminal window:
```bash
cd client
npm install
npm run dev
# Frontend active on http://localhost:5173
```

---

## 6. Pre-Configured Demo Accounts for Viva Evaluation

| Role | Email | Password | Access Capabilities |
|---|---|---|---|
| **Admin** | `admin@medicalapp.com` | `admin123` | Doctor CRUD, Patient list, Specializations, All Appointments |
| **Doctor** | `dr.robert@medicalapp.com` | `doctor123` | Doctor Dashboard, Accept/Reject Requests, Time Slot Manager |
| **Patient** | `john.doe@gmail.com` | `patient123` | Doctor Search, 6-Step Booking Wizard, Appointment History |

---

## 7. REST API Endpoints Summary

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Patient Registration
- `POST /api/auth/login` — Account Login
- `GET /api/auth/me` — Current User Token Verification

### Doctor Management (`/api/doctors`)
- `GET /api/doctors` — Public: Get Doctors (with `search` & `specialization` filters)
- `GET /api/doctors/:id` — Public: Get Doctor Profile & Slots
- `POST /api/doctors` — Admin: Create Doctor Account
- `PUT /api/doctors/:id` — Doctor/Admin: Update Profile Details & Availability

### Appointments (`/api/appointments`)
- `POST /api/appointments` — Patient: Book Slot (with Double-Booking Lock)
- `GET /api/appointments` — Role-based: List Appointments
- `PUT /api/appointments/:id/status` — Doctor/Admin: Update Status (`Confirmed`, `Rejected`, `Completed`)
- `DELETE /api/appointments/:id` — Patient/Admin: Cancel Appointment

---

## 8. Student Viva Defense Q&A Guide

1. **Why 3-Tier Architecture?**  
   *Answer:* Decouples UI (React), business rules (Express API), and database persistence (MongoDB). Enhances system security, maintainability, and modular scalability.

2. **How is double booking prevented?**  
   *Answer:* The system applies an atomic query check before saving: `Appointment.findOne({ doctorId, appointmentDate, appointmentTime, status: { $in: ['Pending', 'Confirmed'] } })`. In addition, a Mongoose partial unique index on `{ doctorId: 1, appointmentDate: 1, appointmentTime: 1 }` guarantees zero duplicate active bookings at the database level.

3. **How does Role-Based Access Control (RBAC) work?**  
   *Answer:* When a user logs in, Express signs a JWT payload containing `{ id, role }`. The `authorize('ADMIN')` middleware checks the token role against permitted execution paths. The React frontend uses a `ProtectedRoute` component to prevent unauthorized route navigation.

---

## 9. Future Enhancements

- **Online Payment Integration:** Stripe/Razorpay gateway for prepayment of consultation fees.
- **Telemedicine Video Call:** Integrated WebRTC video room for remote doctor consultations.
- **SMS & Email Notifications:** Automated Twilio/Nodemailer alerts upon booking confirmation.

---

## 10. License

This project is open-source under the [MIT License](LICENSE).
