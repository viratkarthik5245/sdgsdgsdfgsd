import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Navigation } from "@/components/Navigation";
import { Home } from "@/pages/Home";
import { Registration } from "@/pages/Registration";
import { Toaster } from "@/components/ui/toaster";
import { Loader2 } from "lucide-react";

// Lazy load admin pages
const AdminSubmissions = lazy(() => import("@/pages/AdminSubmissions"));
const AdminSettingsPage = lazy(() => import("@/pages/AdminSettings"));

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
      <div className="relative min-h-screen noise-texture">
        <Navigation />
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/admin/submissions" element={<AdminSubmissions />} />
            <Route path="/admin/settings" element={<AdminSettingsPage />} />
          </Routes>
        </Suspense>
        <Toaster />
      </div>
    </AuthProvider>
  );
}

export default App;
