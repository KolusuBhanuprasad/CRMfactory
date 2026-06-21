# MERN Stack Mini CRM Opportunity Tracker

A complete, production-ready Mini CRM application built on the MERN stack (MongoDB, Express, React, Node.js) for sales teams to log client engagements, estimate deal values, coordinate pipeline stages, and track follow-ups securely.

The application leverages **JSON Web Tokens (JWT)** for authentication, implements strict **ownership-based authorization** on all database operations, and delivers a premium **glassmorphic dark-theme user experience** designed with responsive CSS.

---

## Key Features

1. **Secure Registration & Login**: Multi-user registration with cryptographically hashed passwords (`bcryptjs`) and JWT access control.
2. **Opportunity Pipeline Metrics**: Instantly calculated KPI cards at the top of the dashboard showing Total Pipeline Value, Average Deal Value, Win Rate %, and Open Deal count.
3. **Pipeline Stages & Priorities**: Color-coded badges representing deal phases (`New`, `Contacted`, `Qualified`, `Proposal Sent`, `Won`, `Lost`) and priorities (`Low`, `Medium`, `High`).
4. **Ownership Restrictions (Security)**:
   - All opportunities display the owner's name.
   - Users can read all deals, but they **cannot** edit or delete opportunities owned by other users.
   - Ownership controls are enforced **both** on the React UI (conditional action buttons) and on the Express REST API (ownership validation middleware).
5. **Interactive Controls**:
   - Live query searching on Customer Company, Contact Name, and Contact Email.
   - Filtering filters for Stage and Priority.
   - A toggle switch to filter and only view "My Opportunities".
6. **Date Overdue Highlights**: Follow-up dates that are in the past are highlighted in red as high-priority actions.

---

## Directory Structure

```text
CEOfactory/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database Connection
│   ├── controllers/
│   │   ├── authController.js     # Register & Login controllers
│   │   └── opportunityController.js # CRUD opportunity controllers
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT extraction & authentication
│   ├── models/
│   │   ├── User.js               # Mongoose User Schema
│   │   └── Opportunity.js        # Mongoose Opportunity Schema
│   ├── routes/
│   │   ├── authRoutes.js         # Register & Login REST endpoints
│   │   └── opportunityRoutes.js  # Opportunity CRUD REST endpoints
│   ├── .env                      # Local env configs
│   ├── .env.example              # Env configuration template
│   ├── package.json              # Backend package scripts & dependencies
│   └── server.js                 # App Entry Point
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── MetricCard.jsx    # Display individual KPI
│   │   │   ├── Navbar.jsx        # Navigation & User info
│   │   │   └── OpportunityCard.jsx # Render deal cards & actions
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Client global authentication state
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx     # Pipeline dashboard page
│   │   │   ├── Login.jsx         # Card-based login form
│   │   │   ├── OpportunityForm.jsx # Add / Edit deal form
│   │   │   └── Register.jsx      # Card-based register form
│   │   ├── services/
│   │   │   └── api.js            # Axios client with JWT interceptors
│   │   ├── App.jsx               # Client routes & guards
│   │   ├── index.css             # Vibrant glassmorphic global design system
│   │   └── main.jsx              # React mounting file
│   ├── index.html                # App shell HTML, loading Inter/Outfit fonts
│   ├── package.json              # Vite scripts & dependencies
│   └── vite.config.js            # Vite configuration and proxy config
│
├── .gitignore                    # MERN Git exclusion list
├── package.json                  # Root runner package configuration
└── README.md                     # Documentation
```

---

## Local Setup & Installation

Ensure you have **Node.js (v18+)** and **npm** installed on your system.

### 1. Database Configuration
You need either a local MongoDB instance running (`mongodb://127.0.0.1:27017`) or a **MongoDB Atlas Cloud Database Connection String**.
- Open `backend/.env` (and template details in `.env.example`).
- Update `MONGO_URI` to point to your cluster.
- Update `JWT_SECRET` to a secure random string of your choice.

