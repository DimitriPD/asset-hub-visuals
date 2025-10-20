import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { useColorPalette } from "@/hooks/use-color-palette";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AssetCatalog from "./pages/AssetCatalog";
import AssetManagement from "./pages/AssetManagement";
import PurchaseFlow from "./pages/PurchaseFlow";
import PurchaseHistory from "./pages/PurchaseHistory";
import Employees from "./pages/Employees";
import Customization from "./pages/Customization";
import Reservations from "./pages/Reservations";
import Events from "./pages/Events";
import NotFound from "./pages/NotFound";
import SecurityPolicies from "./pages/SecurityPolicies";
import { AppSidebar } from "@/components/Layout/AppSidebar";
import { Header } from "@/components/Layout/Header";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

// Public Route Component (for login)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  const { currentRole } = useAuth();
  
  if (isAuthenticated) {
    // Redirect based on role: regular users go to assets, admins go to dashboard
    return <Navigate to={currentRole === 'admin' ? "/dashboard" : "/assets"} replace />;
  }
  
  return <>{children}</>;
};

const App = () => {
  // Load saved color palette on app mount
  useColorPalette();
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
            {/* Public Routes */}
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/assets" 
              element={
                <ProtectedRoute>
                  <AssetCatalog />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/assets-management" 
              element={
                <ProtectedRoute>
                  <AssetManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/purchase/:assetId" 
              element={
                <ProtectedRoute>
                  <PurchaseFlow />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/purchase-history" 
              element={
                <ProtectedRoute>
                  <PurchaseHistory />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/employees" 
              element={
                <ProtectedRoute>
                  <Employees />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/customization" 
              element={
                <ProtectedRoute>
                  <Customization />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/events" 
              element={
                <ProtectedRoute>
                  <Events />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/security-policies" 
              element={
                <ProtectedRoute>
                  <SecurityPolicies />
                </ProtectedRoute>
              } 
            />
            
            {/* Redirect root based on role */}
            <Route path="/" element={<Navigate to="/assets" replace />} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
  );
};

export default App;
