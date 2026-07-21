<div align="center">

# 🌍 VoyageAI

**Your Intelligent AI Travel Companion**

VoyageAI is a next-generation travel platform that transforms the way you plan your trips. By seamlessly combining intelligent itinerary generation, budget estimation, and smart recommendations into a single, unified experience, VoyageAI removes the friction from travel planning so you can focus on the journey.

<br />

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Gemini_AI-8E75B2?style=flat-square&logo=google-gemini&logoColor=white" alt="Gemini AI" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white" alt="Framer Motion" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel" />
  <img src="https://img.shields.io/badge/Render-46E3B7?style=flat-square&logo=render&logoColor=white" alt="Render" />
</p>

</div>


## ✈️ About VoyageAI

Planning a trip is often overwhelming. Traditional travel planning forces you to bounce between dozens of tabs—cross-referencing flights, scouting hotels, reading restaurant reviews, checking the weather, and manually calculating budgets on a spreadsheet. 

**VoyageAI changes everything.**

We’ve built a centralized, intelligent platform that orchestrates your entire travel experience. Simply tell VoyageAI your departure city, destination, travel dates, budget, number of travellers, and travel style. Within seconds, it generates a comprehensive, personalized travel itinerary tailored precisely to your preferences. 

---

## ✨ Key Features

### 🤖 AI Trip Planner
Experience personalized itinerary generation powered by advanced AI. VoyageAI understands your destination and travel style, delivering destination-aware and budget-aware recommendations that feel tailor-made for you.

### 📅 Personalized Day-wise Itinerary
Never wonder what to do next. Get an optimized daily schedule featuring morning activities, afternoon plans, evening experiences, and daily highlights to ensure you make the most of every moment.

### ✈️ Intelligent Flight Recommendations
Find the perfect way to get there. Discover travel-style-specific airline recommendations, estimated fares, and return flight suggestions, complete with direct booking links.

### 🏨 Hotel Recommendations
Rest easy with hotels matched perfectly to your travel preferences. VoyageAI provides curated hotel recommendations complete with pricing estimates, descriptions, and direct booking links.

### 🍽 Restaurant Recommendations
Discover local dining experiences curated by cuisine and ratings. From hidden local gems to fine dining, find exactly what you're craving with integrated Google Maps links.

### 🌤 Weather Forecasts
Pack perfectly every time. Access destination-specific weather forecasts including temperature and conditions to help you prepare for your journey.

### 💰 Smart Budget Planner
Keep your finances in check effortlessly. View a comprehensive breakdown of your estimated trip cost, covering flights, hotels, restaurants, attractions, and transportation.

### 📍 Attraction Discovery
Uncover the best your destination has to offer. From famous tourist attractions and hidden gems to cultural experiences and nature destinations, VoyageAI guides your adventure.

### ❤️ Saved Trips
Never lose a great plan. Save your generated itineraries to revisit and organize your future travel plans at any time.

### 👤 Personalized Dashboard
Manage your travel life from a central hub. Access your dashboard overview, saved trips, the AI planner, your travel statistics, and a deeply customizable user profile.

### 🔐 Secure Authentication
Your data is safe. Enjoy secure email sign-up and login, seamless session management, and a protected dashboard experience.

### 🎨 Modern User Experience
Travel planning should be beautiful. Enjoy a fully responsive design featuring modern glassmorphism, smooth animations, dark mode, and a highly polished, reusable design system.

---

## ⚖️ Why VoyageAI?

| Planning Aspect | Without VoyageAI (Traditional) | With VoyageAI |
| :--- | :--- | :--- |
| **Flights** | Searching multiple airline aggregators | Tailored recommendations instantly |
| **Hotels** | Cross-referencing booking sites | Curated stays matching your style |
| **Dining** | Reading endless review sites | Top-rated local cuisine curated for you |
| **Itinerary** | Manual spreadsheets & generic blogs | AI-optimized, day-wise scheduling |
| **Budget** | Manual calculator math | Automatic comprehensive cost estimation |
| **Weather** | Separate weather apps | Integrated destination forecasts |
| **Time Spent** | Days of stressful research | Seconds of intelligent generation |

---

## 💻 Tech Stack

| Frontend | Backend | AI | Database | Authentication | Styling | Deployment |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Next.js, React, TypeScript | FastAPI, Python | Google Gemini | Supabase (PostgreSQL) | Supabase Auth | Tailwind CSS, Framer Motion | Vercel, Render |

---

## ⚙️ Running Locally

Follow these steps to run VoyageAI on your local machine:

**1. Clone the repository**
```bash
git clone https://github.com/manasir747/VoyageAI.git
cd voyageai
```

**2. Install dependencies**
```bash
npm install
```

**3. Configure environment variables**
Set up the `.env` files in both the frontend and backend directories.

**4. Configure Supabase & Gemini**
Ensure your Supabase project is active and you have a valid Google Gemini API key.

**5. Start backend**
```bash
cd apps/api
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**6. Start frontend**
```bash
# In a new terminal from the root directory
npm run dev:web
```

---

## 🔑 Environment Variables

### Frontend (`apps/web/.env.local`)
| Variable |
| :--- |
| `NEXT_PUBLIC_APP_NAME` |
| `NEXT_PUBLIC_API_BASE_URL` |
| `NEXT_PUBLIC_SUPABASE_URL` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| `API_URL` |

### Backend (`apps/api/.env`)
| Variable |
| :--- |
| `APP_NAME` |
| `APP_ENV` |
| `APP_DEBUG` |
| `APP_HOST` |
| `APP_PORT` |
| `API_V1_PREFIX` |
| `CORS_ORIGINS` |
| `GEMINI_API_KEY` |

---

## 📂 Project Structure

```text
voyageai/
├── apps/
│   ├── web/
│   └── api/
├── docker/
├── package.json
└── README.md
```

---

## 🚀 Deployment

- **Frontend** → Deployed via Vercel
- **Backend** → Deployed via Render
- **Database** → Hosted on Supabase
- **Authentication** → Managed by Supabase Auth

---

## 🗺 Roadmap

• Live Flight APIs  
• Live Hotel APIs  
• Currency Conversion  
• AI Chat Assistant  
• Collaborative Trip Planning  
• Visa Requirement Assistant  
• Offline Trip Support  
• Mobile Application  

---

## Explore VoyageAI

Dive into the codebase, experience the speed of the AI-powered travel planner, and discover how modern artificial intelligence can completely redefine how we explore the world.
