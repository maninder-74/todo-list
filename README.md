# TaskFlow — Full-Stack To-Do List App

A complete full-stack To-Do List application built with **React.js**, **Node.js**, **Express.js**, and **MongoDB**.

---

## 📁 Project Structure

```
todo-app/
├── backend/                  # Node.js + Express REST API
│   ├── config/
│   │   └── db.js             # MongoDB connection setup
│   ├── controllers/
│   │   └── taskController.js # All API logic (CRUD + stats)
│   ├── middleware/
│   │   ├── validators.js     # express-validator rules
│   │   └── errorHandler.js   # Global error + 404 handling
│   ├── models/
│   │   └── Task.js           # Mongoose schema (UUID _id)
│   ├── routes/
│   │   └── taskRoutes.js     # Express router
│   ├── .env.example          # Environment variable template
│   ├── package.json
│   └── server.js             # App entry point
│
└── frontend/                 # React.js SPA
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Dashboard.js  # Main layout & orchestration
    │   │   ├── FilterBar.js  # Search, filter, sort controls
    │   │   ├── StatsBar.js   # Task count statistics
    │   │   ├── TaskCard.js   # Individual task row
    │   │   ├── TaskForm.js   # Create/edit modal
    │   │   ├── TaskList.js   # Renders list + loading state
    │   │   └── Toast.js      # Success/error notifications
    │   ├── context/
    │   │   └── TaskContext.js # Global state (useReducer)
    │   ├── services/
    │   │   └── taskService.js # Axios API calls
    │   ├── App.js
    │   └── index.css         # Global dark-theme styles
    ├── .env.example
    └── package.json
```

---

## ⚙️ Backend Setup (Node.js + Express + MongoDB)

### Prerequisites
- Node.js ≥ 18.x
- MongoDB Atlas account (free tier works) or local MongoDB

### Steps

```bash
# 1. Navigate to backend
cd todo-app/backend

# 2. Install dependencies
npm install

# 3. Create .env file from template
cp .env.example .env
# Edit .env and fill in your MONGODB_URI

# 4. Start development server
npm run dev       # uses nodemon (auto-restart)
# OR
npm start         # production

# Server runs on http://localhost:5000
```

### Environment Variables (`.env`)

| Variable       | Description                         | Example                                  |
|----------------|-------------------------------------|------------------------------------------|
| `PORT`         | Server port                         | `5000`                                   |
| `MONGODB_URI`  | MongoDB connection string           | `mongodb+srv://user:pass@cluster/todoapp`|
| `NODE_ENV`     | Environment mode                    | `development`                            |
| `FRONTEND_URL` | Allowed CORS origin                 | `http://localhost:3000`                  |

---

## 🎨 Frontend Setup (React.js)

```bash
# 1. Navigate to frontend
cd todo-app/frontend

# 2. Install dependencies
npm install

# 3. Create .env file
cp .env.example .env
# Set REACT_APP_API_URL to your backend URL

# 4. Start development server
npm start

# App runs on http://localhost:3000
```

### Environment Variables (`.env`)

| Variable             | Description            | Example                        |
|----------------------|------------------------|--------------------------------|
| `REACT_APP_API_URL`  | Backend API base URL   | `http://localhost:5000/api`    |

---

## 🔌 API Endpoints

| Method   | Endpoint                        | Description                      |
|----------|---------------------------------|----------------------------------|
| `GET`    | `/api/tasks`                    | Get all tasks (filters/search)   |
| `GET`    | `/api/tasks/stats`              | Get task count by status         |
| `GET`    | `/api/tasks/:id`                | Get single task                  |
| `POST`   | `/api/tasks`                    | Create new task                  |
| `PUT`    | `/api/tasks/:id`                | Full update task                 |
| `PATCH`  | `/api/tasks/:id`                | Partial update (e.g. status)     |
| `DELETE` | `/api/tasks/:id`                | Delete single task               |
| `DELETE` | `/api/tasks?status=completed`   | Bulk delete by status            |

### Query Parameters for `GET /api/tasks`
- `status` — filter by `pending` | `in-progress` | `completed`
- `priority` — filter by `low` | `medium` | `high`
- `category` — filter by category name
- `search` — full-text search in title and description
- `sortBy` — `createdAt` | `updatedAt` | `dueDate` | `priority` | `title`
- `order` — `asc` | `desc`
- `page` — page number (default: 1)
- `limit` — results per page (default: 20)

### Sample Request — Create Task
```json
POST /api/tasks
{
  "title": "Complete assignment",
  "description": "Finish the backend API task",
  "priority": "high",
  "status": "in-progress",
  "category": "Work",
  "dueDate": "2025-03-15T18:00:00Z"
}
```

---

## 🚀 Deployment

### Backend → Render
1. Push code to GitHub
2. Create new **Web Service** on [render.com](https://render.com)
3. Select your GitHub repo → set Root Directory to `backend`
4. Build command: `npm install` | Start command: `npm start`
5. Add Environment Variables in Render dashboard
6. Copy the deployed URL (e.g. `https://todoapi.onrender.com`)

### Frontend → Netlify
1. Push code to GitHub
2. Create new site on [netlify.com](https://netlify.com) → Import from GitHub
3. Set Base directory: `frontend` | Build command: `npm run build` | Publish directory: `frontend/build`
4. Add Environment Variable: `REACT_APP_API_URL = https://todoapi.onrender.com/api`
5. Deploy!

---

## 🧪 Testing with Postman

1. Import the following into Postman:
   - **Base URL**: `http://localhost:5000`
2. Test each endpoint manually using the table above
3. Use **Body → raw → JSON** for POST/PUT/PATCH requests

---

## ✨ Features

- ✅ Full CRUD for tasks
- 🔍 Real-time search, filter by status/priority
- 📊 Live stats dashboard (total, pending, in-progress, completed)
- ⚡ Instant status toggle (click checkbox)
- 🗑 Bulk delete all completed tasks
- 📅 Due date tracking with overdue indicators
- 🔔 Toast notifications for all actions
- 📄 Pagination for large task lists
- 🌑 Dark-themed responsive UI

---

## 🛠 Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| UUID as MongoDB `_id` instead of ObjectId | Overrode `_id` field in Mongoose schema with `type: String, default: uuidv4` |
| CORS issues between React & Express | Configured `cors` middleware with explicit `origin` from env variable |
| Filter state syncing with API calls | Used `useReducer` + `useEffect` in Context to re-fetch when filters change |
| Race conditions on rapid status toggles | Added local `toggling` state to disable the button until API responds |
| Validation on both client and server | Used `express-validator` server-side + custom `validate()` function client-side |

---

## 📦 Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React 18, Context API, Axios      |
| Backend   | Node.js 18, Express.js 4          |
| Database  | MongoDB Atlas, Mongoose 8         |
| Validation| express-validator                 |
| ID gen    | UUID v4                           |
| Deploy    | Netlify (frontend), Render (backend)|
