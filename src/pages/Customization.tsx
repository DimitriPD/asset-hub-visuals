import { useState, useEffect } from "react";
import { Upload, Palette, Filter, Save, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useAuth, useTranslation } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { customService, Palette as PaletteType } from "@/lib/services/customService";

export default function Customization() {
  const { currentRole } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const [selectedColorPalette, setSelectedColorPalette] = useState<string>("");
  const [palettes, setPalettes] = useState<PaletteType[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Filter visibility settings
  const [filterSettings, setFilterSettings] = useState({
    categoryFilter: true,
    priceFilter: true,
    sortingFilter: true,
    searchFilter: true,
    statusFilter: false, // Disabled as per requirements
  });

  // Load palettes from API on mount
  useEffect(() => {
    loadPalettes();
    loadSavedPalette();
  }, []);

  const loadPalettes = async () => {
    try {
      setLoading(true);
      const data = await customService.getColorsPalette();
      setPalettes(data);
      
      // Set selected palette if available
      if (data.length > 0 && !selectedColorPalette) {
        setSelectedColorPalette(data[0].id);
      }
    } catch (error) {
      console.error('Error loading palettes:', error);
      toast({
        title: "Error",
        description: "Failed to load color palettes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadSavedPalette = () => {
    const saved = customService.loadSavedPalette();
    if (saved) {
      customService.applyColorPalette(saved);
      setSelectedColorPalette(saved.id);
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCompanyLogo(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFilterToggle = (filterKey: keyof typeof filterSettings) => {
    setFilterSettings(prev => ({
      ...prev,
      [filterKey]: !prev[filterKey]
    }));
  };

  const handleSaveChanges = async () => {
    try {
      setLoading(true);

      // Save logo if changed
      if (companyLogo) {
        await customService.updateLogo({ logoUrl: companyLogo });
      }

      // Save catalog filters
      await customService.updateCatalogFilters({
        catalogFilterRulesJson: filterSettings
      });

      toast({
        title: "Settings Saved",
        description: "Your customization settings have been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePaletteUpdate = (paletteId: string) => {
    try {
      setSelectedColorPalette(paletteId);
      
      // Find the selected palette
      const palette = palettes.find(p => p.id === paletteId);
      
      if (palette) {
        // Apply colors immediately to the site (synchronous for instant visual feedback)
        customService.applyColorPalette(palette);
        
        toast({
          title: "Palette Applied",
          description: `${palette.paletteName} colors have been applied to the site.`,
        });
      }
    } catch (error) {
      console.error('Error updating palette:', error);
      toast({
        title: "Error",
        description: "Failed to apply color palette.",
        variant: "destructive",
      });
    }
  };

  const handleResetToDefaults = async () => {
    try {
      setLoading(true);
      setCompanyLogo(null);
      setSelectedColorPalette("");
      setFilterSettings({
        categoryFilter: true,
        priceFilter: true,
        sortingFilter: true,
        searchFilter: true,
        statusFilter: false,
      });
      
      // Clear saved palette and reset colors
      customService.clearSavedPalette();
      
      // Reset on backend
      await customService.updateCatalogFilters({
        catalogFilterRulesJson: {
          categoryFilter: true,
          priceFilter: true,
          sortingFilter: true,
          searchFilter: true,
          statusFilter: false,
        }
      });
      
      toast({
        title: "Settings Reset",
        description: "All settings have been reset to default values.",
      });
    } catch (error) {
      console.error('Error resetting settings:', error);
      toast({
        title: "Error",
        description: "Failed to reset settings.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (currentRole !== 'admin') {
    return (
      <div className="p-6">
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-foreground mb-4">Access Restricted</h2>
          <p className="text-foreground-muted">Customization settings are only available for administrators.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('customization')}</h1>
          <p className="text-foreground-muted">Customize the platform appearance and functionality</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleResetToDefaults} disabled={loading}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset to Defaults
          </Button>
          <Button onClick={handleSaveChanges} className="bg-gradient-primary text-white border-none hover:opacity-90" disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Live Preview Banner */}
      {selectedColorPalette && (
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary shadow-lg flex items-center justify-center">
                  <Palette className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Live Preview Active</h3>
                  <p className="text-sm text-foreground-muted">
                    Colors are being applied in real-time. Click "Save Changes" to persist.
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full shadow-md transition-all duration-300" 
                     style={{ backgroundColor: 'var(--color-primary)' }} 
                     title="Primary Color" />
                <div className="w-8 h-8 rounded-full shadow-md transition-all duration-300" 
                     style={{ backgroundColor: 'var(--color-secondary)' }} 
                     title="Secondary Color" />
                <div className="w-8 h-8 rounded-full shadow-md transition-all duration-300" 
                     style={{ backgroundColor: 'var(--color-tertiary)' }} 
                     title="Tertiary Color" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company Branding */}
        <Card className="bg-surface border-border-subtle">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Company Branding
            </CardTitle>
            <CardDescription className="text-foreground-muted">
              Upload your company logo to replace the default AssetHub branding
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="logo-upload">Company Logo</Label>
              <div className="mt-2 flex items-center gap-4">
                <div className="w-32 h-16 border-2 border-dashed border-border-subtle rounded-lg flex items-center justify-center bg-surface-elevated">
                  {companyLogo ? (
                    <img 
                      src={companyLogo} 
                      alt="Company Logo" 
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <div className="text-center">
                      <Upload className="w-6 h-6 mx-auto text-foreground-muted mb-1" />
                      <span className="text-xs text-foreground-muted">Upload Logo</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <Input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="bg-white"
                  />
                  <p className="text-xs text-foreground-muted mt-1">
                    Recommended: PNG or SVG format, max 2MB
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-surface-elevated rounded-lg border border-border-subtle">
              <h4 className="font-medium text-foreground mb-2">Preview</h4>
              <div className="flex items-center gap-2 p-2 bg-background rounded border">
                {companyLogo ? (
                  <img src={companyLogo} alt="Company Logo" className="h-8 object-contain" />
                ) : (
                  <span className="text-2xl font-bold text-primary">AssetHub</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filter Settings */}
        <Card className="bg-surface border-border-subtle">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Catalog Filters
            </CardTitle>
            <CardDescription className="text-foreground-muted">
              Configure which filters are available in the asset catalogs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="search-filter">Search Filter</Label>
                  <p className="text-sm text-foreground-muted">Allow users to search assets by name and description</p>
                </div>
                <Switch
                  id="search-filter"
                  checked={filterSettings.searchFilter}
                  onCheckedChange={() => handleFilterToggle('searchFilter')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="category-filter">Category Filter</Label>
                  <p className="text-sm text-foreground-muted">Filter assets by category (Electronics, Furniture, etc.)</p>
                </div>
                <Switch
                  id="category-filter"
                  checked={filterSettings.categoryFilter}
                  onCheckedChange={() => handleFilterToggle('categoryFilter')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sorting-filter">Sorting Options</Label>
                  <p className="text-sm text-foreground-muted">Allow sorting by price (high to low, low to high)</p>
                </div>
                <Switch
                  id="sorting-filter"
                  checked={filterSettings.sortingFilter}
                  onCheckedChange={() => handleFilterToggle('sortingFilter')}
                />
              </div>
              
              <div className="flex items-center justify-between opacity-50">
                <div>
                  <Label htmlFor="status-filter">Status Filter</Label>
                  <p className="text-sm text-foreground-muted">Filter by asset status (disabled as per requirements)</p>
                </div>
                <Switch
                  id="status-filter"
                  checked={false}
                  disabled={true}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Color Palette */}
      <Card className="bg-surface border-border-subtle">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Color Palette
          </CardTitle>
          <CardDescription className="text-foreground-muted">
            Choose a color scheme for the platform interface. Colors will be applied instantly!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Color Preview Section */}
          {selectedColorPalette && (
            <div className="p-6 rounded-lg border-2 border-primary/20 bg-gradient-to-br from-background to-primary/5">
              <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                Live Preview
              </h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="h-24 rounded-lg bg-primary shadow-lg flex items-center justify-center transition-all duration-300">
                    <span className="text-primary-foreground font-semibold">Primary</span>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-mono text-foreground-muted">
                      {palettes.find(p => p.id === selectedColorPalette)?.primaryColor}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-24 rounded-lg shadow-lg flex items-center justify-center transition-all duration-300"
                       style={{ backgroundColor: 'var(--color-secondary)', color: 'white' }}>
                    <span className="font-semibold">Secondary</span>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-mono text-foreground-muted">
                      {palettes.find(p => p.id === selectedColorPalette)?.secondaryColor}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-24 rounded-lg shadow-lg flex items-center justify-center transition-all duration-300"
                       style={{ backgroundColor: 'var(--color-tertiary)', color: 'white' }}>
                    <span className="font-semibold">Tertiary</span>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-mono text-foreground-muted">
                      {palettes.find(p => p.id === selectedColorPalette)?.tertiaryColor}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Example UI Elements */}
              <div className="mt-6 space-y-3">
                <div className="flex gap-3 flex-wrap">
                  <Button className="bg-primary hover:bg-primary/90">Primary Button</Button>
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">Outline Button</Button>
                  <Badge className="bg-primary text-primary-foreground">Badge</Badge>
                </div>
              </div>
            </div>
          )}

          {loading && palettes.length === 0 ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-foreground-muted">Loading palettes...</p>
            </div>
          ) : palettes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-foreground-muted">No color palettes available</p>
            </div>
          ) : (
            <div>
              <h4 className="font-semibold text-foreground mb-4">Available Palettes</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {palettes.map((palette) => {
                // Create gradient from colors
                const gradient = palette.primaryColor && palette.secondaryColor
                  ? `linear-gradient(135deg, ${palette.primaryColor}, ${palette.secondaryColor})`
                  : palette.primaryColor
                  ? palette.primaryColor
                  : '#ccc';

                return (
                  <div
                    key={palette.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedColorPalette === palette.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border-subtle hover:border-primary/50'
                    }`}
                    onClick={() => handlePaletteUpdate(palette.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-16 h-16 rounded-lg shadow-sm"
                        style={{ background: gradient }}
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{palette.paletteName}</h3>
                        <div className="flex gap-2 mt-2">
                          {palette.primaryColor && (
                            <div
                              className="w-4 h-4 rounded-full border border-white shadow-sm"
                              style={{ backgroundColor: palette.primaryColor }}
                              title="Primary"
                            />
                          )}
                          {palette.secondaryColor && (
                            <div
                              className="w-4 h-4 rounded-full border border-white shadow-sm"
                              style={{ backgroundColor: palette.secondaryColor }}
                              title="Secondary"
                            />
                          )}
                          {palette.tertiaryColor && (
                            <div
                              className="w-4 h-4 rounded-full border border-white shadow-sm"
                              style={{ backgroundColor: palette.tertiaryColor }}
                              title="Tertiary"
                            />
                          )}
                        </div>
                      </div>
                      {selectedColorPalette === palette.id && (
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}