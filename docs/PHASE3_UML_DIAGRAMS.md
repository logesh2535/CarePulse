# Phase 3: Object-Oriented System Design & UML Diagrams
## Project Title: Medical Appointment Booking System
**Document Type:** Unified Modeling Language (UML) Specification Document (Argo UML Standard)  
**Target Audience:** Software Architects, Academic Evaluators, Viva Examiners  

---

## 1. Introduction & UML Standard

The **Unified Modeling Language (UML)** is standard visual modeling notation used to specify, visualize, construct, and document software artifacts. 

For the **Medical Appointment Booking System (MABS)**, 7 standard UML diagrams have been designed in accordance with standard Argo UML object-oriented modeling guidelines:

1. **Use Case Diagram** (Functional Boundaries & Actors)
2. **Class Diagram** (Static Object Structure)
3. **Sequence Diagrams** (Dynamic Interaction Specifications for 4 Key Scenarios)
4. **Activity Diagram** (Workflow Behavior & Decisions)
5. **State Chart Diagram** (Lifecycle State Machine for Appointments)
6. **Component Diagram** (Physical Software Module Organization)
7. **Deployment Diagram** (Node Topology & Hardware Deployment)

---

## 2. Diagram 1: Use Case Diagram

### 2.1 Actors
1. **Patient:** Primary user searching for doctors and booking appointments.
2. **Doctor:** Healthcare provider managing availability and approving requests.
3. **Admin:** System supervisor managing users, doctors, and specializations.

### 2.2 Use Case Diagram (Mermaid Rendering)

```mermaid
graph LR
    subgraph "Medical Appointment Booking System Boundary"
        UC1(("UC-1 Register Patient"))
        UC2(("UC-2 Login"))
        UC3(("UC-3 Search Doctor"))
        UC4(("UC-4 View Available Slots"))
        UC5(("UC-5 Book Appointment"))
        UC6(("UC-6 Cancel Appointment"))
        UC7(("UC-7 View Appointment History"))
        UC8(("UC-8 Manage Profile"))
        UC9(("UC-9 Logout"))
        
        UC10(("UC-10 Manage Availability"))
        UC11(("UC-11 View Assigned Appointments"))
        UC12(("UC-12 Accept / Reject Appointment"))
        UC13(("UC-13 View Patient Details"))
        
        UC14(("UC-14 Manage Doctors"))
        UC15(("UC-15 Manage Patients"))
        UC16(("UC-16 Manage Specializations"))
        UC17(("UC-17 View All System Appointments"))
    end

    Patient["👤 Patient"]
    Doctor["👨‍⚕️ Doctor"]
    Admin["🔐 Admin"]

    Patient --> UC1
    Patient --> UC2
    Patient --> UC3
    Patient --> UC4
    Patient --> UC5
    Patient --> UC6
    Patient --> UC7
    Patient --> UC8
    Patient --> UC9

    Doctor --> UC2
    Doctor --> UC8
    Doctor --> UC10
    Doctor --> UC11
    Doctor --> UC12
    Doctor --> UC13
    Doctor --> UC9

    Admin --> UC2
    Admin --> UC14
    Admin --> UC15
    Admin --> UC16
    Admin --> UC17
    Admin --> UC9

    UC5 -.->|"<<include>>"| UC4
    UC5 -.->|"<<include>>"| UC2
    UC12 -.->|"<<include>>"| UC2
```

---

## 3. Diagram 2: Class Diagram

### 3.1 Class Structure & Relationships

```mermaid
classDiagram
    class User {
        +ObjectId _id
        +String name
        +String email
        +String password
        +String role
        +String phone
        +Date createdAt
        +register()
        +login()
        +logout()
        +updateProfile()
    }

    class Patient {
        +ObjectId _id
        +ObjectId userId
        +Date dateOfBirth
        +String gender
        +String address
        +String bloodGroup
        +String medicalInformation
        +searchDoctors()
        +viewSlots()
        +bookAppointment()
        +cancelAppointment()
    }

    class Doctor {
        +ObjectId _id
        +ObjectId userId
        +ObjectId specialization
        +String qualification
        +Number experience
        +Number consultationFee
        +String description
        +String profileImage
        +Array availability
        +manageSlots()
        +acceptAppointment()
        +rejectAppointment()
    }

    class Admin {
        +manageDoctors()
        +managePatients()
        +manageSpecializations()
        +viewAllAppointments()
    }

    class Specialization {
        +ObjectId _id
        +String name
        +String description
        +String icon
        +Boolean isActive
        +addSpecialization()
        +updateSpecialization()
    }

    class Appointment {
        +ObjectId _id
        +ObjectId patientId
        +ObjectId doctorId
        +String appointmentDate
        +String appointmentTime
        +String reason
        +String status
        +Date createdAt
        +createBooking()
        +updateStatus()
        +cancel()
    }

    User <|-- Patient : Inherits (1 to 1)
    User <|-- Doctor : Inherits (1 to 1)
    User <|-- Admin : Inherits (1 to 1)
    Doctor "1" -- "1" Specialization : Categorized By
    Patient "1" -- "0..*" Appointment : Places
    Doctor "1" -- "0..*" Appointment : Attends
```

