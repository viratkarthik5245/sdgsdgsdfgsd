/**
 * Convert a product name to a URL-friendly slug
 * Example: "Nancy prasana" -> "nancyprasana"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '') // Remove spaces, underscores, and hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Generate a product URL path
 * Example: "Nancy prasana", "c7d9acc6..." -> "/nancyprasana/c7d9acc6..."
 */
export function generateProductPath(productName: string, productId: string): string {
  const slug = slugify(productName);
  return `/${slug}/${productId}`;
}