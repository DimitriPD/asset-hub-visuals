# 💻 Guia do Desenvolvedor - Sistema de Paleta de Cores

## 🎯 Para Desenvolvedores que Queiram Entender ou Estender o Sistema

---

## 📚 Arquitetura do Sistema

### 1. **Estrutura de Arquivos**

```
asset-hub-visuals/
├── src/
│   ├── lib/
│   │   └── services/
│   │       └── customService.ts        # ⭐ Core do sistema
│   ├── hooks/
│   │   └── use-color-palette.ts       # Hook de auto-aplicação
│   ├── pages/
│   │   ├── Customization.tsx           # UI de seleção
│   │   └── Dashboard.tsx               # Exemplo com charts
│   ├── components/
│   │   └── Layout/
│   │       ├── AppSidebar.tsx         # Usa cores dinâmicas
│   │       └── Header.tsx             # Usa cores dinâmicas
│   ├── index.css                       # Variáveis CSS
│   └── App.tsx                         # Integração do hook
└── docs/
    ├── GLOBAL_COLOR_APPLICATION.md     # Documentação completa
    ├── COLOR_SYSTEM_SUMMARY.md         # Resumo executivo
    └── TEST_GUIDE.md                   # Guia de testes
```

---

## 🔧 Como Funciona Internamente

### 1. **Conversão de Cores (HEX → HSL)**

```typescript
// customService.ts

const hexToHSL = (hex: string): string => {
  // Remove o '#' se presente
  hex = hex.replace('#', '');
  
  // Converte HEX para RGB (0-1)
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  
  // Calcula HSL
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  
  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);
  
  // Retorna no formato Tailwind: "H S% L%"
  return `${h} ${s}% ${l}%`;
};

// Exemplo de uso:
hexToHSL("#8B5CF6") // → "267 82% 53%"
hexToHSL("#3B82F6") // → "217 91% 60%"
```

### 2. **Geração de Variantes**

```typescript
// customService.ts

const adjustLightness = (hsl: string, adjustment: number): string => {
  const match = hsl.match(/(\d+)\s+(\d+)%\s+(\d+)%/);
  if (!match) return hsl;
  
  const h = match[1];
  const s = match[2];
  let l = parseInt(match[3]);
  
  // Ajusta luminosidade mantendo entre 0-100
  l = Math.max(0, Math.min(100, l + adjustment));
  
  return `${h} ${s}% ${l}%`;
};

// Exemplos:
const primary = "267 82% 53%";
adjustLightness(primary, 7);   // → "267 82% 60%" (mais claro)
adjustLightness(primary, -8);  // → "267 82% 45%" (mais escuro)
```

### 3. **Aplicação das Cores**

```typescript
// customService.ts

applyColorPalette(palette: Palette): void {
  const root = document.documentElement;
  
  // 1. Cor primária e suas variantes
  if (palette.primaryColor) {
    const primaryHSL = hexToHSL(palette.primaryColor);
    
    root.style.setProperty('--primary', primaryHSL);
    root.style.setProperty('--color-primary', palette.primaryColor);
    root.style.setProperty('--primary-foreground', '0 0% 98%');
    root.style.setProperty('--primary-light', adjustLightness(primaryHSL, 7));
    root.style.setProperty('--primary-dark', adjustLightness(primaryHSL, -8));
    root.style.setProperty('--hover-purple', adjustLightness(primaryHSL, 2));
    root.style.setProperty('--active-purple', adjustLightness(primaryHSL, -5));
    
    // Sidebar
    root.style.setProperty('--sidebar-primary', primaryHSL);
    root.style.setProperty('--sidebar-ring', primaryHSL);
    
    // Focus ring
    root.style.setProperty('--ring', primaryHSL);
  }
  
  // 2. Cores secundária e terciária
  if (palette.secondaryColor) {
    const secondaryHSL = hexToHSL(palette.secondaryColor);
    root.style.setProperty('--secondary', secondaryHSL);
    root.style.setProperty('--color-secondary', palette.secondaryColor);
  }
  
  if (palette.tertiaryColor) {
    const tertiaryHSL = hexToHSL(palette.tertiaryColor);
    root.style.setProperty('--tertiary', tertiaryHSL);
    root.style.setProperty('--color-tertiary', palette.tertiaryColor);
  }
  
  // 3. Gradientes
  if (palette.primaryColor && palette.secondaryColor) {
    root.style.setProperty('--gradient-primary', 
      `linear-gradient(135deg, ${palette.primaryColor}, ${palette.secondaryColor})`
    );
    
    if (palette.tertiaryColor) {
      root.style.setProperty('--gradient-hero', 
        `linear-gradient(135deg, ${palette.primaryColor}, ${palette.secondaryColor}, ${palette.tertiaryColor})`
      );
    }
  }
  
  // 4. Cores de gráficos
  if (palette.primaryColor) {
    const primaryHSL = hexToHSL(palette.primaryColor);
    root.style.setProperty('--chart-1', primaryHSL);
    root.style.setProperty('--chart-4', adjustLightness(primaryHSL, 15));
    root.style.setProperty('--chart-5', adjustLightness(primaryHSL, -15));
  }
  if (palette.secondaryColor) {
    root.style.setProperty('--chart-2', hexToHSL(palette.secondaryColor));
  }
  if (palette.tertiaryColor) {
    root.style.setProperty('--chart-3', hexToHSL(palette.tertiaryColor));
  }
  
  // 5. Persistência
  localStorage.setItem('selectedPalette', JSON.stringify(palette));
  
  // 6. Evento para re-render de componentes
  window.dispatchEvent(new CustomEvent('paletteChanged', { detail: palette }));
}
```

