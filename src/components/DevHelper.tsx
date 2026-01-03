import { useProducts } from '@/contexts/ProductContext';
import { Button } from '@/components/ui/button';
import { Copy, Download } from 'lucide-react';

export const DevHelper = () => {
  const { products } = useProducts();

  const copyProductsToClipboard = () => {
    const productsCode = `// Updated products array - replace HARDCODED_PRODUCTS in hardcodedProducts.ts
export const HARDCODED_PRODUCTS: Product[] = ${JSON.stringify(products, null, 2)};`;
    
    navigator.clipboard.writeText(productsCode);
    alert('Products code copied to clipboard! Paste this into hardcodedProducts.ts');
  };

  const downloadProductsFile = () => {
    const productsCode = `import { Product } from '@/types/product';

// Hardcoded product storage - can hold up to 150 products
// This array is stored directly in the code and will be available on all devices
export const HARDCODED_PRODUCTS: Product[] = ${JSON.stringify(products, null, 2)};

// Maximum number of products that can be stored
export const MAX_PRODUCTS = 150;`;

    const blob = new Blob([productsCode], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hardcodedProducts.ts';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 bg-[#0a1628]/90 border border-[#00d9b8]/30 rounded-lg p-4 backdrop-blur-xl z-50">
      <h3 className="text-white text-sm font-semibold mb-2">Dev Helper</h3>
      <p className="text-[#b8c5d6] text-xs mb-3">
        Products: {products.length}/150
      </p>
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={copyProductsToClipboard}
          className="bg-[#00d9b8] hover:bg-[#00c4a6] text-[#0a1628] text-xs"
        >
          <Copy className="w-3 h-3 mr-1" />
          Copy Code
        </Button>
        <Button
          size="sm"
          onClick={downloadProductsFile}
          className="bg-[#00d9b8] hover:bg-[#00c4a6] text-[#0a1628] text-xs"
        >
          <Download className="w-3 h-3 mr-1" />
          Download
        </Button>
      </div>
    </div>
  );
};