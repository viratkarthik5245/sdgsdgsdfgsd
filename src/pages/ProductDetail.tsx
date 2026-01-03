import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProducts } from '@/contexts/ProductContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { generateProductPath } from '@/lib/slugify';

export const ProductDetail = () => {
  const { id, slug } = useParams<{ id: string; slug?: string }>();
  const { getProductById } = useProducts();
  const navigate = useNavigate();
  const product = id ? getProductById(id) : undefined;

  // Redirect old URLs to new SEO-friendly format
  useEffect(() => {
    if (product && !slug) {
      // This is an old URL format (/product/id), redirect to new format
      const newPath = generateProductPath(product.name, product.id);
      navigate(newPath, { replace: true });
    }
  }, [product, slug, navigate]);

  if (!product) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#00d9b8]/20 to-[#1affce]/10 flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-[#00d9b8]" />
          </div>
          <h2 className="text-3xl font-display font-bold text-white mb-4">Product Not Found</h2>
          <p className="text-[#b8c5d6] mb-6">The product you're looking for doesn't exist.</p>
          <Button
            onClick={() => navigate('/')}
            className="bg-[#00d9b8] hover:bg-[#00c4a6] text-[#0a1628] font-semibold shadow-lg shadow-[#00d9b8]/30"
          >
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-[#00d9b8]/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#1affce]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-16 py-12 relative z-10">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[#b8c5d6] hover:text-[#00d9b8] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Products</span>
          </Link>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-3xl p-12 lg:p-16 mb-12 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#00d9b8]/20 to-transparent rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00d9b8] to-[#1affce] flex items-center justify-center mb-6 shadow-lg shadow-[#00d9b8]/30">
              <ExternalLink className="w-8 h-8 text-[#0a1628]" />
            </div>

            <h1 className="text-5xl lg:text-6xl font-display font-extrabold text-white mb-6 text-glow">
              {product.name}
            </h1>

            <p className="text-[#b8c5d6] text-xl leading-relaxed max-w-3xl">
              {product.description}
            </p>
          </div>
        </motion.div>

        {/* Usage Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-3xl p-12 lg:p-16 mb-12"
        >
          <h2 className="text-3xl font-heading font-bold text-white mb-6">
            Usage Instructions
          </h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-[#b8c5d6] text-lg leading-relaxed whitespace-pre-wrap">
              {product.usageInstructions}
            </p>
          </div>
        </motion.div>

        {/* External Link CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center"
        >
          <a
            href={product.externalLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group"
          >
            <Button
              size="lg"
              className="bg-[#00d9b8] hover:bg-[#00c4a6] text-[#0a1628] font-semibold shadow-2xl shadow-[#00d9b8]/40 hover:shadow-[#00d9b8]/60 transition-all text-lg px-8 py-6 h-auto gap-3 hover:scale-105"
            >
              <span>Visit Product Page</span>
              <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Button>
          </a>
        </motion.div>

        {/* Metadata */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center text-sm text-[#6b7a8f]"
        >
          Last updated {new Date(product.updatedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </motion.div>
      </div>
    </div>
  );
};
