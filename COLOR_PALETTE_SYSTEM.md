# Dynamic Color Palette System - Asset Hub

## 🎨 Visão Geral

Sistema completo de paletas de cores dinâmicas que permite carregar, selecionar e aplicar temas de cores em tempo real no Asset Hub.

## ✨ Funcionalidades Implementadas

### 1. **Carregamento Dinâmico de Paletas**
- ✅ Paletas são carregadas da API (`GET /custom/colorsPalette`)
- ✅ Exibição automática de todas as paletas disponíveis
- ✅ Fallback para mensagem quando não há paletas

### 2. **Aplicação de Cores em Tempo Real**
- ✅ Seleção de paleta aplica cores imediatamente
- ✅ Cores são injetadas via CSS Variables (`--color-primary`, `--color-secondary`, `--color-tertiary`)
- ✅ Mudanças são visíveis instantaneamente em todo o site

### 3. **Persistência de Preferências**
- ✅ Paleta selecionada é salva no `localStorage`
- ✅ Cores são reaplicadas automaticamente ao recarregar a página
- ✅ Hook `useColorPalette` gerencia a inicialização

### 4. **UI Responsiva**
- ✅ Grid adaptativo para diferentes tamanhos de tela
- ✅ Preview visual das cores (gradiente + círculos)
- ✅ Indicador visual da paleta ativa
- ✅ Loading state durante carregamento

## 🔧 Arquivos Modificados/Criados

### 1. `src/lib/services/customService.ts`
**Novos Métodos:**
```typescript
// Aplica paleta de cores no site
applyColorPalette(palette: Palette): void

// Carrega paleta salva do localStorage
loadSavedPalette(): Palette | null

// Remove paleta salva e reseta cores
clearSavedPalette(): void
```

### 2. `src/pages/Customization.tsx`
**Alterações:**
- ✅ Removidas paletas hardcoded
- ✅ Renderização dinâmica de paletas da API
- ✅ Aplicação de cores ao selecionar paleta
- ✅ Loading state para carregamento
- ✅ Reset que limpa cores salvas

### 3. `src/hooks/use-color-palette.ts` (NOVO)
Hook customizado para aplicar cores salvas na inicialização do app

### 4. `src/App.tsx`
Integrado hook `useColorPalette()` para aplicar cores ao carregar

### 5. `src/index.css`
Adicionadas variáveis CSS customizadas:
```css
--color-primary: #8B5CF6;
--color-secondary: #A78BFA;
--color-tertiary: #C4B5FD;
```

## 💡 Como Funciona

### Fluxo de Seleção de Paleta

```
1. Usuário clica em uma paleta
   ↓
2. handlePaletteUpdate(paletteId)
   ↓
3. customService.applyColorPalette(palette)
   ↓
4. document.documentElement.style.setProperty()
   ↓
5. Cores aplicadas instantaneamente via CSS Variables
   ↓
6. Paleta salva em localStorage
   ↓
7. Toast de confirmação exibido
```

### Fluxo de Inicialização

```
1. App carrega
   ↓
2. useColorPalette() hook executa
   ↓
3. customService.loadSavedPalette()
   ↓
4. Se há paleta salva:
   customService.applyColorPalette(savedPalette)
   ↓
5. Cores aplicadas automaticamente
```

## 📝 Estrutura de Dados

### Palette (da API)
```typescript
{
  id: "uuid-palette-1",
  paletteName: "Purple Theme",
  primaryColor: "#8B5CF6",
  secondaryColor: "#A78BFA",
  tertiaryColor: "#C4B5FD"
}
```

### Armazenamento localStorage
```json
{
  "selectedPalette": {
    "id": "uuid-palette-1",
    "paletteName": "Purple Theme",
    "primaryColor": "#8B5CF6",
    "secondaryColor": "#A78BFA",
    "tertiaryColor": "#C4B5FD"
  }
}
```

## 🎯 Uso das Cores no CSS

As cores podem ser utilizadas em qualquer lugar do CSS:

```css
/* Usando as variáveis customizadas */
.my-element {
  background-color: var(--color-primary);
  border-color: var(--color-secondary);
  color: var(--color-tertiary);
}

/* Exemplo com gradiente */
.gradient-bg {
  background: linear-gradient(
    135deg, 
    var(--color-primary), 
    var(--color-secondary)
  );
}
```

## 🚀 Como Usar

### 1. Adicionar Paletas no Backend

Primeiro, insira paletas no banco de dados via API ou diretamente:

