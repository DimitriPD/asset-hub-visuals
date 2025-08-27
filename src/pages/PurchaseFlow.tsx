import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Banknote, Smartphone, DollarSign, FileText, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth, useTranslation } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Asset {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

export default function PurchaseFlow() {
  const { assetId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [contractAccepted, setContractAccepted] = useState(false);
  const [asset, setAsset] = useState<Asset | null>(null);

  // Mock asset data
  const mockAssets: Asset[] = [
    {
      id: "1",
      name: "MacBook Pro 16\"",
      price: 2499,
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
      description: "High-performance laptop for professional work"
    },
    {
      id: "2", 
      name: "Ergonomic Office Chair",
      price: 399,
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      description: "Comfortable ergonomic chair with lumbar support"
    },
    {
      id: "3",
      name: "Dell UltraSharp Monitor 27\"",
      price: 549,
      image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop",
      description: "4K USB-C monitor with excellent color accuracy"
    }
  ];

  useEffect(() => {
    const foundAsset = mockAssets.find(a => a.id === assetId);
    if (foundAsset) {
      setAsset(foundAsset);
    } else {
      navigate('/assets');
    }
  }, [assetId, navigate]);

  const paymentMethods = [
    {
      id: "payroll",
      name: t('payrollDeduction'),
      icon: DollarSign,
      description: "Deduct from monthly payroll"
    },
    {
      id: "credit",
      name: t('creditCard'),
      icon: CreditCard,
      description: "Pay with credit card"
    },
    {
      id: "debit",
      name: t('debitCard'),
      icon: Banknote,
      description: "Pay with debit card"
    },
    {
      id: "pix",
      name: t('pix'),
      icon: Smartphone,
      description: "Instant payment via PIX"
    }
  ];

  const handleNextStep = () => {
    if (step === 1 && !paymentMethod) {
      toast({
        title: "Payment Method Required",
        description: "Please select a payment method to continue.",
        variant: "destructive"
      });
      return;
    }
    
    if (step === 2 && !contractAccepted) {
      toast({
        title: "Contract Acceptance Required",
        description: "Please accept the contract terms to continue.",
        variant: "destructive"
      });
      return;
    }
    
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleCompletePurchase = () => {
    // Simulate purchase completion
    toast({
      title: "Purchase Completed",
      description: `Successfully purchased ${asset?.name}!`,
    });
    
    // Redirect to assets catalog after a short delay
    setTimeout(() => {
      navigate('/assets');
    }, 2000);
  };

  if (!asset) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate('/assets')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Catalog
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Purchase Flow</h1>
          <p className="text-foreground-muted">Complete your purchase</p>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        <div className={`flex items-center ${step >= 1 ? 'text-primary' : 'text-foreground-muted'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'border-primary bg-primary text-white' : 'border-foreground-muted'}`}>
            1
          </div>
          <span className="ml-2">Payment</span>
        </div>
        <div className={`w-16 h-0.5 ${step >= 2 ? 'bg-primary' : 'bg-foreground-muted'}`} />
        <div className={`flex items-center ${step >= 2 ? 'text-primary' : 'text-foreground-muted'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'border-primary bg-primary text-white' : 'border-foreground-muted'}`}>
            2
          </div>
          <span className="ml-2">Contract</span>
        </div>
        <div className={`w-16 h-0.5 ${step >= 3 ? 'bg-primary' : 'bg-foreground-muted'}`} />
        <div className={`flex items-center ${step >= 3 ? 'text-primary' : 'text-foreground-muted'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 3 ? 'border-primary bg-primary text-white' : 'border-foreground-muted'}`}>
            3
          </div>
          <span className="ml-2">Confirmation</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Asset Summary */}
        <Card className="lg:col-span-1 bg-surface border-border-subtle">
          <CardHeader>
            <CardTitle className="text-foreground">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <img 
                src={asset.image} 
                alt={asset.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-medium text-foreground">{asset.name}</h3>
                <p className="text-sm text-foreground-muted">{asset.description}</p>
              </div>
            </div>
            <div className="border-t border-border-subtle pt-4">
              <div className="flex justify-between items-center">
                <span className="text-foreground-muted">Subtotal:</span>
                <span className="font-medium text-foreground">${asset.price}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-foreground-muted">Tax:</span>
                <span className="font-medium text-foreground">$0.00</span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold text-primary border-t border-border-subtle pt-2 mt-2">
                <span>Total:</span>
                <span>${asset.price}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card className="lg:col-span-2 bg-surface border-border-subtle">
          <CardContent className="p-6">
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Select Payment Method</h2>
                  <p className="text-foreground-muted">Choose how you'd like to pay for this asset</p>
                </div>
                
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="space-y-4">
                    {paymentMethods.map((method) => (
                      <div key={method.id} className="flex items-center space-x-3 p-4 border border-border-subtle rounded-lg hover:bg-surface-elevated cursor-pointer">
                        <RadioGroupItem value={method.id} id={method.id} />
                        <method.icon className="w-6 h-6 text-primary" />
                        <div className="flex-1">
                          <Label htmlFor={method.id} className="font-medium text-foreground cursor-pointer">
                            {method.name}
                          </Label>
                          <p className="text-sm text-foreground-muted">{method.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Contract Agreement</h2>
                  <p className="text-foreground-muted">Please review and accept the purchase contract</p>
                </div>
                
                <Card className="bg-surface-elevated border-border-subtle">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Asset Purchase Agreement
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="prose prose-sm max-w-none text-foreground-muted">
                      <h4 className="text-foreground">Terms and Conditions</h4>
                      <ul className="space-y-2">
                        <li>The purchaser agrees to use the asset responsibly and in accordance with company policies.</li>
                        <li>The asset remains company property and must be returned upon employment termination.</li>
                        <li>Any damage or loss of the asset may result in replacement costs being charged to the employee.</li>
                        <li>The asset should not be used for personal purposes outside of work-related activities.</li>
                        <li>Regular maintenance and care of the asset is the responsibility of the purchaser.</li>
                        <li>This agreement is binding and supersedes any previous agreements regarding this asset.</li>
                      </ul>
                      <p className="mt-4">
                        By accepting this contract, you acknowledge that you have read and understood all terms and conditions.
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2 pt-4 border-t border-border-subtle">
                      <Checkbox 
                        id="contract-accept" 
                        checked={contractAccepted}
                        onCheckedChange={(checked) => setContractAccepted(checked === true)}
                      />
                      <Label htmlFor="contract-accept" className="text-foreground cursor-pointer">
                        I accept the terms and conditions of this purchase agreement
                      </Label>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 text-center">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center">
                    <Check className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Purchase Completed!</h2>
                  <p className="text-foreground-muted">Your order has been successfully processed</p>
                </div>
                
                <Card className="bg-surface-elevated border-border-subtle text-left">
                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-foreground-muted">Order ID:</span>
                        <span className="ml-2 font-medium text-foreground">#ORD-{Date.now().toString().slice(-6)}</span>
                      </div>
                      <div>
                        <span className="text-foreground-muted">Payment Method:</span>
                        <span className="ml-2 font-medium text-foreground">
                          {paymentMethods.find(m => m.id === paymentMethod)?.name}
                        </span>
                      </div>
                      <div>
                        <span className="text-foreground-muted">Asset:</span>
                        <span className="ml-2 font-medium text-foreground">{asset.name}</span>
                      </div>
                      <div>
                        <span className="text-foreground-muted">Total Paid:</span>
                        <span className="ml-2 font-medium text-primary">${asset.price}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <p className="text-sm text-foreground-muted">
                  You will be redirected to the asset catalog shortly...
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between pt-6 border-t border-border-subtle">
              <Button 
                variant="outline" 
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1}
              >
                Previous
              </Button>
              
              {step < 3 ? (
                <Button 
                  onClick={handleNextStep}
                  className="bg-gradient-primary text-white border-none hover:opacity-90"
                >
                  {step === 2 ? 'Complete Purchase' : 'Next'}
                </Button>
              ) : (
                <Button 
                  onClick={handleCompletePurchase}
                  className="bg-gradient-primary text-white border-none hover:opacity-90"
                >
                  Back to Catalog
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}