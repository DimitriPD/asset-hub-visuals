import { useState } from "react";
import { Search, Eye, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth, useTranslation } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Asset {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  quantity: number;
  specifications: Record<string, string>;
}

export default function AssetCatalog() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  // Mock assets data - only in-stock items for regular users
  const [assets] = useState<Asset[]>([
    {
      id: "1",
      name: "MacBook Pro 16\"",
      category: "Electronics",
      price: 2499,
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
      description: "High-performance laptop for professional work",
      quantity: 5,
      specifications: {
        "Processor": "M2 Pro chip",
        "Memory": "32GB RAM",
        "Storage": "1TB SSD"
      }
    },
    {
      id: "2", 
      name: "Ergonomic Office Chair",
      category: "Furniture",
      price: 399,
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      description: "Comfortable ergonomic chair with lumbar support",
      quantity: 12,
      specifications: {
        "Material": "Mesh back, fabric seat",
        "Weight Capacity": "300 lbs",
        "Warranty": "5 years"
      }
    },
    {
      id: "3",
      name: "Dell UltraSharp Monitor 27\"",
      category: "Electronics", 
      price: 549,
      image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop",
      description: "4K USB-C monitor with excellent color accuracy",
      quantity: 2,
      specifications: {
        "Resolution": "3840 x 2160",
        "Panel Type": "IPS",
        "Connectivity": "USB-C, HDMI, DisplayPort"
      }
    },
    {
      id: "5",
      name: "Wireless Noise-Canceling Headphones",
      category: "Electronics",
      price: 299,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
      description: "Premium wireless headphones with active noise cancellation",
      quantity: 8,
      specifications: {
        "Battery Life": "30 hours",
        "Noise Cancellation": "Active ANC",
        "Connectivity": "Bluetooth 5.0"
      }
    },
    {
      id: "6",
      name: "Conference Table",
      category: "Furniture",
      price: 1299,
      image: "https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=400&h=300&fit=crop",
      description: "Large conference table for 8-10 people",
      quantity: 3,
      specifications: {
        "Dimensions": "10ft x 4ft",
        "Material": "Solid oak",
        "Seating": "8-10 people"
      }
    }
  ]);

  const categories = ["all", "Electronics", "Furniture", "Vehicles", "Office Supplies"];

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
    // Navigate to purchase flow
    navigate(`/purchase/${assetId}`);
  };

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