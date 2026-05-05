# 🚨 Incident Management System (IMS)

A resilient, scalable Incident Management System designed to handle high-volume signals, process them asynchronously, and manage incident workflows with mandatory RCA validation.

---
## 🔗 GitHub Repository
https://github.com/Hari658-collab/Incident-Managment-Sysytem

---
## 🏗️ Architecture Diagram
IMS-Architecture Diagram.png

This system follows an event-driven architecture for handling high-volume signals.

- React frontend provides incident dashboard
- Node.js backend receives signals via REST API
- Redis queue handles asynchronous processing
- Worker processes signals and applies debouncing logic
- MongoDB stores raw signals (audit log)
- PostgreSQL stores incidents and RCA (source of truth)
- Redis cache improves dashboard performance

This design ensures scalability, fault tolerance, and efficient processing.

---
###🔄 Flow

Client → Backend API → Redis Queue → Worker → MongoDB + PostgreSQL → React Dashboard

---
## ⚙️ Tech Stack

- **Frontend**: React
- **Backend**: Node.js (Express)
- **Queue**: Redis
- **NoSQL (Signals)**: MongoDB
- **RDBMS (Work Items)**: PostgreSQL
- **Containerization**: Docker & Docker Compose
  
---

## 🚀 Features

- Async signal processing using Redis queue
- High-throughput ingestion handling
- MongoDB stores raw signals (audit logs)
- PostgreSQL stores structured work items
- Debouncing logic (multiple signals → single incident)
- Incident lifecycle:
  - OPEN → INVESTIGATING → RESOLVED → CLOSED
- Mandatory RCA validation before closing incident
- MTTR (Mean Time To Repair) calculation
- React dashboard for monitoring incidents
- Rate limiting support (basic)
- Retry logic for DB failures
- Throughput logging (Signals/sec)
  
-------

## 🐳 Setup Instructions (Docker)

### 1. Clone Repository

git clone https://github.com/Hari658-collab/Incident-Managment-Sysytem

cd ims-project

### 2. RUN Application
docker-compose up --build

### 3. Services
| Service     | URL                                            |
| ----------- | -----------------------------------------------|
| Backend API | [http://localhost:3000]                        |
| Frontend    | [http://localhost:3001]                        |
| MongoDB     | localhost:27017                                |
| Redis       | localhost:6379                                 |
| PostgreSQL  | localhost:5432                                 |

--------

# 💻 Run Without Docker
Backend:

cd backend
npm install
node index.js

------
Frontend:

cd frontend
npm install
npm start

------

# 🔌 API Endpoints
✅ Health Check:
GET /health  | http://localhost:3000/health

# 📥 Create Signal:
POST /signals | http://localhost:3000/Signals

 Body:
   {
  "componentId": "API_SERVER",
  "severity": "HIGH"
   }
# 📊 Get Incidents:
GET /incidents | https://localhost:3000/incidents

# 🔄 Update Incident (Status + RCA):
PUT /incidents/:id | https://localhost:3000/incidents/id/status

  Body:
    {
  "status": "CLOSED",
  "rca": "Database connection issue resolved"
    }

---------

# 🔁 Backpressure Handling

Signals are pushed into Redis queue instead of direct DB writes
Worker processes signals asynchronously
Prevents API overload during high traffic (10,000 signals/sec)
Ensures system stability even if database is slow

---------

# 🧠 Data Handling Strategy

| Purpose          | Technology |
| ---------------- | ---------- |
| Raw Signals      | MongoDB    |
| Work Items (RCA) | PostgreSQL |
| Queue            | Redis      |
| Dashboard Cache  | Redis      |

---------
# 🔒 Security & Validation

Input validation on APIs
Invalid status transitions blocked
RCA mandatory before closing incident

--------
# ⚡ Performance Optimizations

Redis caching for fast dashboard load
Async processing via worker
Debouncing duplicate signals

--------
# 🛡️ Resilience

Retry logic for database operations
Queue-based architecture prevents data loss
System continues even if one service slows down

-------
# 📈 Observability
/health endpoint for system check
Logs signals throughput (Signals/sec)
Console monitoring for worker activity

# 🧪 Testing
API Testing
 * Tested using Postman
 * Verified all endpoints
   
Load Simulation:
   for i in {1..100}
   do
    curl -X POST http://localhost:3000/signals \
    -H "Content-Type: application/json" \
    -d '{"componentId":"API_SERVER","severity":"HIGH"}'
   done

-------
Validation Tested:

RCA required before CLOSED
Status transition rules
Data persistence across services

-------

# 📊 MTTR Calculation

MTTR = End Time - Start Time
Automatically calculated when incident is CLOSED

--------
# Project Structure

ims-project/
├── backend/
├── frontend/
├── docker-compose.yml
├── README.md
├── architecture.png

--------

## 🎯 Bonus Features

- Async queue-based architecture (Redis)
- Debouncing logic for signals
- Redis caching for dashboard
- MTTR calculation
- RCA validation before closure
- Retry logic for DB operations

--------

## 📌 Submission Notes

- Fully working application using Docker
- Backend + Frontend included
- All requirements implemented
- GitHub repository attached

## 👤 Author

Harichandana Mittapally
