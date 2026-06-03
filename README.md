# Signum

> Signal everything, miss nothing.

I built Signum because I wanted to understand how 
notification systems like Swiggy or Zomato actually 
work under the hood. Most tutorials just show you 
how to use Firebase - this is the engine itself.

Signum handles real-time delivery over WebSocket 
and SSE, falls back to SMS/Email when users are 
offline, and never silently drops a notification.

---

## What it does

- Delivers notifications in real-time over WebSocket or SSE
- Falls back to SMS or Email when user is offline
- Prioritizes — an OTP always beats a promo message
- Retries failed deliveries with exponential backoff
- Tracks every notification - delivered, pending, failed
- Rate limits per user so no one gets spammed

---

## Why I built this

Most backend projects are just CRUD apps with 
authentication. I wanted something that actually 
solves a real engineering problem.

The interesting parts:

- **Priority Queue** - built from scratch, no libraries
- **Connection Manager** -tracks live WebSocket and SSE 
  connections using WeakMap so dead connections are 
  garbage collected automatically
- **Retry logic** - exponential backoff so failed 
  deliveries don't hammer the system

---

## Stack

- Node.js + Express
- MongoDB + Mongoose
- WebSocket (ws library)
- SSE (native HTTP)
- JWT for auth

No heavy frameworks. No message broker dependencies. 
Just Node doing what Node is good at.

---

## Project structure
<img width="1161" height="505" alt="image" src="https://github.com/user-attachments/assets/7fe5ab68-e0fe-4b3d-9451-97f21740e135" />

---

## API
---

## Running locally

```bash
git clone https://github.com/yourusername/signum.git
cd signum
npm install
cp .env.example .env
# fill in your MONGO_URI and JWT_SECRET
npm run dev
```

---

## Limitations (honest)

- No horizontal scaling yet - connection manager is 
  in-memory, so multiple instances won't share connections
- SMS - plug in 
  Twilio or Nodemailer yourself
- No auth middleware on most routes yet - don't 
  expose this publicly without adding that

  ## SMS Channel
SMS delivery is currently stubbed.
Indian SMS providers require DLT 
registration (TRAI regulation).
Production deployment needs:
- DLT Entity registration
- Approved message templates  
- Provider integration (MSG91/Fast2SMS)

---

## What I learned building this

- How WebSocket heartbeats work and why they matter
- Why WeakMap is better than Map for tracking 
  objects that can be garbage collected
- How priority queues work without using any library
- Why exponential backoff matters for retries

---


## Roadmap

- [x] Priority queue
- [x] Event bus
- [x] Rate limiting
- [x] Connection manager
- [x] Retry logic
- [x] Email channel (Nodemailer)
- [x] SMS channel (plug in provider)
- [x] WebSocket channel
- [x] SSE channel
- [x] Express routes

---

