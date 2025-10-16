# Lists API Endpoints

## Overview
Este documento descreve todos os endpoints relacionados à funcionalidade de Lists (Listas) da Strak Social API.

Base URL: `/api/lists`

Todos os endpoints requerem autenticação via token JWT em cookie.

---

## Endpoints

### 1. Create List
Cria uma nova lista.

**Endpoint:** `POST /api/lists`

**Request Body:**
```json
{
  "title": "My Favorite Posts",
  "description": "A collection of my favorite content",
  "coverUrl": "https://storage.firebase.com/...",
  "isPrivate": false
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "List created successfully",
  "data": {
    "list": {
      "id": "uuid",
      "userId": "uuid",
      "title": "My Favorite Posts",
      "description": "A collection of my favorite content",
      "coverUrl": "https://storage.firebase.com/...",
      "isPrivate": false,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  }
}
```

**Errors:**
- `400 Bad Request` - Title or description missing/invalid
- `401 Unauthorized` - Not authenticated

---

### 2. Get User Lists
Retorna todas as listas que o usuário criou ou é membro.

**Endpoint:** `GET /api/lists`

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 20)

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Lists retrieved successfully",
  "data": {
    "lists": [
      {
        "id": "uuid",
        "userId": "uuid",
        "title": "My Favorite Posts",
        "description": "A collection of my favorite content",
        "coverUrl": "https://storage.firebase.com/...",
        "isPrivate": false,
        "createdAt": "2025-01-01T00:00:00.000Z",
        "updatedAt": "2025-01-01T00:00:00.000Z",
        "owner": {
          "id": "uuid",
          "name": "John Doe",
          "username": "johndoe",
          "avatar": "https://...",
          "isVerified": false
        },
        "membersCount": 5,
        "isOwner": true
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "hasMore": false
    }
  }
}
```

---

### 3. Get List by ID
Retorna detalhes de uma lista específica.

**Endpoint:** `GET /api/lists/:id`

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "List retrieved successfully",
  "data": {
    "list": {
      "id": "uuid",
      "userId": "uuid",
      "title": "My Favorite Posts",
      "description": "A collection of my favorite content",
      "coverUrl": "https://storage.firebase.com/...",
      "isPrivate": false,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z",
      "owner": {
        "id": "uuid",
        "name": "John Doe",
        "username": "johndoe",
        "avatar": "https://...",
        "isVerified": false
      },
      "membersCount": 5,
      "isOwner": true,
      "isMember": false
    }
  }
}
```

**Errors:**
- `404 Not Found` - List does not exist
- `403 Forbidden` - Private list and user does not have permission

---

### 4. Update List
Atualiza uma lista existente.

**Endpoint:** `PATCH /api/lists/:id`

**Request Body:** (todos os campos são opcionais)
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "coverUrl": "https://storage.firebase.com/...",
  "isPrivate": true
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "List updated successfully",
  "data": {
    "list": {
      "id": "uuid",
      "userId": "uuid",
      "title": "Updated Title",
      "description": "Updated description",
      "coverUrl": "https://storage.firebase.com/...",
      "isPrivate": true,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T12:00:00.000Z"
    }
  }
}
```

**Errors:**
- `404 Not Found` - List does not exist
- `403 Forbidden` - User is not the list owner
- `400 Bad Request` - Invalid field values

---

### 5. Delete List
Deleta uma lista.

**Endpoint:** `DELETE /api/lists/:id`

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "List deleted successfully",
  "data": null
}
```

**Errors:**
- `404 Not Found` - List does not exist
- `403 Forbidden` - User is not the list owner

---

### 6. Get List Members
Retorna todos os membros de uma lista.

