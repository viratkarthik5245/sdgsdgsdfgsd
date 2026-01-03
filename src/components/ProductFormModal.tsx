import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Product, ProductFormData } from '@/types/product';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(100, 'Name is too long'),
  description: z.string().min(1, 'Description is required').max(500, 'Description is too long'),
  usageInstructions: z.string().min(1, 'Usage instructions are required'),
  externalLink: z.string().url('Please enter a valid URL'),
});

interface ProductFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => Promise<void>;
  product?: Product;
}

export const ProductFormModal = ({ open, onClose, onSubmit, product }: ProductFormModalProps) => {
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      usageInstructions: '',
      externalLink: '',
    },
  });

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        description: product.description,
        usageInstructions: product.usageInstructions,
        externalLink: product.externalLink,
      });
    } else {
      form.reset({
        name: '',
        description: '',
        usageInstructions: '',
        externalLink: '',
      });
    }
  }, [product, form]);

  const handleSubmit = async (data: ProductFormData) => {
    await onSubmit(data);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass-card border-[#00d9b8]/30 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display font-bold text-white">
            {product ? 'Edit Product' : 'Add New Product'}
          </DialogTitle>
          <DialogDescription className="text-[#b8c5d6]">
            {product
              ? 'Update the product information below.'
              : 'Fill in the details to add a new product to your catalog.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 mt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white font-heading">Product Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter product name"
                      className="bg-[#0a1628]/50 border-[#00d9b8]/20 text-white placeholder:text-[#6b7a8f] focus:border-[#00d9b8] focus:ring-[#00d9b8]/30"
                    />
                  </FormControl>
                  <FormMessage className="text-[#ff6b6b]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white font-heading">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Brief description of the product"
                      rows={3}
                      className="bg-[#0a1628]/50 border-[#00d9b8]/20 text-white placeholder:text-[#6b7a8f] focus:border-[#00d9b8] focus:ring-[#00d9b8]/30 resize-none"
                    />
                  </FormControl>
                  <FormMessage className="text-[#ff6b6b]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="usageInstructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white font-heading">Usage Instructions</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Detailed instructions on how to use this product"
                      rows={6}
                      className="bg-[#0a1628]/50 border-[#00d9b8]/20 text-white placeholder:text-[#6b7a8f] focus:border-[#00d9b8] focus:ring-[#00d9b8]/30 resize-none"
                    />
                  </FormControl>
                  <FormMessage className="text-[#ff6b6b]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="externalLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white font-heading">External Link</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="url"
                      placeholder="https://example.com"
                      className="bg-[#0a1628]/50 border-[#00d9b8]/20 text-white placeholder:text-[#6b7a8f] focus:border-[#00d9b8] focus:ring-[#00d9b8]/30 font-mono text-sm"
                    />
                  </FormControl>
                  <FormMessage className="text-[#ff6b6b]" />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="flex-1 text-[#b8c5d6] hover:text-white hover:bg-white/5"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="flex-1 bg-[#00d9b8] hover:bg-[#00c4a6] text-[#0a1628] font-semibold shadow-lg shadow-[#00d9b8]/30 hover:shadow-[#00d9b8]/50 transition-all"
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>{product ? 'Update Product' : 'Add Product'}</>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
