import { useState, useMemo } from 'react';
import { useProducts } from '@/contexts/ProductContext';
import { ProductCard } from '@/components/ProductCard';
import { EmptyState } from '@/components/EmptyState';
import { Input } from '@/components/ui/input';
import { Search, Package } from 'lucide-react';
import { motion } from 'framer-motion';

export const UserPortal = () => {
  const { products, loading, error } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;

    const query = searchQuery.toLowerCase();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  return (
    <div className="min-h-screen pt-16 sm:pt-20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 sm:top-40 left-4 sm:left-20 w-48 sm:w-96 h-48 sm:h-96 bg-[#00d9b8]/10 rounded-full blur-[60px] sm:blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 sm:bottom-40 right-4 sm:right-20 w-48 sm:w-96 h-48 sm:h-96 bg-[#1affce]/10 rounded-full blur-[60px] sm:blur-[120px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-16 py-6 sm:py-12 relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-[#00d9b8]/10 border border-[#00d9b8]/30 mb-4 sm:mb-6">
            <div className="w-2 h-2 rounded-full bg-[#00d9b8] animate-pulse" />
            <span className="text-[#00d9b8] text-xs sm:text-sm font-medium">Discover Products</span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-extrabold text-white mb-4 sm:mb-6 text-glow leading-tight">
            Explore Our
            <br />
            <span className="text-[#00d9b8]">Product Catalog</span>
          </h1>
          
          <p className="text-[#b8c5d6] text-sm sm:text-base lg:text-lg max-w-2xl mx-auto mb-4 sm:mb-6 px-4">
            Browse through our curated collection of products. Search, discover, and learn more about each offering.
          </p>
          
          {/* Product Count */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1affce]/10 border border-[#1affce]/30 mb-6 sm:mb-8">
            <div className="w-2 h-2 rounded-full bg-[#1affce]" />
            <span className="text-[#1affce] text-xs font-medium">
              {products.length} Products Available
            </span>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl mx-auto mb-8 sm:mb-16 px-4"
        >
          <div className="relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-[#6b7a8f]" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 sm:pl-12 pr-3 sm:pr-4 h-12 sm:h-14 bg-[#0a1628]/50 border-[#00d9b8]/20 text-white placeholder:text-[#6b7a8f] focus:border-[#00d9b8] focus:ring-[#00d9b8]/30 focus:glow-teal rounded-xl text-sm sm:text-lg"
            />
          </div>
          {searchQuery && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[#b8c5d6] text-xs sm:text-sm mt-3 text-center"
            >
              Found {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
            </motion.p>
          )}
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6 max-w-2xl mx-auto"
          >
            <p className="text-red-400 text-sm text-center">{error}</p>
            {error.includes('Database table not found') && (
              <p className="text-red-300 text-xs text-center mt-2">
                Please contact the administrator to set up the database.
              </p>
            )}
          </motion.div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-[#00d9b8] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-[#b8c5d6] text-sm">Loading products...</p>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <EmptyState
            icon={Package}
            title={searchQuery ? 'No Products Found' : 'No Products Available'}
            description={
              searchQuery
                ? 'Try adjusting your search terms or browse all products.'
                : 'Check back later for new products.'
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-4">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
