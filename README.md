# 🌍 VoyageAI

A modern AI-powered travel planning platform that generates intelligent travel itineraries, recommends flights, hotels, restaurants, attractions, budgets, and personalized experiences.

---

## ✨ Features

### Landing Page
- Modern animated landing page
- Responsive design
- Theme switching
- Hero section
- Features section
- How It Works section
- Pricing section
- About section
- Smooth scrolling navigation
- Authentication CTA

### Authentication
- Sign Up
- Sign In
- Email verification
- Supabase authentication
- Protected dashboard

### Dashboard
- Modern sidebar
- Search bar
- User profile
- Responsive layout

### AI Trip Planner
- Destination selection
- Departure city selection
- Travel dates
- Budget
- Number of travellers
- Travel style
- AI itinerary generation
- Budget estimation
- Attraction recommendations
- Hotel recommendations
- Flight recommendations
- Restaurant recommendations
- Weather forecast
- Day-wise itinerary
- Save Trip
- Export PDF
- View Full Itinerary

### Flight Recommendations
- Travel-style-aware airline recommendations
- Airline details
- Flight timing information
- Booking redirection

### Hotel Recommendations
- Real hotel recommendations
- Hotel information
- Estimated pricing
- Booking page redirection

### Dining Recommendations
- Real restaurant recommendations
- Ratings
- Cuisine
- Google Maps integration

### Weather
- Live weather forecast
- Multi-day forecast
- Destination-based weather

### User Profile
- Premium profile page
- Editable profile
- Avatar
- Travel preferences
- Travel personality
- Profile completion
- Statistics
- Sticky save bar

### Additional Features
- Dark mode
- Responsive UI
- Animations
- Glassmorphism design
- Modern component system
- Reusable design system

---

## 💻 Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- TailwindCSS
- ShadCN UI
- Framer Motion

### Backend
- FastAPI
- Python

### Database
- Supabase

### Authentication
- Supabase Auth

### Deployment
- Vercel (Frontend)
- Render (Backend)

### Version Control
- GitHub

---

## 📁 Project Structure

This repository is structured as a modern monorepo:

- `apps/web`: The Next.js frontend application containing UI, routing, and presentation logic.
- `apps/api`: The FastAPI Python backend handling AI generation and business logic.
- `docker`: Configurations for environment parity.

---

## 🚀 Installation

### 1. Clone the repository
```bash
git clone https://github.com/manasir747/VoyageAI.git
cd voyageai
```

### 2. Install dependencies
From the root of the project:
```bash
npm install
```

### 3. Setup Environment Variables
Configure your environment variables as detailed in the **Environment Variables** section below.

### 4. Setup the Backend
Navigate to the API app and set up your Python environment:
```bash
cd apps/api
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 5. Run the Application
You can run the entire stack concurrently from the root directory:
```bash
npm run dev
```

Alternatively, to run the services individually:
- **Backend**: `cd apps/api && source venv/bin/activate && uvicorn app.main:app --reload`
- **Frontend**: `npm run dev:web`

---

## 🔑 Environment Variables

The project requires the following environment variables.

### Frontend (`apps/web/.env.local`)
```env
NEXT_PUBLIC_APP_NAME=VoyageAI
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
API_URL=http://localhost:8000
```

### Backend (`apps/api/.env`)
```env
APP_NAME="VoyageAI API"
APP_ENV=development
APP_DEBUG=true
APP_HOST=0.0.0.0
APP_PORT=8000
API_V1_PREFIX=/api/v1
CORS_ORIGINS=http://localhost:3000
GEMINI_API_KEY=your_gemini_api_key
```

---

## 📸 Screenshots

| Landing Page | Dashboard |
|:---:|:---:|
| ![Landing Page](path/to/landing_page_screenshot.png) <br> *The modern animated landing page.* | ![Dashboard](path/to/dashboard_screenshot.png) <br> *Your central hub for travel planning.* |

| AI Planner | Generated Itinerary |
|:---:|:---:|
| ![AI Planner](path/to/ai_planner_screenshot.png) <br> *Intelligent trip generation form.* | ![Generated Itinerary](path/to/itinerary_screenshot.png) <br> *Comprehensive travel plans at a glance.* |

| Profile | |
|:---:|:---:|
| ![Profile](path/to/profile_screenshot.png) <br> *Manage your travel preferences and personality.* | |

---

## 🔮 Future Improvements

- Live flight APIs
- Live hotel image APIs
- Calendar integration
- Offline itineraries
- AI chat assistant
- Expense tracking
- Multi-language support
- Collaborative trip planning

---

## 📄 License

This project is licensed under the terms provided in the repository.
