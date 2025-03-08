**Project Requirement Document**

## **Project Name**
Super Admin Appointment Management System

## **Introduction**
This project aims to develop a comprehensive appointment management system that allows a Super Admin to manage organizations, services, staff, clients, and appointments. The system features advanced role-based access control, theming, audit trails, WhatsApp notifications (with appointment confirmation links), and both manual and AI-driven appointment scheduling with a manual override option. It is designed to be scalable and performant to support multiple organizations and a large volume of users and appointments.

## **Tech Stack**
- **MERN Stack:**
  - **MongoDB:** Database for storing application data.
  - **Express & Node.js:** Backend server and API development.
  - **React:** Frontend user interface.
- **UI Framework:**
  - **Ant Design (antd):** For building a consistent and robust user interface.
- **Package Manager:**
  - **Bun:** For managing dependencies.
- **Frontend Setup:**
  - Use the following command to create the React app:
    ```bash
    bun create vite my-vue-app --template react-ts
    ```
  - Use `.tsx` file extensions for components (instead of `.jsx`).
- **Folder Structure:**
  ```plaintext
  mern-app/
  ├── client/                   # React frontend
  │   ├── public/               # Static files (index.html, favicon, etc.)
  │   └── src/
  │       ├── assets/           # Images, styles, fonts, etc.
  │       ├── components/       # Reusable UI components (use .tsx for React components)
  │       ├── pages/            # Page-level components/views (use .tsx for React components)
  │       ├── hooks/            # Custom React hooks (optional, .tsx or .ts)
  │       ├── utils/            # Utility functions and helpers (.ts or .tsx as needed)
  │       ├── App.tsx           # Main App component
  │       └── index.tsx         # Entry point for React
  │
  ├── server/                   # Node/Express backend
  │   ├── config/               # Environment variables, database config, etc.
  │   ├── controllers/          # Functions to handle requests
  │   ├── middleware/           # Custom middleware (authentication, error handling, etc.)
  │   ├── models/               # Mongoose models for MongoDB
  │   ├── routes/               # Express routes definitions
  │   ├── utils/                # Utility functions (logging, helpers, etc.)
  │   └── server.js             # Main server file (Express app setup)
  │
  ├── .gitignore                # Git ignore file
  ├── package.json              # Root package file for backend dependencies and scripts
  └── README.md                 # Project documentation
  ```

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

### A. **Roles & Permissions**
- **Roles Management:**  
  - The Super Admin can create and manage roles (e.g., Admin, Limited User) via the Roles tab.
  - Each role is assigned specific permissions that govern access to various sidebar tabs (e.g., view services, view appointments).

### B. **Organization Management**
- **Features:**  
  - Create a new organization.
  - Switch between multiple organizations if applicable.

### C. **Services Management**
- **Data Fields:**  
  - Service Name  
  - Description  
  - Duration  
  - Price

### D. **Staff Management**
- **Operations:**  
  - Create and manage staff members.
  - Assign services to staff members during the creation process.

### E. **Client Management**
- **Data Fields:**  
  - Name  
  - Phone Number  
  - Email  
  - Priority Score (default 10; hidden in UI but used for appointment scheduling)  
  - Preferred Staff  
  - Preferred Days mapped to Preferred Services  
    - *Example:* Monday → Service 1, Wednesday → Service 2  
  - Monthly Appointment Slot Allocation per Service  
    - *Example:* 20 slots for Service 2, 10 for Service 1

### F. **Appointment Management**
- **Manual Appointments:**  
  - The Super Admin (or authorized roles) can manually assign appointments based on staff and client availability.
- **AI-Generated Appointments:**  
  - The system automatically schedules appointments using client availability, priority score, preferred staff, and service timings.
  - **Manual Override:**  
    - Provide an option for manual override of AI-generated appointments to adjust scheduling as needed.

### G. **Notification System**
- **WhatsApp Notifications:**  
  After daily appointments are created, the system will send notifications as follows:
  - **Client Message:**  
    - Includes detailed appointment information (date, time, service, etc.).
    - Contains a confirmation URL displaying full appointment details.
    - The confirmation page includes two response buttons:
      - **Yes (default):** Confirms attendance.
      - **No:** Indicates non-attendance.
  - **Staff Message:**  
    - Provides a daily summary with appointment details, including client names and appointment times.

### H. **Attendance Management**
- **Monitoring:**  
  - The Super Admin can view attendance records for clients to track no-shows and manage follow-ups.

### I. **Audit and Logging**
- **Tracking:**  
  - Log all user activities and changes (e.g., appointment modifications, role changes, staff updates, organization details) for accountability and troubleshooting.

### J. **Insights and Reporting**
- **Dashboard Metrics:**  
  - Display metrics such as total sessions per staff segmented by day, week, month, and year.
  - Show total revenue generated per staff member.
  - Provide additional insights to optimize scheduling and resource allocation.

### K. **Settings**
- **Theme Settings:**  
  - Toggle between Light and Dark themes.
- **Appointment Settings:**  
  - Configure default appointment durations.
- **Weekly Schedule Settings:**  
  - Set start and end times for each day of the week.

---

## **Performance and Scalability**
- **Scalability:**  
  - The system must support a large number of users and appointments without compromising performance.
- **Performance Targets:**  
  - Ensure fast response times and efficient processing, particularly during peak scheduling and notification dispatch.

