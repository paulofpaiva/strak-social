# Arquitetura de Páginas e Componentes

## Visão Geral

Este documento explica como as páginas principais do sistema estão estruturadas, quais componentes utilizam e como se comunicam entre si.

## 📄 Estrutura de Páginas

### PostView - `/post/:id`
**Localização:** `src/pages/app/posts/[id]/index.tsx`

#### Responsabilidades
- Exibe um post individual em página dedicada
- Mostra comentários do post
- Permite interações (like, comment, edit, delete)
- Navegação inteligente de volta

#### Componentes Utilizados
```tsx
// Componentes principais
import { PostCard } from '@/components/posts/PostCard'
import { PostLoadingSkeleton } from '@/components/posts/PostLoadingSkeleton'

// Navegação
import { createSmartNavigationHandler, useNavigationTracking } from '@/utils/navigation'
```

#### Estrutura
```tsx
<>
  {/* Header com botão Back */}
  <div className="flex items-center space-x-4 mb-6">
    <Button onClick={handleBack}>←</Button>
    <h1>Post</h1>
  </div>

  {/* Post principal */}
  <PostCard 
    post={post}
    showComments={true}
    showDetailedTimestamp={true}  // ✅ Mostra data completa
    disableHover={true}
  />
</>
```

#### Props Especiais do PostCard na PostView
- `showComments={true}` - Exibe seção de comentários
- `showDetailedTimestamp={true}` - Mostra "14:25 · Sep 21, 2025 · Edited"
- `disableHover={true}` - Remove cursor pointer (já estamos na página do post)

---

### CommentView - `/post/:postId/comment/:id`
**Localização:** `src/pages/app/posts/comments/[id]/index.tsx`

#### Responsabilidades
- Exibe um comentário individual em página dedicada
- Mostra replies do comentário
- Permite interações (like, reply, edit, delete)
- Volta sempre para o post pai

#### Componentes Utilizados
```tsx
// Componentes principais
import { Avatar } from '@/components/ui/avatar'
import { CommentActions } from '@/components/comments/CommentActions'
import { CommentReplies } from '@/components/comments/CommentReplies'
import { CommentLoadingSkeleton } from '@/components/comments/CommentLoadingSkeleton'
import { ImageModal } from '@/components/posts/ImageModal'

// API e hooks
import { getCommentApi, likeCommentApi } from '@/api/posts'
import { useToast } from '@/hooks/useToast'
```

#### Estrutura
```tsx
<>
  {/* Header com botão Back */}
  <div className="flex items-center space-x-4 mb-6">
    <Button onClick={handleBackToPost}>←</Button>
    <h1>Comment</h1>
  </div>

  {/* Comentário principal (layout similar ao PostCard) */}
  <div className="w-full py-4 pr-4 mb-6">
    <div className="flex space-x-3">
      <Avatar />
      <div className="flex-1 min-w-0">
        {/* Header com nome, username, hora */}
        {/* Conteúdo do comentário */}
        {/* Mídia (se houver) */}
        {/* Botões de ação */}
      </div>
    </div>
    
    {/* Replies do comentário */}
    <CommentReplies commentId={id} postId={postId} />
  </div>
</>
```

#### Navegação Especial
```tsx
const handleBackToPost = () => {
  if (postId) {
    navigate(`/post/${postId}`) // Sempre volta para o post pai
  }
}
```

---

### Profile - `/profile` (Próprio Perfil)
**Localização:** `src/pages/app/profile/Profile.tsx`

#### Responsabilidades
- Exibe perfil do usuário logado
- Permite edição (avatar, cover, bio, etc.)
- Mostra posts do usuário
- Configurações e estatísticas pessoais

#### Componentes Utilizados
```tsx
// Componentes principais
import { ProfileHeader } from '@/components/profile/ProfileHeader'
import { ProfileMeta } from '@/components/profile/ProfileMeta'

// Editores (só para próprio perfil)
import { EditProfileModal } from '@/components/profile/EditProfileModal'
import { AvatarEditor } from '@/components/profile/AvatarEditor'
import { CoverEditor } from '@/components/profile/CoverEditor'

// Navegação
import { useNavigationTracking, createSmartNavigationHandler } from '@/utils/navigation'
```

#### Estrutura
```tsx
<>
  {/* Header com navegação */}
  <div className="flex items-center space-x-4 mb-3">
    <Button onClick={handleBack}>←</Button>
    <h1>Profile</h1>
  </div>

  {/* Header do perfil */}
  <ProfileHeader
    user={user}
    isOwnProfile={true}  // ✅ Permite edição
    CoverEditorComponent={<CoverEditor />}
    AvatarEditorComponent={<AvatarEditor />}
    meta={<ProfileMeta email={user.email} />}  // ✅ Mostra email
  />

  {/* Modal de edição */}
  <EditProfileModal />
</>
```

---

### UserProfile - `/:username` (Perfil Público)
**Localização:** `src/pages/app/users/[username]/index.tsx`

#### Responsabilidades
- Exibe perfil público de outro usuário
- Permite seguir/deixar de seguir
- Mostra posts públicos do usuário
- Redireciona se for próprio perfil

#### Componentes Utilizados
```tsx
// Reutiliza componentes do Profile
import { ProfileHeader } from '@/components/profile/ProfileHeader'
import { ProfileMeta } from '@/components/profile/ProfileMeta'

// API específica
import { useUser } from '@/hooks/useAuthStore'  // Busca usuário por username
```

