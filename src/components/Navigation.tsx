import { Link, useLocation } from 'react-router-dom';
import { Package, User, Shield, FileText, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Navigation = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const isRegister = location.pathname === '/register';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a1628]/80 backdrop-blur-xl border-b border-[#00d9b8]/20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-16">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl overflow-hidden shadow-lg shadow-[#00d9b8]/30 group-hover:shadow-[#00d9b8]/50 transition-all">
              <img 
                src="/primoboost-logo.jpg" 
                alt="PrimoJobs Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-lg sm:text-2xl font-display font-bold text-white">
              Primo<span className="text-[#00d9b8]">Jobs</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Link to="/">
              <Button
                variant={location.pathname === '/' ? "default" : "ghost"}
                size="sm"
                className={`gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 ${
                  location.pathname === '/'
                    ? 'bg-[#00d9b8] hover:bg-[#00c4a6] text-[#0a1628] shadow-lg shadow-[#00d9b8]/30'
                    : 'text-[#b8c5d6] hover:text-white hover:bg-white/5'
                }`}
              >
                <User className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Home</span>
              </Button>
            </Link>
            <Link to="/register">
              <Button
                variant={isRegister ? "default" : "ghost"}
                size="sm"
                className={`gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 ${
                  isRegister
                    ? 'bg-[#00d9b8] hover:bg-[#00c4a6] text-[#0a1628] shadow-lg shadow-[#00d9b8]/30'
                    : 'text-[#b8c5d6] hover:text-white hover:bg-white/5'
                }`}
              >
                <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Register</span>
              </Button>
            </Link>
            <Link to="/admin/submissions">
              <Button
                variant={isAdmin ? "default" : "ghost"}
                size="sm"
                className={`gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 ${
                  isAdmin
                    ? 'bg-[#00d9b8] hover:bg-[#00c4a6] text-[#0a1628] shadow-lg shadow-[#00d9b8]/30'
                    : 'text-[#b8c5d6] hover:text-white hover:bg-white/5'
                }`}
              >
                <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Admin</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
