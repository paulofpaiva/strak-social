# 👤 Users Endpoints

Base URL: `http://localhost:3000/api/users`

All endpoints require authentication via JWT token.

---

## 1. Get User by Username

**GET** `/api/users/username/:username`

**Headers:** `Authorization: Bearer {token}`

---

## 2. Get User by ID

**GET** `/api/users/:userId`

**Headers:** `Authorization: Bearer {token}`

