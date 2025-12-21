# 💬 Sakhi

### A friend in every chat

Sakhi is a real-time cross-platform chatting application built for **web and mobile**.  
It combines fast messaging, live presence updates, and an AI assistant to make conversations feel natural and responsive.

---

## ✨ Features

### 💬 Real-Time Chat

- One-to-one messaging
- WebSocket-based communication
- Instant message delivery
- Online / offline status
- Typing indicators
- Read & delivered receipts

### 🤖 SakhiAI

- Built-in AI chat assistant
- Context-aware responses
- Designed to act as a friendly companion in chats

### 🌍 Cross-Platform Support

- Web application
- Android app
- iOS app

---

## 🛠️ Tech Stack

### Frontend

- React (Web)
- React Native (Android & iOS)
- Expo (Mobile)
- Zustand / Context API (State management)

### Backend

- Node.js
- Express.js
- WebSockets (Real-time communication)
- REST APIs

---

## ⚡ Realtime Capabilities

WebSockets are used to handle:

- Typing start / stop
- Message delivery status
- Read receipts
- User presence (online / offline)

---

## 📱 Supported Platforms

- ✅ Web (Desktop & Mobile Browsers)
- ✅ Android
- ✅ iOS

---

## 📂 Project Structure

    sakhi/
    │
    ├── backend/           # Node.js backend
    │   ├── routes
    │   ├── controllers
    │   └── websocket
    ├── frontend/          # React web application
    ├── mobile/            # React Native app (Android / iOS)
    └── README.md

---

## 🔐 Authentication

- Secure user authentication
- Protected routes
- Token-based authentication

---

## 🚀 Getting Started

### Prerequisites

- Node.js
- npm / yarn
- Expo CLI (for mobile)

### Clone the Repository

```bash
git clone https://github.com/imksh/sakhi.git
cd sakhi
```

## Backend

```bash
cd backend
npm install
npm run dev
```

## Web App

```bash
cd frontend
npm install
npm run dev
```

## Mobile App

```bash
cd mobile
npm install
npx expo start
```
