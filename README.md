# Skill Swap Platform 🎓

A full-stack MERN application designed for college students to exchange skills without monetary transactions.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [How It Works](#how-it-works)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [Usage Guide](#usage-guide)
- [Project Status](#project-status)

---

## 🎯 Overview

**Skill Swap** is a peer-to-peer skill exchange platform where college students can teach and learn from each other for free. Instead of paying for tutoring or courses, users can offer their skills and request to learn skills from peers.

### Problem Statement
- College students need access to various skills (coding, design, languages, instruments, etc.)
- Traditional tutoring is expensive
- Students often have expertise they can share with peers

### Solution
A platform that:
- Connects students with complementary skills
- Enables direct skill exchanges
- Facilitates scheduling and session management
- Builds community through ratings and reviews

---

## ✨ Features

### User Authentication
- ✅ Secure registration with college information
- ✅ Email & password login
- ✅ JWT-based session management
- ✅ Protected routes & private user data

### User Profile
- ✅ Complete profile with name, college, email, phone
- ✅ Skills management (skills offered & skills needed)
- ✅ Experience level tracking
- ✅ User bio/introduction
- ✅ Rating & review history
- ✅ Session history

### Skill Matching & Discovery
- ✅ Search for users with specific skills
- ✅ Smart suggestions for typos or no exact matches
- ✅ Popular skills grid fallback
- ✅ View user profiles before requesting

### Request Management
- ✅ Send skill exchange requests
- ✅ Accept/decline incoming requests
- ✅ View request status
- ✅ Yellow warning if request not accepted

### Session Management
- ✅ Schedule sessions (date, time, duration)
- ✅ Unlimited reschedule capability
- ✅ Mark sessions as ongoing/completed
- ✅ Cancel sessions
- ✅ Complete session lifecycle tracking

### Reviews & Ratings
- ✅ Rate sessions on 5-star scale
- ✅ Leave written feedback
- ✅ View aggregate ratings on profiles
- ✅ Prevent duplicate reviews
- ✅ Visual confirmation after submission

### Dashboard
- ✅ View all active sessions
- ✅ Categorized by status (Pending, Scheduled, Ongoing, Completed, Cancelled)
- ✅ Quick action buttons for session management

---

## 🔄 How It Works

### User Journey - Step by Step

#### 1. **Registration & Profile Setup**
   - New user registers with email, password, phone, and college
   - User creates profile with bio, experience level
   - User adds skills they can teach & skills they want to learn

#### 2. **Discovery & Search**
   - User searches for students with desired skills
   - System shows matching profiles or suggestions
   - User views profile details and reviews

#### 3. **Request Skills**
   - User clicks "Connect" to send skill exchange request
   - Request goes to other student's inbox
   - Shows skills being offered & requested

#### 4. **Accept Request**
   - Recipient reviews request
   - Clicks "Accept" to move to scheduling phase
   - **Important:** Request must be accepted before scheduling

#### 5. **Schedule Session**
   - ScheduleModal opens automatically after accepting
   - Users set date, time, and duration
   - Session status becomes "Scheduled"

#### 6. **Conduct Session**
   - At scheduled time, users mark session as "Ongoing"
   - Skills are exchanged (peer-to-peer)
   - Users mark session as "Completed" when done

#### 7. **Rate & Review**
   - "Write Review" button appears in Completed tab
   - User leaves 1-5 star rating
   - User optionally adds feedback
   - Button changes to "✓ Submitted" (green, disabled)

#### 8. **Ratings Update**
   - Other user's profile rating updates
   - Reviews visible on user's profile
   - Help future students make better matches

---

## 🛠️ Technology Stack

### **Frontend**
- **Framework:** React 18 with React Router v6
- **Build Tool:** Vite (fast development server)
- **HTTP Client:** Axios with JWT interceptor
- **State Management:** React Context API (AuthContext)
- **Styling:** CSS3 with CSS Variables
- **Responsive Design:** Mobile-first approach

### **Backend**
- **Runtime:** Node.js with Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Security:** bcryptjs for password hashing
- **Environment:** .env file for configuration

### **Database**
- **Collections:** Users, Sessions, Requests, Ratings
- **Relationships:** Populated references between collections
- **Indexes:** Optimized for user lookups and session queries

### **Deployment**
- Backend runs on port 5000
- Frontend runs on port 5173 (Vite dev server)
- MongoDB connection configured via environment variables

---

## 📁 Project Structure

```
Skill_Swap/
├── Frontend/                    # React application
│   ├── src/
│   │   ├── pages/              # Page components (Dashboard, Profile, etc.)
│   │   ├── components/         # Reusable components (Modals, Avatar, etc.)
│   │   ├── services/           # API service calls
│   │   ├── styles/             # CSS styles organized by page/component
│   │   ├── App.jsx             # Main app component
│   │   ├── AuthContext.jsx     # Authentication state management
│   │   └── main.jsx            # Entry point
│   ├── vite.config.js          # Vite configuration
│   └── package.json            # Frontend dependencies
│
├── Backend/                     # Express.js server
│   ├── controllers/            # Business logic for routes
│   ├── Models/                 # MongoDB Mongoose schemas
│   ├── routes/                 # API endpoint definitions
│   ├── middleware/             # Authentication middleware
│   ├── DataBase/               # Database connection
│   ├── index.js                # Server entry point
│   └── package.json            # Backend dependencies
│
├── FINAL_REVIEW.md             # Comprehensive project review
├── README.md                   # This file
└── approach/                   # Design documents

```

---

## 📋 Prerequisites

Before setting up the project, ensure you have:

1. **Node.js** (v14 or higher)
   - Download from: https://nodejs.org/

2. **MongoDB** (local or cloud instance)
   - Local: https://docs.mongodb.com/manual/installation/
   - Cloud: MongoDB Atlas (https://www.mongodb.com/cloud/atlas)

3. **Git** (for version control)
   - Download from: https://git-scm.com/

4. **Code Editor** (recommended: VS Code)
   - Download from: https://code.visualstudio.com/

5. **npm** or **yarn** (comes with Node.js)

---

## 🚀 Installation & Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/Deekshith1983/Skill_Swap.git
cd Skill_Swap
```

### Step 2: Backend Setup

#### Install Dependencies
```bash
cd Backend
npm install
```

#### Configure Environment Variables
Create a `.env` file in the Backend directory with:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=development
```

**Note:** Do not commit `.env` file to version control

#### Verify Setup
```bash
# Check if all dependencies are installed
npm list
```

### Step 3: Frontend Setup

#### Install Dependencies
```bash
cd ../Frontend
npm install
```

#### Configure API Endpoint
The frontend is pre-configured to point to `http://localhost:5000` for API calls. If your backend runs on a different port, update the API configuration file.

#### Verify Setup
```bash
# Check if all dependencies are installed
npm list
```

---

## 🏃 Running the Application

### Option 1: Run Backend & Frontend Separately (Recommended for Development)

#### Terminal 1 - Start Backend Server
```bash
cd Backend
npm start
```
Expected output: "Server running on port 5000"

#### Terminal 2 - Start Frontend Development Server
```bash
cd Frontend
npm run dev
```
Expected output: "Local: http://localhost:5173"

### Option 2: Run Both from Root (if scripts configured)
```bash
npm run dev
```

### Accessing the Application
- **Frontend:** Open browser and go to `http://localhost:5173`
- **Backend API:** `http://localhost:5000`
- **MongoDB:** Verify connection in backend startup messages

---

## 📖 Usage Guide

### First Time User

1. **Register**
   - Click "Register" on landing page
   - Fill in email, password, phone, and college
   - Submit registration form

2. **Complete Profile**
   - Navigate to Profile page
   - Add bio and experience level
   - Add skills you can teach
   - Add skills you want to learn

3. **Search for Skills**
   - Go to Search page
   - Enter a skill you want to learn
   - Browse matching user profiles
   - Click "Connect" to send request

4. **Manage Requests**
   - Go to Requests page
   - View incoming requests from others
   - Accept requests you're interested in
   - Schedule accepted requests

5. **Attend Sessions**
   - Go to Schedule page
   - View scheduled sessions
   - Mark as "Ongoing" when session starts
   - Mark as "Completed" when finished

6. **Leave Reviews**
   - In Schedule page, go to "Completed" tab
   - Click "Write Review" button
   - Rate and add feedback
   - Confirm submission

### Navigation
- **Dashboard:** Overview of activity
- **Profile:** View/edit your profile
- **Search:** Find users with skills
- **Requests:** Manage incoming requests
- **Schedule:** View and manage all sessions

---

## ✅ Project Status

**Current Version:** 1.0.0  
**Status:** ✅ **PRODUCTION READY** (98% complete)

### What's Implemented
- ✅ Complete authentication system
- ✅ Full user profile management
- ✅ Skill matching and discovery
- ✅ Session management with unlimited reschedules
- ✅ Professional review and rating system
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Error handling and validation


---

## 📝 Notes

- All user data is encrypted and secured
- Sessions are stateless using JWT tokens
- Password hashing ensures security
- Each user can only see their own data
- Reviews are anonymous to prevent bias
- Sessions can be managed flexibly with unlimited reschedules

---
