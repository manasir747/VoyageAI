<div align="center">

# 🌍 VoyageAI

**Your Intelligent Travel Companion**

VoyageAI is a modern, AI-powered travel planning platform designed to generate intelligent, personalized itineraries. It seamlessly recommends flights, hotels, restaurants, and attractions while estimating budgets and tailoring experiences to your unique travel style.

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel" />
  <img src="https://img.shields.io/badge/Render-46E3B7?style=flat-square&logo=render&logoColor=white" alt="Render" />
</p>

![App Screenshot Placeholder](path/to/hero_screenshot.png)

</div>

---

## 📑 Table of Contents
- [Project Highlights](#-project-highlights)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Future Improvements](#-future-improvements)

---

## ✨ Project Highlights

✔ **AI-powered itinerary generation** tailored to your budget and travel style.  
✔ **Live weather forecasts** integrated directly into your travel plans.  
✔ **Smart recommendations** for hotels and flights based on real-world data.  
✔ **Interactive dashboard** to manage saved trips and view travel statistics.  
✔ **Beautiful responsive UI** built with modern glassmorphism and animations.  

---

## 🚀 Key Features

### 🤖 AI Planning
- Personalized itineraries & day-wise plans
- Budget estimation based on travel style
- Smart attraction recommendations

### ✈️ Travel Integrations
- Context-aware flight recommendations
- Real hotel & dining recommendations
- Live weather forecasts

### 🔐 Security & Auth
- Secure login & email verification via Supabase
- Protected user dashboard & session management
- Personalized user profiles

### 🎨 Modern UI/UX
- Responsive design & dark mode support
- Smooth animations (Framer Motion)
- Glassmorphism aesthetic & centralized design system

---

## 💻 Tech Stack

| Layer | Technologies |
| --- | --- |
| **Frontend** | Next.js, React, TypeScript, TailwindCSS, ShadCN UI, Framer Motion |
| **Backend** | FastAPI, Python |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth |
| **Deployment** | Vercel (Frontend), Render (Backend) |

---

## 📁 Project Structure

```text
voyageai/
├── apps/
│   ├── web/                # Next.js Frontend Application
│   │   ├── src/app/        # App Router Pages (Dashboard, Planner, Auth)
│   │   ├── src/components/ # Reusable UI components & Design System
│   │   └── src/lib/        # Supabase clients and utility functions
│   └── api/                # FastAPI Python Backend
│       ├── app/api/        # API Routes (v1)
│       ├── app/schemas/    # Pydantic Models for AI generation
│       └── app/services/   # Gemini AI and business logic
├── docker/                 # Local development & production configurations
└── package.json            # Monorepo workspaces configuration
```

---

## ⚙️ Installation

### 1. Clone & Install
```bash
git clone https://github.com/manasir747/VoyageAI.git
cd voyageai
npm install
```

### 2. Configure Environment Variables
Set up your `.env` files in both the frontend and backend directories (see [Environment Variables](#-environment-variables)).

### 3. Setup Backend
```bash
cd apps/api
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 4. Run Application
Run both frontend and backend concurrently from the root directory:
```bash
npm run dev
```

---

## 🔑 Environment Variables

### Frontend (`apps/web/.env.local`)
| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_APP_NAME` | Application name (VoyageAI) |
| `NEXT_PUBLIC_API_BASE_URL` | Backend URL (e.g., `http://localhost:8000`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key |
| `API_URL` | Internal API URL (`http://localhost:8000`) |

### Backend (`apps/api/.env`)
| Variable | Description |
| --- | --- |
| `APP_NAME` | API Name |
| `APP_ENV` | Environment (`development` or `production`) |
| `APP_DEBUG` | Debug mode (`true` or `false`) |
| `APP_HOST` / `APP_PORT` | Server binding (e.g., `0.0.0.0` / `8000`) |
| `API_V1_PREFIX` | Route prefix (`/api/v1`) |
| `CORS_ORIGINS` | Allowed frontend origins |
| `GEMINI_API_KEY` | Google Gemini API Key for itinerary generation |

---



## 🔮 Future Improvements

- Live flight & hotel booking APIs integration.
- Calendar syncing (Google Calendar / Apple Calendar).
- Offline itinerary access via PWA.
- Interactive AI chat assistant for trip modifications.
- Multi-language support and currency conversion.
- Collaborative trip planning with friends.

---

