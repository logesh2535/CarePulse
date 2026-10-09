# Phase 2: Database Design & Data Architecture
## Project Title: Medical Appointment Booking System
**Document Type:** Database Design & Schema Specification Document  
**Target Audience:** Database Administrators, Backend Engineers, Viva Examiners  

---

## 1. Database Architecture & Design Strategy

The **Medical Appointment Booking System (MABS)** utilizes **MongoDB** as its primary NoSQL database server, accessed via the **Mongoose** Object Data Modeling (ODM) library in Node.js.

### 1.1 Key Database Requirements
1. **Referential Integrity:** Enforce foreign key references (`ref`) between collections (User $\rightarrow$ Doctor, User $\rightarrow$ Patient, Doctor $\rightarrow$ Specialization, Appointment $\rightarrow$ Patient/Doctor).
2. **Conflict Prevention (Zero Double-Booking):** Create a unique compound database index on `(doctorId, appointmentDate, appointmentTime)` filtered for non-cancelled appointments.
3. **Optimized Query Performance:** Index frequently queried fields such as `email`, `role`, `specialization`, and `status`.
4. **Data Auditing:** Maintain standard timestamp fields (`createdAt`, `updatedAt`) across all entities.

---

## 2. Entity Relationship Diagram (ERD)

```
┌────────────────────────────────────────────────────────┐
│                        USER                            │
├────────────────────────────────────────────────────────┤
│ _id: ObjectId [PK]                                    │
│ name: String                                           │
│ email: String [Unique, Indexed]                        │
│ password: String [Hashed]                              │
│ role: Enum ['PATIENT', 'DOCTOR', 'ADMIN']              │
│ phone: String                                          │
│ createdAt: Date                                        │
└───────────────┬────────────────────────┬───────────────┘
                │ 1:1                    │ 1:1
                ▼                        ▼
┌───────────────────────────────┐  ┌──────────────────────────────────┐
│            PATIENT            │  │              DOCTOR              │
├───────────────────────────────┤  ├──────────────────────────────────┤
│ _id: ObjectId [PK]            │  │ _id: ObjectId [PK]               │
│ userId: ObjectId [FK -> User] │  │ userId: ObjectId [FK -> User]    │
│ dateOfBirth: Date             │  │ specialization: ObjectId [FK]    │
│ gender: Enum ['Male','Female']│  │ qualification: String            │
│ address: String               │  │ experience: Number (years)       │
│ medicalInformation: String    │  │ consultationFee: Number          │
└───────────────┬───────────────┘  │ description: String              │
                │                  │ profileImage: String             │
                │                  │ availability: Array[Slot]        │
                │                  └────────────────┬─────────────────┘
                │ 1:N                               │ 1:N
                ▼                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                             APPOINTMENT                             │
├─────────────────────────────────────────────────────────────────────┤
│ _id: ObjectId [PK]                                                  │
│ patientId: ObjectId [FK -> Patient]                                 │
│ doctorId: ObjectId [FK -> Doctor]                                   │
│ appointmentDate: String (YYYY-MM-DD)                                │
│ appointmentTime: String (HH:mm)                                     │
│ reason: String                                                      │
│ status: Enum ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'Rejected']
│ createdAt: Date                                                     │
└─────────────────────────────────────────────────────────────────────┘

                                ┌─────────────────────────────────────┐
                                │           SPECIALIZATION            │
                                ├─────────────────────────────────────┤
                                │ _id: ObjectId [PK]                  │
                                │ name: String [Unique]               │
                                │ description: String                 │
                                │ icon: String                        │
                                │ isActive: Boolean                   │
                                └─────────────────────────────────────┘
```

---

## 3. Mongoose Schema Definitions

### 3.1 User Schema (`server/models/User.js`)
Stores authentication credentials and base profile data for all system users.

```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters']
    },
    role: {
      type: String,
      enum: ['PATIENT', 'DOCTOR', 'ADMIN'],
      default: 'PATIENT'
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
```

---

### 3.2 Specialization Schema (`server/models/Specialization.js`)
Stores medical categories (e.g., Cardiology, Dermatology, Pediatrics).

```javascript
const mongoose = require('mongoose');

const specializationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Specialization name is required'],
      unique: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: 'stethoscope'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Specialization', specializationSchema);
```

---

### 3.3 Doctor Schema (`server/models/Doctor.js`)
Extends the User entity with professional medical details and daily available slots.