---

## 🎨 Como Usar nas CSS

### 1. **Variáveis CSS Disponíveis**

```css
/* index.css */

:root {
  /* Core - Atualizadas automaticamente pela paleta */
  --primary: 267 82% 53%;                /* HSL format */
  --color-primary: #8B5CF6;              /* HEX format */
  --primary-foreground: 0 0% 98%;
  --primary-light: 267 82% 60%;
  --primary-dark: 267 82% 45%;
  
  --secondary: 267 71% 60%;
  --color-secondary: #A78BFA;
  --secondary-foreground: 0 0% 98%;
  
  --tertiary: 267 60% 67%;
  --color-tertiary: #C4B5FD;
  
  /* Gradientes */
  --gradient-primary: linear-gradient(...);
  --gradient-hero: linear-gradient(...);
  
  /* Charts */
  --chart-1: var(--primary);
  --chart-2: var(--secondary);
  --chart-3: var(--tertiary);
  --chart-4: /* variante +15% */;
  --chart-5: /* variante -15% */;
  
  /* Interactive states */
  --hover-purple: /* +2% luminosidade */;
  --active-purple: /* -5% luminosidade */;
  --ring: var(--primary);
  
  /* Sidebar */
  --sidebar-primary: var(--primary);
  --sidebar-primary-foreground: 0 0% 98%;
  --sidebar-ring: var(--primary);
}
```

### 2. **Usando com Tailwind CSS**

```tsx
// Componente React

// ✅ CORRETO - Usa variável CSS
<div className="bg-primary text-primary-foreground">
  Texto em fundo primário
</div>

// ✅ CORRETO - Opacity com Tailwind
<div className="bg-primary/20">
  Fundo com 20% de opacity
</div>

// ✅ CORRETO - Border
<div className="border-2 border-primary">
  Borda primária
</div>

// ✅ CORRETO - Hover
<div className="hover:bg-primary hover:text-primary-foreground">
  Hover com cor primária
</div>

// ❌ INCORRETO - Cor hardcoded
<div className="bg-purple-500">
  Não muda com a paleta!
</div>
```

### 3. **Usando Gradientes**

```tsx
// ✅ Classe utilitária
<div className="bg-gradient-primary">
  Gradiente dinâmico
</div>

// ✅ Style inline
<div style={{ background: 'var(--gradient-hero)' }}>
  Gradiente hero
</div>

// ✅ CSS customizado
<div className="custom-gradient">
  Gradiente customizado
</div>

/* CSS */
.custom-gradient {
  background: var(--gradient-primary);
  background-size: 200% 200%;
  animation: gradient 3s ease infinite;
}
```

---

## 📊 Integração com Gráficos (Recharts)

### 1. **Função Helper para Buscar Cores**

```typescript
// Dashboard.tsx ou qualquer página com gráficos

const getPaletteColor = (variable: string) => {
  if (typeof window !== 'undefined') {
    const root = document.documentElement;
    const value = getComputedStyle(root).getPropertyValue(variable).trim();
    
    if (value.includes(' ')) {
      // É HSL, retorna no formato hsl()
      return `hsl(${value})`;
    }
    return value || '#8B5CF6'; // Fallback
  }
  return '#8B5CF6';
};
```

### 2. **Usando em PieChart**

