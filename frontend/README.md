# Complaint Box

A lightweight, role-based CRUD web application designed to streamline internal workplace issue reporting. Employees can log in to raise and track complaints, while Administrators manage employee accounts across dedicated pages, provide resolution remarks, and update complaint resolution statuses.

---

## Tech Stack

- **Frontend:** React (Vite), React Router, Tailwind CSS, Axios, Lucide React
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL (Neon DB in production)
- **Authentication:** JSON Web Tokens (JWT) & `bcryptjs` with role-based route protection
- **Deployment:** Vercel (Serverless Backend + Static SPA Frontend)

---

## User Roles & Application Pages

### Public Routes
| Path | Page | Description |
| :--- | :--- | :--- |
| `/` | Landing Page | Overview of the portal and workflow with a login call-to-action. |
| `/login` | Unified Login | Authenticates users and redirects to the Employee or Admin dashboard based on role. |

### Employee Portal (`Role: Employee`)
| Path | Page | Description |
| :--- | :--- | :--- |
| `/employee/dashboard` | Employee Dashboard | Lists the logged-in employee's complaints (highlighting `Pending` items), provides a modal to raise new complaints, and allows deleting own entries. |
| `/complaints/:id` | Complaint Details | Displays the full title, description, timestamp, resolution status, and Admin resolution remarks (if provided). |

### Admin Portal (`Role: Admin`)
| Path | Page | Description |
| :--- | :--- | :--- |
| `/admin/dashboard` | Admin Dashboard | Master view of all organization complaints with submitter details and delete controls. |
| `/admin/complaints/:id` | Admin Complaint Details | Displays full complaint details with a form to update status (`Pending`, `Resolved`, `Rejected`) and submit resolution remarks (mandatory if status is `Rejected`). |
| `/admin/employees` | Employee Directory | Lists all registered employees (`employee_id` and `email`). |
| `/admin/employees/new` | Create Employee | Dedicated form to register a new employee account. |
| `/admin/employees/:id/edit` | Edit Employee | Dedicated form to update an employee's email or reset their password. |

---

## Database Schema

### `users`
| Column | Type | Constraints |
| :--- | :--- | :--- |
| `id` | `SERIAL` | Primary Key |
| `employee_id` | `VARCHAR(50)` | Unique, Nullable (null for Admin) |
| `email` | `VARCHAR(255)` | Unique, Not Null |
| `password` | `VARCHAR(255)` | Not Null (bcrypt hash) |
| `role` | `VARCHAR(20)` | Not Null (`Admin` \| `Employee`) |
| `created_at` | `TIMESTAMPTZ` | Default `CURRENT_TIMESTAMP` |
| `updated_at` | `TIMESTAMPTZ` | Auto-updated via trigger |

### `complaints`
| Column | Type | Constraints |
| :--- | :--- | :--- |
| `id` | `SERIAL` | Primary Key |
| `user_id` | `INTEGER` | Foreign Key → `users(id)` (`ON DELETE CASCADE`) |
| `title` | `VARCHAR(255)` | Not Null |
| `description` | `TEXT` | Not Null |
| `status` | `VARCHAR(20)` | Not Null, Default `'Pending'` (`Pending` \| `Resolved` \| `Rejected`) |
| `remarks` | `TEXT` | Nullable (Mandatory when status is set to `'Rejected'`) |
| `created_at` | `TIMESTAMPTZ` | Default `CURRENT_TIMESTAMP` |
| `updated_at` | `TIMESTAMPTZ` | Auto-updated via trigger |

---

## Backend API Reference

All protected endpoints require the `Authorization` header:
```http
Authorization: Bearer <your_jwt_token>
```

### 1. Health & Authentication (`/api`)

| Method | Endpoint | Access | Request Body | Description |
| --- | --- | --- | --- | --- |
| `GET` | `/api/health` | Public | — | Verifies API and server availability. |
| `POST` | `/api/auth/login` | Public | `{ "email", "password" }` | Authenticates user and returns `{ token, user }`. |
| `GET` | `/api/auth/me` | Authenticated | — | Returns the currently authenticated user's decoded profile. |

### 2. Employee Management (`/api/employees`)

| Method | Endpoint | Access | Request Body | Description |
| --- | --- | --- | --- | --- |
| `GET` | `/api/employees` | Admin | — | Retrieves all users with the `Employee` role. |
| `GET` | `/api/employees/:id` | Admin | — | Retrieves a single employee's `id`, `employee_id`, and `email`. |
| `POST` | `/api/employees` | Admin | `{ "employee_id", "email", "password" }` | Registers a new employee account with a hashed password. |
| `PUT` | `/api/employees/:id` | Admin | `{ "email", "password" (optional) }` | Updates an employee's email and optionally resets their password. |

### 3. Complaints (`/api/complaints`)

| Method | Endpoint | Access | Request Body | Description |
| --- | --- | --- | --- | --- |
| `GET` | `/api/complaints` | Authenticated | — | **Employee:** returns own complaints with remarks. **Admin:** returns all complaints with submitter info and remarks. |
| `GET` | `/api/complaints/:id` | Authenticated | — | Returns full details of a complaint including remarks (Employees can only access their own). |
| `POST` | `/api/complaints` | Employee | `{ "title", "description" }` | Submits a new complaint with default status `Pending`. |
| `PATCH` | `/api/complaints/:id/status` | Admin | `{ "status", "remarks" (optional) }` | Updates status (`Pending`, `Resolved`, `Rejected`) and resolution remarks. `remarks` is required when status is `Rejected`. |
| `DELETE` | `/api/complaints/:id` | Authenticated | — | **Employee:** deletes own complaint. **Admin:** deletes any complaint. |

---

## Local Development Setup

### 1. Clone & Database Setup

```bash
git clone https://github.com/Adil-km/complaint_box.git
cd complaint_box
```

Create a PostgreSQL database named `complaint_box` and run `backend/schema.sql`:

```bash
psql -U postgres -d complaint_box -f backend/schema.sql
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/complaint_box
JWT_SECRET=your_jwt_secret
```

Seed the initial Admin account (`admin@gmail.com` / `admin@123`) and start the server:

```bash
npm run seed
npm run dev
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the Vite development server:

```bash
npm run dev
```
