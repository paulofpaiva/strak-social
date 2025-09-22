# Padrões de Layout Responsivo

## CSS Grid para Layouts com Truncamento Dinâmico

### Problema
Em layouts que contêm **avatar + conteúdo de texto + botão**, o texto pode quebrar o layout em telas pequenas, empurrando o botão para fora da área visível ou quebrando para uma nova linha.

### Solução: CSS Grid com Truncamento Inteligente

#### Estrutura Base
```tsx
<div className="grid grid-cols-[auto_1fr_auto] gap-3 p-3 border border-border rounded-lg">
  {/* Avatar - tamanho fixo */}
  <Avatar className="w-10 h-10" />
  
  {/* Conteúdo - ocupa espaço restante */}
  <div className="min-w-0 overflow-hidden">
    <h4 className="truncate pr-2">Nome do Usuário</h4>
    <span className="truncate block pr-2">@username</span>
    <p className="truncate mt-1 pr-2">Bio do usuário...</p>
  </div>
  
  {/* Botão - tamanho fixo */}
  <div className="shrink-0">
    <Button>Follow</Button>
  </div>
</div>
```

#### Classes CSS Essenciais

**Container Principal:**
- `grid grid-cols-[auto_1fr_auto]` - Define 3 colunas: fixo | flexível | fixo
- `gap-3` - Espaçamento uniforme entre elementos
- `items-center` - Alinhamento vertical

**Container de Conteúdo:**
- `min-w-0` - Permite que o elemento encolha além do conteúdo
- `overflow-hidden` - Força o truncamento quando necessário

**Elementos de Texto:**
- `truncate` - Adiciona reticências quando texto é muito longo
- `pr-2` - Padding direito para buffer de segurança
- `block` - Para spans que precisam quebrar linha

**Container de Botão:**
- `shrink-0` - Impede que o botão encolha
- `ml-auto` - (opcional) Empurra para direita em layouts flex

### Exemplos de Implementação

#### UserCard (3 colunas)
```tsx
<div className="grid grid-cols-[auto_1fr_auto] gap-3">
  <Avatar className="w-10 h-10" />
  <div className="min-w-0 overflow-hidden">
    <h4 className="truncate pr-2">{user.name}</h4>
    <span className="truncate block pr-2">@{user.username}</span>
    {user.bio && <p className="truncate mt-1 pr-2">{user.bio}</p>}
  </div>
  <FollowButton />
</div>
```

#### ProfileHeader (2 colunas)
```tsx
<div className="grid grid-cols-[1fr_auto] gap-4">
  <div className="min-w-0 overflow-hidden">
    <h1 className="text-2xl font-bold truncate pr-2">{user.name}</h1>
    <p className="truncate pr-2">@{user.username}</p>
    {user.bio && <p className="truncate pr-2">{user.bio}</p>}
  </div>
  <div className="shrink-0">
    <EditButton />
  </div>
</div>
```

### Vantagens desta Abordagem

1. **Truncamento Dinâmico**: Só trunca quando realmente necessário
2. **Botão Sempre Visível**: Grid garante espaço reservado
3. **Responsivo Inteligente**: Adapta-se automaticamente ao espaço
4. **Sem Quebras de Layout**: Grid força elementos a respeitarem limites
5. **Fácil Manutenção**: Padrão consistente e previsível

### Quando Usar

- ✅ Cards de usuário com botões de ação
- ✅ Headers de perfil com botões de edição
- ✅ Listas de itens com ações à direita
- ✅ Qualquer layout horizontal que não pode quebrar

### Quando NÃO Usar

- ❌ Layouts que precisam quebrar em múltiplas linhas
- ❌ Conteúdo que deve expandir verticalmente
- ❌ Layouts com número variável de colunas

### Checklist de Implementação

- [ ] Container principal usa `grid grid-cols-[...]`
- [ ] Container de conteúdo tem `min-w-0 overflow-hidden`
- [ ] Textos têm `truncate pr-2`
- [ ] Elementos fixos têm `shrink-0`
- [ ] Gap adequado entre elementos (`gap-3` ou `gap-4`)
- [ ] Alinhamento vertical correto (`items-center` ou `items-start`)

### Exemplo Completo

```tsx
function ResponsiveCard({ user, onAction }) {
  return (
    <div className="grid grid-cols-[auto_1fr_auto] gap-3 p-3 border rounded-lg items-center">
      {/* Elemento fixo à esquerda */}
      <Avatar src={user.avatar} className="w-10 h-10" />
      
      {/* Conteúdo flexível no meio */}
      <div className="min-w-0 overflow-hidden">
        <h3 className="font-semibold truncate pr-2">{user.name}</h3>
        <p className="text-sm text-muted-foreground truncate pr-2">@{user.username}</p>
      </div>
      
      {/* Elemento fixo à direita */}
      <div className="shrink-0">
        <Button onClick={onAction}>Action</Button>
      </div>
    </div>
  )
}
```

Este padrão garante que o layout **nunca quebra** e o texto **trunca inteligentemente** conforme o espaço disponível.
