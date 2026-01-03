# Report of INT222

**Lovely Professional University**

**Project Title:** Digital Attendance & Academic Management System

**Submitted to:** [Instructor Name]

---

**Member Details:**
*   [Your Name] ([Your ID])
*   [Team Member 1] ([ID])
*   [Team Member 2] ([ID])

---

## Table of Contents
1.  **INTRODUCTION**
    *   1.1 PURPOSE
    *   1.2 SCOPE
    *   1.3 DEFINITIONS, ACRONYMS, AND ABBREVIATIONS
    *   1.4 REFERENCES
    *   1.5 OVERVIEW
2.  **GENERAL DESCRIPTION**
    *   2.1 PRODUCT PERSPECTIVE
    *   2.2 PRODUCT FUNCTIONS
    *   2.3 USER CHARACTERISTICS
    *   2.4 GENERAL CONSTRAINTS
    *   2.5 ASSUMPTIONS AND DEPENDENCIES
3.  **SPECIFIC REQUIREMENTS**
    *   3.1 EXTERNAL INTERFACE REQUIREMENTS
        *   3.1.1 User Interfaces
        *   3.1.2 Hardware Interfaces
        *   3.1.3 Software Interfaces
        *   3.1.4 Communications Interfaces
    *   3.2 FUNCTIONAL REQUIREMENTS
        *   3.2.1 User Authentication and Authorization
        *   3.2.2 Attendance Management
        *   3.2.3 Leave Management System
        *   3.2.4 Admin/Teacher Dashboard
        *   3.2.5 Student Dashboard
        *   3.2.6 Reporting and Analytics
    *   3.3 NON-FUNCTIONAL REQUIREMENTS
        *   3.3.1 Performance
        *   3.3.2 Reliability
        *   3.3.3 Availability
        *   3.3.4 Security
        *   3.3.5 Maintainability
        *   3.3.6 Portability
    *   3.4 DESIGN CONSTRAINTS
    *   3.5 OTHER REQUIREMENTS
4.  **ANALYSIS MODELS**
    *   4.1 DATA FLOW DIAGRAMS (DFD)
    *   4.2 USE CASE DIAGRAM
    *   4.3 ENTITY-RELATIONSHIP DIAGRAM
5.  **GITHUB LINK**
6.  **VIDEO LINK**

**A. APPENDICES**
    *   A.1 APPENDIX 1: USER STORIES
    *   A.2 APPENDIX 2: WIREFRAMES

---

## 1. INTRODUCTION

### 1.1 PURPOSE
This Software Requirements Specification (SRS) document outlines the functional and non-functional requirements for "Digital Attendance System," a comprehensive Attendance & Academic Management System built using the MERN stack (MongoDB, Express.js, React.js, Node.js). The intended audience includes software developers, testers, and project stakeholders involved in the development of the system.

### 1.2 SCOPE
**Digital Attendance System** is a web-based platform that enables:
*   Secure user registration, authentication, and role management (Student/Teacher).
*   Digital attendance marking for multiple subjects per day.
*   Leave application and approval workflow.
*   Teacher dashboard for class oversight and reports.
*   Student dashboard for personal attendance tracking.

**In-Scope:**
*   Complete user authentication system (JWT).
*   Subject-wise attendance marking and tracking.
*   Leave management system (Apply, Approve/Reject).
*   Daily and History Reports generation.
*   Role-based access control (Student, Teacher/Admin).
*   Interactive UI with "Future Tech" aesthetics.

**Out-of-Scope:**
*   Mobile application development.
*   Payment gateway integration.
*   **Facial Recognition** (Removed as per project scope update).
*   Third-party authentication services.

### 1.3 DEFINITIONS, ACRONYMS, AND ABBREVIATIONS
*   **MERN:** MongoDB, Express.js, React.js, Node.js
*   **JWT:** JSON Web Token (for secure authentication)
*   **API:** Application Programming Interface
*   **UI/UX:** User Interface/User Experience
*   **CRUD:** Create, Read, Update, Delete
*   **SRS:** Software Requirements Specification

### 1.4 REFERENCES
1.  IEEE Std 830-1998: IEEE Recommended Practice for Software Requirements Specifications
2.  MERN Stack Documentation
3.  React.js Official Documentation
4.  MongoDB Documentation
5.  Node.js Documentation
