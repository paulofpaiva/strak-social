# Implementar Feed do App com Tabs

## Visão Geral

Implementar o feed principal do app com duas tabs usando Headless UI: "For you" (posts de todos) e "Following" (posts apenas de quem seguimos). A tab "Following" será o padrão.

## Estrutura do Feed

### Layout com Tabs

```
┌─────────────────────────────────┐
│  Feed                           │
├─────────────────────────────────┤
│  [For you]  [Following] ←       │
├─────────────────────────────────┤
│  ┌───────────────────────────┐  │
│  │ Post Card 1               │  │
│  └───────────────────────────┘  │
│  ┌───────────────────────────┐  │
│  │ Post Card 2               │  │
│  └───────────────────────────┘  │
│  ┌───────────────────────────┐  │
│  │ Post Card 3               │  │
│  └───────────────────────────┘  │
│           [Loading...]          │
└─────────────────────────────────┘
```

## Backend: Endpoints

### 1. Endpoint de Posts de Quem Seguimos

**Arquivo**: `apps/backend/src/routes/posts/listFollowing.ts` (NOVO)

Criar endpoint GET `/posts/following` que retorna posts apenas de usuários que o usuário atual segue.

**Lógica:**
```tsx
router.get('/', authenticateToken, asyncHandler(async (req, res) => {
  const currentUserId = req.user!.id
  const page = parseInt(req.query.page as string) || 1
  const limit = parseInt(req.query.limit as string) || 10
  const offset = (page - 1) * limit

  // Buscar posts de usuários que o current user segue
  const postsWithUsers = await db
    .select({
      id: posts.id,
      userId: posts.userId,
      content: posts.content,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
      user: {
        id: users.id,
        name: users.name,
        username: users.username,
        avatar: users.avatar,
        isVerified: users.isVerified,
      }
    })
    .from(posts)
    .innerJoin(users, eq(posts.userId, users.id))
    .innerJoin(followers, eq(followers.followingId, posts.userId))
    .where(eq(followers.followerId, currentUserId))
    .orderBy(desc(posts.createdAt))
    .limit(limit)
    .offset(offset)

  // Buscar media, likes, comments count para cada post
  const postsWithDetails = await Promise.all(
    postsWithUsers.map(async (post) => {
      const media = await db.select().from(postMedia).where(eq(postMedia.postId, post.id)).orderBy(asc(postMedia.order))
      
      const likesCount = await db.select({ count: likes.id }).from(likes).where(eq(likes.postId, post.id))
      
      const userLiked = await db.select({ id: likes.id }).from(likes).where(and(eq(likes.postId, post.id), eq(likes.userId, currentUserId))).limit(1)
      
      const commentsCount = await db.select({ count: comments.id }).from(comments).where(eq(comments.postId, post.id))

      return {
        ...post,
        media,
        likesCount: likesCount.length,
        userLiked: userLiked.length > 0,
        commentsCount: commentsCount.length,
      }
    })
  )

  return ApiResponse.success(res, {
    posts: postsWithDetails,
    pagination: {
      page,
      limit,
      hasMore: postsWithUsers.length === limit
    }
  }, 'Following posts retrieved successfully')
}))
```

**Imports necessários:**
```tsx
import { followers } from '../../schemas/followers'
import { comments } from '../../schemas/comments'
```

### 2. Adicionar Rota no index.ts

**Arquivo**: `apps/backend/src/routes/posts/index.ts`

Adicionar rota:
```tsx
import listFollowingRouter from './listFollowing'

router.use('/following', listFollowingRouter)
```

### 3. Atualizar list.ts (For you)

**Arquivo**: `apps/backend/src/routes/posts/list.ts`

Adicionar contagem de comentários no endpoint atual:
```tsx
const commentsCount = await db
  .select({ count: comments.id })
  .from(comments)
  .where(eq(comments.postId, post.id))

return {
  ...post,
  media,
  likesCount: likesCount.length,
  userLiked: userLiked.length > 0,
  commentsCount: commentsCount.length,  // ← Adicionar
}
```

