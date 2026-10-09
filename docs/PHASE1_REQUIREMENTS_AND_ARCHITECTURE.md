# Phase 1: Requirement Analysis & System Architecture
## Project Title: Medical Appointment Booking System
**Document Type:** Software Requirement Specification (SRS) & Architecture Plan  
**Target Audience:** Academic Evaluators, Software Architecture Review, Viva Presentation  

---

## 1. Requirement Analysis

### 1.1 Introduction
The **Medical Appointment Booking System (MABS)** is a web-based healthcare management application designed to bridge the communication gap between patients and healthcare providers. It provides an automated, centralized platform allowing patients to search for qualified doctors, inspect real-time slot availability, and book appointments seamlessly. Simultaneously, doctors can manage schedule slots and appointment requests, while administrators exercise full system oversight.

### 1.2 Problem Statement
In traditional manual healthcare booking processes, patients face numerous difficulties:
- Long queue waiting times at clinics and hospitals.
- Lack of visibility into real-time doctor availability and specialization schedules.
- Inefficient phone-based scheduling leading to double-bookings or human errors.
- Difficulty for patients in discovering specialist doctors based on qualifications and consultation fees.
- Absence of a centralized digital record for tracking appointment history and status.

### 1.3 Existing System & Its Disadvantages
**Existing System:** Manual paper-based booking or phone call reservations handled by front-desk receptionists.

**Disadvantages:**
1. **High Inefficiency:** Receptionists must manually check paper logs or spreadsheets.
2. **Double Booking Risk:** High probability of scheduling multiple patients for the same time slot.
3. **No 24/7 Availability:** Patients can only schedule appointments during clinic operating hours.
4. **Lack of Transparency:** Patients cannot view doctor qualifications, consultation fees, or real-time available slots beforehand.
5. **Data Loss & Inaccuracy:** Paper records are prone to physical damage, misplacement, and confidentiality breaches.

### 1.4 Proposed System & Its Advantages
**Proposed System:** A modern 3-Tier Web Application built using React.js, Node.js, Express.js, and MongoDB.

**Advantages:**
1. **24/7 Online Booking:** Patients can search and reserve appointment slots anytime from any device.
2. **Zero Double-Booking:** Database-level transactional validation prevents duplicate bookings for the exact doctor, date, and time.
3. **Transparent Doctor Profiles:** Comprehensive visibility into doctor specializations, qualifications, experience, and consultation fees.
4. **Role-Based Workflows:** Tailored dashboards for Patients, Doctors, and Administrators.
5. **Real-time Status Updates:** Clear lifecycle tracking (`Pending` → `Confirmed` / `Rejected` → `Completed` / `Cancelled`).

### 1.5 Project Objectives
- To automate medical appointment scheduling and reduce administrative overhead.
- To implement role-based access control (RBAC) across Patient, Doctor, and Admin roles.
- To prevent double booking using server-side slot availability checks.
- To provide a modern, responsive, healthcare-themed user interface accessible on Desktop, Tablet, and Mobile devices.
- To establish a RESTful API architecture following clean coding practices.

### 1.6 Scope
**In-Scope:**
- User Registration, Authentication (JWT), and Password Hashing (bcrypt).
- Patient Doctor Search with Specialization and Availability filtering.
- Appointment Booking, Approval/Rejection workflow, Cancellation, and History tracking.
- Doctor Schedule and Availability Slot Management.
- Admin Management of Doctors, Patients, Specializations, and System Appointments.

**Out-of-Scope (Future Enhancements):**
- Online Payment Gateway Integration (Stripe/Razorpay).
- Real-time Telemedicine Video Consultations (WebRTC).
- Automated SMS/Email Gateway Notifications.

---

## 2. System Requirements

### 2.1 Functional Requirements
- **FR-1 Authentication:** Users can register as Patients, login securely with credentials, receive a JWT token, and logout.
- **FR-2 Doctor Discovery:** Patients can search doctors by name and filter by specialization and available dates.
- **FR-3 Slot Management:** Doctors can define daily available time slots (e.g., 09:00 AM - 09:30 AM).
- **FR-4 Booking Process:** Patients can select a doctor, date, time slot, provide a reason, and submit a booking request.
- **FR-5 Double Booking Prevention:** System must reject booking attempts if the doctor is already booked for that specific slot on that date.
- **FR-6 Appointment Decisioning:** Doctors can accept (`Confirmed`) or decline (`Rejected`) pending appointments.
- **FR-7 Appointment Cancellation:** Patients can cancel upcoming appointments before the scheduled date.
- **FR-8 Admin Management:** Admins can create/edit/delete specializations, manage doctor/patient accounts, and monitor all system appointments.

