# 🔐 Authentication Endpoints

Base URL: `http://localhost:3000/api/auth`

---

## 1. Sign Up

**POST** `/api/auth/sign-up`

```json
{
  "email": "test@example.com",
  "username": "testuser",
  "name": "Test User",
  "password": "password123",
  "avatar": "https://example.com/avatar.jpg",
  "cover": "https://example.com/cover.jpg",
  "bio": "My test bio",
  "birthDate": "1990-01-01"
}
```

---

## 2. Sign In

**POST** `/api/auth/sign-in`

```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

---

## 3. Check Username

**GET** `/api/auth/check-username?username=testuser`

---

## 4. Sign Out

**POST** `/api/auth/sign-out`

**Headers:** `Authorization: Bearer {token}`

```json
{}
```

---

## 5. Get Session

**GET** `/api/auth/session`

**Headers:** `Authorization: Bearer {token}`

---

## 6. Update Profile

**PUT** `/api/auth/profile`

**Headers:** `Authorization: Bearer {token}`

```json
{
  "name": "Updated Name",
  "bio": "Updated bio text",
  "birthDate": "1990-01-01",
  "username": "newusername"
}
```

---

## 7. Update Avatar

**PUT** `/api/auth/avatar`

**Headers:** `Authorization: Bearer {token}`

```json
{
  "avatar": "https://example.com/new-avatar.jpg"
}
```

---

## 8. Update Cover

**PUT** `/api/auth/cover`

**Headers:** `Authorization: Bearer {token}`

```json
{
  "cover": "https://example.com/new-cover.jpg"
}
```

---

## 9. Change Password

**PUT** `/api/auth/change-password`

**Headers:** `Authorization: Bearer {token}`

```json
{
  "currentPassword": "password123",
  "newPassword": "NewPassword123",
  "confirmPassword": "NewPassword123"
}
```