---

## 4. Diagram 3: Sequence Diagrams

### Sequence A: Patient Login Workflow

```mermaid
sequenceDiagram
    autonumber
    actor Patient
    participant Frontend as React Client
    participant AuthAPI as Auth Controller
    participant DB as MongoDB User Coll

    Patient->>Frontend: Enter Email & Password
    Frontend->>AuthAPI: POST /api/auth/login
    AuthAPI->>DB: User.findOne({ email })
    DB-->>AuthAPI: User Record (with hashed password)
    AuthAPI->>AuthAPI: Compare Password (bcrypt)
    alt Password Invalid
        AuthAPI-->>Frontend: 401 Unauthorized ("Invalid credentials")
        Frontend-->>Patient: Display Error Alert
    else Password Valid
        AuthAPI->>AuthAPI: Sign JWT (userId, role)
        AuthAPI-->>Frontend: 200 OK + JWT Token + User Data
        Frontend->>Frontend: Save Token in localStorage & AuthContext
        Frontend-->>Patient: Redirect to Patient Dashboard
    end
```

---

### Sequence B: Doctor Search Workflow

```mermaid
sequenceDiagram
    autonumber
    actor Patient
    participant Frontend as React Client
    participant DoctorAPI as Doctor Controller
    participant DB as MongoDB Doctor Coll

    Patient->>Frontend: Select Specialization filter / Type Doctor Name
    Frontend->>DoctorAPI: GET /api/doctors?specialization=id&search=name
    DoctorAPI->>DB: Doctor.find().populate('userId specialization')
    DB-->>DoctorAPI: Array of Doctor Profiles
    DoctorAPI-->>Frontend: 200 OK + Doctors JSON List
    Frontend->>Frontend: Render Doctor Cards Grid
    Frontend-->>Patient: View Filtered Doctors & Consultation Fees
```

---

### Sequence C: Appointment Booking Workflow (With Collision Prevention)

```mermaid
sequenceDiagram
    autonumber
    actor Patient
    participant Frontend as React Client
    participant ApptAPI as Appointment Controller
    participant DB as MongoDB Appointment Coll

    Patient->>Frontend: Select Doctor, Date, Time Slot & Reason
    Frontend->>ApptAPI: POST /api/appointments { doctorId, date, time, reason }
    ApptAPI->>DB: Appointment.findOne({ doctorId, date, time, status: {$in: ['Pending','Confirmed']} })
    DB-->>ApptAPI: Existing Booking Result
    alt Slot Already Booked
        ApptAPI-->>Frontend: 400 Bad Request ("Slot no longer available")
        Frontend-->>Patient: Show Error Alert ("Select another slot")
    else Slot Available
        ApptAPI->>DB: Appointment.create({ patientId, doctorId, date, time, reason, status: 'Pending' })
        DB-->>ApptAPI: Saved Appointment Document
        ApptAPI-->>Frontend: 201 Created + Appointment Details
        Frontend-->>Patient: Display Success Toast & Confirmation Receipt
    end
```

---

### Sequence D: Doctor Approval / Rejection Workflow

```mermaid
sequenceDiagram
    autonumber
    actor Doctor
    participant Frontend as React Client
    participant ApptAPI as Appointment Controller
    participant DB as MongoDB Appointment Coll

    Doctor->>Frontend: View Pending Appointments
    Frontend->>ApptAPI: GET /api/appointments?doctorId=id&status=Pending
    ApptAPI->>DB: Fetch Pending Appointments
    DB-->>ApptAPI: Appointments List
    ApptAPI-->>Frontend: Render Requests Table
    Doctor->>Frontend: Click "Accept" or "Reject" Button
    Frontend->>ApptAPI: PUT /api/appointments/:id/status { status: 'Confirmed' / 'Rejected' }
    ApptAPI->>DB: Appointment.findByIdAndUpdate(id, { status })
    DB-->>ApptAPI: Updated Document
    ApptAPI-->>Frontend: 200 OK ("Status updated successfully")
    Frontend->>Frontend: Update UI Badge to Confirmed/Rejected
    Frontend-->>Doctor: Display Status Success Notification
```

---

## 5. Diagram 4: Activity Diagram (Appointment Booking)