### 2.2 Non-Functional Requirements
- **NFR-1 Security:** Passwords hashed with bcrypt (salt factor 10); API endpoints protected with JWT middleware; strict CORS enabled.
- **NFR-2 Performance:** API response time < 300ms for standard queries; optimized MongoDB indexes for fast search.
- **NFR-3 Reliability:** High data consistency preventing race conditions during concurrent bookings.
- **NFR-4 Usability:** Intuitive mobile-first UI built with responsive layout grids, visual status indicators, and clear feedback alerts.
- **NFR-5 Maintainability:** Clean modular code structure adhering to standard MVC/3-tier software architecture.

### 2.3 Hardware & Software Requirements

| Category | Requirement | Specification |
|---|---|---|
| **Hardware** | Processor | Intel Core i3 / AMD Ryzen 3 or higher |
| | RAM | 4 GB Minimum (8 GB Recommended) |
| | Disk Space | 2 GB available storage |
| **Software** | Operating System | Windows 10/11, macOS, or Linux |
| | Frontend Engine | Node.js (v18.x or v20.x), React.js v18 |
| | Backend Engine | Express.js v4.x |
| | Database | MongoDB (Local Community Server v6+ or MongoDB Atlas) |
| | IDE / Tools | Visual Studio Code / Antigravity IDE, Postman |
| | Version Control | Git & GitHub |

---

## 3. User Roles & Access Control Matrix

| Permission / Action | PATIENT | DOCTOR | ADMIN |
|---|:---:|:---:|:---:|
| Self Registration & Login | ✅ | ❌ (Created by Admin/Self) | ❌ (Pre-seeded / Protected) |
| Search Doctors & Specializations | ✅ | ✅ | ✅ |
| Book Appointment | ✅ | ❌ | ❌ |
| Cancel Own Appointment | ✅ | ❌ | ✅ |
| View Own Appointments | ✅ | ✅ | ✅ (View All) |
| Accept / Reject Appointments | ❌ | ✅ | ✅ |
| Manage Available Time Slots | ❌ | ✅ | ✅ |
| Manage Specializations | ❌ | ❌ | ✅ |
| Manage Doctor & Patient Profiles | Own Profile | Own Profile | Full CRUD All Users |

---

## 4. Module Decomposition

```
Medical Appointment Booking System
 ├── A. Authentication Module
 │    ├── Registration & Password Validation
 │    └── JWT Login & Role Routing
 ├── B. Patient Module
 │    ├── Doctor & Specialization Search
 │    └── Patient Profile & History
 ├── C. Doctor Module
 │    ├── Slot & Schedule Management
 │    └── Appointment Requests Handling
 ├── D. Admin Module
 │    ├── Doctor & Patient CRUD
 │    └── Specialization CRUD
 └── E. Appointment Module
      ├── Validation & Double-Booking Lock
      └── Status Transitions (Pending/Confirmed/etc)
```

---

## 5. Database Entities & Schemas Overview

1. **User Schema:** Base authentication account containing `name`, `email`, `password`, `role` (`PATIENT`, `DOCTOR`, `ADMIN`), `phone`, `createdAt`.
2. **Doctor Schema:** Linked to User via `userId`, contains `specialization` (Ref Specialization), `qualification`, `experience`, `consultationFee`, `description`, `profileImage`, `availability` (Array of days & time slots).
3. **Patient Schema:** Linked to User via `userId`, contains `dateOfBirth`, `gender`, `address`, `bloodGroup`, `medicalInformation`.
4. **Specialization Schema:** Contains `name`, `description`, `icon`, `isActive`.
5. **Appointment Schema:** Contains `patientId` (Ref Patient), `doctorId` (Ref Doctor), `appointmentDate`, `appointmentTime`, `reason`, `status` (`Pending`, `Confirmed`, `Completed`, `Cancelled`, `Rejected`), `createdAt`.
6. **Availability / TimeSlot Schema:** Helper schema for tracking doctor availability intervals per day.

---

## 6. REST API Endpoint Blueprint

### 6.1 Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new patient
- `POST /api/auth/login` — Authenticate user and return JWT + role info
- `GET /api/auth/me` — Fetch current logged-in user details

### 6.2 Doctor Management (`/api/doctors`)
- `GET /api/doctors` — Public: Get all doctors with filters (`specialization`, `search`, `availability`)
- `GET /api/doctors/:id` — Public: Get doctor detail profile with slots
- `POST /api/doctors` — Admin: Create new doctor account & profile
- `PUT /api/doctors/:id` — Doctor/Admin: Update doctor profile details
- `DELETE /api/doctors/:id` — Admin: Deactivate/Remove doctor profile
- `PUT /api/doctors/:id/availability` — Doctor/Admin: Update time slots

### 6.3 Patient Management (`/api/patients`)
- `GET /api/patients/:id` — Patient/Admin: Get patient profile
- `PUT /api/patients/:id` — Patient/Admin: Update patient profile

