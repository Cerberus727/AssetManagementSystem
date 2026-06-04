<div align="center">
  <img src="./public/Indian_Oil_Logo.svg.png" alt="IOCL Logo" width="150" />
  <h1>IOCL Asset Management System</h1>
  <p>A comprehensive full-stack solution for managing hardware and software assets, employees, locations, vendors, and maintenance tickets.</p>
</div>

---

## 📖 Table of Contents
- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation Guide](#-installation-guide)
  - [1. Clone Repository](#1-clone-repository)
  - [2. Backend Setup](#2-backend-setup)
  - [3. Frontend Setup](#3-frontend-setup)
- [Running the Application](#-running-the-application)
- [Project Structure](#-project-structure)
- [License](#-license)

---

## 🌟 Overview

The **IOCL Asset Management System** is built to streamline the tracking and assignment of organizational assets. From assigning laptops to employees to tracking server room locations and managing vendor relationships, the application provides an intuitive dashboard and robust API to handle all IT and physical asset workflows.

---

## ✨ Key Features

- 📊 **Dynamic Dashboard**: View high-level metrics, recent activities, and statistical summaries at a glance.
- 💻 **Asset Lifecycle Management**: End-to-end tracking of assets including assignments, statuses (Available, Allocated, Repair, Retired), warranties, and cost.
- 👥 **Employee & Vendor Tracking**: Manage employee roles/departments and maintain active records of external suppliers.
- 🏢 **Location Directory**: Hierarchical management of building locations, floors, and specific rooms.
- 🎫 **Ticketing System**: Track maintenance requests, repairs, and associated costs directly tied to specific assets.
- 🔒 **Secure Authentication**: Role-based access control protected by JSON Web Tokens (JWT) and encrypted passwords.
- 🛡️ **Defensive UI Rendering**: Built to handle complex relational data safely with scalable, searchable dropdowns for large datasets.

---

## 🛠 Tech Stack

### Frontend
- **React 19** (via Vite) - UI Framework
- **Tailwind CSS 4** - Utility-first styling
- **React Router DOM** - Client-side routing
- **React-Select** - Advanced scalable dropdowns
- **Recharts** - Data visualization and analytics
- **Lucide React** - Modern iconography

### Backend
- **Node.js & Express.js** - RESTful API Server
- **Prisma ORM** - Next-generation database toolkit
- **PostgreSQL** - Primary relational database
- **JWT & bcryptjs** - Authentication and security

---

## 📋 Prerequisites

Ensure you have the following installed on your local development machine:
- [Node.js](https://nodejs.org/en/) (v18.0.0 or higher recommended)
- [npm](https://www.npmjs.com/) (comes packaged with Node.js)
- [PostgreSQL](https://www.postgresql.org/) (Running locally or hosted via a cloud provider)
- [Git](https://git-scm.com/)

---

## 🚀 Installation Guide

### 1. Clone Repository
Open your terminal and clone the repository to your local machine:
\`\`\`bash
git clone https://github.com/Cerberus727/AssetManagementSystem.git
cd AssetManagementSystem
\`\`\`

### 2. Backend Setup
Navigate into the backend directory and install the necessary dependencies:
\`\`\`bash
cd backend
npm install
\`\`\`

#### Environment Variables
Create a `.env` file in the root of the `backend` directory. Populate it with your specific database credentials and secrets:
\`\`\`env
# Database Connection String
# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/iocl_assets?schema=public"

# Authentication Secret
JWT_SECRET="generate_a_secure_random_secret_key_here"

# Server Port
PORT=5000
\`\`\`

#### Database Migration
Sync the Prisma schema with your PostgreSQL database to create all necessary relational tables:
\`\`\`bash
# Apply the schema to the database
npx prisma db push

# Generate the Prisma Client
npx prisma generate
\`\`\`

### 3. Frontend Setup
Open a **new** terminal window, navigate to the root directory of the project, and install the frontend dependencies:
\`\`\`bash
# From the project root (AssetManagementSystem/)
npm install
\`\`\`

---

## 🏃 Running the Application

To run the application locally, you will need to keep both the backend and frontend servers running simultaneously in separate terminal windows.

### Terminal 1: Backend Server
\`\`\`bash
cd backend
npm run dev
\`\`\`
*The Express API server will start on `http://localhost:5000`.*

### Terminal 2: Frontend Server
\`\`\`bash
# From the project root
npm run dev
\`\`\`
*The React application will be available at `http://localhost:5173` (or the next available port).*

**Next Steps**: 
Open your browser to `http://localhost:5173`, register a new administrator account, log in, and begin managing assets!

---

## 📁 Project Structure

\`\`\`text
AssetManagementSystem/
├── backend/                   # Express.js REST API
│   ├── config/                # Database configurations
│   ├── controllers/           # API request handlers (Assets, Employees, etc.)
│   ├── middleware/            # JWT validation and route protection
│   ├── prisma/                # Prisma schema and migrations
│   ├── routes/                # Express route definitions
│   └── server.js              # Entry point for backend
├── src/                       # React Frontend
│   ├── components/            # Reusable UI (Forms, Modals, Tables, Layout)
│   ├── pages/                 # Full Page Views (Dashboard, AssetList, etc.)
│   ├── routes/                # Protected routing logic
│   └── services/              # Axios API integrators
├── public/                    # Static assets (Images, Icons)
├── package.json               # Frontend dependencies
└── vite.config.js             # Vite bundler configuration
\`\`\`

---

## 📄 License

**Private / Proprietary.** All rights reserved by IOCL.
