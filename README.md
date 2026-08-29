# 🎵 Addis Sound — MERN Music Management & Analytics Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![Redux-Saga](https://img.shields.io/badge/Redux--Saga-86D46B?style=for-the-badge&logo=redux-saga&logoColor=white)](https://redux-saga.js.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Emotion](https://img.shields.io/badge/Emotion-D26AC2?style=for-the-badge&logo=emotion&logoColor=white)](https://emotion.sh/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

A modern, full-stack **MERN (MongoDB, Express, React, Node.js)** music catalog management and real-time analytics platform built with **strict TypeScript**, **Redux Toolkit & Redux-Saga**, and a custom **dark glassmorphism design system** powered by `@emotion/styled`.

---

## 🌟 Key Features

### 1. 🎵 Song Catalog & Library
* **Full CRUD Operations**: Create, view, update, and delete songs instantly.
* **Instant Client-Side Search**: Filter by Title, Artist, Album, or Genre in real-time.
* **Dynamic Sorting**: Sort catalog by *Recently Added*, *Title (A-Z)*, *Artist (A-Z)*, or *Album (A-Z)*.
* **Interactive Genre Filter Pills**: Live interactive genre chips with real-time song count badges.
* **Quick Add & Edit Modals**: Form validation with live feedback and quick genre selectors.
* **Delete Confirmation Dialogs**: Safeguarded destructive actions.

### 2. 📊 Catalog Analytics & Insights Dashboard
* **KPI Metrics**: Total distinct Songs, Artists, Albums, and Genres.
* **Podium Showcases (Top 3)**:
  * 👑 **Top 3 Artists** ranked by song count with Gold/Silver/Bronze badges and album counts.
  * 🏆 **Top 3 Albums** ranked by track count with artist attribution.
  * 🏷️ **Top 3 Genres** ranked by catalog share percentage and track count.
* **Deep-Dive Catalog Breakdowns**:
  * **Songs by Genre**: Visual progress bars and catalog percentage distributions.
  * **Recently Added Songs**: Live feed with relative timestamps (*"Just now"*, *"2h ago"*, *"Yesterday"*), vinyl disc badges, and genre tags.
  * **Artists Directory**: Full list of all artists with song and album counts.
  * **Albums Directory**: Full list of all albums with artists and track counts.
  * **Independent Scrolling**: All deep-dive cards feature independent internal scrolling with sticky table headers.

### 3. ⚡ Zero-Reload Real-Time Synchronization
* State management orchestrated via **Redux-Saga side effects**.
* Mutations (create, update, delete) automatically trigger non-blocking background refreshes of both the song library and analytics aggregation without requiring page reloads.

### 4. 🔠 Universal Case-Insensitive Normalization
* Song creation and updates accept any letter casing (`lowercase`, `UPPERCASE`, or `Mixed Case`).
* Automatic server-side **Title Case normalization** ensures clean, unfragmented catalog data across all fields (`title`, `artist`, `album`, `genre`).

### 5. 🎨 Aesthetic & Design
* Custom sleek dark glassmorphism theme using `@emotion/styled`.
* Modern typography, glowing neon accents, gradient badges, and smooth micro-animations.

---

## 🏗️ Architecture & Tech Stack

```
addis/
├── backend/                  # REST API & Aggregation Engine
│   ├── src/
│   │   ├── controllers/      # Route controllers (songs, statistics)
│   │   ├── models/           # Mongoose schemas & Title Case hooks
│   │   ├── routes/           # Express router endpoints
│   │   ├── services/         # Business logic & MongoDB aggregation pipelines
│   │   ├── validators/       # Zod schema validation
│   │   ├── app.ts            # Express configuration & middleware
│   │   └── server.ts         # Server bootstrap & MongoDB connection
│   ├── Dockerfile            # Multi-stage production container
│   ├── .env.docker           # Docker environment variables
│   └── package.json
├── frontend/                 # React Single Page Application (SPA)
│   ├── src/
│   │   ├── api/              # Axios REST client
│   │   ├── components/       # Reusable UI components (Navbar, Modals, Cards, Pills)
│   │   ├── pages/            # MusicLibrary & StatisticsDashboard views
│   │   ├── store/            # Redux Toolkit slice, Root Store & Redux-Saga
│   │   ├── styles/           # Emotion theme tokens & global animations
│   │   ├── types/            # TypeScript interfaces & domain types
│   │   └── App.tsx           # Router & layout entry point
│   ├── vite.config.ts        # Vite configuration & /api proxy
│   └── package.json
├── docker-compose.yml        # Multi-container orchestration
├── .gitignore
└── README.md
```

### Technology Breakdown

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, Redux Toolkit, Redux-Saga, Emotion (`@emotion/styled`), Lucide React, Axios |
| **Backend** | Node.js, Express.js, TypeScript (`tsx`), Mongoose, MongoDB, Zod validation, CORS, Dotenv |
| **DevOps & Containerization** | Docker, Docker Compose, Multi-stage Docker builds |

---

## 🚀 API Endpoints

### Songs Endpoints (`/api/songs`)

| Method | Endpoint | Description | Query / Body Parameters |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/songs` | Retrieve all songs (or filtered by genre) | Query: `?genre=Pop` (case-insensitive) |
| `GET` | `/api/songs/:id` | Retrieve single song by ID | Params: `id` |
| `POST` | `/api/songs` | Create a new song | Body: `{ title, artist, album, genre }` |
| `PATCH` | `/api/songs/:id` | Update an existing song | Body: `{ title?, artist?, album?, genre? }` |
| `DELETE` | `/api/songs/:id` | Delete a song | Params: `id` |

### Statistics Endpoint (`/api/statistics`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/statistics` | Aggregates total songs, distinct artists, albums, genres, genre distributions, artist/album stats, Top 3 podiums, and recently added songs |

---

## 💻 Local Development Setup

### Prerequisites
* [Node.js](https://nodejs.org/) (v18.0.0 or higher)
* [MongoDB](https://www.mongodb.com/) (local instance running on `localhost:27017` or MongoDB Atlas URI)

### 1. Clone the Repository
```bash
git clone https://github.com/kalabberihun/addis.git
cd addis
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file with your MongoDB connection string:
# PORT=5000
# MONGO_URI=mongodb://localhost:27017/addis_music

npm run dev
```
*Backend server will start at:* `http://localhost:5000`

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
*Frontend application will start at:* `http://localhost:5173`

---

## 🐳 Docker Quickstart

To run the entire platform with MongoDB in containers using a single command:

```bash
docker compose up --build
```

* **Frontend Web App**: `http://localhost:5173`
* **Backend REST API**: `http://localhost:5000`
* **MongoDB**: Running internally on `mongodb:27017`

---

## 🧪 Testing & Verification

The project includes an end-to-end automated test suite verifying all REST endpoints, case-insensitive normalization, aggregation pipelines, and CRUD flows:

```bash
# Verify backend & analytics endpoints
node scratch/comprehensive_test.js

# Verify frontend TypeScript build
cd frontend
npm run build
```

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
