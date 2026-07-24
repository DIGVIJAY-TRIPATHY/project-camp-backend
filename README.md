# Project Camp Backend — Product Requirements Document (PRD)

|                  |                                           |
| ---------------- | ----------------------------------------- |
| **Product Name** | Project Camp Backend                      |
| **Version**      | 1.0.0                                     |
| **Product Type** | Backend API for Project Management System |

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Target Users](#2-target-users)
3. [Core Features](#3-core-features)
4. [Technical Specifications](#4-technical-specifications)
5. [Security Features](#5-security-features)
6. [File Management](#6-file-management)
7. [Success Criteria](#7-success-criteria)

---

## 1. Product Overview

Project Camp Backend is a RESTful API service designed to support collaborative project management. The system enables teams to:

- Organize **projects**
- Manage **tasks** with **subtasks**
- Maintain **project notes**
- Handle **user authentication** with **role-based access control**

---

## 2. Target Users

| User Type                  | Description                                                              |
| -------------------------- | ------------------------------------------------------------------------ |
| **Project Administrators** | Create and manage projects, assign roles, oversee all project activities |
| **Project Admins**         | Manage tasks and project content within assigned projects                |
| **Team Members**           | View projects, update task completion status, access project information |

---

## 3. Core Features

### 3.1 User Authentication & Authorization

- **User Registration** — Account creation with email verification
- **User Login** — Secure authentication with JWT tokens
- **Password Management** — Change password, forgot/reset password functionality
- **Email Verification** — Account verification via email tokens
- **Token Management** — Access token refresh mechanism
- **Role-Based Access Control** — Three-tier permission system (Admin, Project Admin, Member)

### 3.2 Project Management

- **Project Creation** — Create new projects with name and description
- **Project Listing** — View all projects user has access to, with member count
- **Project Details** — Access individual project information
- **Project Updates** — Modify project information _(Admin only)_
- **Project Deletion** — Remove projects _(Admin only)_

### 3.3 Team Member Management

- **Member Addition** — Invite users to projects via email
- **Member Listing** — View all project team members
- **Role Management** — Update member roles within projects _(Admin only)_
- **Member Removal** — Remove team members from projects _(Admin only)_

### 3.4 Task Management

- **Task Creation** — Create tasks with title, description, and assignee
- **Task Listing** — View all tasks within a project
- **Task Details** — Access individual task information
- **Task Updates** — Modify task information and status
- **Task Deletion** — Remove tasks from projects
- **File Attachments** — Support for multiple file attachments on tasks
- **Task Assignment** — Assign tasks to specific team members
- **Status Tracking** — Three-state status system (Todo, In Progress, Done)

### 3.5 Subtask Management

- **Subtask Creation** — Add subtasks to existing tasks
- **Subtask Updates** — Modify subtask details and completion status
- **Subtask Deletion** — Remove subtasks _(Admin/Project Admin only)_
- **Member Completion** — Allow members to mark subtasks as complete

### 3.6 Project Notes

- **Note Creation** — Add notes to projects _(Admin only)_
- **Note Listing** — View all project notes
- **Note Details** — Access individual note content
- **Note Updates** — Modify existing notes _(Admin only)_
- **Note Deletion** — Remove notes _(Admin only)_

### 3.7 System Health

- **Health Check** — API endpoint for system status monitoring

---

## 4. Technical Specifications

### 4.1 API Endpoints Structure

#### Authentication Routes — `/api/v1/auth/`

| Method | Endpoint                           | Description               | Access  |
| ------ | ---------------------------------- | ------------------------- | ------- |
| POST   | `/register`                        | User registration         | Public  |
| POST   | `/login`                           | User authentication       | Public  |
| POST   | `/logout`                          | User logout               | Secured |
| GET    | `/current-user`                    | Get current user info     | Secured |
| POST   | `/change-password`                 | Change user password      | Secured |
| POST   | `/refresh-token`                   | Refresh access token      | Public  |
| GET    | `/verify-email/:verificationToken` | Email verification        | Public  |
| POST   | `/forgot-password`                 | Request password reset    | Public  |
| POST   | `/reset-password/:resetToken`      | Reset forgotten password  | Public  |
| POST   | `/resend-email-verification`       | Resend verification email | Secured |

#### Project Routes — `/api/v1/projects/`

| Method | Endpoint                      | Description          | Access              |
| ------ | ----------------------------- | -------------------- | ------------------- |
| GET    | `/`                           | List user projects   | Secured             |
| POST   | `/`                           | Create project       | Secured             |
| GET    | `/:projectId`                 | Get project details  | Secured, role-based |
| PUT    | `/:projectId`                 | Update project       | Secured, Admin only |
| DELETE | `/:projectId`                 | Delete project       | Secured, Admin only |
| GET    | `/:projectId/members`         | List project members | Secured             |
| POST   | `/:projectId/members`         | Add project member   | Secured, Admin only |
| PUT    | `/:projectId/members/:userId` | Update member role   | Secured, Admin only |
| DELETE | `/:projectId/members/:userId` | Remove member        | Secured, Admin only |

#### Task Routes — `/api/v1/tasks/`

| Method | Endpoint                         | Description        | Access                       |
| ------ | -------------------------------- | ------------------ | ---------------------------- |
| GET    | `/:projectId`                    | List project tasks | Secured, role-based          |
| POST   | `/:projectId`                    | Create task        | Secured, Admin/Project Admin |
| GET    | `/:projectId/t/:taskId`          | Get task details   | Secured, role-based          |
| PUT    | `/:projectId/t/:taskId`          | Update task        | Secured, Admin/Project Admin |
| DELETE | `/:projectId/t/:taskId`          | Delete task        | Secured, Admin/Project Admin |
| POST   | `/:projectId/t/:taskId/subtasks` | Create subtask     | Secured, Admin/Project Admin |
| PUT    | `/:projectId/st/:subTaskId`      | Update subtask     | Secured, role-based          |
| DELETE | `/:projectId/st/:subTaskId`      | Delete subtask     | Secured, Admin/Project Admin |

#### Note Routes — `/api/v1/notes/`

| Method | Endpoint                | Description        | Access              |
| ------ | ----------------------- | ------------------ | ------------------- |
| GET    | `/:projectId`           | List project notes | Secured, role-based |
| POST   | `/:projectId`           | Create note        | Secured, Admin only |
| GET    | `/:projectId/n/:noteId` | Get note details   | Secured, role-based |
| PUT    | `/:projectId/n/:noteId` | Update note        | Secured, Admin only |
| DELETE | `/:projectId/n/:noteId` | Delete note        | Secured, Admin only |

#### Health Check — `/api/v1/healthcheck/`

| Method | Endpoint | Description          | Access |
| ------ | -------- | -------------------- | ------ |
| GET    | `/`      | System health status | Public |

---

### 4.2 Permission Matrix

| Feature                    | Admin | Project Admin | Member |
| -------------------------- | :---: | :-----------: | :----: |
| Create Project             |   ✓   |       ✗       |   ✗    |
| Update/Delete Project      |   ✓   |       ✗       |   ✗    |
| Manage Project Members     |   ✓   |       ✗       |   ✗    |
| Create/Update/Delete Tasks |   ✓   |       ✓       |   ✗    |
| View Tasks                 |   ✓   |       ✓       |   ✓    |
| Update Subtask Status      |   ✓   |       ✓       |   ✓    |
| Create/Delete Subtasks     |   ✓   |       ✓       |   ✗    |
| Create/Update/Delete Notes |   ✓   |       ✗       |   ✗    |
| View Notes                 |   ✓   |       ✓       |   ✓    |

---

### 4.3 Data Models

**User Roles**

| Role            | Description                         |
| --------------- | ----------------------------------- |
| `admin`         | Full system access                  |
| `project_admin` | Project-level administrative access |
| `member`        | Basic project member access         |

**Task Status**

| Status        | Description                    |
| ------------- | ------------------------------ |
| `todo`        | Task not started               |
| `in_progress` | Task currently being worked on |
| `done`        | Task completed                 |

---

## 5. Security Features

- JWT-based authentication with refresh tokens
- Role-based authorization middleware
- Input validation on all endpoints
- Email verification for account security
- Secure password reset functionality
- File upload security with Multer middleware
- CORS configuration for cross-origin requests

---

## 6. File Management

- Support for multiple file attachments on tasks
- Files stored in `public/images` directory
- File metadata tracking (URL, MIME type, size)
- Secure file upload handling

---

## 7. Success Criteria

- ✅ Secure user authentication and authorization system
- ✅ Complete project lifecycle management
- ✅ Hierarchical task and subtask organization
- ✅ Role-based access control implementation
- ✅ File attachment capability for enhanced collaboration
- ✅ Email notification system for user verification and password reset
- ✅ Comprehensive API documentation through endpoint structure
