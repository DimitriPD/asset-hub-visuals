# Custom Service Integration - Asset Hub

## 📋 Visão Geral

Integração completa entre o frontend React e a API Node.js do Asset Hub para customização (paletas de cores, logo da empresa e filtros de catálogo).

## 🎯 Status da Integração

✅ **100% Funcional** - Data: 19/10/2025

## 📁 Arquivos Criados/Modificados

### 1. Novo Serviço: `src/lib/services/customService.ts`
- ✅ Serviço completo para consumir a API de customização
- ✅ Implementa endpoints:
  - `GET /custom/colorsPalette` - Listar paletas de cores
  - `PATCH /custom/colorsPalette/:id` - Atualizar paleta
  - `PATCH /custom/logo` - Atualizar logo da empresa
  - `PATCH /custom/catalogFilters` - Atualizar filtros do catálogo
- ✅ Inclui interceptor para token de autenticação
- ✅ Types/Interfaces: Palette, PaletteQuery, PaletteUpdate, LogoUpdate, CatalogFiltersUpdate, CompanyCustom
- ✅ Tratamento de erros completo
- ✅ Suporte para formato de resposta `{ data: ... }`

### 2. Página Atualizada: `src/pages/Customization.tsx`
- ✅ Integração completa com API de customização
- ✅ Carregamento de paletas da API
- ✅ Atualização de logo da empresa
- ✅ Configuração de filtros do catálogo
- ✅ Seleção de paleta de cores
- ✅ Reset para configurações padrão
- ✅ Loading states durante operações
- ✅ Toast notifications para feedback

## 🔌 Endpoints da API

### Base URL: `http://localhost:5001`

#### 1. Listar Paletas de Cores
```
GET /custom/colorsPalette
```
**Query Parameters:**
- `companyId` (opcional): UUID da empresa
- `paletteName` (opcional): Nome da paleta

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "paletteName": "Purple Default",
      "primaryColor": "#8B5CF6",
      "secondaryColor": "#A78BFA",
      "tertiaryColor": "#C4B5FD"
    }
  ]
}
```

#### 2. Atualizar Paleta de Cores
```
PATCH /custom/colorsPalette/:id
```
**Body:**
```json
{
  "paletteName": "Custom Purple",
  "primaryColor": "#8B5CF6",
  "secondaryColor": "#A78BFA",
  "tertiaryColor": "#C4B5FD"
}
```

#### 3. Atualizar Logo da Empresa
```
PATCH /custom/logo
```
**Body:**
```json
{
  "logoUrl": "https://example.com/logo.png"
}
```

#### 4. Atualizar Filtros do Catálogo
```
PATCH /custom/catalogFilters
```
**Body:**
```json
{
  "catalogFilterRulesJson": {
    "categoryFilter": true,
    "priceFilter": true,
    "sortingFilter": true,
    "searchFilter": true,
    "statusFilter": false
  }
}
```

## 📦 Estrutura de Dados

### Palette
```typescript
interface Palette {
  id: string;                    // UUID da paleta
  paletteName: string;           // Nome da paleta
  primaryColor: string | null;   // Cor primária (hex)
  secondaryColor: string | null; // Cor secundária (hex)
  tertiaryColor: string | null;  // Cor terciária (hex)
}
```

### PaletteUpdate
```typescript
interface PaletteUpdate {
  paletteName?: string;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  tertiaryColor?: string | null;
}
```

### LogoUpdate
```typescript
interface LogoUpdate {
  logoUrl: string;  // URL ou base64 da imagem
}
```

### CatalogFiltersUpdate
```typescript
interface CatalogFiltersUpdate {
  catalogFilterRulesJson: {
    categoryFilter?: boolean;
    priceFilter?: boolean;
    sortingFilter?: boolean;
    searchFilter?: boolean;
    statusFilter?: boolean;
  };
}
```

### CompanyCustom
```typescript
interface CompanyCustom {
  id: string;
  tradeName: string;
  logoUrl: string | null;
  catalogFilterRulesJson: object | null;
  paletteId: string | null;
}
```

## 🚀 Como Usar o Serviço

### 1. Importar o Serviço
```typescript
import { customService, Palette } from '@/lib/services/customService';
```

### 2. Listar Paletas
```typescript
const palettes = await customService.getColorsPalette();
// ou com filtros
const filteredPalettes = await customService.getColorsPalette({
  companyId: 'company-uuid',
  paletteName: 'Purple'
});
```

### 3. Atualizar Paleta
```typescript
await customService.updateColorsPalette('palette-uuid', {
  paletteName: 'Custom Theme',
  primaryColor: '#FF5733',
  secondaryColor: '#33FF57',
  tertiaryColor: '#3357FF'
});
```

### 4. Atualizar Logo
```typescript
await customService.updateLogo({
  logoUrl: 'https://example.com/new-logo.png'
});
```

### 5. Atualizar Filtros
```typescript
await customService.updateCatalogFilters({
  catalogFilterRulesJson: {
    categoryFilter: true,
    priceFilter: true,
    sortingFilter: false,
    searchFilter: true,
    statusFilter: false
  }
});
```

## 🎨 Funcionalidades Implementadas

### Na Página Customization:

1. **Branding da Empresa**
   - ✅ Upload de logo personalizado
   - ✅ Preview do logo
   - ✅ Salvar logo no backend

2. **Filtros do Catálogo**
   - ✅ Toggle para cada tipo de filtro
   - ✅ Search Filter
   - ✅ Category Filter
   - ✅ Sorting Options
   - ✅ Status Filter (desabilitado conforme requisitos)
   - ✅ Salvar configurações no backend

3. **Paleta de Cores**
   - ✅ Carregar paletas da API
   - ✅ Visualização de cores (primária, secundária, terciária)
   - ✅ Seleção de paleta ativa
   - ✅ Indicador visual da paleta selecionada

4. **Operações**
   - ✅ Salvar todas as alterações
   - ✅ Reset para configurações padrão
   - ✅ Loading states
   - ✅ Feedback via toast

## 📝 Exemplo Completo de Uso

```typescript
import { useState, useEffect } from 'react';
import { customService } from '@/lib/services/customService';
import { useToast } from '@/hooks/use-toast';

