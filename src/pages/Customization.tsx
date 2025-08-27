import { useState } from "react";
import { Upload, Palette, Filter, Save, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useAuth, useTranslation } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function Customization() {
  const { currentRole } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const [selectedColorPalette, setSelectedColorPalette] = useState("purple");
  
  // Filter visibility settings
  const [filterSettings, setFilterSettings] = useState({
    categoryFilter: true,
    priceFilter: true,
    sortingFilter: true,
    searchFilter: true,
    statusFilter: false, // Disabled as per requirements
  });

  const colorPalettes = [
    {
      id: "purple",
      name: "Purple (Default)",
      primary: "#8B5CF6",
      secondary: "#A78BFA",
      accent: "#C4B5FD",
      preview: "linear-gradient(135deg, #8B5CF6, #A78BFA)"
    },
    {
      id: "blue",
      name: "Ocean Blue",
      primary: "#3B82F6",
      secondary: "#60A5FA",
      accent: "#93C5FD",
      preview: "linear-gradient(135deg, #3B82F6, #60A5FA)"
    },
    {
      id: "green",
      name: "Forest Green",
      primary: "#10B981",
      secondary: "#34D399",
      accent: "#6EE7B7",
      preview: "linear-gradient(135deg, #10B981, #34D399)"
    },
    {
      id: "orange",
      name: "Sunset Orange",
      primary: "#F59E0B",
      secondary: "#FBBF24",
      accent: "#FDE68A",
      preview: "linear-gradient(135deg, #F59E0B, #FBBF24)"
    },
    {
      id: "red",
      name: "Ruby Red",
      primary: "#EF4444",
      secondary: "#F87171",
      accent: "#FCA5A5",
      preview: "linear-gradient(135deg, #EF4444, #F87171)"
    },
    {
      id: "pink",
      name: "Rose Pink",
      primary: "#EC4899",
      secondary: "#F472B6",
      accent: "#F9A8D4",
      preview: "linear-gradient(135deg, #EC4899, #F472B6)"
    }
  ];

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

  const handleSaveChanges = () => {
    // In a real app, this would save to backend
    toast({
      title: "Settings Saved",
      description: "Your customization settings have been saved successfully.",
    });
  };

  const handleResetToDefaults = () => {
    setCompanyLogo(null);
    setSelectedColorPalette("purple");
    setFilterSettings({
      categoryFilter: true,
      priceFilter: true,
      sortingFilter: true,
      searchFilter: true,
      statusFilter: false,
    });
    
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to default values.",
    });
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
          <Button variant="outline" onClick={handleResetToDefaults}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset to Defaults
          </Button>
          <Button onClick={handleSaveChanges} className="bg-gradient-primary text-white border-none hover:opacity-90">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

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
            Choose a color scheme for the platform interface
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {colorPalettes.map((palette) => (
              <div
                key={palette.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedColorPalette === palette.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border-subtle hover:border-primary/50'
                }`}
                onClick={() => setSelectedColorPalette(palette.id)}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-16 h-16 rounded-lg shadow-sm"
                    style={{ background: palette.preview }}
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{palette.name}</h3>
                    <div className="flex gap-2 mt-2">
                      <div
                        className="w-4 h-4 rounded-full border border-white shadow-sm"
                        style={{ backgroundColor: palette.primary }}
                        title="Primary"
                      />
                      <div
                        className="w-4 h-4 rounded-full border border-white shadow-sm"
                        style={{ backgroundColor: palette.secondary }}
                        title="Secondary"
                      />
                      <div
                        className="w-4 h-4 rounded-full border border-white shadow-sm"
                        style={{ backgroundColor: palette.accent }}
                        title="Accent"
                      />
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
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}