```javascript
const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
  dayOfWeek: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true
  },
  startTime: { type: String, required: true }, // e.g., "09:00"
  endTime: { type: String, required: true },   // e.g., "17:00"
  slotDurationMinutes: { type: Number, default: 30 },
  isAvailable: { type: Boolean, default: true }
});

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    specialization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Specialization',
      required: [true, 'Specialization is required']
    },
    qualification: {
      type: String,
      required: [true, 'Qualification is required'],
      trim: true
    },
    experience: {
      type: Number,
      required: [true, 'Years of experience required'],
      min: [0, 'Experience cannot be negative']
    },
    consultationFee: {
      type: Number,
      required: [true, 'Consultation fee required'],
      min: [0, 'Fee cannot be negative']
    },
    description: {
      type: String,
      default: ''
    },
    profileImage: {
      type: String,
      default: 'default-doctor.png'
    },
    availability: [timeSlotSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Doctor', doctorSchema);
```

---

### 3.4 Patient Schema (`server/models/Patient.js`)
Extends the User entity with patient medical history and personal demographic info.

```javascript
const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    dateOfBirth: {
      type: Date,
      required: false
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other', 'Unspecified'],
      default: 'Unspecified'
    },
    address: {
      type: String,
      default: ''
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'],
      default: 'Unknown'
    },
    medicalInformation: {
      type: String,
      default: 'No prior medical conditions reported.'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Patient', patientSchema);
```

---

### 3.5 Appointment Schema (`server/models/Appointment.js`)
Manages appointment requests, status lifecycles, and conflict locking.

```javascript
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true
    },
    appointmentDate: {
      type: String, // Stored as "YYYY-MM-DD" for exact string queries
      required: [true, 'Appointment date is required']
    },
    appointmentTime: {
      type: String, // Stored as "HH:mm" e.g., "10:30"
      required: [true, 'Appointment time is required']
    },
    reason: {
      type: String,
      required: [true, 'Reason for appointment is required'],
      trim: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'Rejected'],
      default: 'Pending'
    },
    adminNotes: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

// Compound Index to prevent double booking active slots
appointmentSchema.index(
  { doctorId: 1, appointmentDate: 1, appointmentTime: 1 },
  { unique: true, partialFilterExpression: { status: { $in: ['Pending', 'Confirmed'] } } }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
```

---

## 4. Double-Booking Prevention Logic & Transaction Rules

### 4.1 Business Rules
A doctor **cannot** have two active appointments at the exact same date and time slot.
Active appointment statuses: `Pending` and `Confirmed`.
Inactive appointment statuses: `Cancelled` and `Rejected` (which release the time slot back to the available pool).

### 4.2 Server-Side Atomic Query Logic
Before saving a new appointment in `appointmentController.js`, the API executes an explicit validation check:

```javascript
const existingAppointment = await Appointment.findOne({
  doctorId,
  appointmentDate,
  appointmentTime,
  status: { $in: ['Pending', 'Confirmed'] }
});

if (existingAppointment) {
  return res.status(400).json({
    success: false,
    message: 'This appointment slot is no longer available. Please select another slot.'
  });
}
```

---

## 5. Sample Seed Data

### 5.1 Specializations
1. **Cardiology:** Heart & Cardiovascular care
2. **Dermatology:** Skin, hair, and nail health
3. **Pediatrics:** Infant, child, and adolescent healthcare
4. **General Physician:** Primary diagnosis & wellness care
5. **Dentistry:** Dental, oral, and gum treatments
6. **Neurology:** Brain and nervous system specialists

### 5.2 Pre-configured Demo Accounts

| Role | Email | Default Password | Details |
|---|---|---|---|
| **Admin** | `admin@medicalapp.com` | `admin123` | Full system manager |
| **Doctor** | `dr.smith@medicalapp.com` | `doctor123` | Cardiologist, 12 yrs exp, Fee: $100 |
| **Doctor** | `dr.sarah@medicalapp.com` | `doctor123` | Dermatologist, 8 yrs exp, Fee: $80 |
| **Patient** | `john.doe@gmail.com` | `patient123` | Demo Patient account |

---

## 6. Viva Q&A Guide (Phase 2 Focus)

1. **Q: Why use a partialFilterExpression compound index on Appointment?**  
   *Answer:* The index `{ doctorId: 1, appointmentDate: 1, appointmentTime: 1 }` with `partialFilterExpression: { status: { $in: ['Pending', 'Confirmed'] } }` guarantees database-level uniqueness for active bookings. If an appointment is `Cancelled` or `Rejected`, the partial index ignores it, allowing another patient to reuse the released slot without DB index conflict.

2. **Q: Why store dates as YYYY-MM-DD strings in appointmentDate instead of UTC ISODate?**  
   *Answer:* Storing date as `YYYY-MM-DD` eliminates time-zone offset bugs (e.g., 00:00 UTC shifting to previous day in local time) and allows simple, fast equality matching in MongoDB queries.
