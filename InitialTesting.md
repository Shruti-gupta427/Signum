# Signum — API Testing Guide

> Base URL (local): `http://localhost:3000`
> Base URL (production): `https://signum.onrender.com`

---

## Prerequisites

- Postman installed
- Server running (`npm run dev`)
- MongoDB connected

---

## 1. Send Email Notification

**POST** `/notify`

Headers:
```
Content-Type: application/json
```

Body:
```json
{
  "userId": "user_1",
  "channel": "email",
  "email": "your@gmail.com",
  "message": {
    "subject": "Signum Test",
    "body": "Signal everything, miss nothing."
  },
  "priority": 0
}
```

Expected Response:
```json
{
  "queued": true,
  "id": "xxxxxxxxxxxxxxxx"
}
```

Expected Result:
- Email received in inbox ✅

---

## 2. Send SMS Notification

**POST** `/notify`

Body:
```json
{
  "userId": "user_1",
  "channel": "sms",
  "phone": "9876543210",
  "message": {
    "body": "Your OTP is 1234"
  },
  "priority": 0
}
```

Expected Response:
```json
{
  "queued": true,
  "id": "xxxxxxxxxxxxxxxx"
}
```

Expected Result:
- Terminal shows: `[SMS] → 9876543210: Your OTP is 1234` ✅

---

## 3. Broadcast Notification

**POST** `/notify/broadcast`

Body:
```json
{
  "userIds": ["user_1", "user_2", "user_3"],
  "channel": "email",
  "message": {
    "subject": "Broadcast Test",
    "body": "This is a broadcast message!"
  },
  "priority": 2
}
```

Expected Response:
```json
{
  "queued": true,
  "recipients": 3
}
```

---

## 4. SSE Connection

**GET** `/subscribe/sse?userId=user_1`

Open in browser:
```
http://localhost:3000/subscribe/sse?userId=user_1
```

Expected Result:
- Browser stays connected ✅
- Terminal shows connection added ✅

Then send notification:
```json
{
  "userId": "user_1",
  "channel": "sse",
  "message": {
    "title": "Live!",
    "body": "SSE works!"
  },
  "priority": 1
}
```

Expected Result:
- Browser receives notification instantly ✅

---

## 5. Notification History

**GET** `/notifications/:userId`

```
GET /notifications/user_1
```

Expected Response:
```json
[
  {
    "_id": "xxx",
    "userId": "user_1",
    "channel": "email",
    "status": "delivered",
    "priority": 0,
    "createdAt": "2024-11-01T10:00:00Z"
  }
]
```

---

## 6. Unread Count

**GET** `/notifications/:userId/unread`

```
GET /notifications/user_1/unread
```

Expected Response:
```json
{
  "count": 5
}
```

---

## 7. Mark as Read

**PATCH** `/notifications/:id/read`

```
PATCH /notifications/6512345abc123def456789/read
```

Expected Response:
```json
{
  "success": true
}
```

---

## 8. Priority Queue Test

Send in this order as fast as possible:

**Request 1 — LOW**
```json
{
  "userId": "user_2",
  "channel": "email",
  "email": "your@gmail.com",
  "message": { "subject": "Promo", "body": "50% off!" },
  "priority": 3
}
```

**Request 2 — CRITICAL**
```json
{
  "userId": "user_2",
  "channel": "email",
  "email": "your@gmail.com",
  "message": { "subject": "OTP", "body": "Your OTP is 9999" },
  "priority": 0
}
```

**Request 3 — HIGH**
```json
{
  "userId": "user_2",
  "channel": "email",
  "email": "your@gmail.com",
  "message": { "subject": "Order", "body": "Order placed!" },
  "priority": 1
}
```

Expected email order:
```
1st → OTP   (CRITICAL - priority 0)
2nd → Order (HIGH - priority 1)
3rd → Promo (LOW - priority 3)
```

---

## 9. Rate Limiter Test

Send same SMS request 6 times quickly:

```json
{
  "userId": "user_1",
  "channel": "sms",
  "phone": "9876543210",
  "message": {
    "body": "Test OTP"
  },
  "priority": 0
}
```

Check MongoDB:
```js
db.notifications.find({ status: 'rate_limited' })
```

Expected Result:
- At least 1 notification with `rate_limited` status ✅

---

## 10. Retry Logic Test

Temporarily add to `src/channels/email.js`:
```js
throw new Error('Simulated failure');
```

Send email notification:
```json
{
  "userId": "user_1",
  "channel": "email",
  "email": "your@gmail.com",
  "message": {
    "subject": "Retry Test",
    "body": "Testing retry logic"
  },
  "priority": 0
}
```

Expected terminal:
```
attempt 1 failed → retry in 2s
attempt 2 failed → retry in 4s
attempt 3 failed → marked as failed
```

Check MongoDB:
```js
db.notifications.find({ status: 'failed' })
```

Remove error line after testing!

---

## API Reference

### Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /notify | Send single notification |
| POST | /notify/broadcast | Send to multiple users |
| GET | /subscribe/sse?userId=xxx | SSE connection |
| GET | /notifications/:userId | Notification history |
| GET | /notifications/:userId/unread | Unread count |
| PATCH | /notifications/:id/read | Mark as read |

---

## Status Reference

| Status | Meaning |
|---|---|
| queued | Added to queue |
| processing | Being delivered |
| delivered | Successfully sent |
| pending | User offline |
| failed | All retries exhausted |
| rate_limited | Too many requests |
| read | User read it |

---

## Priority Reference

| Priority | Value | Use Case |
|---|---|---|
| CRITICAL | 0 | OTP, security alerts |
| HIGH | 1 | Payments, orders |
| MEDIUM | 2 | Reminders |
| LOW | 3 | Promotions |

---

## Channel Reference

| Channel | Description |
|---|---|
| email | Email via Nodemailer |
| sms | SMS stub (console.log) |
| ws | WebSocket real-time |
| sse | Server-Sent Events |

---

## Rate Limits

| Channel | Capacity | Refill Rate |
|---|---|---|
| SMS | 5 requests | 1 per 10s |
| Email | 10 requests | 1 per 2s |
| WebSocket | 100 requests | 10 per 1s |
| SSE | 100 requests | 10 per 1s |

---

## Retry Policy

| Attempt | Delay |
|---|---|
| 1st retry | 2 seconds |
| 2nd retry | 4 seconds |
| 3rd retry | 8 seconds |
| Max attempts | 3 |
| After max | marked as failed |