# IOCL Asset Management System

A full-stack web application designed for comprehensive tracking and management of organizational assets, employees, locations, vendors, and maintenance tickets. The system features a modern React frontend and a robust Express/Prisma backend.

## Features

- **Dashboard**: High-level metrics, recent activities, and statistical summaries.
- **Asset Management**: Full lifecycle management of hardware/software assets including assignments, statuses, and warranties.
- **Employee Management**: Track employee roles, departments, and their assigned assets.
- **Location Tracking**: Manage building locations, floors, and rooms.
- **Vendor Management**: Keep track of suppliers and vendor contact information.
- **Ticketing System**: Issue tracking for asset maintenance, repairs, and requests.
- **Authentication**: Secure JWT-based login and session management.

## Tech Stack

**Frontend**
- React 19 (Vite)
- Tailwind CSS 4
- React Router DOM
- React-Select (for scalable dropdowns)
- Recharts (for dashboard analytics)
- Lucide React (for icons)

**Backend**
- Node.js & Express.js
- Prisma ORM
- PostgreSQL
- JSON Web Tokens (JWT) & bcryptjs (for authentication)

---

## Prerequisites

Before you begin, ensure you have the following installed on your machine:
- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)
- **PostgreSQL** (running locally or remotely)

---

## Installation & Setup

### 1. Clone the repository
\`\`\`bash
git clone <your-repository-url>
cd iocl-asset-managementsystem-main
\`\`\`

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
\`\`\`bash
cd backend
npm install
\`\`\`

#### Environment Variables
Create a `.env` file in the `backend` directory with the following variables:
\`\`\`env
# Database connection string (Update with your PostgreSQL credentials)
DATABASE_URL="postgresql://user:password@localhost:5432/iocl_assets?schema=public"

# JWT Secret for authentication
JWT_SECRET="your_super_secret_jwt_key_here"

# Server Port
PORT=5000
\`\`\`

#### Database Migration
Push the Prisma schema to your PostgreSQL database to create the necessary tables:
\`\`\`bash
npx prisma db push
# or if using migrations:
# npx prisma migrate dev --name init
\`\`\`

*(Optional) Seed the database if you have a seed script prepared.*

### 3. Frontend Setup
Open a new terminal window, navigate to the root directory (where the frontend lives), and install dependencies:
\`\`\`bash
# From the project root
npm install
\`\`\`

*Note: The frontend is configured to communicate with the backend running on `http://localhost:5000` via Axios.*

---

## Running the Application

To run the application locally, you will need two terminal windows to run both the frontend and backend servers simultaneously.

**Terminal 1: Start the Backend Server**
\`\`\`bash
cd backend
npm run dev
\`\`\`
*The backend API will be available at `http://localhost:5000`.*

**Terminal 2: Start the Frontend Server**
\`\`\`bash
# From the project root
npm run dev
\`\`\`
*The React application will be available at `http://localhost:5173` (or the next available port).*

---

## Usage

1. Open your browser and navigate to `http://localhost:5173`.
2. **Login** using your registered administrator credentials.
3. Use the sidebar to navigate between Assets, Employees, Locations, Vendors, and Tickets.
4. The system is equipped with robust global error handling and defensive UI components, ensuring seamless usage even with large datasets.

## Development Notes

- **API Structure**: The frontend cleanly decouples API logic into the `src/services` folder (e.g., `assetService.js`, `authService.js`).
- **Defensive Rendering**: Dropdowns and data tables are implemented defensively to gracefully handle unexpected empty data states without crashing the UI.
- **Searchable Dropdowns**: Long lists (like Employees and Assets) utilize custom searchable select components to improve UX and scalability.

## License

Private / Proprietary. All rights reserved.