**Import:**
```tsx
import { comments } from '../../schemas/comments'
```

## Frontend: Implementação

### 4. Criar APIs no Frontend

**Arquivo**: `apps/frontend/src/api/posts.ts`

Adicionar funções:

```tsx
export const getAllPostsApi = async (page: number = 1, limit: number = 10): Promise<PostsResponse> => {
  const response = await api.get('/posts', {
    params: { page, limit }
  })
  
  return response.data.data
}

export const getFollowingPostsApi = async (page: number = 1, limit: number = 10): Promise<PostsResponse> => {
  const response = await api.get('/posts/following', {
    params: { page, limit }
  })
  
  return response.data.data
}
```

### 5. Criar Componentes de Feed

**Arquivos**: 
- `apps/frontend/src/pages/app/Feed/components/ForYouFeed.tsx` (NOVO)
- `apps/frontend/src/pages/app/Feed/components/FollowingFeed.tsx` (NOVO)

**ForYouFeed.tsx:**
```tsx
import { useInfiniteQuery } from '@tanstack/react-query'
import { getAllPostsApi } from '@/api/posts'
import { PostCard } from '@/components/post/PostCard'
import { PostCardSkeleton } from '@/components/skeleton/PostCardSkeleton'
import { useInfiniteScroll } from '@/hooks'
import { Loader2 } from 'lucide-react'
import { ErrorEmpty } from '@/components/ErrorEmpty'
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from '@/components/ui/empty'
import { FileText } from 'lucide-react'

export function ForYouFeed() {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch
  } = useInfiniteQuery({
    queryKey: ['posts', 'for-you'],
    queryFn: ({ pageParam = 1 }) => getAllPostsApi(pageParam, 10),
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasMore 
        ? lastPage.pagination.page + 1 
        : undefined
    },
    initialPageParam: 1,
    retry: false,
    refetchOnWindowFocus: false,
  })

  const sentinelRef = useInfiniteScroll(
    () => fetchNextPage(),
    hasNextPage || false,
    isFetchingNextPage
  )

  if (isLoading) {
    return <PostCardSkeleton count={3} />
  }

  if (isError) {
    return (
      <ErrorEmpty
        title="Failed to load posts"
        description="Unable to load posts. Please try again."
        onRetry={() => refetch()}
        retryText="Try again"
      />
    )
  }

  const posts = data?.pages.flatMap((page) => page.posts) || []

  if (posts.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FileText className="h-6 w-6" />
          </EmptyMedia>
          <EmptyTitle>No posts yet</EmptyTitle>
          <EmptyDescription>
            Be the first to share something!
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div>
      <div>
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {hasNextPage && (
        <div ref={sentinelRef} className="flex justify-center py-4">
          {isFetchingNextPage && (
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          )}
        </div>
      )}
    </div>
  )
}
```

**FollowingFeed.tsx:**
(Idêntico ao ForYouFeed, mas com query key diferente e API diferente)

```tsx
// Mesma estrutura, mas:
queryKey: ['posts', 'following']
queryFn: ({ pageParam = 1 }) => getFollowingPostsApi(pageParam, 10)

// Empty state diferente:
<EmptyTitle>No posts from people you follow</EmptyTitle>
<EmptyDescription>
  Follow users to see their posts here!
</EmptyDescription>
```

### 6. Atualizar Feed.tsx

**Arquivo**: `apps/frontend/src/pages/app/Feed.tsx`

Implementar com ScrollableTabs:

```tsx
import { useNavigationTracking } from '@/utils/navigation'
import { ScrollableTabs } from '@/components/ui/scrollable-tabs'
import { Users, Sparkles } from 'lucide-react'
import { ForYouFeed } from './components/ForYouFeed'
import { FollowingFeed } from './components/FollowingFeed'

export function Feed() {
  useNavigationTracking('/feed')

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Feed</h2>
        <p className="text-muted-foreground">Stay updated with the latest posts</p>
      </div>

      <ScrollableTabs
        defaultIndex={1}  // Following é o padrão (índice 1)
        tabs={[
          {
            id: 'for-you',
            label: 'For you',
            icon: Sparkles,
            content: <ForYouFeed />
          },
          {
            id: 'following',
            label: 'Following',
            icon: Users,
            content: <FollowingFeed />
          }
        ]}
      />
    </div>
  )
}
```

