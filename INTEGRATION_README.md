# Integração Frontend-Backend - Asset Hub

## Visão Geral

Este documento descreve a integração entre o frontend (React + Vite) e a API backend (Node.js + Express) do Asset Hub.

## Configuração

### Backend (API)
- **Porta**: 5001
- **URL Base**: `http://localhost:5001`
- **Rotas Disponíveis**:
  - `GET /assets` - Lista todos os assets
  - `GET /assets/:id` - Busca asset por ID
  - `POST /assets` - Cria novo asset
  - `PUT /assets/:id` - Atualiza asset
  - `DELETE /assets/:id` - Deleta asset

### Frontend
- **Arquivo de Configuração**: `.env`
- **Variável de Ambiente**: `VITE_API_URL=http://localhost:5001`
- **Serviço**: `src/lib/services/assetService.ts`

## Estrutura da API

### Asset DTO (Backend)
```typescript
{
  id: string;
  companyId: string | null;
  categoryId: string | null;
  name: string;
  description: string | null;
  basePrice: number | null;
  maxInstallments: number | null;
  isAvailable: boolean;
  createdAt: Date | string | null;
  availableQuantity: number | null;
  photos: string[];
}
```

### Asset Interface (Frontend)
```typescript
{
  id: string;
  name: string;
  category: string;
  categoryId?: string;
  price: number;
  image: string;
  description: string;
  quantity: number;
  specifications: Record<string, string>;
  isAvailable?: boolean;
  companyId?: string;
  maxInstallments?: number;
  createdAt?: string;
  photos?: string[];
}
```

## Mapeamento de Campos

A função `transformAsset` no serviço frontend realiza o mapeamento entre os campos da API e o formato esperado pelo frontend:

| API (Backend) | Frontend | Transformação |
|--------------|----------|---------------|
| `basePrice` | `price` | Direto |
| `availableQuantity` | `quantity` | Direto |
| `photos[0]` | `image` | Primeiro item do array ou placeholder |
| `categoryId` | `category` | ID da categoria ou 'Uncategorized' |

## Operações CRUD

### 1. Listar Assets (GET /assets)
```typescript
const assets = await assetService.getAll({
  companyId?: string,
  categoryId?: string,
  isAvailable?: boolean,
  searchTerm?: string,
  limit?: number,
  offset?: number
});
```

### 2. Buscar Asset por ID (GET /assets/:id)
```typescript
const asset = await assetService.getById(assetId);
```

### 3. Criar Asset (POST /assets)
```typescript
const newAsset = await assetService.create({
  name: string,
  description: string,
  basePrice: number,
  availableQuantity: number,
  categoryId?: string,
  companyId: string,
  maxInstallments?: number,
  photos?: string[]
});
```

### 4. Atualizar Asset (PUT /assets/:id)
```typescript
const updated = await assetService.update(assetId, {
  name?: string,
  description?: string,
  basePrice?: number,
  availableQuantity?: number,
  categoryId?: string,
  maxInstallments?: number,
  photos?: string[],
  isAvailable?: boolean
});
```

### 5. Deletar Asset (DELETE /assets/:id)
```typescript
await assetService.delete(assetId);
```

## Autenticação

O serviço frontend inclui um interceptor Axios que adiciona automaticamente o token de autenticação às requisições:

```typescript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('assethub_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## Tratamento de Erros

Todas as operações incluem tratamento de erros com try-catch e logging no console. Erros são propagados para o componente que pode exibir mensagens usando o toast.

## Como Testar

### 1. Inicie o Backend
```bash
cd asset-hub-api
npm install
npm run dev
```

### 2. Inicie o Frontend
```bash
cd asset-hub-visuals
npm install
npm run dev
```

### 3. Acesse a aplicação
- Frontend: `http://localhost:5173` (porta padrão do Vite)
- API: `http://localhost:5001`
- Swagger Docs: `http://localhost:5001/docs`

## Componentes Integrados

### AssetManagement.tsx
- **Localização**: `src/pages/AssetManagement.tsx`
- **Funcionalidades**:
  - Listagem de assets com filtros
  - Criação de novos assets
  - Edição de assets existentes
  - Exclusão de assets
  - Busca por termo
  - Filtro por categoria

## Próximos Passos

1. Implementar autenticação real (substituir 'temp-company-id')
2. Adicionar paginação na listagem
3. Implementar upload de imagens
4. Adicionar validações mais robustas
5. Implementar cache de requisições
6. Adicionar testes unitários e de integração

## Troubleshooting

### Erro de CORS
Se houver erro de CORS, verifique se o backend tem o middleware `cors()` configurado corretamente em `index.routes.ts`.

### API não responde
1. Verifique se o backend está rodando na porta 5001
2. Verifique a variável `VITE_API_URL` no arquivo `.env`
3. Verifique o console do navegador para erros de rede

### Dados não aparecem
1. Verifique se há dados no banco de dados
2. Abra o DevTools e veja a aba Network
3. Verifique os logs do console para erros
