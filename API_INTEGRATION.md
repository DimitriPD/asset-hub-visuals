# Asset Service Integration - Asset Hub

## 📋 Visão Geral

Integração completa entre o frontend React e a API Node.js do Asset Hub para gerenciamento de assets.

## 🎯 Status da Integração

✅ **100% Funcional** - Última atualização: 19/10/2025

## 📁 Arquivos Modificados

### 1. Serviço de API (`src/lib/services/assetService.ts`)
- ✅ Serviço completo para consumir a API de assets
- ✅ Implementa todos os endpoints: GET, POST, PUT, DELETE
- ✅ Inclui interceptor para adicionar token de autenticação
- ✅ Função `transformAsset` para mapear dados da API
- ✅ Types/Interfaces: Asset, AssetQuery, AssetCreate, AssetUpdate
- ✅ Tratamento de erros completo
- ✅ Suporte para formato de resposta `{ data: [...] }`

### 2. Página Asset Management (`src/pages/AssetManagement.tsx`)
- ✅ CRUD completo integrado com a API
- ✅ Criar novo asset com campos corretos (basePrice, availableQuantity)
- ✅ Editar asset existente
- ✅ Deletar asset
- ✅ Loading states
- ✅ Error handling com toast notifications
- ✅ Filtros por categoria e busca

### 3. Configuração de Ambiente
- ✅ `.env` - Configurado com `VITE_API_URL=http://localhost:5001`
- ✅ `.env.example` - Exemplo de configuração

## 🚀 Como Usar

### 1. Configurar a URL da API

O arquivo `.env` já está configurado com:

```env
VITE_API_URL=http://localhost:5001
```

### 2. Instalar Dependências

```bash
npm install
```

(axios já está incluído como dependência)

### 3. Iniciar o Backend

```bash
cd asset-hub-api
npm install
npm run dev
```

A API estará rodando em `http://localhost:5001`

### 4. Iniciar o Frontend

```bash
cd asset-hub-visuals
npm install
npm run dev
```

O frontend estará rodando em `http://localhost:5173`

## 🔌 Endpoints da API

### Base URL: `http://localhost:5001`

- `GET /assets` - Listar todos os assets (com filtros opcionais)
- `GET /assets/:id` - Buscar asset por ID
- `POST /assets` - Criar novo asset
- `PUT /assets/:id` - Atualizar asset
- `DELETE /assets/:id` - Deletar asset

## 🔍 Filtros Disponíveis

A API suporta os seguintes parâmetros de query:
- `companyId` - Filtrar por empresa
- `categoryId` - Filtrar por categoria
- `isAvailable` - Filtrar por disponibilidade
- `searchTerm` - Buscar por termo
- `limit` - Limitar número de resultados
- `offset` - Paginação

## Notas Importantes

1. **Autenticação**: O serviço inclui um interceptor que adiciona automaticamente o token JWT do localStorage a todas as requisições
2. **Error Handling**: Todos os métodos incluem tratamento de erros com toast notifications
3. **Loading States**: As páginas mostram um spinner enquanto carregam dados
4. **TypeScript**: Todas as interfaces estão tipadas corretamente

## Estrutura de Dados

```typescript
interface Asset {
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
}
```
