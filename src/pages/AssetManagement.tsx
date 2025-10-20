import { useState, useEffect } from "react";
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
import { assetService, Asset, AssetCreate, AssetUpdate } from "@/lib/services/assetService";

export default function AssetManagement() {
  const { currentRole } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAddAssetOpen, setIsAddAssetOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>(['all']);

  // Form states for adding new asset
  const [newAsset, setNewAsset] = useState<Partial<AssetCreate>>({
    name: '',
    description: '',
    basePrice: 0,
    availableQuantity: 0,
    categoryId: '',
    companyId: 'temp-company-id',
  });

  useEffect(() => {
    loadAssets();
  }, [selectedCategory, searchTerm]);

  const loadAssets = async () => {
    try {
      setLoading(true);
      const query: any = {
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

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || asset.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleAddAsset = async () => {
    try {
      if (!newAsset.name || !newAsset.description || !newAsset.categoryId) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }

      await assetService.create(newAsset as AssetCreate);
      toast({
        title: "Success",
        description: "Asset has been added successfully.",
      });
      setIsAddAssetOpen(false);
      setNewAsset({
        name: '',
        description: '',
        basePrice: 0,
        availableQuantity: 0,
        categoryId: '',
        companyId: 'temp-company-id',
      });
      loadAssets();
    } catch (error) {
      console.error('Error adding asset:', error);
      toast({
        title: "Error",
        description: "Failed to add asset. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateAsset = async (assetId: string, updates: AssetUpdate) => {
    try {
      await assetService.update(assetId, updates);
      toast({
        title: "Success",
        description: "Asset has been updated successfully.",
      });
      setEditingAsset(null);
      loadAssets();
    } catch (error) {
      console.error('Error updating asset:', error);
      toast({
        title: "Error",
        description: "Failed to update asset. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAsset = async (assetId: string) => {
    try {
      await assetService.delete(assetId);
      toast({
        title: "Asset Deleted",
        description: "Asset has been removed from the inventory.",
      });
      loadAssets();
    } catch (error) {
      console.error('Error deleting asset:', error);
      toast({
        title: "Error",
        description: "Failed to delete asset. Please try again.",
        variant: "destructive",
      });
    }
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
                  <Input 
                    id="assetName" 
                    placeholder="Enter asset name"
                    value={newAsset.name}
                    onChange={(e) => setNewAsset({...newAsset, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price *</Label>
                  <Input 
                    id="price" 
                    type="number" 
                    placeholder="0.00"
                    value={newAsset.basePrice}
                    onChange={(e) => setNewAsset({...newAsset, basePrice: parseFloat(e.target.value)})}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={newAsset.categoryId} onValueChange={(value) => setNewAsset({...newAsset, categoryId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.filter(c => c !== 'all').map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea 
                  id="description" 
                  placeholder="Enter description"
                  value={newAsset.description}
                  onChange={(e) => setNewAsset({...newAsset, description: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="quantity">Quantity *</Label>
                <Input 
                  id="quantity" 
                  type="number" 
                  placeholder="0"
                  value={newAsset.availableQuantity}
                  onChange={(e) => setNewAsset({...newAsset, availableQuantity: parseInt(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="image">Image URL</Label>
                <Input 
                  id="image" 
                  placeholder="https://..."
                  value={newAsset.photos?.[0] || ''}
                  onChange={(e) => setNewAsset({...newAsset, photos: [e.target.value]})}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddAsset} className="flex-1">
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
                              <Input 
                                id="editName" 
                                defaultValue={asset.name}
                                onChange={(e) => setEditingAsset({...asset, name: e.target.value})}
                              />
                            </div>
                            <div>
                              <Label htmlFor="editPrice">Price</Label>
                              <Input 
                                id="editPrice" 
                                type="number" 
                                defaultValue={asset.price}
                                onChange={(e) => setEditingAsset({...asset, price: parseFloat(e.target.value)})}
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="editDescription">Description</Label>
                            <Textarea 
                              id="editDescription" 
                              defaultValue={asset.description}
                              onChange={(e) => setEditingAsset({...asset, description: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="editQuantity">Quantity</Label>
                            <Input 
                              id="editQuantity" 
                              type="number" 
                              defaultValue={asset.quantity}
                              onChange={(e) => setEditingAsset({...asset, quantity: parseInt(e.target.value)})}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              className="flex-1"
                              onClick={() => editingAsset && handleUpdateAsset(asset.id, {
                                name: editingAsset.name,
                                description: editingAsset.description,
                                basePrice: editingAsset.price,
                                availableQuantity: editingAsset.quantity,
                              })}
                            >
                              Save Changes
                            </Button>
                            <Button variant="outline" onClick={() => setEditingAsset(null)}>Cancel</Button>
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