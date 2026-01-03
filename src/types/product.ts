export interface Product {
  id: string;
  name: string;
  description: string;
  usageInstructions: string;
  externalLink: string;
  createdAt: string;
  updatedAt: string;
}

export type ProductFormData = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;
