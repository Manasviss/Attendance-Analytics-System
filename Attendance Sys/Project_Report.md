[University Name]

Report of [Course Code]
Project Title: Automated Student Attendance Monitoring and Analytics System
Submitted to [Professor Name]
Member Details: [Your Name] ([Registration Number])
[Member Name] ([Registration Number])
[Member Name] ([Registration Number])

Table of Contents
	1. INTRODUCTION 	 1
1.1 PURPOSE
1.2 SCOPE
1.3 DEFINITIONS, ACRONYMS, AND ABBREVIATIONS
1.4 REFERENCES
1.5 OVERVIEW

	2. GENERAL DESCRIPTION 	 2
2.1 PRODUCT PERSPECTIVE
2.2 PRODUCT FUNCTIONS
2.3 USER CHARACTERISTICS
2.4 GENERAL CONSTRAINTS
2.5 ASSUMPTIONS AND DEPENDENCIES

	3. SPECIFIC REQUIREMENTS 	 3
3.1 EXTERNAL INTERFACE REQUIREMENTS
3.1.1 User Interfaces
3.1.2 Hardware Interfaces
3.1.3 Software Interfaces
3.1.4 Communications Interfaces
3.2 FUNCTIONAL REQUIREMENTS
3.2.1 User Authentication and Authorization
3.2.2 Attendance Management
3.2.3 Student Management
3.2.4 Leave Management System
3.2.5 Reports and Analytics
3.2.6 Timetable Management
3.2.7 Announcements and Notifications
3.3 NON-FUNCTIONAL REQUIREMENTS
3.3.1 Performance
3.3.2 Reliability
3.3.3 Availability
3.3.4 Security
3.3.5 Maintainability
3.3.6 Portability
3.4 DESIGN CONSTRAINTS
3.5 OTHER REQUIREMENTS

	4. ANALYSIS MODELS 	 7
4.1 DATA FLOW DIAGRAMS (DFD)
4.2 USE CASE DIAGRAM
4.3 ENTITY-RELATIONSHIP DIAGRAM

5. GITHUB LINK 	9
6. VIDEO LINK  9

A. APPENDICES
A.1 APPENDIX 1: USER STORIES
A.2 APPENDIX 2: WIREFRAMES

---

1. INTRODUCTION

1.1 PURPOSE
This Software Requirements Specification (SRS) document outlines the functional and non-functional requirements for the "Automated Student Attendance Monitoring and Analytics System," a comprehensive platform built using the MERN stack (MongoDB, Express.js, React.js, Node.js). The intended audience includes software developers, project supervisors, and academic stakeholders involved in the evaluation of the system.

1.2 SCOPE
The Attendance System is a web-based platform designed to modernize and streamline the process of recording and managing student attendance.
It enables:
•	Secure user authentication for teachers and administrators.
•	Manual attendance marking for various subjects and classes.
•	Comprehensive student profile and data management.
•	Leave application submission and approval workflow.
•	Visual reports and analytics for attendance tracking.
•	Timetable management and display.
•	System-wide announcements.

In-Scope:
•	Complete user authentication system (Login/Signup).
•	Dashboard for quick overview of stats.
•	Attendance marking interface (Subject-wise).
•	Student management (CRUD operations).
•	Leave management system (Request/Approve/Reject).
•	Timetable visualization.
•	Analytical reports (Charts/Graphs).
•	Announcements board.

Out-of-Scope:
•	Facial recognition-based attendance (removed from current scope).
•	Mobile application development (Android/iOS).
•	Payment gateway integration.
•	Biometric hardware integration.

1.3 DEFINITIONS, ACRONYMS, AND ABBREVIATIONS
•	MERN: MongoDB, Express.js, React.js, Node.js
•	UID: User Identification (Unique ID for teachers/students)
•	API: Application Programming Interface
•	UI/UX: User Interface/User Experience
•	CRUD: Create, Read, Update, Delete
•	JWT: JSON Web Token (for secure authentication)
•	SPA: Single Page Application

