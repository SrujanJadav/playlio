# Plaxlio 🎨🎮

**Plaxlio** is a real-time, interactive multiplayer arcade platform built for drawing battles, animal quizzes, music trivia, and couples game modes. Featuring rich CRT/retro pixel design, fluid animations, and live socket communication, Plaxlio offers a premium, engaging gaming experience.

---

## 🎮 Game Modes

### 🎨 Draw n Guess
Classic real-time drawing. One player gets a word and sketches it on the digital canvas while other players race against the clock to guess the word in chat.

### 🐾 Animal Quiz
A test of speed and identification. A heavily zoomed-in animal picture flashes on the screen, and the first player to correctly guess and type the animal name scores points.

### 🎵 Music Quiz
Lyric-based music trivia. Players are given a snippet of song lyrics and must choose the correct song from multiple choices. Once answered, the album art spins in as the music plays.

### 💕 Couples Mode
A sweet, spicy, and honest trivia mode designed for two players. One partner answers questions honestly, and the other attempts to guess their partner's response.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS & Custom CSS
- **Animations**: Motion (Framer Motion) & GSAP
- **3D Graphics**: Three.js & React Three Fiber (R3F)
- **AI/CV Integration**: Face-API.js (face tracking/expression features)
- **Routing**: React Router DOM (v7)
- **Communication**: Socket.io-client & Axios

### Backend
- **Server**: Node.js & Express
- **Real-Time Communication**: Socket.io
- **Database**: MongoDB & Mongoose
- **Authentication**: Passport.js (Google OAuth 2.0) & JSON Web Tokens (JWT)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (Local or Atlas Uri)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/SrujanJadav/playlio.git
   cd playlio
   ```

2. Install dependencies for both the Client and Server:
   ```bash
   # Install client dependencies
   cd client
   npm install

   # Install server dependencies
   cd ../server
   npm install
   ```

### Environment Configuration

#### Server Setup (`server/.env`)
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

#### Client Setup (`client/.env`)
Create a `.env` file in the `client` directory:
```env
VITE_SERVER_URL=http://localhost:5000
```

### Running Locally

To run the application locally, you will need to start both the backend server and frontend development server.

#### Start the Backend Server:
```bash
cd server
npm start # or npm run dev
```

#### Start the Frontend Client:
```bash
cd client
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

---

## 🌐 Production Deployment

- **Frontend**: Hosted on [Vercel](https://plaxlio.vercel.app/)
  - Features dynamic URL rewrite configurations inside `vercel.json` for SPA routes fallback and HTTP proxying to Render.
- **Backend**: Hosted on [Render](https://playlio.onrender.com)
  - Features persistent Node.js servers enabling full WebSocket/Socket.io capability.
- **OAuth Callback**: Configured dynamically to redirect users back to the frontend after authenticating with Google Cloud Console.
