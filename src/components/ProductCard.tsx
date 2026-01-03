import { Product } from '@/types/product';
import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { generateProductPath } from '@/lib/slugify';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const productPath = generateProductPath(product.name, product.id);
  
  return (
    <Link to={productPath}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02, y: -4 }}
        transition={{ duration: 0.2 }}
        className="glass-card rounded-2xl p-6 h-full cursor-pointer group relative overflow-hidden"
      >
        {/* Hover glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#00d9b8]/0 to-[#00d9b8]/0 group-hover:from-[#00d9b8]/10 group-hover:to-[#1affce]/5 transition-all duration-300 rounded-2xl" />
        
        <div className="relative z-10 flex flex-col h-full">
          {/* Product Icon */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00d9b8]/20 to-[#1affce]/10 flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-[#00d9b8]/30 transition-all">
            <ExternalLink className="w-6 h-6 text-[#00d9b8]" />
          </div>

          {/* Product Name */}
          <h3 className="text-xl font-heading font-semibold text-white mb-3 group-hover:text-[#00d9b8] transition-colors">
            {product.name}
          </h3>

          {/* Product Description */}
          <p className="text-[#b8c5d6] text-sm leading-relaxed line-clamp-3 mb-4 flex-grow">
            {product.description}
          </p>

          {/* Learn More */}
          <div className="flex items-center gap-2 text-[#00d9b8] text-sm font-medium group-hover:gap-3 transition-all">
            <span>Learn More</span>
            <ExternalLink className="w-4 h-4" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
};
