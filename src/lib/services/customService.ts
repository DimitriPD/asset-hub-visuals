import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

// Types based on API DTOs
export interface Palette {
  id: string;
  paletteName: string;
  primaryColor: string | null;
  secondaryColor: string | null;
  tertiaryColor: string | null;
}

export interface PaletteQuery {
  companyId?: string;
  paletteName?: string;
}

export interface PaletteUpdate {
  paletteName?: string;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  tertiaryColor?: string | null;
}

export interface LogoUpdate {
  logoUrl: string;
}

export interface CatalogFiltersUpdate {
  catalogFilterRulesJson: object;
}

export interface CompanyCustom {
  id: string;
  tradeName: string;
  logoUrl: string | null;
  catalogFilterRulesJson: object | null;
  paletteId: string | null;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('assethub_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Transform API response to handle { data: ... } format
const extractData = (response: any) => {
  return response.data.data || response.data;
};

export const customService = {
  /**
   * Get color palettes
   */
  async getColorsPalette(query?: PaletteQuery): Promise<Palette[]> {
    try {
      const response = await api.get('/custom/colorsPalette', { params: query });
      const palettes = extractData(response);
      return Array.isArray(palettes) ? palettes : [palettes];
    } catch (error) {
      console.error('Error fetching color palettes:', error);
      throw error;
    }
  },

  /**
   * Update color palette by ID
   */
  async updateColorsPalette(id: string, data: PaletteUpdate): Promise<Palette> {
    try {
      const response = await api.patch(`/custom/colorsPalette/${id}`, data);
      return extractData(response);
    } catch (error) {
      console.error('Error updating color palette:', error);
      throw error;
    }
  },

  /**
   * Update company logo
   */
  async updateLogo(data: LogoUpdate): Promise<CompanyCustom> {
    try {
      const response = await api.patch('/custom/logo', data);
      return extractData(response);
    } catch (error) {
      console.error('Error updating logo:', error);
      throw error;
    }
  },

  /**
   * Update catalog filter rules
   */
  async updateCatalogFilters(data: CatalogFiltersUpdate): Promise<CompanyCustom> {
    try {
      const response = await api.patch('/custom/catalogFilters', data);
      return extractData(response);
    } catch (error) {
      console.error('Error updating catalog filters:', error);
      throw error;
    }
  },

  /**
   * Apply color palette to the website
   * Converts hex colors to HSL format for Tailwind CSS
   * Applies colors to ALL elements: sidebar, buttons, charts, icons, badges, etc.
   */
  applyColorPalette(palette: Palette): void {
    const root = document.documentElement;
    
    // Helper function to convert hex to HSL
    const hexToHSL = (hex: string): string => {
      // Remove # if present
      hex = hex.replace('#', '');
      
      // Convert to RGB
      const r = parseInt(hex.substring(0, 2), 16) / 255;
      const g = parseInt(hex.substring(2, 4), 16) / 255;
      const b = parseInt(hex.substring(4, 6), 16) / 255;
      
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
      
      return `${h} ${s}% ${l}%`;
    };
    
    // Helper to calculate lighter/darker variants
    const adjustLightness = (hsl: string, adjustment: number): string => {
      const match = hsl.match(/(\d+)\s+(\d+)%\s+(\d+)%/);
      if (!match) return hsl;
      
      const h = match[1];
      const s = match[2];
      let l = parseInt(match[3]);
      l = Math.max(0, Math.min(100, l + adjustment));
      
      return `${h} ${s}% ${l}%`;
    };
    
    // Apply primary color and all its variants
    if (palette.primaryColor) {
      const primaryHSL = hexToHSL(palette.primaryColor);
      
      // Core primary colors
      root.style.setProperty('--primary', primaryHSL);
      root.style.setProperty('--color-primary', palette.primaryColor);
      root.style.setProperty('--primary-foreground', '0 0% 98%');
      
      // Primary variants for hover/active states
      root.style.setProperty('--primary-light', adjustLightness(primaryHSL, 7));
      root.style.setProperty('--primary-dark', adjustLightness(primaryHSL, -8));
      root.style.setProperty('--hover-purple', adjustLightness(primaryHSL, 2));
      root.style.setProperty('--active-purple', adjustLightness(primaryHSL, -5));
      
      // Sidebar colors (use primary as base)
      root.style.setProperty('--sidebar-primary', primaryHSL);
      root.style.setProperty('--sidebar-primary-foreground', '0 0% 98%');
      root.style.setProperty('--sidebar-ring', primaryHSL);
      
      // Sidebar accent (for hover and active states)
      root.style.setProperty('--sidebar-accent', adjustLightness(primaryHSL, -40)); // Darker for contrast
      root.style.setProperty('--sidebar-accent-foreground', primaryHSL);
      
      // Ring/focus colors
      root.style.setProperty('--ring', primaryHSL);
    }
    
    // Apply secondary color
    if (palette.secondaryColor) {
      const secondaryHSL = hexToHSL(palette.secondaryColor);
      root.style.setProperty('--color-secondary', palette.secondaryColor);
      root.style.setProperty('--secondary', secondaryHSL);
      root.style.setProperty('--secondary-foreground', '0 0% 98%');
    }
    
    // Apply tertiary color
    if (palette.tertiaryColor) {
      const tertiaryHSL = hexToHSL(palette.tertiaryColor);
      root.style.setProperty('--color-tertiary', palette.tertiaryColor);
      root.style.setProperty('--tertiary', tertiaryHSL);
    }
    
    // Update gradients with all color combinations
    if (palette.primaryColor && palette.secondaryColor) {
      root.style.setProperty('--gradient-primary', 
        `linear-gradient(135deg, ${palette.primaryColor}, ${palette.secondaryColor})`);
      
      // Hero gradient with all three colors
      if (palette.tertiaryColor) {
        root.style.setProperty('--gradient-hero', 
          `linear-gradient(135deg, ${palette.primaryColor}, ${palette.secondaryColor}, ${palette.tertiaryColor})`);
      }
    }
    
    // Update chart colors (for dashboard graphs)
    if (palette.primaryColor) {
      root.style.setProperty('--chart-1', hexToHSL(palette.primaryColor));
    }
    if (palette.secondaryColor) {
      root.style.setProperty('--chart-2', hexToHSL(palette.secondaryColor));
    }
    if (palette.tertiaryColor) {
      root.style.setProperty('--chart-3', hexToHSL(palette.tertiaryColor));
    }
    
    // Additional chart colors (generated from primary)
    if (palette.primaryColor) {
      const primaryHSL = hexToHSL(palette.primaryColor);
      root.style.setProperty('--chart-4', adjustLightness(primaryHSL, 15));
      root.style.setProperty('--chart-5', adjustLightness(primaryHSL, -15));
    }
    
    // Update status colors with primary tint
    if (palette.primaryColor) {
      const primaryHSL = hexToHSL(palette.primaryColor);
      root.style.setProperty('--status-pending', adjustLightness(primaryHSL, 10));
    }
    
    // Store in localStorage for persistence
    localStorage.setItem('selectedPalette', JSON.stringify(palette));
    
    // Trigger a custom event to notify components of color change
    window.dispatchEvent(new CustomEvent('paletteChanged', { 
      detail: palette 
    }));
  },

  /**
   * Load saved palette from localStorage
   */
  loadSavedPalette(): Palette | null {
    try {
      const saved = localStorage.getItem('selectedPalette');
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Error loading saved palette:', error);
      return null;
    }
  },

  /**
   * Clear saved palette
   */
  clearSavedPalette(): void {
    localStorage.removeItem('selectedPalette');
    const root = document.documentElement;
    root.style.removeProperty('--color-primary');
    root.style.removeProperty('--color-secondary');
    root.style.removeProperty('--color-tertiary');
  },
};
