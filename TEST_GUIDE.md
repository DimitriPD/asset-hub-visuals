# 🧪 Guia de Teste - Sistema de Paleta de Cores Global

## 🎯 Como Testar a Aplicação Global de Cores

### 📋 Pré-requisitos

1. ✅ Servidor backend rodando em `http://localhost:5001`
2. ✅ Frontend rodando em `http://localhost:5173` (ou porta configurada)
3. ✅ Usuário logado com permissões de admin

---

## 🧪 Testes a Realizar

### **Teste 1: Aplicação Básica de Paleta**

#### Passos:
1. Acesse a página **Customization** (`/customization`)
2. Veja as paletas disponíveis carregadas da API
3. Clique em qualquer paleta
4. Observe a mudança **instantânea** de cores

#### ✅ O Que Verificar:
- [ ] Toast notification aparece confirmando "Palette Applied"
- [ ] Cores mudam em **menos de 1 segundo**
- [ ] Transições são **suaves** (sem flashes)
- [ ] Preview mostra as cores ativas
- [ ] Checkmark indica paleta selecionada

---

### **Teste 2: Sidebar (Barra Lateral)**

#### Passos:
1. Com a página aberta, selecione uma paleta **Roxa**
2. Observe a sidebar
3. Selecione uma paleta **Azul**
4. Observe as mudanças

#### ✅ O Que Deve Mudar na Sidebar:
- [ ] **Logo gradient** (canto superior)
- [ ] **Item de menu ativo** (borda esquerda colorida)
- [ ] **Badge de role** (Admin/User)
- [ ] **Avatar fallback** (se sem foto)
- [ ] **Botão "Switch to User"** (hover)
- [ ] **Indicador de notificação** (ponto vermelho pode ter tint)

#### 📸 Verificação Visual:
```
Antes (Roxo):  Depois (Azul):
Logo: 🟣      Logo: 🔵
Menu: 🟣      Menu: 🔵
Badge: 🟣     Badge: 🔵
```

---

### **Teste 3: Header (Cabeçalho)**

#### Passos:
1. Foque no header (barra superior)
2. Mude entre diferentes paletas
3. Observe todos os elementos

#### ✅ O Que Deve Mudar no Header:
- [ ] **Badge "Live Data"** (cor de fundo)
- [ ] **Ícone de Search** (ao fazer hover)
- [ ] **Dropdown de idioma** (hover nos items)
- [ ] **Badge de notificações** (contador)
- [ ] **Indicadores de "unread"** (pontinhos)
- [ ] **Avatar do usuário** (fallback se aplicável)

---

### **Teste 4: Botões em Toda a Interface**

#### Passos:
1. Navegue pelas páginas: Dashboard, Assets, Employees, etc.
2. Mude a paleta
3. Verifique se TODOS os botões mudam

#### ✅ Tipos de Botões a Verificar:
- [ ] **Botões primários** (ex: "Save Changes", "Add Asset")
- [ ] **Botões outline** (borda colorida)
- [ ] **Botões link** (texto sublinhado)
- [ ] **Botões em hover** (cor muda ao passar mouse)
- [ ] **Botões disabled** (mantêm cor com opacity)

#### 📍 Páginas para Testar:
- `/customization` - Botão "Save Changes"
- `/assets-management` - Botões "Add New Asset", "Edit"
- `/employees` - Botões de ação
- `/dashboard` - Se houver botões de filtro

---

### **Teste 5: Badges e Labels**

#### Passos:
1. Vá para página **Dashboard** ou **Assets**
2. Mude a paleta
3. Observe badges de status

#### ✅ O Que Deve Mudar:
- [ ] **Badge "Live Data"** (Dashboard)
- [ ] **Badge de Role** (Sidebar - Admin/User)
- [ ] **Badges de status** em cards
- [ ] **Labels coloridos** em tabelas
- [ ] **Tags** em eventos/auctions

---

### **Teste 6: Gráficos (Charts) no Dashboard**

