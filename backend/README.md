# Asset Management System - Backend

This is the backend service for the Asset Management System. It is built using Node.js, Express, and Prisma with a PostgreSQL database.

## Prerequisites

- Node.js
- PostgreSQL

## Getting Started

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Copy the `.env.sample` file to a new file named `.env` and configure your database and app credentials:
   ```bash
   cp .env.sample .env
   ```

4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```
