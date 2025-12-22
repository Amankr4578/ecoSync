# EcoSync

A modern waste management platform with user scheduling, admin dashboard, and real-time notifications.

![React](https://img.shields.io/badge/React-19-blue) ![Node.js](https://img.shields.io/badge/Node.js-Express-green) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)

## Features

- 🗓️ **Schedule Pickups** - Users can schedule waste collection with map-based location selection
- 📊 **Admin Dashboard** - Manage users, pickups, and homepage statistics
- 🔔 **Notifications** - Real-time notifications for pickup status updates
- 🌍 **Interactive Map** - Select pickup location using Leaflet maps
- 📱 **Responsive Design** - Works on desktop and mobile

## Tech Stack

**Frontend:** React, Vite, Tailwind CSS, Framer Motion, Lucide Icons, Leaflet  
**Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT Authentication

---

## Prerequisites

- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

---

## Local Development Setup

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/ecoSync.git
cd ecoSync
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster.mongodb.net/ecosync
JWT_SECRET=your_super_secret_jwt_key_here
```

> ⚠️ Replace with your actual MongoDB Atlas connection string

### 4. Seed admin user (first time only)

```bash
node server/seedAdmin.js
```

This creates an admin account:

- **Email:** admin@ecosync.com
- **Password:** admin123

### 5. Run the application

**Run both frontend and backend together:**

```bash
npm run dev:full
```

**Or run separately:**

```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run dev
```

### 6. Access the app

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api

---

## Available Scripts

| Command            | Description                   |
| ------------------ | ----------------------------- |
| `npm run dev`      | Start frontend (Vite)         |
| `npm run server`   | Start backend (Nodemon)       |
| `npm run dev:full` | Start both frontend & backend |
| `npm run build`    | Build for production          |

---

## Project Structure

```
ecoSync/
├── src/                    # Frontend (React)
│   ├── components/         # UI components
│   │   ├── admin/          # Admin dashboard components
│   │   ├── dashboard/      # User dashboard components
│   │   ├── landing/        # Landing page components
│   │   ├── layout/         # Navbar, Footer
│   │   └── ui/             # Reusable UI (Map picker, Notifications)
│   ├── pages/              # Page views
│   ├── context/            # Auth context
│   └── api/                # Axios API configuration
├── server/                 # Backend (Express)
│   ├── config/             # Database configuration
│   ├── middleware/         # Auth middleware
│   ├── models/             # Mongoose models (User, Pickup, Notification)
│   ├── routes/             # API routes
│   └── index.js            # Server entry point
└── public/                 # Static assets
```

---

## Default Accounts

After running `seedAdmin.js`:

| Role  | Email             | Password |
| ----- | ----------------- | -------- |
| Admin | admin@ecosync.com | admin123 |

Users can register through the app.