---

## **Integration and Compliance**
- **Integration:**  
  - No current plans for integration with external calendar applications or payment processors.
- **Security & Compliance:**  
  - Although specific security standards (e.g., GDPR, HIPAA) have not yet been defined, this aspect will be revisited and integrated as the project evolves.

---

## **Detailed Phases**

### **Phase 1: Project Setup and Environment Configuration**

1. **Repository Initialization:**
   - Initialize a new Git repository.
   - Set up the project structure according to the provided folder structure.

2. **Environment Setup:**
   - Install **Bun** and set it as your package manager.
   - Create a `package.json` for the backend and configure necessary scripts.
   - Configure environment variables (e.g., database connection strings) in the `server/config/` directory.

3. **Frontend Setup:**
   - Use the following command to create the React app:
     ```bash
     bun create vite my-vue-app --template react-ts
     ```
   - Ensure that all React components are created with the `.tsx` extension.

4. **Dependency Installation:**
   - **Backend:** Install Express, Mongoose, and additional required packages.
   - **Frontend:** Install React, Ant Design (antd), and other necessary libraries.
   
5. **Initial Testing:**
   - Write basic tests to ensure the server and client are set up correctly and communicate properly.

### **Phase 2: Core Authentication and User Flow**

1. **Authentication Module:**
   - Develop login functionality on the backend using Express and middleware for authentication and role-based access.
   - Create a basic login page in React (located in `client/src/pages/Login.tsx`).

2. **Organization Redirection:**
   - Implement logic to check if a Super Admin has created an organization.
   - Redirect new users to the **Create Organization Page**; existing users should navigate to the **Dashboard**.

3. **UI Layout:**
   - Build a basic dashboard layout with header and sidebar navigation using Ant Design.
   - Set up placeholder pages for Appointments, Services, Staff, Customers, Organization, Attendance, Insights, and Settings.

4. **Testing & Debugging:**
   - Verify user authentication flows.
   - Test redirection logic to ensure correct routing based on organization status.

### **Phase 3: Feature Modules Development**

1. **Roles & Permissions Module:**
   - Develop backend endpoints for creating, updating, and deleting roles.
   - Build a UI in React for role management.
   - Ensure roles have assigned permissions for accessing specific sidebar tabs.

2. **Organization Management:**
   - Develop CRUD endpoints for organizations.
   - Build UI for creating and switching between organizations.

3. **Services Management:**
   - Implement CRUD endpoints for services (name, description, duration, price).
   - Create React pages for adding, editing, and listing services.

4. **Staff Management:**
   - Develop endpoints for staff management and assign services during creation.
   - Build React components for managing staff.

5. **Client Management:**
   - Create CRUD endpoints for clients with fields such as name, phone number, email, priority score, preferred staff/days, and monthly appointment slot allocations.
   - Build a user interface for managing clients.

6. **Appointment Management:**
   - **Manual Appointments:**  
     - Build endpoints for manual appointment scheduling.
     - Develop UI components for selecting staff, client, and available slots.
   - **AI-Generated Appointments:**  
     - Implement logic to generate appointments based on client availability, priority score, preferred staff, and service timings.
     - Provide an option for manual override.
   
7. **Notification System:**
   - Develop functionality to send WhatsApp notifications:
     - **For Clients:**  
       - Send appointment details with a confirmation URL (including buttons for Yes [default] and No).
     - **For Staff:**  
       - Send a daily summary message with appointment details.
   - Integrate or simulate WhatsApp API if live integration is not feasible initially.

8. **Attendance Management:**
   - Create endpoints and UI components to log and view client attendance records.

9. **Audit and Logging:**
   - Implement audit logging on the backend to track user actions across modules.
   - Build a basic UI to view audit logs for administrators.

10. **Insights and Reporting:**
    - Develop endpoints to collect and calculate metrics (sessions per staff, revenue, etc.).
    - Display insights on the dashboard using charts or tables with Ant Design.

11. **Settings Module:**
    - Develop configurable settings for themes (Light/Dark), appointment durations, and weekly schedules.
    - Build corresponding UI components.

### **Phase 4: Testing, Optimization, and Deployment**

1. **Comprehensive Testing:**
   - Perform unit tests, integration tests, and end-to-end tests for both backend and frontend.
   - Validate all business flows (appointment scheduling, notifications, role-based access).

2. **Performance and Scalability:**
   - Optimize database queries and API endpoints.
   - Stress-test the application to ensure it can handle high volumes of users and appointments.

3. **Security Review:**
   - Implement robust error handling, secure authentication, and necessary middleware.
   - Revisit security standards (GDPR, HIPAA, etc.) as the project requirements evolve.

4. **Documentation and Final Touches:**
   - Update the README.md with setup, usage, and deployment instructions.
   - Ensure the codebase is well-documented and maintainable.

5. **Deployment:**
   - Prepare the application for deployment using your preferred cloud provider or hosting platform.
   - Set up continuous integration and deployment pipelines.

---

## **Deliverables**

- A fully functional MERN-based application.
- Source code organized according to the provided folder structure.
- Complete documentation including setup, running instructions, and deployment details.
- A working WhatsApp notification system (or simulation thereof).
- Comprehensive audit logs and insights features.
- A clean, modular, and maintainable codebase.