function CustomizationComponent() {
  const [palettes, setPalettes] = useState([]);
  const [selectedPalette, setSelectedPalette] = useState('');
  const [logo, setLogo] = useState('');
  const [filters, setFilters] = useState({});
  const { toast } = useToast();

  // Carregar paletas
  useEffect(() => {
    const loadPalettes = async () => {
      try {
        const data = await customService.getColorsPalette();
        setPalettes(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load palettes",
          variant: "destructive",
        });
      }
    };
    loadPalettes();
  }, []);

  // Salvar configurações
  const handleSave = async () => {
    try {
      // Atualizar logo
      if (logo) {
        await customService.updateLogo({ logoUrl: logo });
      }

      // Atualizar filtros
      await customService.updateCatalogFilters({
        catalogFilterRulesJson: filters
      });

      toast({
        title: "Success",
        description: "Settings saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      {/* UI components */}
    </div>
  );
}
```

## 🔐 Autenticação

O serviço inclui automaticamente o token de autenticação:

```typescript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('assethub_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## ⚠️ Notas Importantes

1. **CompanyId Temporário**: O backend usa `"temp-company-id"` hardcoded. Em produção, deve vir do contexto de autenticação.

2. **Upload de Logo**: Atualmente aceita URLs ou base64. Para upload real de arquivos, considere implementar endpoint de upload separado.

3. **Filtros**: O campo `statusFilter` está desabilitado conforme requisitos do projeto.

4. **Paletas**: As paletas de cores são carregadas dinamicamente da API. Paletas padrão podem ser inseridas via seed no banco.

## 🧪 Como Testar

### 1. Via Interface
1. Acesse a aplicação como admin
2. Vá para "Customization"
3. Teste as funcionalidades:
   - Upload de logo
   - Toggle dos filtros
   - Seleção de paleta
   - Salvar alterações
   - Reset para padrão

### 2. Via Console do Navegador
```javascript
// Listar paletas
const palettes = await customService.getColorsPalette();
console.log(palettes);

// Atualizar logo
await customService.updateLogo({ 
  logoUrl: 'https://example.com/logo.png' 
});

// Atualizar filtros
await customService.updateCatalogFilters({
  catalogFilterRulesJson: {
    categoryFilter: true,
    searchFilter: true
  }
});
```

## 📊 Diagrama de Fluxo

```
Frontend (Customization Page)
    ↓
customService.ts
    ↓ HTTP Request
API (http://localhost:5001)
    ↓
/custom/colorsPalette → CustomController → CustomService
/custom/logo          → CustomController → CustomService
/custom/catalogFilters → CustomController → CustomService
    ↓
Database (MySQL)
    ↓
Response → Frontend → UI Update + Toast
```

## ✅ Checklist de Integração

- [x] Serviço de customização criado
- [x] Endpoints integrados
- [x] Tipos TypeScript definidos
- [x] Tratamento de erros implementado
- [x] Loading states adicionados
- [x] Toast notifications configuradas
- [x] Página Customization atualizada
- [x] Teste de integração realizado
- [x] Documentação completa

## 🚧 Próximos Passos

1. Implementar upload real de imagens para o logo
2. Adicionar preview em tempo real das mudanças de paleta
3. Implementar validação de cores (hex válido)
4. Adicionar mais opções de customização
5. Implementar histórico de mudanças
6. Adicionar testes automatizados

---

**Desenvolvido por:** GitHub Copilot  
**Data:** 19/10/2025
