import { useState } from "react";
import { Search, Plus, Edit, Trash2, Upload } from "lucide-react";
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
  quantity: number;
  specifications: Record<string, string>;
}

export default function AssetManagement() {
  const { currentRole } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAddAssetOpen, setIsAddAssetOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

  // Mock assets data - includes out of stock items for admin
  const [assets, setAssets] = useState<Asset[]>([
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
      id: "4",
      name: "Standing Desk Converter",
      category: "Furniture",
      price: 299,
      image: "https://images.unsplash.com/photo-1595515106969-1ce29566662e?w=400&h=300&fit=crop",
      description: "Adjustable height desk converter for sit-stand working",
      quantity: 0, // Out of stock
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

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || asset.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleDeleteAsset = (assetId: string) => {
    setAssets(prev => prev.filter(asset => asset.id !== assetId));
    toast({
      title: "Asset Deleted",
      description: "Asset has been removed from the inventory.",
    });
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { text: "Out of Stock", color: "bg-destructive text-destructive-foreground" };
    if (quantity <= 5) return { text: "Low Stock", color: "bg-warning text-warning-foreground" };
    return { text: "In Stock", color: "bg-success text-success-foreground" };
  };

  if (currentRole !== 'admin') {
    return (
      <div className="p-6">
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-foreground mb-4">Access Restricted</h2>
          <p className="text-foreground-muted">Asset Management is only available for administrators.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Asset Management</h1>
          <p className="text-foreground-muted">Manage your organization's asset inventory</p>
        </div>
        <Dialog open={isAddAssetOpen} onOpenChange={setIsAddAssetOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary text-white border-none hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              Add Asset
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-surface border-border-subtle">
            <DialogHeader>
              <DialogTitle className="text-foreground">Add New Asset</DialogTitle>
              <DialogDescription className="text-foreground-muted">
                Create a new asset entry for the inventory
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="assetName">Asset Name *</Label>
                  <Input id="assetName" placeholder="Enter asset name" />
                </div>
                <div>
                  <Label htmlFor="price">Price *</Label>
                  <Input id="price" type="number" placeholder="0.00" />
                </div>
              </div>
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Furniture">Furniture</SelectItem>
                    <SelectItem value="Vehicles">Vehicles</SelectItem>
                    <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea id="description" placeholder="Enter description" />
              </div>
              <div>
                <Label htmlFor="quantity">Quantity *</Label>
                <Input id="quantity" type="number" placeholder="0" />
              </div>
              <div>
                <Label htmlFor="image">Image Upload</Label>
                <div className="flex items-center gap-2">
                  <Input id="image" type="file" accept="image/*" />
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-1" />
                    Upload
                  </Button>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setIsAddAssetOpen(false)} className="flex-1">
                  Save Asset
                </Button>
                <Button variant="outline" onClick={() => setIsAddAssetOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-lg border border-border-subtle shadow-sm">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground-muted" />
            <Input
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48 bg-white">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAssets.map((asset) => {
          const stockStatus = getStockStatus(asset.quantity);
          return (
            <Card key={asset.id} className="bg-surface border-border-subtle hover:shadow-card transition-all group">
              <div className="relative overflow-hidden rounded-t-lg">
                <img 
                  src={asset.image} 
                  alt={asset.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2">
                  <Badge className={stockStatus.color}>
                    {stockStatus.text}
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
                    Qty: {asset.quantity}
                  </Badge>
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
                        <Button variant="outline" size="sm" onClick={() => setEditingAsset(asset)}>
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl bg-surface border-border-subtle">
                        <DialogHeader>
                          <DialogTitle className="text-foreground">Edit Asset</DialogTitle>
                          <DialogDescription className="text-foreground-muted">
                            Update asset information
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="editName">Asset Name</Label>
                              <Input id="editName" defaultValue={asset.name} />
                            </div>
                            <div>
                              <Label htmlFor="editPrice">Price</Label>
                              <Input id="editPrice" type="number" defaultValue={asset.price} />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="editDescription">Description</Label>
                            <Textarea id="editDescription" defaultValue={asset.description} />
                          </div>
                          <div>
                            <Label htmlFor="editQuantity">Quantity</Label>
                            <Input id="editQuantity" type="number" defaultValue={asset.quantity} />
                          </div>
                          <div className="flex gap-2">
                            <Button className="flex-1">Save Changes</Button>
                            <Button variant="outline">Cancel</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDeleteAsset(asset.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
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