# 🏢 Asset Hub - Enterprise Asset Management Platform

Uma plataforma moderna e completa para gerenciamento de ativos empresariais com sistema avançado de customização visual.

## ✨ Features Principais

- 🎨 **Sistema de Paleta de Cores Dinâmico** - Customize toda a interface em tempo real
- 📊 **Dashboard Interativo** - Gráficos e métricas em tempo real
- 📦 **Gerenciamento de Ativos** - CRUD completo com filtros avançados
- 👥 **Gestão de Funcionários** - Controle de usuários e permissões
- 🎭 **Eventos e Leilões** - Sistema completo de eventos
- 🔐 **Autenticação JWT** - Login seguro com múltiplas roles
- 🌍 **Multi-idioma** - Suporte para PT, EN, ES
- 📱 **Responsivo** - Interface adaptada para todos os dispositivos

## 🎨 Sistema de Cores Dinâmico

Este projeto implementa um **sistema avançado de aplicação global de paletas de cores** que permite:

- ✅ Mudança instantânea de cores em **TODO o site** (< 10ms)
- ✅ Transições suaves de 300ms em todos os elementos
- ✅ Aplicação em: Sidebar, Header, Botões, Badges, Ícones, Gráficos, Forms
- ✅ Conversão automática HEX → HSL (compatível com Tailwind)
- ✅ Geração automática de variantes (light, dark, hover, active)
- ✅ Persistência via localStorage
- ✅ Re-render automático de componentes dinâmicos (gráficos)

### 📚 Documentação Completa

- **[GLOBAL_COLOR_APPLICATION.md](./GLOBAL_COLOR_APPLICATION.md)** - Documentação técnica completa do sistema de cores
- **[COLOR_SYSTEM_SUMMARY.md](./COLOR_SYSTEM_SUMMARY.md)** - Resumo executivo da implementação
- **[REALTIME_COLORS.md](./REALTIME_COLORS.md)** - Guia sobre mudanças em tempo real
- **[TEST_GUIDE.md](./TEST_GUIDE.md)** - Guia completo de testes do sistema
- **[DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)** - Guia para desenvolvedores
- **[API_INTEGRATION.md](./API_INTEGRATION.md)** - Integração com backend
- **[CUSTOM_INTEGRATION.md](./CUSTOM_INTEGRATION.md)** - Endpoints de customização

## Project info

**URL**: https://lovable.dev/projects/745f0784-a396-413c-a321-8a97983ba168

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/745f0784-a396-413c-a321-8a97983ba168) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## 🛠️ Technologies

### Frontend
- **Vite** - Build tool e dev server
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **Shadcn/ui** - Componentes UI de alta qualidade
- **Recharts** - Biblioteca de gráficos
- **Axios** - HTTP client
- **React Router** - Navegação
- **Lucide Icons** - Ícones modernos

### Backend (API)
- **Node.js** + **Express**
- **PostgreSQL** (via Sequelize ORM)
- **JWT Authentication**
- **RESTful API**

### Design System
- **CSS Variables** - Cores dinâmicas
- **HSL Color Space** - Compatibilidade com Tailwind
- **Custom Event System** - Comunicação entre componentes
- **LocalStorage** - Persistência de preferências

## 🚀 Quick Start

### Pré-requisitos
- Node.js 18+ ([instalar com nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- npm ou yarn
- Backend rodando em `http://localhost:5001`

### Instalação

```sh
# Clone o repositório
git clone <YOUR_GIT_URL>

# Entre no diretório
cd asset-hub-visuals

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env

# Inicie o servidor de desenvolvimento
npm run dev
```

### Variáveis de Ambiente

```env
VITE_API_URL=http://localhost:5001
```

## 📖 Como Usar o Sistema de Cores

### 1. Acesse a Página de Customização
```
http://localhost:5173/customization
```

### 2. Selecione uma Paleta
- Clique em qualquer paleta disponível
- Veja a mudança **instantânea** em todo o site
- Toast confirma a aplicação

### 3. Verifique a Aplicação Global
- ✅ Sidebar muda de cor
- ✅ Botões atualizam
- ✅ Gráficos re-renderizam
- ✅ Badges e ícones mudam
- ✅ Gradientes se atualizam

### 4. Salve as Mudanças
- Clique em "Save Changes"
- Cores são persistidas no localStorage
- Mantêm-se após reload da página

## 🎯 Estrutura do Projeto

```
asset-hub-visuals/
├── src/
│   ├── lib/
│   │   └── services/
│   │       ├── customService.ts    # ⭐ Core do sistema de cores
│   │       └── assetService.ts     # Serviço de assets
│   ├── hooks/
│   │   └── use-color-palette.ts    # Hook de auto-aplicação
│   ├── pages/
│   │   ├── Customization.tsx       # Página de customização
│   │   ├── Dashboard.tsx           # Dashboard com gráficos
│   │   └── ...
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── AppSidebar.tsx     # Sidebar dinâmica
│   │   │   └── Header.tsx         # Header dinâmico
│   │   └── ui/                    # Componentes Shadcn
│   ├── contexts/
│   │   └── AuthContext.tsx        # Autenticação
│   ├── index.css                  # Variáveis CSS globais
│   └── App.tsx                    # App principal
├── docs/
│   ├── GLOBAL_COLOR_APPLICATION.md  # Doc completa
│   ├── COLOR_SYSTEM_SUMMARY.md      # Resumo
│   ├── TEST_GUIDE.md                # Guia de testes
│   └── DEVELOPER_GUIDE.md           # Guia dev
└── README.md
```

## 🎨 Variáveis CSS Disponíveis

```css
/* Cores principais (atualizadas pela paleta) */
--primary              /* HSL da cor primária */
--color-primary        /* HEX da cor primária */
--secondary            /* Cor secundária */
--tertiary             /* Cor terciária */

/* Variantes automáticas */
--primary-light        /* +7% luminosidade */
--primary-dark         /* -8% luminosidade */
--hover-purple         /* Estado hover */
--active-purple        /* Estado active */

/* Gradientes dinâmicos */
--gradient-primary     /* Primary → Secondary */
--gradient-hero        /* Primary → Secondary → Tertiary */

/* Charts (gráficos) */
--chart-1 a --chart-5  /* Cores para gráficos */

/* Sidebar */
--sidebar-primary
--sidebar-ring

/* Interactive */
--ring                 /* Focus rings */
```

## 📊 Exemplo de Uso

### Botão com Cor Primária
```tsx
<Button variant="default">
  Salvar Mudanças
</Button>
// Usa bg-primary automaticamente
```

### Gráfico com Cores Dinâmicas
```tsx
<AreaChart data={data}>
  <Area 
    stroke="hsl(var(--primary))" 
    fill="hsl(var(--primary))" 
  />
</AreaChart>
```

### Card com Gradiente
```tsx
<div className="bg-gradient-primary p-6">
  Conteúdo com gradiente dinâmico
</div>
```

## 🧪 Testes

Para testar o sistema completo, siga o [TEST_GUIDE.md](./TEST_GUIDE.md) que inclui:

- ✅ Aplicação básica de paleta
- ✅ Verificação de sidebar e header
- ✅ Testes de botões e badges
- ✅ Validação de gráficos
- ✅ Persistência via localStorage
- ✅ Múltiplas trocas rápidas

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/745f0784-a396-413c-a321-8a97983ba168) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
