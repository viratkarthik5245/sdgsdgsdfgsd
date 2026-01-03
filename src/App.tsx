import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { ProductProvider } from "@/contexts/ProductContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { Navigation } from "@/components/Navigation";
import { UserPortal } from "@/pages/UserPortal";
import { AdminDashboard } from "@/pages/AdminDashboard";
import { ProductDetail } from "@/pages/ProductDetail";
import { Toaster } from "@/components/ui/toaster";
import { Loader2 } from "lucide-react";

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-[#00d9b8] animate-spin mx-auto mb-4" />
        <p className="text-[#b8c5d6]">Loading...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <div className="relative min-h-screen noise-texture">
          <Navigation />
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<UserPortal />} />
              <Route path="/admin" element={<AdminDashboard />} />
              {/* Legacy route for backward compatibility */}
              <Route path="/product/:id" element={<ProductDetail />} />
              {/* New SEO-friendly route: /productname/id */}
              <Route path="/:slug/:id" element={<ProductDetail />} />
            </Routes>
          </Suspense>
          <Toaster />
        </div>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;