```sql
INSERT INTO color_palettes (palette_id, palette_name, primary_color, secondary_color, tertiary_color)
VALUES 
  (UUID(), 'Purple Theme', '#8B5CF6', '#A78BFA', '#C4B5FD'),
  (UUID(), 'Ocean Blue', '#3B82F6', '#60A5FA', '#93C5FD'),
  (UUID(), 'Forest Green', '#10B981', '#34D399', '#6EE7B7');
```

### 2. Usar na Interface

1. Acesse "Customization" como admin
2. Veja as paletas carregadas da API
3. Clique em uma paleta para aplicar
4. Cores mudam instantaneamente
5. Paleta é salva automaticamente

### 3. Usar Programaticamente

```typescript
import { customService } from '@/lib/services/customService';

// Aplicar paleta manualmente
const palette = {
  id: 'custom-1',
  paletteName: 'My Custom Palette',
  primaryColor: '#FF5733',
  secondaryColor: '#33FF57',
  tertiaryColor: '#3357FF'
};

customService.applyColorPalette(palette);

// Carregar paleta salva
const saved = customService.loadSavedPalette();
if (saved) {
  console.log('Paleta ativa:', saved.paletteName);
}

// Limpar paleta
customService.clearSavedPalette();
```

## 🎨 Exemplo Visual

### Antes (Paletas Hardcoded)
```tsx
const colorPalettes = [
  { id: "purple", name: "Purple", ... },
  { id: "blue", name: "Blue", ... },
  // Fixas no código
];
```

### Depois (Paletas da API)
```tsx
const [palettes, setPalettes] = useState<Palette[]>([]);

useEffect(() => {
  const data = await customService.getColorsPalette();
  setPalettes(data); // Dinâmico!
}, []);

{palettes.map(palette => (
  <PaletteCard key={palette.id} palette={palette} />
))}
```

## ⚙️ Configuração de CSS Variables

As cores são aplicadas diretamente no elemento `:root`:

```javascript
const root = document.documentElement;
root.style.setProperty('--color-primary', '#8B5CF6');
root.style.setProperty('--color-secondary', '#A78BFA');
root.style.setProperty('--color-tertiary', '#C4B5FD');
```

Isso permite que qualquer elemento CSS use essas variáveis:

```css
.button-primary {
  background: var(--color-primary);
}

.text-secondary {
  color: var(--color-secondary);
}
```

## 🔄 Sincronização entre Páginas

Quando uma paleta é selecionada:

1. **Customization Page**: Aplica e salva
2. **localStorage**: Armazena a paleta
3. **App Reload**: Hook reaplica automaticamente
4. **Todas as Páginas**: Veem as mesmas cores

## ✅ Checklist de Funcionalidades

- [x] Carregar paletas da API
- [x] Exibir paletas dinamicamente
- [x] Preview visual das cores
- [x] Aplicar cores em tempo real
- [x] Salvar em localStorage
- [x] Carregar ao iniciar app
- [x] Indicador de paleta ativa
- [x] Loading states
- [x] Reset de paleta
- [x] Toast notifications
- [x] Gradientes dinâmicos
- [x] Responsividade

## 🎯 Benefícios

1. **Totalmente Dinâmico**: Paletas vêm da API
2. **Sem Reload**: Cores aplicadas instantaneamente
3. **Persistente**: Salvo entre sessões
4. **Escalável**: Fácil adicionar novas paletas
5. **Flexível**: Suporta qualquer cor hexadecimal
6. **UX Amigável**: Feedback visual imediato

## 🚧 Próximos Passos

1. [ ] Editor de paletas personalizado
2. [ ] Preview em tempo real antes de salvar
3. [ ] Importar/Exportar paletas
4. [ ] Suporte a dark mode por paleta
5. [ ] Validação de contraste de cores
6. [ ] Temas pré-definidos por indústria
7. [ ] API para compartilhar paletas

## 📊 Exemplo Completo

```typescript
// 1. Componente carrega paletas
useEffect(() => {
  const loadPalettes = async () => {
    const data = await customService.getColorsPalette();
    setPalettes(data);
  };
  loadPalettes();
}, []);

// 2. Usuário seleciona paleta
const handleSelect = (paletteId) => {
  const palette = palettes.find(p => p.id === paletteId);
  customService.applyColorPalette(palette);
  toast({ title: "Palette Applied!" });
};

// 3. Cores aplicadas via CSS
<div style={{ 
  background: `var(--color-primary)`,
  color: 'white'
}}>
  Usando cor primária da paleta!
</div>
```

---

**Desenvolvido por:** GitHub Copilot  
**Data:** 19/10/2025  
**Status:** ✅ Totalmente Funcional
