import { useState, useEffect } from "react";
import { Search, Eye, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth, useTranslation } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { assetService, Asset } from "@/lib/services/assetService";

export default function AssetCatalog() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>(['all']);

  useEffect(() => {
    loadAssets();
  }, [selectedCategory, searchTerm]);

  const loadAssets = async () => {
    try {
      setLoading(true);
      const query: any = {
        isAvailable: true,
        limit: 100,
      };

      if (selectedCategory !== 'all') {
        query.categoryId = selectedCategory;
      }

      if (searchTerm) {
        query.searchTerm = searchTerm;
      }

      const data = await assetService.getAll(query);
      setAssets(data);

      // Extract unique categories
      const uniqueCategories = ['all', ...new Set(data.map(a => a.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error loading assets:', error);
      toast({
        title: "Error",
        description: "Failed to load assets. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredAssets = assets
    .filter(asset => {
      const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           asset.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || asset.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-high":
          return b.price - a.price;
        case "price-low":
          return a.price - b.price;
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const handlePurchase = (assetId: string) => {
    navigate(`/purchase/${assetId}`);
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground-muted">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('assetCatalog')}</h1>
          <p className="text-foreground-muted">Browse and purchase available assets</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-lg border border-border-subtle shadow-sm">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground-muted" />
            <Input
              placeholder={t('search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48 bg-white">
            <SelectValue placeholder={t('category')} />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-48 bg-white">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="name">Name A-Z</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAssets.map((asset) => (
          <Card key={asset.id} className="bg-surface border-border-subtle hover:shadow-card transition-all group">
            <div className="relative overflow-hidden rounded-t-lg">
              <img 
                src={asset.image} 
                alt={asset.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-foreground">{asset.name}</CardTitle>
              <CardDescription className="text-foreground-muted">
                {asset.description}
              </CardDescription>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-primary">${asset.price}</span>
              </div>
            </CardHeader>
            
            <CardContent className="pt-2">
              <div className="space-y-3">
                <div className="text-sm text-foreground-muted">
                  <p><strong>Category:</strong> {asset.category}</p>
                </div>
                
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        {t('view')}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl bg-surface border-border-subtle">
                      <DialogHeader>
                        <DialogTitle className="text-foreground">{asset.name}</DialogTitle>
                        <DialogDescription className="text-foreground-muted">
                          Asset details and specifications
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <img 
                            src={asset.image} 
                            alt={asset.name}
                            className="w-full h-64 object-cover rounded-lg"
                          />
                        </div>
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-semibold text-foreground mb-2">Specifications</h3>
                            <div className="space-y-2">
                              {Object.entries(asset.specifications).map(([key, value]) => (
                                <div key={key} className="flex justify-between text-sm">
                                  <span className="text-foreground-muted">{key}:</span>
                                  <span className="text-foreground">{value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-4 border-t border-border-subtle">
                            <span className="text-2xl font-bold text-primary">${asset.price}</span>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button 
                    size="sm" 
                    onClick={() => handlePurchase(asset.id)}
                    className="flex-1 bg-gradient-primary text-white border-none hover:opacity-90"
                  >
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    {t('purchase')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No results */}
      {filteredAssets.length === 0 && (
        <div className="text-center py-20">
          <h3 className="text-xl font-semibold text-foreground mb-2">No assets found</h3>
          <p className="text-foreground-muted">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
}