1.4 REFERENCES
1.	IEEE Std 830-1998: IEEE Recommended Practice for Software Requirements Specifications
2.	React.js Documentation
3.	Node.js & Express.js Documentation
4.	MongoDB Documentation
5.	Tailwind CSS Documentation

1.5 OVERVIEW
This document is organized into four main sections: Introduction, General Description, Specific Requirements, and Analysis Models. Section 3 contains detailed functional and non-functional requirements. Appendices contain supplementary information including user stories and wireframe descriptions.

---

2. GENERAL DESCRIPTION

2.1 PRODUCT PERSPECTIVE
The Automated Student Attendance System is a standalone web application designed to replace manual paper-based attendance registers. It operates as a local development project but is architected for potential cloud deployment.

2.2 PRODUCT FUNCTIONS
1.	User (Teacher/Admin) Authentication & Management
2.	Subject-wise Attendance Marking & Tracking
3.	Student Database Management
4.	Leave Application Processing (Apply/Approve)
5.	Visual Analytics & Attendance Reports
6.	Weekly Timetable Management
7.	Announcement Broadcasting

2.3 USER CHARACTERISTICS
Primary Users:
1.	Teachers/Faculty: Mark attendance, view reports, manage leaves, view timetable.
2.	Administrators: Manage students, system settings, and overall data.
3.	Students (Limited View): View own attendance, apply for leaves (if applicable).

Technical Proficiency:
•	All users: Basic web navigation skills.
•	Administrators: Moderate technical understanding for system configuration.

2.4 GENERAL CONSTRAINTS
1.	Must be developed using MERN stack.
2.	Responsive design for desktop and tablet usage.
3.	Local development environment (node modules).
4.	Secure password handling.

2.5 ASSUMPTIONS AND DEPENDENCIES
Assumptions:
1.	Stable internet connection for accessing CDN-based assets (if any).
2.	Modern web browsers (Chrome, Firefox, Edge).
Dependencies:
1.	Node.js runtime environment.
2.	MongoDB instance (Local or Atlas).
3.	NPM/Yarn for package management.

---

3. SPECIFIC REQUIREMENTS

3.1 EXTERNAL INTERFACE REQUIREMENTS

3.1.1 User Interfaces
•	Login/Signup Page: Secure entry with modern UI/UX (Wave background/Animations).
•	Dashboard: High-level metrics (Total Students, Present Today, Pending Leaves).
•	Attendance Sheet: Grid/List view to mark students present/absent/late.
•	Reports Page: Graphical representation (Bar/Pie charts) of attendance trends.
•	Student Profiles: Detailed view of individual student info and stats.
•	Leave Portal: Form for requests and list for approvals.
•	Responsive Design: Built with Tailwind CSS for adaptability.

3.1.2 Hardware Interfaces
•	Standard PC/Laptop for server and client.
•	Minimum: 4GB RAM, generic dual-core processor.

3.1.3 Software Interfaces
•	Frontend: React.js (Vite) with Axios for API calls.
•	Backend: Node.js with Express.js REST API.
•	Database: MongoDB with Mongoose Schema.
•	Styling: Tailwind CSS.

3.1.4 Communications Interfaces
•	RESTful API endpoints (JSON format).
•	HTTP/HTTPS protocols.

3.2 FUNCTIONAL REQUIREMENTS

3.2.1 User Authentication and Authorization
FR-001: User Login/Register
•	Inputs: Name, Email/UID, Password.
•	Processing: JWT generation, Bcrypt password hashing.
•	Outputs: Access token, redirection to Dashboard.
•	Error Handling: Invalid credentials, weak password, duplicate email.

3.2.2 Attendance Management
FR-002: Mark Attendance
•	Inputs: Date, Subject/Class, Student Status (Present/Absent).
•	Processing: Create/Update attendance records in database.
•	Outputs: Success confirmation, updated stats.
•	Error Handling: Duplicate entry for same day/subject.

FR-003: Subject Integration
•	Inputs: Subject name/code.
•	Processing: Link attendance records to specific subjects.
•	Outputs: Subject-wise attendance reports.