#### Estrutura
```tsx
<>
  {/* Header com navegação */}
  <div className="flex items-center space-x-4 mb-3">
    <Button onClick={handleBack}>←</Button>
    <h1>@{username}</h1>
  </div>

  {/* Header do perfil */}
  <ProfileHeader
    user={user}
    isOwnProfile={false}  // ✅ Não permite edição
    meta={<ProfileMeta />}  // ✅ SEM email
    // Sem CoverEditor/AvatarEditor - imagens estáticas
  />
</>
```

#### Lógica Especial
```tsx
// Redireciona se for próprio perfil
if (isOwnProfile && currentUser) {
  window.location.href = '/profile'
  return null
}
```

---

## 🧩 Componentes e Suas Comunicações

### PostCard
**Localização:** `src/components/posts/PostCard.tsx`

#### Props Principais
```tsx
interface PostCardProps {
  post: Post
  showComments?: boolean           // Exibe seção de comentários
  showDetailedTimestamp?: boolean  // Data completa vs relativa
  disableHover?: boolean          // Remove cursor pointer
  onPostDeleted?: () => void      // Callback após deletar
}
```

#### Comportamentos Condicionais
- **Feed**: `showComments={false}`, timestamp relativo ("3h ago")
- **PostView**: `showComments={true}`, `showDetailedTimestamp={true}` ("14:25 · Sep 21, 2025")

#### Componentes Filhos
- `PostComments` - Lista de comentários (se `showComments={true}`)
- `DeletePostModal` - Modal de confirmação de exclusão
- `EditPostModal` - Modal de edição de post
- `ImageModal` - Visualização de imagens em tela cheia
- `CreateCommentModal` - Modal para criar comentário

### CommentCard
**Localização:** `src/components/comments/CommentCard.tsx`

#### Responsabilidades
- Exibe um comentário individual
- Formatação de hora simples ("14:25")
- Ações de like, reply, edit, delete

#### Componentes Filhos
- `CommentActions` - Dropdown com ações (edit, delete)
- `ImageModal` - Visualização de mídia
- `CreateCommentModal` - Modal para responder

### ProfileHeader
**Localização:** `src/components/profile/ProfileHeader.tsx`

#### Props Principais
```tsx
interface ProfileHeaderProps {
  user: ProfileUser
  isOwnProfile: boolean           // Controla se pode editar
  onEditProfile: () => void
  CoverEditorComponent?: React.ReactNode  // Só para próprio perfil
  AvatarEditorComponent?: React.ReactNode // Só para próprio perfil
  meta?: React.ReactNode          // ProfileMeta
}
```

#### Comportamentos Condicionais
- **Próprio perfil**: Botão "Edit Profile", editores de avatar/cover
- **Perfil público**: Botão "Follow/Following", imagens estáticas

### ProfileMeta
**Localização:** `src/components/profile/ProfileMeta.tsx`

#### Responsabilidades
- Exibe estatísticas (followers, following)
- Mostra email (só para próprio perfil)
- Gerencia tabs (posts, likes, comments)
- Renderiza conteúdo das tabs

#### Componentes Filhos
- `ProfileTabs` - Navegação entre seções
- `UserPosts` - Lista de posts do usuário

---

## 🔄 Fluxo de Comunicação

### Navegação entre Páginas
```
Feed → PostView → CommentView
  ↓      ↓         ↓
Dashboard ← Post ← Comment
```

### Comunicação via Props
```tsx
// PostView passa configurações específicas para PostCard
<PostCard 
  showComments={true}
  showDetailedTimestamp={true}
  disableHover={true}
/>

// Profile passa configurações para ProfileHeader
<ProfileHeader 
  isOwnProfile={true}
  CoverEditorComponent={<CoverEditor />}
  meta={<ProfileMeta email={user.email} />}
/>

// UserProfile reutiliza componentes com configurações diferentes
<ProfileHeader 
  isOwnProfile={false}
  meta={<ProfileMeta />} // SEM email
/>
```

### Invalidação de Cache
```tsx
// Quando ações são realizadas, múltiplas queries são invalidadas
queryClient.invalidateQueries({ queryKey: ['posts'] })
queryClient.invalidateQueries({ queryKey: ['user-posts'] })
queryClient.invalidateQueries({ queryKey: ['comments'] })
queryClient.invalidateQueries({ queryKey: ['session'] })
```

---

## 🛠️ Padrões de Implementação

### Estados de Loading
- **PostView**: `PostLoadingSkeleton`
- **CommentView**: `CommentLoadingSkeleton`
- **Profile**: `Spinner` centralizado

### Tratamento de Erros
- **404 Pages**: Layout centralizado com botão de volta
- **Network Errors**: Toast notifications
- **Validation Errors**: Inline error messages

### Navegação Inteligente
- Todas as páginas usam `useNavigationTracking()`
- Botões Back usam `createSmartNavigationHandler()`
- Evita loops infinitos entre Post ↔ Comment

### Responsividade
- Layout CSS Grid para elementos que não podem quebrar
- `min-w-0 overflow-hidden` para containers de texto
- `truncate pr-2` para textos que devem truncar
- `shrink-0` para elementos que devem manter tamanho

---

## 🎯 Resumo de Responsabilidades

| Página | Responsabilidade | Componentes Principais | Características |
|--------|------------------|------------------------|-----------------|
| **PostView** | Post individual | PostCard, PostComments | Data detalhada, comentários |
| **CommentView** | Comentário individual | Layout customizado, CommentReplies | Volta para post pai |
| **Profile** | Perfil próprio | ProfileHeader, ProfileMeta | Editável, com email |
| **UserProfile** | Perfil público | ProfileHeader, ProfileMeta | Follow/Unfollow, sem email |

Cada página é **especializada** mas **reutiliza** componentes comuns, mantendo consistência visual e funcional em toda a aplicação.
