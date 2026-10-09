# Postman API Testing Plan & Execution Documentation
## Project Title: Medical Appointment Booking System
**Document Type:** API QA Testing Plan & Verification Guide  
**Target Audience:** QA Engineers, API Developers, Viva Evaluators  

---

## 1. Overview & Setup Instructions

This document provides a comprehensive testing plan for verifying all REST API endpoints of the **Medical Appointment Booking System**.

### 1.1 Postman Environment Variables
Create a new Environment in Postman named `CarePulse Local Env` with the following key-value pairs:

| Variable Name | Initial Value | Current Value | Description |
|---|---|---|---|
| `baseUrl` | `http://localhost:5000/api` | `http://localhost:5000/api` | Base URL for Express server |
| `patientToken` | *(leave empty)* | *(populated after login)* | Bearer JWT token for Patient |
| `doctorToken` | *(leave empty)* | *(populated after login)* | Bearer JWT token for Doctor |
| `adminToken` | *(leave empty)* | *(populated after login)* | Bearer JWT token for Admin |
| `doctorId` | *(populated from DB)* | *(populated from DB)* | Doctor ObjectId |
| `patientId` | *(populated from DB)* | *(populated from DB)* | Patient ObjectId |
| `appointmentId` | *(populated from DB)* | *(populated from DB)* | Appointment ObjectId |

---

## 2. API Test Suite Matrix

| # | Test Case Description | HTTP Method | Endpoint Path | Headers | Auth Required | Expected HTTP Status |
|---|---|:---:|---|---|:---:|:---:|
| 1 | Register Patient | `POST` | `/auth/register` | `Content-Type: application/json` | None | `201 Created` |
| 2 | Login Patient | `POST` | `/auth/login` | `Content-Type: application/json` | None | `200 OK` |
| 3 | Login Doctor | `POST` | `/auth/login` | `Content-Type: application/json` | None | `200 OK` |
| 4 | Login Admin | `POST` | `/auth/login` | `Content-Type: application/json` | None | `200 OK` |
| 5 | Get Current Profile | `GET` | `/auth/me` | `Authorization: Bearer {{token}}` | JWT | `200 OK` |
| 6 | Get All Doctors | `GET` | `/doctors` | None | None | `200 OK` |
| 7 | Filter Doctors by Spec | `GET` | `/doctors?specialization={{specId}}` | None | None | `200 OK` |
| 8 | Get Doctor By ID | `GET` | `/doctors/{{doctorId}}` | None | None | `200 OK` |
| 9 | Get Specializations | `GET` | `/specializations` | None | None | `200 OK` |
| 10 | Create Specialization | `POST` | `/specializations` | `Authorization: Bearer {{adminToken}}` | Admin | `201 Created` |
| 11 | Book Appointment | `POST` | `/appointments` | `Authorization: Bearer {{patientToken}}` | Patient | `201 Created` |
| 12 | Double Booking Check | `POST` | `/appointments` | `Authorization: Bearer {{patientToken}}` | Patient | `400 Bad Request` |
| 13 | List User Appointments | `GET` | `/appointments` | `Authorization: Bearer {{token}}` | Role-based | `200 OK` |
| 14 | Update Status (Confirm) | `PUT` | `/appointments/{{appointmentId}}/status` | `Authorization: Bearer {{doctorToken}}` | Doctor/Admin | `200 OK` |
| 15 | Cancel Appointment | `DELETE` | `/appointments/{{appointmentId}}` | `Authorization: Bearer {{patientToken}}` | Patient/Admin | `200 OK` |

---

## 3. Detailed Request Body & Expected Response Examples

### Test 1: Register New Patient
- **Method:** `POST`
- **URL:** `{{baseUrl}}/auth/register`
- **Body (JSON):**
```json
{
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "password": "patient123",
  "phone": "+1 (555) 987-6543",
  "gender": "Female",
  "address": "456 Healthcare Blvd"
}
```
- **Expected Status:** `201 Created`
- **Expected Response (JSON):**
```json
{
  "success": true,
  "message": "Registration successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "660a123...",
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "role": "PATIENT"
  }
}
```

---

### Test 11: Book Appointment
- **Method:** `POST`
- **URL:** `{{baseUrl}}/appointments`
- **Headers:** `Authorization: Bearer {{patientToken}}`
- **Body (JSON):**
```json
{
  "doctorId": "660b456...",
  "appointmentDate": "2026-10-15",
  "appointmentTime": "10:00",
  "reason": "Cardiology routine evaluation"
}
```
- **Expected Status:** `201 Created`

---

### Test 12: Double Booking Conflict Verification
- **Method:** `POST`
- **URL:** `{{baseUrl}}/appointments` (Same doctor, date, and time slot as Test 11)
- **Headers:** `Authorization: Bearer {{patientToken}}`
- **Expected Status:** `400 Bad Request`
- **Expected Response (JSON):**
```json
{
  "success": false,
  "message": "This appointment slot is no longer available. Please select another slot."
}
```