3.2.3 Student Management
FR-004: Student Operations (CRUD)
•	Inputs: Student Name, Roll No, Branch, Contact Info.
•	Processing: Store user details in MongoDB.
•	Outputs: Updated student list.
•	Error Handling: Duplicate Roll No.

3.2.4 Leave Management System
FR-005: Apply for Leave
•	Inputs: Date Range, Reason, Type (Medical/Casual).
•	Processing: Create leave request record.
FR-006: Manage Requests
•	Processing: Teacher approves or rejects request.
•	Outputs: Status update notification.

3.2.5 Reports and Analytics
FR-007: Visual Reports
•	Processing: Aggregate attendance data.
•	Outputs: Charts (using Chart.js) showing attendance percentages.
FR-008: Export Data
•	Outputs: Attendance lists (Downloadable format if implemented).

3.2.6 Timetable Management
FR-009: View Timetable
•	Inputs: Class/Section.
•	Outputs: Weekly schedule grid.

3.2.7 Announcements
FR-010: Post Announcement
•	Inputs: Title, Message, Date.
•	Outputs: Broadcast message on Dashboards.

3.3 NON-FUNCTIONAL REQUIREMENTS

3.3.1 Performance
•	API response time < 500ms.
•	Dashboard load time < 2 seconds.

3.3.2 Reliability
•	Accurate calculation of attendance percentages.
•	Data persistence in MongoDB.

3.3.3 Availability
•	System uptime 99.9% during local operation.

3.3.4 Security
•	JWT for protected routes.
•	Password encryption (bcrypt).
•	Input validation (express-validator).

3.3.5 Maintainability
•	Component-based architecture (React).
•	Modular backend routes.

3.3.6 Portability
•	Runs on any OS with Node.js installed.
•	Cross-browser compatibility.

3.4 DESIGN CONSTRAINTS
1.	MERN Stack only.
2.	No use of facial recognition libraries (deprecated).
3.	Strict adherence to syllabus-prescribed technologies.

---

4. ANALYSIS MODELS

4.1 DATA FLOW DIAGRAMS (DFD)

Context Level DFD:
[User/Teacher] → (Attendance System) → [MongoDB]
     ↑                    ↓
[Student]          [Administrator]

Level 1 DFD Processes:
1.  Auth Service (Login/Session)
2.  Attendance Processor (Mark/Calculate)
3.  Student Data Manager (Add/Edit)
4.  Leave Workflow Engine
5.  Report Generator

4.2 USE CASE DIAGRAM
Actors:
1.  Teacher: Mark Attendance, View Reports, Approve Leaves.
2.  Student: View Attendance, Apply Leave.
3.  Admin: Manage Users, Configure System.
Key Use Cases:
•   UC-001: Login
•   UC-002: Mark Daily Attendance
•   UC-003: Generate Weekly Report
•   UC-004: Apply for Leave
•   UC-005: View Timetable

4.3 ENTITY-RELATIONSHIP DIAGRAM
Entities:
1.  User/Auth
    - id, name, email, password_hash, role
2.  Student
    - id, roll_no, name, batch, course
3.  Attendance
    - id, student_id, date, status, subject_id
4.  LeaveRequest
    - id, student_id, from_date, to_date, reason, status
5.  Subject
    - id, name, code, teacher_id

---

5. GITHUB LINK

Repository: [Insert Your GitHub Link Here]

6. VIDEO LINK

Demo Video: [Insert Video Link Here]

---

A. APPENDICES

A.1 APPENDIX 1: USER STORIES
Priority: High
US-001: As a teacher, I want to log in securely so I can manage my class.
US-002: As a teacher, I want to mark attendance for a specific subject so records are accurate.
US-003: As a teacher, I want to view a student's attendance percentage to identify defaulters.

Priority: Medium
US-004: As a student, I want to apply for leave online to save time.
US-005: As a teacher, I want to see a visual graph of class attendance.

A.2 APPENDIX 2: WIREFRAMES
1.  Login Screen: Minimalist form with background animation.
2.  Dashboard: Card layout showing key stats (Total Students, Attendance %).
3.  Attendance Sheet: Table with checkboxes for marking Present/Absent.
4.  Leave Portal: List of pending requests with Approve/Reject buttons.
