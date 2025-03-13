# **Super Admin Appointment Management System - Detailed Requirement Document**

## **Project Name**
Super Admin Appointment Management System

## **Introduction**
This project aims to develop a comprehensive appointment management system that allows a Super Admin to manage organizations, services, staff, clients, and appointments. The system features advanced role-based access control, theming, audit trails, WhatsApp notifications (with appointment confirmation links), and both manual and AI-driven appointment scheduling with a manual override option. It is designed to be scalable and performant to support multiple organizations and a large volume of users and appointments.

---

## **Tech Stack**
- **MERN Stack:**
  - **MongoDB:** Database for storing application data.
  - **Express & Node.js:** Backend server and API development.
  - **React:** Frontend user interface.
- **UI Framework:**
  - **Ant Design (antd):** For building a consistent and robust user interface.
- **Package Manager:**
  - **Bun:** For managing dependencies.

---

## **User Flow**
### 1. **Login Page**
- **Authentication:**  
  - Pre-defined user accounts (Super Admin and additional roles created via the Roles module) log in; self-registration is not allowed.
- **Redirection:**  
  - If the Super Admin has not created an organization, redirect to the **Create Organization Page**.
  - If an organization exists, navigate directly to the **Dashboard**.

### 2. **Dashboard**
- **Header:**  
  - **Left:** Displays the organization name.  
  - **Right:** Displays the logged-in user’s name and profile picture.
- **Sidebar Navigation:**  
  - Appointments  
  - Services  
  - Staff  
  - Customers  
  - Organization  
  - Attendance  
  - Insights  
  - Settings  

---

## **Key Features**
### **Roles & Permissions**
- The Super Admin can create and manage roles (e.g., Admin, Limited User) via the Roles tab.
- Each role is assigned specific permissions that govern access to various sidebar tabs.

### **Organization Management**
- Create a new organization.
- Switch between multiple organizations if applicable.

### **Services Management**
- Data Fields:
  - Service Name  
  - Description  
  - Duration  
  - Price  

### **Staff Management**
- Create and manage staff members.
- Assign services to staff members during the creation process.

### **Client Management**
- Name  
- Phone Number  
- Email  
- Priority Score (default 10; hidden in UI but used for appointment scheduling)  
- Preferred Days mapped to Preferred Services, Preferred Staffs, and Timing  
- Monthly Appointment Slot Allocation per Service  

### **Appointment Management**
- **Manual Appointments:** Assign appointments manually based on staff and client availability.
- **AI-Generated Appointments:** Automatic scheduling using client availability, priority score, preferred staff, and service timings.
- **Manual Override:** Option to manually adjust AI-generated appointments.

### **Notification System**
- WhatsApp notifications for clients and staff, including appointment confirmation links.

### **Attendance Management**
- Staff can log in and view their slot history.
- Staff can update attendance records based on whether the client attended or not.
- Super Admin can monitor attendance records and track no-shows.

### **Audit and Logging**
- Logs all user activities and changes for accountability.

### **Insights and Reporting**
- Displays key metrics such as total sessions per staff and revenue insights.

### **Settings**
- Theme settings (Light/Dark mode)
- Appointment duration configurations
- Weekly schedule settings

---

## **Project Phases and Sprints**

### **Phase 1: Project Setup & Core Authentication**
- Initialize repository and set up project structure.
- Implement authentication (login, role-based access control).
- Redirect users based on organization status.

### **Phase 2: Organization & Role Management**
- Develop CRUD functionality for organizations.
- Implement role-based access control.

### **Phase 3: Core Modules Development**
- Implement services, staff, and client management.
- Develop appointment scheduling (manual and AI-generated).

### **Phase 4: Notifications & Attendance Management**
- Integrate WhatsApp notifications.
- Implement attendance tracking system for staff.

### **Phase 5: Reporting & Insights**
- Develop dashboards with key metrics.
- Implement audit logging.

### **Phase 6: Performance Optimization & Security Enhancements**
- Optimize API endpoints and database queries.
- Conduct security audits and implement compliance measures.

### **Phase 7: Final Testing & Deployment**
- Conduct end-to-end testing.
- Deploy the system with CI/CD pipeline setup.

---

## **Deliverables**
- Fully functional MERN-based application.
- Source code following structured best practices.
- Deployment-ready system with audit logs and insights.
- Comprehensive documentation.

---