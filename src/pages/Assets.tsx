import { useState } from "react";
import { Search, Filter, ShoppingCart, Eye, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth, useTranslation } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Asset {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  availability: number;
  status: 'available' | 'low_stock' | 'out_of_stock';
  condition: 'new' | 'good' | 'fair' | 'refurbished';
  specifications: Record<string, string>;
}

export default function Assets() {
  const { currentRole } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [cart, setCart] = useState<string[]>([]);
  const [isAddAssetOpen, setIsAddAssetOpen] = useState(false);

  // Mock assets data
  const [assets, setAssets] = useState<Asset[]>([
    {
      id: "1",
      name: "MacBook Pro 16\"",
      category: "Electronics",
      price: 2499,
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
      description: "High-performance laptop for professional work",
      availability: 5,
      status: "available",
      condition: "new",
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
      availability: 12,
      status: "available",
      condition: "new",
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
      availability: 2,
      status: "low_stock",
      condition: "new",
      specifications: {
        "Resolution": "3840 x 2160",
        "Panel Type": "IPS",
        "Connectivity": "USB-C, HDMI, DisplayPort"
      }
    },
    {
      id: "4",
      name: "Standing Desk Converter",
      category: "Furniture",
      price: 299,
      image: "https://images.unsplash.com/photo-1595515106969-1ce29566662e?w=400&h=300&fit=crop",
      description: "Adjustable height desk converter for sit-stand working",
      availability: 0,
      status: "out_of_stock",
      condition: "good",
      specifications: {
        "Height Range": "4.5\" to 20\"",
        "Weight Capacity": "35 lbs",
        "Surface Size": "28\" x 23\""
      }
    },
    {
      id: "5",
      name: "Wireless Noise-Canceling Headphones",
      category: "Electronics",
      price: 299,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
      description: "Premium wireless headphones with active noise cancellation",
      availability: 8,
      status: "available",
      condition: "refurbished",
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
      availability: 3,
      status: "available", 
      condition: "good",
      specifications: {
        "Dimensions": "10ft x 4ft",
        "Material": "Solid oak",
        "Seating": "8-10 people"
      }
    }
  ]);

  const categories = ["all", "Electronics", "Furniture", "Vehicles", "Office Supplies"];
  const statuses = ["all", "available", "low_stock", "out_of_stock"];

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || asset.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || asset.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const addToCart = (assetId: string) => {
    if (!cart.includes(assetId)) {
      setCart([...cart, assetId]);
      toast({
        title: "Added to Cart",
        description: "Asset has been added to your cart.",
      });
    }
  };

  const removeFromCart = (assetId: string) => {
    setCart(cart.filter(id => id !== assetId));
    toast({
      title: "Removed from Cart",
      description: "Asset has been removed from your cart.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-success text-success-foreground';
      case 'low_stock': return 'bg-warning text-warning-foreground';
      case 'out_of_stock': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new': return 'bg-success text-success-foreground';
      case 'good': return 'bg-info text-info-foreground';
      case 'fair': return 'bg-warning text-warning-foreground';
      case 'refurbished': return 'bg-purple-500 text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {currentRole === 'admin' ? 'Assets Management' : 'Asset Catalog'}
          </h1>
          <p className="text-foreground-muted">
            {currentRole === 'admin' 
              ? 'Manage your organization\'s asset inventory' 
              : 'Browse and purchase available assets'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {cart.length > 0 && (
            <Badge className="bg-primary text-primary-foreground">
              {cart.length} in cart
            </Badge>
          )}
          {currentRole === 'admin' && (
            <Dialog open={isAddAssetOpen} onOpenChange={setIsAddAssetOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-primary text-white border-none hover:opacity-90">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Asset
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-surface border-border-subtle">
                <DialogHeader>
                  <DialogTitle className="text-foreground">Add New Asset</DialogTitle>
                  <DialogDescription className="text-foreground-muted">
                    Create a new asset entry for the catalog
                  </DialogDescription>
                </DialogHeader>
                {/* Add Asset Form would go here */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="assetName">Asset Name</Label>
                    <Input id="assetName" placeholder="Enter asset name" />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="furniture">Furniture</SelectItem>
                        <SelectItem value="vehicles">Vehicles</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Enter description" />
                  </div>
                  <Button onClick={() => setIsAddAssetOpen(false)}>Save Asset</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-surface rounded-lg border border-border-subtle">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground-muted" />
            <Input
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-surface-elevated border-border-subtle"
            />
          </div>
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map(status => (
              <SelectItem key={status} value={status}>
                {status === 'all' ? 'All Status' : status.replace('_', ' ')}
              </SelectItem>
            ))}
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
              <div className="absolute top-2 right-2 flex gap-1">
                <Badge className={getStatusColor(asset.status)}>
                  {asset.status.replace('_', ' ')}
                </Badge>
              </div>
              <div className="absolute top-2 left-2">
                <Badge className={getConditionColor(asset.condition)}>
                  {asset.condition}
                </Badge>
              </div>
            </div>
            
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-foreground">{asset.name}</CardTitle>
              <CardDescription className="text-foreground-muted">
                {asset.description}
              </CardDescription>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-primary">${asset.price}</span>
                <Badge variant="outline" className="text-foreground-muted">
                  {asset.availability} available
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="pt-2">
              <div className="space-y-3">
                <div className="text-sm text-foreground-muted">
                  <p><strong>Category:</strong> {asset.category}</p>
                </div>
                
                {currentRole === 'admin' ? (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          View
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
                              <Badge className={getStatusColor(asset.status)}>
                                {asset.availability} available
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    {asset.status === 'available' && (
                      <Button 
                        size="sm" 
                        onClick={() => addToCart(asset.id)}
                        disabled={cart.includes(asset.id)}
                        className="flex-1 bg-gradient-primary text-white border-none hover:opacity-90"
                      >
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        {cart.includes(asset.id) ? 'In Cart' : 'Add to Cart'}
                      </Button>
                    )}
                  </div>
                )}
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