### 6.4 Specializations (`/api/specializations`)
- `GET /api/specializations` — Public: List active specializations
- `POST /api/specializations` — Admin: Add specialization
- `PUT /api/specializations/:id` — Admin: Update specialization
- `DELETE /api/specializations/:id` — Admin: Delete specialization

### 6.5 Appointments (`/api/appointments`)
- `POST /api/appointments` — Patient: Book appointment (with conflict check)
- `GET /api/appointments` — Role-based: List appointments (Patient sees own, Doctor sees assigned, Admin sees all)
- `GET /api/appointments/:id` — View appointment details
- `PUT /api/appointments/:id/status` — Doctor/Admin: Update status (`Confirmed`, `Rejected`, `Completed`, `Cancelled`)
- `DELETE /api/appointments/:id` — Patient/Admin: Cancel appointment

---

## 7. UML Diagram Blueprints (ARGO UML Standard)

1. **Use Case Diagram:** Defines system boundary with Patient, Doctor, Admin actors interacting with clear use cases (`<<include>>` for Auth, `<<extend>>` for cancellation reasons).
2. **Class Diagram:** Detailed object-oriented model specifying attributes, methods, inheritance (`User` base class for `Patient`, `Doctor`, `Admin`), and associations (1-to-1, 1-to-Many).
3. **Sequence Diagrams:**
   - *Patient Login Workflow*
   - *Doctor Search & Filter Workflow*
   - *Appointment Booking & Collision Prevention Workflow*
   - *Doctor Approval/Rejection Workflow*
4. **Activity Diagram:** Swimlane activity flow for appointment booking step-by-step decision trees.
5. **State Chart Diagram:** State transition model for the `Appointment` entity lifecycle (`New` → `Pending` → `Confirmed`/`Rejected` → `Completed`/`Cancelled`).
6. **Component Diagram:** Component structure showing React client components, Express Router/Controllers/Middleware, and MongoDB models.
7. **Deployment Diagram:** Hardware/Node topology showing Client Device, Web Browser, Node.js App Server, and MongoDB Database Server.

---

## 8. Complete System Architecture & Folder Layout

### 8.1 3-Layer System Architecture
1. **Presentation Layer (Frontend):** React SPA using React Router for view navigation, Context API for state management, Axios for REST communication, and Vanilla CSS for custom UI themes.
2. **Application / Business Logic Layer (Backend):** Node.js runtime executing Express.js HTTP web server, JWT authorization middleware, request validation controllers, and business rules (e.g., slot lock).
3. **Data Access & Storage Layer (Database):** MongoDB database server interacting via Mongoose ODM schemas, indexes, and transactional queries.

### 8.2 Standard Folder Structure

```
Medical-Appointment-Booking-System/
 ├── client/                         # React Frontend SPA
 │   ├── public/
 │   │   └── favicon.ico
 │   ├── src/
 │   │   ├── assets/                 # CSS, Icons, Static Images
 │   │   │   ├── css/
 │   │   │   │   └── main.css        # Global CSS variables & design tokens
 │   │   │   └── images/
 │   │   ├── components/             # Reusable UI components
 │   │   │   ├── common/             # Navbar, Footer, LoadingSpinner, Modal, Badge
 │   │   │   ├── doctor/             # DoctorCard, DoctorFilter, SlotPicker
 │   │   │   └── appointment/        # AppointmentCard, StatusBadge
 │   │   ├── context/                # React Context (AuthContext)
 │   │   ├── hooks/                  # Custom React hooks (useAuth, useFetch)
 │   │   ├── layouts/                # MainLayout, DashboardLayout
 │   │   ├── pages/                  # Page Views
 │   │   │   ├── public/             # Home, About, DoctorList, DoctorDetails, Login, Register
 │   │   │   ├── patient/            # PatientDashboard, BookAppointment, MyAppointments, Profile
 │   │   │   ├── doctor/             # DoctorDashboard, DoctorAppointments, AvailabilityManager, Profile
 │   │   │   └── admin/              # AdminDashboard, ManageDoctors, ManagePatients, ManageAppointments, Specializations
 │   │   ├── services/               # API service helpers (axios instance & API calls)
 │   │   │   ├── api.js
 │   │   │   ├── authService.js
 │   │   │   ├── doctorService.js
 │   │   │   └── appointmentService.js
 │   │   ├── App.jsx                 # Main Router Configuration
 │   │   └── main.jsx                # React Entry Point
 │   ├── package.json
 │   └── vite.config.js
 │
 ├── server/                         # Node.js + Express.js Backend
 │   ├── config/                     # Database connection & env setup
 │   │   └── db.js
 │   ├── controllers/                # Request handling logic
 │   │   ├── authController.js
 │   │   ├── doctorController.js
 │   │   ├── patientController.js
 │   │   ├── appointmentController.js
 │   │   └── specializationController.js
 │   ├── middleware/                 # Express Middlewares
 │   │   ├── authMiddleware.js       # JWT Verification & RBAC Guard
 │   │   ├── errorMiddleware.js      # Centralized Error Handler
 │   │   └── validationMiddleware.js # Input Validator
 │   ├── models/                     # Mongoose Schemas
 │   │   ├── User.js
 │   │   ├── Doctor.js
 │   │   ├── Patient.js
 │   │   ├── Specialization.js
 │   │   └── Appointment.js
 │   ├── routes/                     # Express API Routes
 │   │   ├── authRoutes.js
 │   │   ├── doctorRoutes.js
 │   │   ├── patientRoutes.js
 │   │   ├── appointmentRoutes.js
 │   │   └── specializationRoutes.js
 │   ├── utils/                      # Helper utilities
 │   │   ├── generateToken.js
 │   │   └── seedData.js             # Initial database seeder
 │   ├── .env.example                # Environment variables template
 │   ├── .env                        # Local environment variables
 │   ├── package.json
 │   └── server.js                   # Express App Entry Point
 │
 ├── docs/                           # Project Documentation & UML
 │   ├── PHASE1_REQUIREMENTS_AND_ARCHITECTURE.md
 │   ├── POSTMAN_TESTING_PLAN.md
 │   ├── JIRA_PROJECT_TRACKING.md
 │   └── UML_DIAGRAMS.md
 └── README.md                       # Main Project Documentation
```

