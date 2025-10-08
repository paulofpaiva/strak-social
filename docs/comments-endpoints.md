# 💬 Comments Endpoints

Base URL: `http://localhost:3000/api/comments`

All endpoints require authentication via JWT token.

---

## 1. Create Comment

**POST** `/api/comments/:postId`

**Headers:** `Authorization: Bearer {token}`

```json
{
  "content": "Amazing post! 🔥"
}
```

**Optional fields:**
- `parentCommentId`: UUID of parent comment (for replies)
- "media": [
    {
      "mediaUrl": "https://example.com/comment-image.jpg",
      "mediaType": "image",
      "order": 0
    }
  ]

---

## 2. Get Comment by ID

**GET** `/api/comments/comment/:commentId`

**Headers:** `Authorization: Bearer {token}`

---

## 3. List Comments by Post

**GET** `/api/comments/post/:postId?page=1&limit=10`

**Headers:** `Authorization: Bearer {token}`

---

## 4. Update Comment

**PUT** `/api/comments/:commentId`

**Headers:** `Authorization: Bearer {token}`

```json
{
  "content": "Updated comment! ✨"
}
```

---

## 5. Delete Comment

**DELETE** `/api/comments/:commentId`

**Headers:** `Authorization: Bearer {token}`

---

## 6. Like/Unlike Comment

**POST** `/api/comments/:commentId/like`

**Headers:** `Authorization: Bearer {token}`

---

## 7. Get Comment Replies

**GET** `/api/comments/comment/:commentId/replies?page=1&limit=10`

**Headers:** `Authorization: Bearer {token}`