## Funcionalidades

### For You Tab
- ✅ Mostra posts de **todos os usuários**
- ✅ Ordenados do mais recente para o mais antigo
- ✅ Infinite scroll (paginação automática)
- ✅ Loading skeleton inicial
- ✅ Loading spinner ao carregar mais
- ✅ Empty state se não houver posts

### Following Tab (Padrão)
- ✅ Mostra posts apenas de **usuários que seguimos**
- ✅ Ordenados do mais recente para o mais antigo
- ✅ Infinite scroll (paginação automática)
- ✅ Loading skeleton inicial
- ✅ Loading spinner ao carregar mais
- ✅ Empty state específico ("Follow users to see posts")

## Estrutura de Arquivos

```
apps/frontend/src/
  pages/
    app/
      Feed/
        ├── Feed.tsx                    (🔧 Atualizar)
        └── components/
            ├── ForYouFeed.tsx          (🆕 Criar)
            └── FollowingFeed.tsx       (🆕 Criar)
  api/
    └── posts.ts                        (🔧 Adicionar APIs)

apps/backend/src/
  routes/
    posts/
      ├── list.ts                       (🔧 Adicionar commentsCount)
      ├── listFollowing.ts              (🆕 Criar)
      └── index.ts                      (🔧 Adicionar rota)
  schemas/
    └── followers.ts                    (✅ Existe)
```

## Query Keys

```tsx
// For You
['posts', 'for-you']

// Following
['posts', 'following']
```

## Ordenação

Ambos os feeds:
```sql
ORDER BY posts.createdAt DESC
```

Do mais novo para o mais antigo ✅

## Paginação

- **Página inicial**: 1
- **Limite por página**: 10 posts
- **Infinite scroll**: Carrega próxima página automaticamente
- **hasMore**: Baseado se retornou o limite completo

## Validações

- ✅ Tabs navegáveis
- ✅ "Following" é tab padrão (defaultIndex={1})
- ✅ Posts carregam corretamente
- ✅ Infinite scroll funciona
- ✅ Skeletons durante loading inicial
- ✅ Spinner durante carregamento de mais posts
- ✅ Empty states apropriados
- ✅ Error handling com retry
- ✅ Posts ordenados do mais recente
- ✅ PostCard renderiza corretamente
- ✅ Likes, comments funcionam

## Checklist de Implementação

### Backend
- [ ] Criar `listFollowing.ts` com endpoint GET /posts/following
- [ ] Adicionar rota no `index.ts`
- [ ] Atualizar `list.ts` para incluir commentsCount

### Frontend
- [ ] Criar `ForYouFeed.tsx` component
- [ ] Criar `FollowingFeed.tsx` component
- [ ] Adicionar `getAllPostsApi` em `posts.ts`
- [ ] Adicionar `getFollowingPostsApi` em `posts.ts`
- [ ] Atualizar `Feed.tsx` com ScrollableTabs
- [ ] Testar tab For you
- [ ] Testar tab Following (padrão)
- [ ] Testar infinite scroll
- [ ] Testar empty states

## Ícones das Tabs

- **For you**: ✨ Sparkles (novidades, descobertas)
- **Following**: 👥 Users (pessoas que você segue)

## Empty States

**For You:**
```
📄 No posts yet
Be the first to share something!
```

**Following:**
```
📄 No posts from people you follow
Follow users to see their posts here!
```

## Resultado Esperado

- ✅ Feed funcional com duas tabs
- ✅ Following como tab padrão
- ✅ Posts de usuários seguidos aparecem em Following
- ✅ Todos os posts aparecem em For you
- ✅ Infinite scroll suave
- ✅ UX responsiva e rápida
- ✅ Loading states apropriados
- ✅ Ordenação cronológica reversa

