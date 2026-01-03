import { Product } from '@/types/product';
import { Edit, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface AdminProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export const AdminProductCard = ({ product, onEdit, onDelete }: AdminProductCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="glass-card rounded-2xl p-6 group hover:border-[#00d9b8]/40 transition-all"
    >
      <div className="flex flex-col h-full">
        {/* Header with actions */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00d9b8]/20 to-[#1affce]/10 flex items-center justify-center">
            <ExternalLink className="w-6 h-6 text-[#00d9b8]" />
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(product)}
              className="text-[#4dd4e8] hover:text-[#00d9b8] hover:bg-[#00d9b8]/10"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(product.id)}
              className="text-[#ff6b6b] hover:text-[#ff5252] hover:bg-[#ff6b6b]/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <h3 className="text-xl font-heading font-semibold text-white mb-2">
          {product.name}
        </h3>
        <p className="text-[#b8c5d6] text-sm leading-relaxed line-clamp-2 mb-3 flex-grow">
          {product.description}
        </p>

        {/* Link Preview */}
        {product.externalLink && (
          <a
            href={product.externalLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-[#6b7a8f] hover:text-[#00d9b8] truncate block transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {product.externalLink}
          </a>
        )}

        {/* Metadata */}
        <div className="mt-4 pt-4 border-t border-white/5 text-xs text-[#6b7a8f]">
          Updated {new Date(product.updatedAt).toLocaleDateString()}
        </div>
      </div>
    </motion.div>
  );
};