### 2. Dependency Installation
In the root directory of the project, you can install all dependencies in a single step using:
```bash
npm run install-all
```
Alternatively, install them individually in their directories:
```bash
# Install root package devDependencies
npm install

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 3. Run the Application
From the root workspace folder, launch both the backend server and Vite frontend concurrently by running:
```bash
npm run dev
```
- **Backend API Server**: Runs on `http://localhost:5000`
- **Frontend App Server**: Runs on `http://localhost:5173`

---

## Detailed Security Flow Validation

To verify the robust security configurations, perform the following validation steps:

1. **Create User Accounts**:
   - Register **User A** (`usera@test.com`, password `123456`) and log in.
   - Register **User B** (`userb@test.com`, password `123456`) and log in.
2. **Post Opportunity as User A**:
   - Navigate to **User A**'s dashboard.
   - Click "Create Opportunity" and submit a deal for Company XYZ valued at `$150,000`.
   - Verify that this deal appears on User A's dashboard labeled with the "My Deal" badge and has editable/deletable action buttons.
3. **Inspect Visibility on User B**:
   - Log out of User A, and sign in as **User B**.
   - Inspect the Pipeline. The opportunity for Company XYZ is visible and displays owner name **User A**.
   - Note that **no** edit (pencil) or delete (trash can) icons are displayed on the Company XYZ card for User B, preventing UI tampering.
4. **Inspect Backend REST API Restrictions**:
   - Obtain the Opportunity ID of the XYZ deal (e.g. `60d5ec4b12345...`).
   - Using Postman or `curl`, attempt to make a `PUT` or `DELETE` request to:
     `http://localhost:5000/api/opportunities/60d5ec4b12345...`
     with User B's JWT token attached to the `Authorization` header as `Bearer <User_B_Token>`.
   - Verify that the server rejects the request with HTTP Status **`403 Forbidden`** and the JSON body:
     ```json
     { "message": "Not authorized to update this opportunity" }
     ```

---

## Deployment Guidelines

### 1. Database: MongoDB Atlas
1. Sign in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free shared cluster.
3. Under **Network Access**, whitelist connection IPs (e.g., `0.0.0.0/0` to allow Vercel/Render access).
4. Under **Database Access**, create a user credentials set.
5. Retrieve your cluster connection string (e.g. `mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/crm_db?retryWrites=true&w=majority`).

### 2. Backend: Render
1. Push your repository to GitHub.
2. Go to [Render Dashboard](https://dashboard.render.com/) and create a new **Web Service**.
3. Link your GitHub repository.
4. Set the following details:
   - **Name**: `mini-crm-api`
   - **Runtime**: `Node`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Add **Environment Variables**:
   - `MONGO_URI`: *<your_atlas_connection_string>*
   - `JWT_SECRET`: *<your_secure_jwt_secret>*
   - `NODE_ENV`: `production`
6. Click deploy. Render will compile and spin up the live endpoint. Make a note of the live URL (e.g. `https://mini-crm-api.onrender.com`).

### 3. Frontend: Vercel
1. Install Vercel CLI or link GitHub to [Vercel Dashboard](https://vercel.com).
2. Create a new project pointing to your GitHub repository.
3. Set the following configurations:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add **Vercel Config / Redirect Rule** to support SPA client routing. Create a file inside `frontend/vercel.json` if configuring from the root, or configure it on their UI settings.
   - Vercel routes all API endpoints proxy to Render in production:
     Update `api.js` to point base url to Render in production instead of local proxy if desired, or use a `vercel.json` route rewrite:
     ```json
     {
       "rewrites": [
         { "source": "/api/(.*)", "destination": "https://mini-crm-api.onrender.com/api/$1" },
         { "source": "/(.*)", "destination": "/index.html" }
       ]
     }
     ```
     This `vercel.json` rewrites all `/api/...` calls to the Render API endpoint directly, resolving CORS issues without any client-side code modification!

5. Click deploy. Your frontend will be live on a secure Vercel URL!
