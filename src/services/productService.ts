import { supabase, DatabaseProduct } from '@/lib/supabase';
import { Product, ProductFormData } from '@/types/product';

// Convert database product to app product format
const dbToAppProduct = (dbProduct: DatabaseProduct): Product => ({
  id: dbProduct.id,
  name: dbProduct.name,
  description: dbProduct.description,
  usageInstructions: dbProduct.usage_instructions,
  externalLink: dbProduct.external_link,
  createdAt: dbProduct.created_at,
  updatedAt: dbProduct.updated_at,
});

// Convert app product to database format
const appToDbProduct = (product: ProductFormData): Omit<DatabaseProduct, 'id' | 'created_at' | 'updated_at' | 'half'> => ({
  name: product.name,
  description: product.description,
  usage_instructions: product.usageInstructions,
  external_link: product.externalLink,
});

export const productService = {
  // Get all products
  async getAllProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      throw error;
    }

    return data?.map(dbToAppProduct) || [];
  },

  // Get product by ID
  async getProductById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Product not found
      }
      console.error('Error fetching product:', error);
      throw error;
    }

    return data ? dbToAppProduct(data) : null;
  },

  // Add new product
  async addProduct(productData: ProductFormData): Promise<Product> {
    const dbProduct = appToDbProduct(productData);

    console.log('Attempting to add product:', dbProduct);

    const { data, error } = await supabase
      .from('products')
      .insert([dbProduct])
      .select()
      .single();

    if (error) {
      console.error('Error adding product:', error);
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw new Error(`Failed to add product: ${error.message}`);
    }

    if (!data) {
      throw new Error('No data returned from database');
    }

    console.log('Product added successfully:', data);
    return dbToAppProduct(data);
  },

  // Update product
  async updateProduct(id: string, productData: ProductFormData): Promise<Product> {
    const dbProduct = appToDbProduct(productData);
    
    const { data, error } = await supabase
      .from('products')
      .update({ ...dbProduct, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating product:', error);
      throw error;
    }

    return dbToAppProduct(data);
  },

  // Delete product
  async deleteProduct(id: string): Promise<void> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  // Get products count
  async getProductsCount(): Promise<number> {
    const { count, error } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Error getting products count:', error);
      throw error;
    }

    return count || 0;
  }
};