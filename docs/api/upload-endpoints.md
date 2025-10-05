# 📤 Upload Endpoints

Base URL: `http://localhost:3000/api/upload`

All endpoints require authentication via JWT token (except serve endpoints).

---

## 1. Upload Avatar

**POST** `/api/upload/avatar`

**Headers:** 
- `Authorization: Bearer {token}`
- `Content-Type: multipart/form-data`

**Form Data:**
- `avatar`: Image file (max 5MB)

---

## 2. Upload Cover

**POST** `/api/upload/cover`

**Headers:**
- `Authorization: Bearer {token}`
- `Content-Type: multipart/form-data`

**Form Data:**
- `cover`: Image file (max 10MB)

---

## 3. Upload Media

**POST** `/api/upload/media`

**Headers:**
- `Authorization: Bearer {token}`
- `Content-Type: multipart/form-data`

**Form Data:**
- `media`: Image or video file (max 20MB)

---

## 4. Serve Avatar

**GET** `/api/upload/uploads/avatars/:filename`

---

## 5. Serve Cover

**GET** `/api/upload/uploads/covers/:filename`

---

## 6. Serve Media

**GET** `/api/upload/uploads/media/:filename`

