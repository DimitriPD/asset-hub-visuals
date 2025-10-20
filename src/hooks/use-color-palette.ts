import { useEffect } from 'react';
import { customService } from '@/lib/services/customService';

/**
 * Hook to load and apply saved color palette on app initialization
 */
export function useColorPalette() {
  useEffect(() => {
    // Load and apply saved palette when app mounts
    const savedPalette = customService.loadSavedPalette();
    if (savedPalette) {
      customService.applyColorPalette(savedPalette);
    }
  }, []);
}
