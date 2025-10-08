# 👥 Follow Endpoints

Base URL: `http://localhost:3000/api/follow`

All endpoints require authentication via JWT token.

---

## 1. Follow/Unfollow User (Toggle)

**POST** `/api/follow/toggle`

**Headers:** `Authorization: Bearer {token}`

```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

## 2. Get User Followers

**GET** `/api/follow/:userId/followers?page=1&limit=10`

**Headers:** `Authorization: Bearer {token}`

---

## 3. Get User Following

**GET** `/api/follow/:userId/following?page=1&limit=10`

**Headers:** `Authorization: Bearer {token}`

---

## 4. Check if Following

**GET** `/api/follow/check/:userId`

**Headers:** `Authorization: Bearer {token}`