**Endpoint:** `GET /api/lists/:id/members`

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "List members retrieved successfully",
  "data": {
    "owner": {
      "id": "uuid",
      "name": "John Doe",
      "username": "johndoe",
      "avatar": "https://...",
      "isVerified": false
    },
    "members": [
      {
        "id": "uuid",
        "name": "Jane Smith",
        "username": "janesmith",
        "avatar": "https://...",
        "isVerified": false,
        "joinedAt": "2025-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

**Errors:**
- `404 Not Found` - List does not exist
- `403 Forbidden` - Private list and user does not have permission

---

### 7. Add Member to List
Adiciona um membro à lista (apenas owner).

**Endpoint:** `POST /api/lists/:id/members`

**Request Body:**
```json
{
  "userId": "uuid"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Member added successfully",
  "data": {
    "member": {
      "id": "uuid",
      "listId": "uuid",
      "userId": "uuid",
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  }
}
```

**Errors:**
- `404 Not Found` - List does not exist
- `403 Forbidden` - User is not the list owner
- `400 Bad Request` - User is already a member

---

### 8. Remove Member from List
Remove um membro da lista.

**Endpoint:** `DELETE /api/lists/:id/members/:userId`

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Member removed successfully",
  "data": null
}
```

**Errors:**
- `404 Not Found` - List or member does not exist
- `403 Forbidden` - User is not the list owner and not removing themselves
- `400 Bad Request` - Owner trying to remove themselves

---

### 9. Search Public Lists
Busca listas públicas.

**Endpoint:** `GET /api/lists/search`

**Query Parameters:**
- `q` (required) - Search query
- `page` (optional, default: 1)
- `limit` (optional, default: 20)

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Lists retrieved successfully",
  "data": {
    "lists": [
      {
        "id": "uuid",
        "userId": "uuid",
        "title": "Tech News",
        "description": "Latest technology news and updates",
        "coverUrl": "https://storage.firebase.com/...",
        "isPrivate": false,
        "createdAt": "2025-01-01T00:00:00.000Z",
        "updatedAt": "2025-01-01T00:00:00.000Z",
        "owner": {
          "id": "uuid",
          "name": "John Doe",
          "username": "johndoe",
          "avatar": "https://...",
          "isVerified": false
        },
        "membersCount": 42,
        "isMember": false,
        "isOwner": false
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "hasMore": true
    }
  }
}
```

---

### 10. Follow List
Segue uma lista pública (adiciona usuário como membro).

**Endpoint:** `POST /api/lists/:id/follow`

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "List followed successfully",
  "data": null
}
```

**Errors:**
- `404 Not Found` - List does not exist
- `403 Forbidden` - List is private

---

### 11. Unfollow List
Para de seguir uma lista (remove usuário dos membros).

**Endpoint:** `DELETE /api/lists/:id/unfollow`

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "List unfollowed successfully",
  "data": null
}
```

**Errors:**
- `404 Not Found` - List does not exist
- `400 Bad Request` - User is the list owner

---

## Upload Endpoints

### Upload List Cover
Faz upload da foto de cover de uma lista.

**Endpoint:** `POST /api/upload/list-cover`

**Request:** `multipart/form-data`
- Field: `cover` (File)

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "List cover uploaded successfully",
  "data": {
    "coverUrl": "https://storage.firebase.com/..."
  }
}
```

**Constraints:**
- Max file size: 5MB
- Allowed types: image/*
- Recommended aspect ratio: 16:9

**Errors:**
- `400 Bad Request` - No file uploaded or invalid file

---

### Delete List Cover
Deleta a foto de cover de uma lista.

**Endpoint:** `DELETE /api/upload/list-cover`

**Request Body:**
```json
{
  "coverUrl": "https://storage.firebase.com/..."
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "List cover deleted successfully",
  "data": null
}
```

**Errors:**
- `400 Bad Request` - No cover URL provided

---

## Validation Rules

### List Title
- Required
- Min length: 1 character
- Max length: 50 characters
- Trimmed

### List Description
- Required
- Min length: 1 character
- Max length: 160 characters
- Trimmed

### Cover URL
- Optional
- Must be a valid URL

### isPrivate
- Optional
- Boolean
- Default: false

---

## Business Rules

1. **List Ownership**
   - Only the list owner can:
     - Update the list
     - Delete the list
     - Add members manually
     - Remove any member

2. **Private Lists**
   - Only visible to the owner
   - Cannot be followed by other users
   - Cannot be searched

3. **Public Lists**
   - Can be discovered via search
   - Anyone can follow (become a member)
   - Members can unfollow at any time

4. **Members**
   - Can view the list and its posts (future feature)
   - Can add posts to the list (future feature)
   - Can only remove their own posts (future feature)
   - Can leave the list at any time (unfollow)

5. **Deletion**
   - Deleting a list also deletes:
     - All list members (cascade)
     - All list posts (cascade)
     - The cover photo from storage

