import { useState } from "react";
import { Search, Filter, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth, useTranslation } from "@/contexts/AuthContext";

interface Purchase {
  id: string;
  assetName: string;
  assetImage: string;
  price: number;
  purchaseDate: Date;
  status: 'finalized' | 'awaiting_payment' | 'refunded' | 'canceled';
  paymentMethod: string;
  orderId: string;
  description: string;
}

export default function PurchaseHistory() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Mock purchase history data
  const [purchases] = useState<Purchase[]>([
    {
      id: "1",
      assetName: "MacBook Pro 16\"",
      assetImage: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
      price: 2499,
      purchaseDate: new Date('2024-01-15'),
      status: 'finalized',
      paymentMethod: 'Payroll Deduction',
      orderId: 'ORD-001234',
      description: "High-performance laptop for professional work"
    },
    {
      id: "2",
      assetName: "Ergonomic Office Chair",
      assetImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      price: 399,
      purchaseDate: new Date('2024-01-10'),
      status: 'awaiting_payment',
      paymentMethod: 'Credit Card',
      orderId: 'ORD-001235',
      description: "Comfortable ergonomic chair with lumbar support"
    },
    {
      id: "3",
      assetName: "Dell UltraSharp Monitor 27\"",
      assetImage: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop",
      price: 549,
      purchaseDate: new Date('2024-01-05'),
      status: 'finalized',
      paymentMethod: 'PIX',
      orderId: 'ORD-001236',
      description: "4K USB-C monitor with excellent color accuracy"
    },
    {
      id: "4",
      assetName: "Wireless Headphones",
      assetImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
      price: 299,
      purchaseDate: new Date('2023-12-20'),
      status: 'refunded',
      paymentMethod: 'Debit Card',
      orderId: 'ORD-001237',
      description: "Premium wireless headphones with active noise cancellation"
    },
    {
      id: "5",
      assetName: "Standing Desk",
      assetImage: "https://images.unsplash.com/photo-1595515106969-1ce29566662e?w=400&h=300&fit=crop",
      price: 799,
      purchaseDate: new Date('2023-12-15'),
      status: 'canceled',
      paymentMethod: 'Payroll Deduction',
      orderId: 'ORD-001238',
      description: "Electric height-adjustable standing desk"
    }
  ]);

  const statuses = ["all", "finalized", "awaiting_payment", "refunded", "canceled"];

  const filteredPurchases = purchases.filter(purchase => {
    const matchesSearch = purchase.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         purchase.orderId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || purchase.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'finalized': return 'bg-success text-success-foreground';
      case 'awaiting_payment': return 'bg-warning text-warning-foreground';
      case 'refunded': return 'bg-info text-info-foreground';
      case 'canceled': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'finalized': return t('completed');
      case 'awaiting_payment': return 'Awaiting Payment';
      case 'refunded': return 'Refunded';
      case 'canceled': return 'Canceled';
      default: return status;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('purchaseHistory')}</h1>
          <p className="text-foreground-muted">View all your asset purchases and their status</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export History
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-lg border border-border-subtle shadow-sm">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground-muted" />
            <Input
              placeholder="Search by asset name or order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>
        </div>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-full sm:w-48 bg-white">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {statuses.map(status => (
              <SelectItem key={status} value={status}>
                {status === 'all' ? 'All Status' : getStatusText(status)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Purchase History */}
      <div className="space-y-4">
        {filteredPurchases.map((purchase) => (
          <Card key={purchase.id} className="bg-surface border-border-subtle hover:shadow-card transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Asset Image & Info */}
                <div className="flex gap-4 flex-1">
                  <img 
                    src={purchase.assetImage} 
                    alt={purchase.assetName}
                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-lg">{purchase.assetName}</h3>
                    <p className="text-sm text-foreground-muted mb-2">{purchase.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-foreground-muted">
                      <div>
                        <span className="font-medium">Order ID:</span> {purchase.orderId}
                      </div>
                      <div>
                        <span className="font-medium">Date:</span> {formatDate(purchase.purchaseDate)}
                      </div>
                      <div>
                        <span className="font-medium">Payment:</span> {purchase.paymentMethod}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price & Status */}
                <div className="flex flex-col justify-between items-end text-right">
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-primary">${purchase.price}</div>
                    <Badge className={getStatusColor(purchase.status)}>
                      {getStatusText(purchase.status)}
                    </Badge>
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="mt-4">
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl bg-surface border-border-subtle">
                      <DialogHeader>
                        <DialogTitle className="text-foreground">Purchase Details</DialogTitle>
                        <DialogDescription className="text-foreground-muted">
                          Order {purchase.orderId}
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <img 
                            src={purchase.assetImage} 
                            alt={purchase.assetName}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        </div>
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-semibold text-foreground mb-2">Asset Information</h3>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-foreground-muted">Asset Name:</span>
                                <span className="text-foreground">{purchase.assetName}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-foreground-muted">Price:</span>
                                <span className="text-foreground font-semibold">${purchase.price}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-foreground-muted">Purchase Date:</span>
                                <span className="text-foreground">{formatDate(purchase.purchaseDate)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-foreground-muted">Payment Method:</span>
                                <span className="text-foreground">{purchase.paymentMethod}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-foreground-muted">Status:</span>
                                <Badge className={getStatusColor(purchase.status)}>
                                  {getStatusText(purchase.status)}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          
                          <div className="pt-4 border-t border-border-subtle">
                            <div className="flex justify-between items-center">
                              <span className="text-lg font-semibold text-foreground">Total Paid:</span>
                              <span className="text-2xl font-bold text-primary">${purchase.price}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No results */}
      {filteredPurchases.length === 0 && (
        <div className="text-center py-20">
          <h3 className="text-xl font-semibold text-foreground mb-2">No purchases found</h3>
          <p className="text-foreground-muted">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
}