# MERN To-Do List App

A full-stack To-Do List application built with MongoDB, Express, React, and Node.js.

## Folder Structure

```
app/
├── backend/
│   ├── config/        # Database connection
│   ├── controllers/   # Route handler logic
│   ├── models/        # Mongoose schemas
│   ├── routes/        # Express route definitions
│   ├── services/      # Database operations
│   └── server.js
├── frontend/
│   └── src/
│       └── App.jsx
└── package.json
```

## Setup Instructions

### 1. Clone the repo and install dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend && npm install
```

### 2. Set up environment variables

Create a `.env` file in the `app/` root folder:

```
MONGO_URI=your_mongodb_connection_string
PORT=5000
CLIENT_URL=https://your-netlify-url.netlify.app
```

Create a `.env` file in the `frontend/` folder:

```
VITE_API_URL=https://your-render-backend-url.onrender.com
```

### 3. Run the app locally

```bash
# Run backend (from app/ folder)
npm run dev

# Run frontend (from frontend/ folder)
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/todos | Get all tasks |
| GET | /api/todos/search?q=keyword | Search tasks by text |
| POST | /api/todos | Create a new task |
| PATCH | /api/todos/:id | Update task (text or completed) |
| DELETE | /api/todos/:id | Delete a task |

## Deployment

- **Backend**: Deployed on [Render](https://render.com)
- **Frontend**: Deployed on [Netlify](https://netlify.com)

## Challenges Faced

- **Controller-Service-Routes split**: Separating concerns across three layers was new for me. I put raw DB queries in the service, response logic in the controller, and kept routes just for mapping URLs to controllers.
- **Search API**: Used MongoDB's `$regex` operator to do a case-insensitive keyword search on the `text` field.
- **Loading and error states**: Added `loading` and `error` useState variables in React and showed messages in the UI so users know what's happening.
- **Environment variables**: Moved the hardcoded API URL to `import.meta.env.VITE_API_URL` so the frontend works with any backend URL without changing code.