```tsx
const assetCategories = [
  { 
    name: 'Electronics', 
    value: 400, 
    color: getPaletteColor('--color-primary') // Dinâmico!
  },
  { 
    name: 'Furniture', 
    value: 300, 
    color: getPaletteColor('--color-secondary')
  },
  { 
    name: 'Vehicles', 
    value: 200, 
    color: getPaletteColor('--color-tertiary')
  },
];

<PieChart>
  <Pie data={assetCategories} dataKey="value">
    {assetCategories.map((entry, index) => (
      <Cell key={`cell-${index}`} fill={entry.color} />
    ))}
  </Pie>
</PieChart>
```

### 3. **Usando em AreaChart**

```tsx
<AreaChart data={salesData}>
  <Area 
    type="monotone"
    dataKey="sales"
    stroke="hsl(var(--primary))"     // Usa variável CSS
    fill="hsl(var(--primary))"       // Preenche com primary
    fillOpacity={0.3}                // 30% opacity
  />
  <Area 
    type="monotone"
    dataKey="purchases"
    stroke="hsl(var(--secondary))"   // Usa variável CSS
    fill="hsl(var(--secondary))"
    fillOpacity={0.3}
  />
</AreaChart>
```

### 4. **Hook para Re-render Automático**

```typescript
// Dashboard.tsx

const [paletteVersion, setPaletteVersion] = useState(0);

useEffect(() => {
  const handlePaletteChange = () => {
    setPaletteVersion(prev => prev + 1); // Força re-render
  };
  
  window.addEventListener('paletteChanged', handlePaletteChange);
  
  return () => {
    window.removeEventListener('paletteChanged', handlePaletteChange);
  };
}, []);

// Quando paletteVersion muda, componente re-renderiza
// e getPaletteColor() busca novas cores
```

---

## 🔌 Criando Novos Componentes com Cores Dinâmicas

### 1. **Componente de Card com Cor Primária**

```tsx
// CardWithPrimary.tsx

import { Card } from "@/components/ui/card";

interface CardWithPrimaryProps {
  title: string;
  children: React.ReactNode;
}

export function CardWithPrimary({ title, children }: CardWithPrimaryProps) {
  return (
    <Card className="border-primary/20 hover:border-primary/50 transition-colors">
      <div className="p-4 border-l-4 border-primary">
        <h3 className="text-primary font-bold mb-2">{title}</h3>
        {children}
      </div>
    </Card>
  );
}

// Uso:
<CardWithPrimary title="Meu Card">
  Conteúdo aqui - borda e título mudam com a paleta!
</CardWithPrimary>
```

### 2. **Badge Customizado com Gradiente**

```tsx
// GradientBadge.tsx

import { Badge } from "@/components/ui/badge";

export function GradientBadge({ children }: { children: React.ReactNode }) {
  return (
    <Badge 
      className="bg-gradient-primary text-white font-semibold px-3 py-1"
      style={{ 
        background: 'var(--gradient-primary)',
        border: 'none'
      }}
    >
      {children}
    </Badge>
  );
}

// Uso:
<GradientBadge>Premium</GradientBadge>
```

### 3. **Ícone com Cor Primária**

```tsx
// PrimaryIcon.tsx

import { LucideIcon } from "lucide-react";

interface PrimaryIconProps {
  icon: LucideIcon;
  size?: number;
  className?: string;
}

export function PrimaryIcon({ 
  icon: Icon, 
  size = 24, 
  className = "" 
}: PrimaryIconProps) {
  return (
    <Icon 
      size={size} 
      className={`text-primary ${className}`} 
    />
  );
}

// Uso:
import { Package } from "lucide-react";

<PrimaryIcon icon={Package} size={20} />
```

---

## 🎨 Estendendo o Sistema

### 1. **Adicionar Nova Variável CSS**

```typescript
// customService.ts - dentro de applyColorPalette()

// Adicionar nova variável
if (palette.primaryColor) {
  const primaryHSL = hexToHSL(palette.primaryColor);
  
  // Nova variável: accent color (20% mais clara)
  root.style.setProperty('--accent', adjustLightness(primaryHSL, 20));
}
```

```css
/* index.css */

:root {
  --accent: 267 82% 73%; /* Será sobrescrito */
}

/* Uso */
.my-element {
  background: hsl(var(--accent));
}
```

### 2. **Adicionar Nova Cor de Chart**