```mermaid
flowchart TD
    Start([Start]) --> LoginCheck{Is User Logged In?}
    LoginCheck -- No --> RegisterLogin[Register / Login as Patient]
    RegisterLogin --> SearchDoc
    LoginCheck -- Yes --> SearchDoc[Search Doctor & Filter Specialization]
    
    SearchDoc --> SelectDoc[Select Doctor Profile]
    SelectDoc --> PickDate[Select Preferred Date]
    PickDate --> PickTime[Select Available Time Slot]
    PickTime --> FillReason[Enter Reason for Consultation]
    FillReason --> ReviewForm[Review Booking Summary]
    ReviewForm --> ClickBook[Click 'Confirm Booking' Button]
    
    ClickBook --> ServerCheck{Server Conflict Check: Is Slot Available?}
    
    ServerCheck -- No --> ConflictAlert[Display 'Slot Already Booked' Alert]
    ConflictAlert --> PickTime
    
    ServerCheck -- Yes --> CreateDB[Create Appointment Record in DB with Status 'Pending']
    CreateDB --> ShowConfirm[Display Confirmation Message & Booking ID]
    ShowConfirm --> End([End])
```

---

## 6. Diagram 5: State Chart Diagram (Appointment Lifecycle)

```mermaid
stateDiagram-v2
    [*] --> New : Patient Initiates Booking
    New --> Pending : Appointment Created in DB
    
    Pending --> Confirmed : Doctor Accepts Booking
    Pending --> Rejected : Doctor Declines Booking
    Pending --> Cancelled : Patient Cancels Booking
    
    Confirmed --> Completed : Consultation Done
    Confirmed --> Cancelled : Patient / Admin Cancels Booking
    
    Rejected --> [*]
    Cancelled --> [*]
    Completed --> [*]
```

---

## 7. Diagram 6: Component Diagram

```mermaid
graph TD
    subgraph "Client Tier (React Frontend)"
        UI_Comp["UI Pages & Layouts"]
        AuthContext["Auth Context & State"]
        ApiService["Axios API Services"]
    end

    subgraph "Application Tier (Express Backend)"
        AppServer["server.js / Express App"]
        AuthMiddleware["JWT Auth Guard"]
        AuthCtrl["Auth Controller"]
        DocCtrl["Doctor Controller"]
        ApptCtrl["Appointment Controller"]
        SpecCtrl["Specialization Controller"]
    end

    subgraph "Database Tier (MongoDB)"
        UserColl[("User Collection")]
        DocColl[("Doctor Collection")]
        PatColl[("Patient Collection")]
        ApptColl[("Appointment Collection")]
        SpecColl[("Specialization Collection")]
    end

    UI_Comp --> AuthContext
    UI_Comp --> ApiService
    ApiService -->|HTTP REST JSON| AppServer

    AppServer --> AuthMiddleware
    AuthMiddleware --> AuthCtrl
    AuthMiddleware --> DocCtrl
    AuthMiddleware --> ApptCtrl
    AuthMiddleware --> SpecCtrl

    AuthCtrl --> UserColl
    DocCtrl --> DocColl
    DocCtrl --> SpecColl
    ApptCtrl --> ApptColl
    ApptCtrl --> PatColl
    ApptCtrl --> DocColl
    SpecCtrl --> SpecColl
```

---

## 8. Diagram 7: Deployment Diagram

```mermaid
graph TD
    subgraph "Client Device (Desktop / Tablet / Mobile)"
        Browser["🌐 Web Browser (Chrome / Firefox / Edge)"]
    end

    subgraph "Web & Application Server Node"
        WebServer["🖥️ Node.js Environment (v18.x)"]
        ReactApp["⚛️ React SPA (Port 5173 / Production Build)"]
        ExpressApp["⚡ Express REST Server (Port 5000)"]
    end

    subgraph "Database Server Node"
        MongoInstance["🍃 MongoDB Server (Port 27017 / MongoDB Atlas)"]
    end

    Browser -->|HTTP / HTTPS Port 5173| ReactApp
    ReactApp -->|REST API Requests Port 5000| ExpressApp
    ExpressApp -->|TCP Connection Port 27017| MongoInstance
```

---

## 9. Viva Preparation Notes (Phase 3 Focus)

When presenting UML diagrams in viva:

1. **What is the difference between Use Case include and extend?**  
   *Answer:* `<<include>>` indicates mandatory execution (e.g., *Book Appointment* mandatory includes *View Available Slots*). `<<extend>>` indicates optional behavior that occurs under specific conditions (e.g., *Cancel Appointment* extends *View Appointment Details*).

2. **How does the Class Diagram handle inheritance?**  
   *Answer:* `User` is the parent superclass containing base credentials (`name`, `email`, `password`, `role`). `Patient`, `Doctor`, and `Admin` extend `User` via 1-to-1 generalization, adding role-specific attributes.

3. **Explain the State Chart Diagram transitions.**  
   *Answer:* An appointment begins in `New`, transitions to `Pending` upon database record creation, moves to `Confirmed` or `Rejected` based on doctor action, and reaches a terminal state of `Completed` or `Cancelled`.
