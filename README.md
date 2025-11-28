# EcoSync

EcoSync is a waste management logistics platform built with React, Node.js, and MongoDB. It provides real-time fleet tracking, automated waste segregation guidance, and analytics for municipal waste collection.

## Features

- **Fleet Management**: Real-time tracking of collection vehicles using geospatial data.
- **Segregation Guide**: Interactive guide for waste classification (Organic, Recyclable, Hazardous).
- **Analytics Dashboard**: Metrics for tonnage processed, carbon offset, and operational uptime.
- **Responsive UI**: Mobile-first design using Tailwind CSS and Framer Motion.

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS v3
- **Backend**: Node.js, Express.js, MongoDB (Mongoose)
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **HTTP Client**: Axios

## Getting Started

1.  **Install dependencies:**

    ```bash
    npm install
    ```

2.  **Configure Environment:**
    Create a `.env` file in the root directory:

    ```env
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/ecosync
    ```

3.  **Run Full Stack (Frontend + Backend):**
    ```bash
    npm run dev:full
    ```
    Or run individually:
    - Frontend: `npm run dev`
    - Backend: `npm run server`

## Project Structure

```
ecoSync/
├── src/                # Frontend (React)
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page views
│   └── assets/         # Static assets
├── server/             # Backend (Express)
│   ├── config/         # Database configuration
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   └── index.js        # Server entry point
└── public/             # Static public assets
```
