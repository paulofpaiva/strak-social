# 📝 Posts Endpoints

Base URL: `http://localhost:3000/api/posts`

All endpoints require authentication via JWT token.

---

## 1. Create Post

**POST** `/api/posts`

**Headers:** `Authorization: Bearer {token}`

```json
{
  "content": "My first post on Strak Social! 🚀",
  "media": [
    {
      "mediaUrl": "https://example.com/image1.jpg",
      "mediaType": "image",
      "order": 0
    },
    {
      "mediaUrl": "https://example.com/image2.jpg",
      "mediaType": "image",
      "order": 1
    }
  ]
}
```

---

## 2. List Posts (Feed)

**GET** `/api/posts?page=1&limit=10`

**Headers:** `Authorization: Bearer {token}`

---

## 3. Get Post by ID

**GET** `/api/posts/:postId`

**Headers:** `Authorization: Bearer {token}`

---

## 4. List Posts by User

**GET** `/api/posts/user/:userId?page=1&limit=10`

**Headers:** `Authorization: Bearer {token}`

---

## 5. Update Post

**PUT** `/api/posts/:postId`

**Headers:** `Authorization: Bearer {token}`

```json
{
  "content": "Updated post content! ✨"
}
```

---

## 6. Delete Post

**DELETE** `/api/posts/:postId`

**Headers:** `Authorization: Bearer {token}`

---

## 7. Like/Unlike Post

**POST** `/api/posts/:postId/like`

**Headers:** `Authorization: Bearer {token}`

---

## 8. Get Post Comments

**GET** `/api/posts/:postId/comments?page=1&limit=10`

**Headers:** `Authorization: Bearer {token}`