```typescript
// customService.ts

// Adicionar chart-6 (combinação de primary + secondary)
if (palette.primaryColor && palette.secondaryColor) {
  const primary = hexToHSL(palette.primaryColor);
  const secondary = hexToHSL(palette.secondaryColor);
  
  // Média entre primary e secondary
  const [h1, s1, l1] = primary.match(/\d+/g)!.map(Number);
  const [h2, s2, l2] = secondary.match(/\d+/g)!.map(Number);
  
  const avgH = Math.round((h1 + h2) / 2);
  const avgS = Math.round((s1 + s2) / 2);
  const avgL = Math.round((l1 + l2) / 2);
  
  root.style.setProperty('--chart-6', `${avgH} ${avgS}% ${avgL}%`);
}
```

### 3. **Criar Theme Variants**

```typescript
// themeService.ts (novo arquivo)

export const themeVariants = {
  vibrant: (palette: Palette) => {
    // Aumenta saturação em 10%
    return {
      ...palette,
      primaryColor: adjustSaturation(palette.primaryColor, 10),
    };
  },
  
  muted: (palette: Palette) => {
    // Reduz saturação em 20%
    return {
      ...palette,
      primaryColor: adjustSaturation(palette.primaryColor, -20),
    };
  },
  
  highContrast: (palette: Palette) => {
    // Aumenta contraste
    return {
      ...palette,
      primaryColor: adjustLightness(palette.primaryColor, -15),
    };
  },
};

// Função auxiliar
function adjustSaturation(hex: string, adjustment: number): string {
  const hsl = hexToHSL(hex);
  const [h, s, l] = hsl.match(/\d+/g)!.map(Number);
  const newS = Math.max(0, Math.min(100, s + adjustment));
  return hslToHex(`${h} ${newS}% ${l}%`);
}
```

---

## 🧪 Testes Unitários

### 1. **Testar Conversão HEX → HSL**

```typescript
// customService.test.ts

import { hexToHSL } from './customService';

describe('hexToHSL', () => {
  it('should convert purple correctly', () => {
    expect(hexToHSL('#8B5CF6')).toBe('267 82% 53%');
  });
  
  it('should convert blue correctly', () => {
    expect(hexToHSL('#3B82F6')).toBe('217 91% 60%');
  });
  
  it('should handle hex without #', () => {
    expect(hexToHSL('FF0000')).toBe('0 100% 50%');
  });
});
```

### 2. **Testar Ajuste de Luminosidade**

```typescript
describe('adjustLightness', () => {
  it('should lighten color', () => {
    expect(adjustLightness('267 82% 53%', 7)).toBe('267 82% 60%');
  });
  
  it('should darken color', () => {
    expect(adjustLightness('267 82% 53%', -8)).toBe('267 82% 45%');
  });
  
  it('should not go below 0%', () => {
    expect(adjustLightness('267 82% 5%', -10)).toBe('267 82% 0%');
  });
  
  it('should not go above 100%', () => {
    expect(adjustLightness('267 82% 95%', 10)).toBe('267 82% 100%');
  });
});
```

---

## 🚀 Performance

### 1. **Medir Tempo de Aplicação**

```typescript
// customService.ts

applyColorPalette(palette: Palette): void {
  const startTime = performance.now();
  
  // ... todo o código de aplicação ...
  
  const endTime = performance.now();
  console.log(`Palette applied in ${endTime - startTime}ms`);
  
  // Típico: < 10ms
}
```

### 2. **Debounce para Múltiplas Mudanças**

```typescript
// Customization.tsx

const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

const handlePaletteUpdate = (paletteId: string) => {
  // Cancela timer anterior
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  
  // Aplica após 100ms
  const timer = setTimeout(() => {
    const palette = palettes.find(p => p.id === paletteId);
    if (palette) {
      customService.applyColorPalette(palette);
    }
  }, 100);
  
  setDebounceTimer(timer);
};
```

### 3. **Lazy Loading de Gráficos**

```typescript
// Dashboard.tsx

const [chartsVisible, setChartsVisible] = useState(false);

useEffect(() => {
  // Só renderiza gráficos quando scroll chega neles
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setChartsVisible(true);
      }
    },
    { threshold: 0.1 }
  );
  
  const chartsElement = document.getElementById('charts-section');
  if (chartsElement) {
    observer.observe(chartsElement);
  }
  
  return () => observer.disconnect();
}, []);

// Render
{chartsVisible && (
  <div id="charts-section">
    <AreaChart {...} />
    <PieChart {...} />
  </div>
)}
```

---

## 📝 Boas Práticas

### ✅ DO's

1. **Use variáveis CSS** em vez de cores hardcoded
```tsx
// ✅ BOM
<div className="bg-primary" />

// ❌ MAU
<div className="bg-purple-500" />
```

