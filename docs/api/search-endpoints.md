# 🔍 Search Endpoints

Base URL: `http://localhost:3000/api/search`

All endpoints require authentication via JWT token.

---

## 1. Search Users

**GET** `/api/search/users?q=john&limit=10`

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `q` (required): Search query string
- `limit` (optional): Number of results (default: 10)