#### Passos:
1. Acesse `/dashboard`
2. Mude para paleta **Roxa** (#8B5CF6)
3. Observe as cores dos gráficos
4. Mude para paleta **Azul** (#3B82F6)
5. Observe a mudança **instantânea**

#### ✅ O Que Deve Mudar nos Gráficos:

**AreaChart (Sales & Purchases):**
- [ ] Linha de "sales" muda de cor
- [ ] Preenchimento muda de cor (com opacity)
- [ ] Linha de "purchases" usa variante

**PieChart (Asset Categories):**
- [ ] Segmento "Electronics" usa cor primária
- [ ] Segmento "Furniture" usa cor secundária
- [ ] Segmento "Vehicles" usa cor terciária
- [ ] Segmento "Office Supplies" usa variante clara

**Stats Cards:**
- [ ] Ícones mudam de cor (DollarSign, Package, Users)

#### 📊 Verificação:
```
Paleta Roxa (#8B5CF6):
- Gráficos: Roxo
- Ícones: Roxo

Paleta Azul (#3B82F6):
- Gráficos: Azul ✅
- Ícones: Azul ✅
```

---

### **Teste 7: Ícones (Lucide Icons)**

#### Passos:
1. Navegue por várias páginas
2. Mude a paleta
3. Observe se ícones coloridos mudam

#### ✅ Ícones que Devem Mudar:
- [ ] **Ícones em Stats Cards** (Dashboard)
- [ ] **Ícones em Activity Feed**
- [ ] **Ícones na Sidebar** (Package, Users, Calendar)
- [ ] **Ícones no Header** (Search, Bell, Globe)
- [ ] **Ícones em botões** (Edit, Delete, etc.)

---

### **Teste 8: Cards e Containers**

#### Passos:
1. Vá para Dashboard
2. Mude paletas
3. Observe cards e containers

#### ✅ O Que Verificar:
- [ ] **Hover nos Stats Cards** (sombra muda?)
- [ ] **Bordas de cards** (se tiverem tint)
- [ ] **Background de cards ativos**
- [ ] **Activity Feed items** (hover states)

---

### **Teste 9: Formulários e Inputs**

#### Passos:
1. Vá para página com forms (ex: Assets Management - "Add New Asset")
2. Mude paleta
3. Interaja com inputs

#### ✅ O Que Deve Mudar:
- [ ] **Input em focus** (borda muda para cor primária)
- [ ] **Checkbox checked** (fundo usa cor primária)
- [ ] **Radio button selected** (borda e ponto usam primária)
- [ ] **Switch ativo** (fundo usa cor primária)
- [ ] **Slider** (track usa cor primária)

---

### **Teste 10: Gradientes**

#### Passos:
1. Procure elementos com gradientes
2. Mude paleta
3. Observe mudanças

#### ✅ Onde Verificar Gradientes:
- [ ] **Logo da Sidebar** (gradiente primária → secundária)
- [ ] **Hero sections** (se houver)
- [ ] **Cards especiais** (backgrounds com gradiente)
- [ ] **Banners de preview** (na página Customization)

---

### **Teste 11: Hover States (Estados de Hover)**

#### Passos:
1. Mude para uma paleta
2. Passe o mouse sobre vários elementos
3. Observe se cores de hover correspondem à paleta

#### ✅ Elementos para Testar Hover:
- [ ] **Items da Sidebar** (devem ficar levemente coloridos)
- [ ] **Botões primários** (devem ficar um pouco mais escuros)
- [ ] **Botões outline** (fundo leve da cor primária)
- [ ] **Dropdown items** (no Header)
- [ ] **Links** (sublinhado na cor primária)

---

### **Teste 12: Focus Rings (Anéis de Foco)**

#### Passos:
1. Use a tecla **Tab** para navegar
2. Observe os anéis de foco ao redor dos elementos
3. Mude paleta
4. Navegue novamente com Tab

#### ✅ O Que Verificar:
- [ ] **Botões com foco** (anel usa cor primária)
- [ ] **Inputs com foco** (anel usa cor primária)
- [ ] **Checkboxes** (anel ao receber foco)
- [ ] **Links** (anel ao receber foco)

---

### **Teste 13: Persistência (LocalStorage)**

#### Passos:
1. Selecione uma paleta **Verde** (se disponível)
2. Clique em "Save Changes"
3. **Recarregue a página** (F5 ou Ctrl+R)
4. Observe se cores permanecem

#### ✅ O Que Verificar:
- [ ] Cores continuam **verdes** após reload
- [ ] Paleta "Verde" aparece como **selecionada**
- [ ] Gráficos mantêm cores verdes
- [ ] Sidebar e Header mantêm cores

---

### **Teste 14: Múltiplas Trocas Rápidas**

#### Passos:
1. Na página Customization
2. Clique rapidamente em várias paletas
3. Teste trocar entre: Roxa → Azul → Verde → Laranja

#### ✅ O Que Verificar:
- [ ] Cada clique aplica cores **instantaneamente**
- [ ] Não há **lag** ou **flickering**
- [ ] Transições são **suaves**
- [ ] Toast não fica "spamming" (pode querer debounce)
- [ ] Última seleção é a que fica aplicada

---

### **Teste 15: Preview em Tempo Real**

#### Passos:
1. Na página Customization
2. Selecione uma paleta
3. Observe a seção **"Live Preview"**

#### ✅ O Que Verificar na Seção de Preview:
- [ ] **Banner "Live Preview"** mostra indicador ativo
- [ ] **3 blocos de cor** mostram primary, secondary, tertiary
- [ ] **Códigos HEX** estão corretos (#...)
- [ ] **Botão de exemplo** usa cor primária
- [ ] **Badge de exemplo** usa cor primária
- [ ] **Botão Outline** tem borda da cor primária

---

## 📊 Checklist Final de Verificação

### Elementos que DEVEM mudar de cor:

#### Layout
- [ ] Sidebar - Logo
- [ ] Sidebar - Items ativos
- [ ] Sidebar - Badges
- [ ] Header - Badges
- [ ] Header - Ícones (hover)

#### Componentes
- [ ] Botões primários
- [ ] Botões outline
- [ ] Botões link
- [ ] Badges
- [ ] Ícones Lucide
- [ ] Avatars (fallback)

#### Forms
- [ ] Input focus
- [ ] Checkbox checked
- [ ] Radio selected
- [ ] Switch active
- [ ] Slider track

#### Dashboard
- [ ] Stats Cards - Ícones
- [ ] AreaChart - Linhas
- [ ] PieChart - Segmentos
- [ ] Activity Feed - Ícones

#### States
- [ ] Hover states
- [ ] Active states
- [ ] Focus rings
- [ ] Disabled (com opacity)

#### Outros
- [ ] Gradientes
- [ ] Bordas coloridas
- [ ] Shadows (algumas)
- [ ] Tooltips (borders)

---

## 🐛 Troubleshooting

### Problema: "Cores não mudam"

**Possíveis causas:**
1. Backend não está retornando paletas
2. localStorage está bloqueando
3. Cache do navegador

**Solução:**
```javascript
// No console do navegador:
localStorage.clear();
window.location.reload();
```

### Problema: "Gráficos não atualizam"

**Solução:**
1. Verifique se está na página Dashboard
2. Abra o console e procure por erros
3. Force re-render:
```javascript
window.dispatchEvent(new CustomEvent('paletteChanged'));
```

### Problema: "Cores aparecem mas não fazem transição"

**Possível causa:** CSS não carregou corretamente

**Solução:**
1. Hard refresh: `Ctrl+F5`
2. Verifique `index.css` foi carregado
3. Verifique console por erros CSS

---

## 📸 Evidências Esperadas

### Antes e Depois - Dashboard

```
┌─────────────────────────────────────┐
│ ANTES (Roxo #8B5CF6)                │
├─────────────────────────────────────┤
│ Sidebar: 🟣                          │
│ Botões: 🟣                          │
│ Gráficos: 🟣                        │
│ Badges: 🟣                          │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ DEPOIS (Azul #3B82F6)               │
├─────────────────────────────────────┤
│ Sidebar: 🔵                          │
│ Botões: 🔵                          │
│ Gráficos: 🔵                        │
│ Badges: 🔵                          │
└─────────────────────────────────────┘

Tempo de transição: 300ms ⚡
```

---

## ✅ Critérios de Sucesso

Para considerar o teste **APROVADO**, você deve ver:

1. ✅ **Mudança instantânea** (< 1 segundo)
2. ✅ **Transições suaves** (300ms sem flashes)
3. ✅ **100% de cobertura** (todos elementos mudam)
4. ✅ **Persistência** (cores mantidas após reload)
5. ✅ **Feedback visual** (toast + preview)
6. ✅ **Sem erros** no console
7. ✅ **Gráficos atualizados** automaticamente
8. ✅ **Sidebar + Header** refletindo cores
9. ✅ **Hover/Focus states** usando novas cores
10. ✅ **Gradientes dinâmicos** aplicados

---

## 🎯 Resultado Esperado

Ao final dos testes, você deve ter **confirmado** que:

> **TODAS as cores do site (sidebar, header, botões, badges, ícones, gráficos, forms, etc.) mudam INSTANTANEAMENTE ao selecionar uma paleta, com transições suaves de 300ms, e permanecem após reload da página.**

---

## 📝 Notas Finais

- **Performance:** A aplicação deve ser instantânea (< 10ms)
- **UX:** Transições devem ser profissionais e suaves
- **Cobertura:** Nenhum elemento deve ficar com cor antiga
- **Consistência:** Todas as páginas devem refletir a mudança

**Se TODOS os itens acima estiverem funcionando: ✅ SUCESSO TOTAL!** 🎉

---

**Criado por:** GitHub Copilot  
**Data:** 19/10/2025  
**Versão:** 1.0
