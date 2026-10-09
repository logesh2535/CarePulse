# Jira Project Management & Agile Sprint Tracking
## Project Title: Medical Appointment Booking System
**Document Type:** Agile Software Engineering Tracking Plan  
**Project Key:** `MABS`  

---

## 1. Project Overview & Epics Breakdown

The development process for the **Medical Appointment Booking System** is organized into 12 distinct Epics representing key software engineering lifecycle milestones.

```
MABS Project Epics
 ├── EPIC-1: Requirement Analysis & Software Specification
 ├── EPIC-2: UI/UX Healthcare Design System & Wireframing
 ├── EPIC-3: Authentication & Role-Based Authorization
 ├── EPIC-4: Patient Module & Doctor Search Engine
 ├── EPIC-5: Doctor Module & Schedule Availability Manager
 ├── EPIC-6: Admin Module & System Management
 ├── EPIC-7: Appointment Lifecycle Engine & Double-Booking Lock
 ├── EPIC-8: Database Architecture & Mongoose Schema Indexing
 ├── EPIC-9: RESTful API Development & Express Routing
 ├── EPIC-10: QA Testing Suite & Postman Verification
 ├── EPIC-11: Production Build & Deployment Setup
 └── EPIC-12: System Documentation & Viva Defense Guide
```

---

## 2. User Stories & Task Backlog

### User Story 1 (Patient Doctor Search)
- **Issue ID:** `MABS-101`
- **Type:** Story
- **Epic:** EPIC-4 Patient Module
- **Summary:** *As a Patient, I want to search for doctors by name and specialization filter so that I can discover qualified specialists for my medical condition.*
- **Priority:** High
- **Sub-Tasks:**
  - `MABS-102` (Backend): Develop `GET /api/doctors` API controller supporting regex search and specialization parameters.
  - `MABS-103` (Database): Create index on `specialization` field in Doctor schema for query acceleration.
  - `MABS-104` (Frontend): Build responsive Doctor Search UI with real-time specialization dropdown filter.
  - `MABS-105` (QA): Write Postman test case for doctor filtering endpoints.

---

### User Story 2 (Appointment Booking & Conflict Lock)
- **Issue ID:** `MABS-106`
- **Type:** Story
- **Epic:** EPIC-7 Appointment Engine
- **Summary:** *As a Patient, I want to select an available time slot and submit an appointment request so that I can reserve a consultation with zero double-booking risk.*
- **Priority:** High
- **Sub-Tasks:**
  - `MABS-107` (Backend): Implement atomic `Appointment.findOne` collision lock query before DB record save.
  - `MABS-108` (Database): Add partial unique compound index `{ doctorId: 1, appointmentDate: 1, appointmentTime: 1 }`.
  - `MABS-109` (Frontend): Build 6-step appointment booking wizard form in React.
  - `MABS-110` (QA): Execute concurrency testing for double booking prevention.

---

### User Story 3 (Doctor Request Decisioning)
- **Issue ID:** `MABS-111`
- **Type:** Story
- **Epic:** EPIC-5 Doctor Module
- **Summary:** *As a Doctor, I want to review pending appointment requests and mark them as Confirmed or Rejected so that I can manage my daily clinic workload.*
- **Priority:** High
- **Sub-Tasks:**
  - `MABS-112` (Backend): Build `PUT /api/appointments/:id/status` endpoint with doctor ownership RBAC verification.
  - `MABS-113` (Frontend): Design Doctor Dashboard requests table with Approve / Reject action buttons.