---

## 9. 16-Phase Development Roadmap

| Phase | Description | Deliverable | Status |
|---|---|---|:---:|
| **PHASE 1** | Requirement Analysis & Architecture Blueprint | SRS Document & Architectural Spec | **COMPLETED** |
| **PHASE 2** | Database Design & Mongoose Schemas | Data Models & Double-Booking Validation Logic | Pending |
| **PHASE 3** | UML Diagrams Specification | 7 Argo UML Diagram Specifications & ASCII/Mermaid Renderings | Pending |
| **PHASE 4** | Project Folder Structure Initialization | `client/` & `server/` Boilerplates & Environment Config | Pending |
| **PHASE 5** | Backend REST API Core Development | Express Server, Routes, Controllers, & Seed Data Script | Pending |
| **PHASE 6** | Frontend Design Token System & Layouts | CSS Tokens, Navbar, Sidebar, Healthcare Design Tokens | Pending |
| **PHASE 7** | Authentication & RBAC Frontend Integration | Login, Register, JWT Storage, Auth Context & Route Guards | Pending |
| **PHASE 8** | Patient Module Frontend Implementation | Doctor Search, Specialization Filter, Patient Dashboard | Pending |
| **PHASE 9** | Doctor Module Frontend Implementation | Doctor Dashboard, Slot Manager, Patient Request Approvals | Pending |
| **PHASE 10** | Admin Module Frontend Implementation | Doctor/Patient CRUD UI, Specialization Management | Pending |
| **PHASE 11** | Step-by-Step Appointment Booking Flow | 6-Step Booking Wizard with Slot Locking & Conflicts | Pending |
| **PHASE 12** | Postman API Test Suite | Importable Postman Test Plan & Environment Setup | Pending |
| **PHASE 13** | Bug Fixing & Exception Handling | Error Boundary, Validation Feedback, Fallbacks | Pending |
| **PHASE 14** | End-to-End System Testing & Validation | Verification of RBAC, Edge Cases & Slot Double-Booking | Pending |
| **PHASE 15** | Comprehensive Documentation | Complete README.md & Academic Viva Guide | Pending |
| **PHASE 16** | Production Build & Deployment Guide | Static Client Build & Production Server Script Setup | Pending |

---

## 10. Student Viva Preparation Notes (Phase 1 Focus)

When asked about **Phase 1 (Requirements & Architecture)** during project viva:

1. **Why 3-Tier Architecture?**  
   *Answer:* It decouples the user interface (React), business logic (Express), and database persistence (MongoDB). This improves security (database is not directly exposed), scalability (layers can be optimized independently), and code maintainability.

2. **How does the system prevent double bookings?**  
   *Answer:* Before saving an appointment record to MongoDB, the backend executes an atomic check: `Appointment.findOne({ doctorId, appointmentDate, appointmentTime, status: { $nin: ['Cancelled', 'Rejected'] } })`. If an active appointment exists for that slot, the server rejects the request with HTTP status `400 Bad Request`.

3. **Why use JWT over traditional sessions?**  
   *Answer:* JSON Web Tokens (JWT) are stateless. The backend doesn't need to store session state in server memory, making the API scalable and easily accessible from single-page web apps or mobile applications.