2. **Use classes Tailwind** quando possível
```tsx
// ✅ BOM
<Badge className="bg-primary text-primary-foreground" />

// ⚠️ OK mas menos recomendado
<Badge style={{ backgroundColor: 'hsl(var(--primary))' }} />
```

3. **Adicione transições** para mudanças suaves
```css
.my-element {
  background-color: hsl(var(--primary));
  transition: background-color 300ms;
}
```

4. **Documente novas variáveis**
```typescript
// Adiciona nova variável para accent color
root.style.setProperty('--accent', accentHSL);
```

### ❌ DON'Ts

1. **Não use cores hardcoded**
```tsx
// ❌ NÃO faça isso
<div style={{ color: '#8B5CF6' }} />
```

2. **Não ignore acessibilidade**
```tsx
// ❌ Contraste baixo
<div className="bg-primary/10 text-primary/30">Texto ilegível</div>

// ✅ Contraste adequado
<div className="bg-primary/10 text-primary">Texto legível</div>
```

3. **Não bloqueie o thread principal**
```typescript
// ❌ Loop pesado bloqueando UI
for (let i = 0; i < 1000000; i++) {
  root.style.setProperty(`--var-${i}`, `${i} 50% 50%`);
}

// ✅ Batch updates
requestAnimationFrame(() => {
  // Aplica todas as variáveis de uma vez
  applyColorPalette(palette);
});
```

---

## 🎯 Exemplos Avançados

### 1. **Tema Escuro com Paleta**

```typescript
// darkModeService.ts

export function applyDarkMode(palette: Palette, isDark: boolean) {
  const root = document.documentElement;
  
  if (isDark) {
    // Escurece a paleta
    const primaryHSL = hexToHSL(palette.primaryColor);
    const darkerPrimary = adjustLightness(primaryHSL, -20);
    
    root.style.setProperty('--primary', darkerPrimary);
    root.style.setProperty('--background', '267 45% 6%');
    root.style.setProperty('--foreground', '267 25% 90%');
  } else {
    // Usa paleta normal
    customService.applyColorPalette(palette);
  }
}
```

### 2. **Animação de Transição entre Paletas**

```typescript
// animatedPaletteChange.ts

export function animatePaletteChange(
  fromPalette: Palette, 
  toPalette: Palette, 
  duration: number = 500
) {
  const startTime = Date.now();
  
  function animate() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Interpola cores
    const interpolatedColor = interpolateHex(
      fromPalette.primaryColor,
      toPalette.primaryColor,
      progress
    );
    
    // Aplica cor interpolada
    const root = document.documentElement;
    root.style.setProperty('--color-primary', interpolatedColor);
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      // Finaliza com paleta exata
      customService.applyColorPalette(toPalette);
    }
  }
  
  animate();
}

function interpolateHex(hex1: string, hex2: string, t: number): string {
  // Converte para RGB
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  
  // Interpola
  const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * t);
  const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * t);
  const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * t);
  
  return rgbToHex(r, g, b);
}
```

### 3. **Color Picker Integrado**

```tsx
// ColorPickerWithPalette.tsx

import { useState } from "react";
import { customService } from "@/lib/services/customService";

export function ColorPickerWithPalette() {
  const [customColor, setCustomColor] = useState("#8B5CF6");
  
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setCustomColor(newColor);
    
    // Aplica imediatamente
    const palette = {
      id: 'custom',
      paletteName: 'Custom',
      primaryColor: newColor,
      secondaryColor: null,
      tertiaryColor: null,
    };
    
    customService.applyColorPalette(palette);
  };
  
  return (
    <div>
      <label>Escolha sua cor primária:</label>
      <input 
        type="color" 
        value={customColor}
        onChange={handleColorChange}
      />
      <div 
        className="w-16 h-16 rounded-full"
        style={{ backgroundColor: customColor }}
      />
    </div>
  );
}
```

---

## 📚 Recursos Adicionais

### Documentação
- `GLOBAL_COLOR_APPLICATION.md` - Documentação completa
- `COLOR_SYSTEM_SUMMARY.md` - Resumo executivo
- `TEST_GUIDE.md` - Guia de testes
- `REALTIME_COLORS.md` - Mudanças em tempo real

### Links Úteis
- [Tailwind CSS Colors](https://tailwindcss.com/docs/customizing-colors)
- [HSL Color Picker](https://hslpicker.com/)
- [Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Recharts Documentation](https://recharts.org/en-US/)

---

**Desenvolvido por:** GitHub Copilot  
**Data:** 19/10/2025  
**Versão:** 1.0  
**Licença:** MIT
