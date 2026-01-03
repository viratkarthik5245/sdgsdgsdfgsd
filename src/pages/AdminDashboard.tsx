import { useState } from 'react';
import { useProducts } from '@/contexts/ProductContext';
import { useAuth } from '@/contexts/AuthContext';
import { Product } from '@/types/product';
import { AdminProductCard } from '@/components/AdminProductCard';
import { ProductFormModal } from '@/components/ProductFormModal';
import { EmptyState } from '@/components/EmptyState';
import { AdminLogin } from '@/components/AdminLogin';
import { DevHelper } from '@/components/DevHelper';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Package } from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminDashboard = () => {
  const { products, loading, error, addProduct, updateProduct, deleteProduct } = useProducts();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeletingProductId(id);
  };

  const confirmDelete = async () => {
    if (deletingProductId) {
      try {
        await deleteProduct(deletingProductId);
        setDeletingProductId(null);
        toast({
          title: 'Product deleted',
          description: 'The product has been successfully removed.',
        });
      } catch (err) {
        toast({
          title: 'Error',
          description: 'Failed to delete product. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, data);
        toast({
          title: 'Product updated',
          description: 'The product has been successfully updated.',
        });
        setIsFormOpen(false);
        setEditingProduct(undefined);
      } else {
        const success = await addProduct(data);
        if (success) {
          toast({
            title: 'Product added',
            description: 'The product has been successfully added to the catalog.',
          });
          setIsFormOpen(false);
          setEditingProduct(undefined);
        } else {
          toast({
            title: 'Error',
            description: error || 'Failed to add product. Please check the console for details.',
            variant: 'destructive',
          });
        }
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingProduct(undefined);
  };

  return (
    <div className="min-h-screen pt-16 sm:pt-20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 sm:top-40 right-4 sm:right-20 w-48 sm:w-96 h-48 sm:h-96 bg-[#00d9b8]/10 rounded-full blur-[60px] sm:blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 sm:bottom-40 left-4 sm:left-20 w-48 sm:w-96 h-48 sm:h-96 bg-[#1affce]/10 rounded-full blur-[60px] sm:blur-[120px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-16 py-6 sm:py-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 sm:mb-12"
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="w-8 sm:w-12 h-8 sm:h-12 rounded-xl bg-gradient-to-br from-[#00d9b8] to-[#1affce] flex items-center justify-center shadow-lg shadow-[#00d9b8]/30">
              <Package className="w-4 sm:w-6 h-4 sm:h-6 text-[#0a1628]" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-display font-extrabold text-white text-glow">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-[#b8c5d6] text-sm sm:text-base lg:text-lg max-w-2xl">
            Manage your product catalog. Add new products, edit existing ones, or remove outdated items.
          </p>
          <p className="text-[#6b7a8f] text-xs sm:text-sm mt-2">
            Products: {products.length}
          </p>
        </motion.div>



        {/* Add Product Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 sm:mb-8"
        >
          <Button
            onClick={() => setIsFormOpen(true)}
            className="bg-[#00d9b8] hover:bg-[#00c4a6] text-[#0a1628] font-semibold shadow-lg shadow-[#00d9b8]/30 hover:shadow-[#00d9b8]/50 transition-all gap-2 w-full sm:w-auto"
            size="lg"
          >
            <Plus className="w-4 sm:w-5 h-4 sm:h-5" />
            <span className="text-sm sm:text-base">Add New Product</span>
          </Button>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6"
          >
            <p className="text-red-400 text-sm">{error}</p>
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
        ) : products.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No Products Yet"
            description="Get started by adding your first product to the catalog. Click the button above to begin."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <AdminProductCard
                  product={product}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      <ProductFormModal
        open={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        product={editingProduct}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingProductId} onOpenChange={() => setDeletingProductId(null)}>
        <AlertDialogContent className="glass-card border-[#00d9b8]/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-display font-bold text-white">
              Delete Product
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[#b8c5d6]">
              Are you sure you want to delete this product? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-[#b8c5d6] hover:text-white hover:bg-white/5 border-white/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-[#ff6b6b] hover:bg-[#ff5252] text-white shadow-lg shadow-[#ff6b6b]/30"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Floating Action Button (Mobile) */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
        onClick={() => setIsFormOpen(true)}
        className="fixed bottom-4 sm:bottom-8 right-4 sm:right-8 w-14 sm:w-16 h-14 sm:h-16 rounded-full bg-gradient-to-br from-[#00d9b8] to-[#1affce] shadow-2xl shadow-[#00d9b8]/40 flex items-center justify-center sm:hidden hover:scale-110 transition-transform z-50"
      >
        <Plus className="w-6 sm:w-8 h-6 sm:h-8 text-[#0a1628]" />
      </motion.button>

      {/* Developer Helper - only shows in development */}
      <DevHelper />
    </div>
  );
};
