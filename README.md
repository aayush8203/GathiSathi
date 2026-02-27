# 🚀 GatiSathi — Ride-Share for India

**GatiSathi** is a full-stack carpooling platform built for Indian commuters, supporting both **Car** and **Bike** ride modes. Think BlaBlaCar, but built specifically for Indian cities, with a clean modern UI and real-time features.

---

## ✨ Features

- 🚗 **Dual Mode** — Find or offer car rides AND bike pillion rides
- 🔐 **Passwordless Auth** — Phone/Email-based OTP login
- 📍 **Live Tracking** — Animated route tracking on active rides
- 💬 **Messaging** — Chat with drivers before booking
- 💳 **Wallet** — Earnings, transactions, withdrawal management
- 📋 **Dashboard** — View booked & offered rides
- 👤 **Profile** — Manage your rider profile with ratings
- 🗺️ **Google Maps Integration** — Route visualization with GatiMap

---

## 🏗️ Tech Stack

### Frontend
- **Next.js 15** (App Router) with TypeScript
- **Tailwind CSS v4** for styling
- **Framer Motion** for animations
- **Lucide React** for icons
- **Google Maps JavaScript API**

### Backend  
- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **JWT** for authentication

---

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Google Maps API Key

### 1. Clone the repo
```bash
git clone https://github.com/aayush8203/GathiSathi.git
cd GathiSathi
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
PORT=5000
```

```bash
npm start
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
GatiSathi/
├── backend/
│   ├── models/          # Mongoose schemas (User, Ride, Booking)
│   ├── routes/          # API routes (auth, rides, bookings, users)
│   ├── middlewares/     # JWT auth middleware
│   └── server.js        # Express entry point
│
└── frontend/
    └── src/
        ├── app/         # Next.js pages (App Router)
        │   ├── home/        # Ride search page
        │   ├── book/[id]/   # Booking confirmation
        │   ├── dashboard/   # User dashboard
        │   ├── messages/    # Messaging inbox + chat
        │   ├── publish/     # Offer a ride
        │   ├── track/[id]/  # Live ride tracking
        │   ├── wallet/      # Wallet & earnings
        │   └── profile/     # User profile
        ├── components/  # Reusable components (GatiMap)
        └── context/     # React contexts (UserContext, VehicleContext)
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login / Register via phone or email |
| GET | `/api/users/me` | Get current user profile |
| PUT | `/api/users/profile` | Update name/profile |
| GET | `/api/rides` | Search available rides |
| POST | `/api/rides` | Publish a new ride |
| GET | `/api/rides/my-rides` | Get your offered rides |
| GET | `/api/rides/:id` | Get ride details |
| POST | `/api/bookings` | Book a seat |
| GET | `/api/bookings/my-bookings` | Get your bookings |

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

---

## 📄 License

MIT © 2026 GatiSathi Team
