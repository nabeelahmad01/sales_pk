import { MetadataRoute } from 'next';
import dbConnect from '@/lib/mongodb';

// Fetch brands from database
async function getBrands() {
  try {
    await dbConnect();
    const Brand = (await import('@/models/Brand')).default;
    const brands = await Brand.find({ isActive: true, status: 'approved' }).select('slug updatedAt');
    return brands;
  } catch (error) {
    console.error('Error fetching brands for sitemap:', error);
    return [];
  }
}

// Fetch sales from database
async function getSales() {
  try {
    await dbConnect();
    const Sale = (await import('@/models/Sale')).default;
    const sales = await Sale.find({ isActive: true }).select('_id updatedAt');
    return sales;
  } catch (error) {
    console.error('Error fetching sales for sitemap:', error);
    return [];
  }
}

// Fetch categories from database
async function getCategories() {
  try {
    await dbConnect();
    const Category = (await import('@/models/Category')).default;
    const categories = await Category.find({}).select('slug updatedAt');
    return categories;
  } catch (error) {
    console.error('Error fetching categories for sitemap:', error);
    return [];
  }
}

// Fetch blog posts from database
async function getPosts() {
  try {
    await dbConnect();
    const Post = (await import('@/models/Post')).default;
    const posts = await Post.find({ isPublished: true }).select('slug updatedAt');
    return posts;
  } catch (error) {
    console.error('Error fetching posts for sitemap:', error);
    return [];
  }
}

// Static pages
const staticPages = [
  { path: '', priority: 1 },
  { path: '/sales', priority: 0.9 },
  { path: '/brands', priority: 0.9 },
  { path: '/categories', priority: 0.8 },
  { path: '/blog', priority: 0.8 },
  { path: '/about', priority: 0.6 },
  { path: '/contact', priority: 0.6 },
  { path: '/terms', priority: 0.3 },
  { path: '/privacy-policy', priority: 0.3 },
  { path: '/refund-policy', priority: 0.3 },
  { path: '/shipping-policy', priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://showsales.pk';

  // Fetch dynamic data
  const [brands, sales, categories, posts] = await Promise.all([
    getBrands(),
    getSales(),
    getCategories(),
    getPosts(),
  ]);

  // Static pages
  const staticUrls: MetadataRoute.Sitemap = staticPages.map(page => ({
    url: `${baseUrl}${page.path}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: page.priority,
  }));

  // Brand pages
  const brandUrls: MetadataRoute.Sitemap = brands.map(brand => ({
    url: `${baseUrl}/brands/${brand.slug}`,
    lastModified: brand.updatedAt || new Date(),
    changeFrequency: 'daily',
    priority: 0.7,
  }));

  // Sale pages
  const saleUrls: MetadataRoute.Sitemap = sales.map(sale => ({
    url: `${baseUrl}/sales/${sale._id}`,
    lastModified: sale.updatedAt || new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  // Category pages
  const categoryUrls: MetadataRoute.Sitemap = categories.map(category => ({
    url: `${baseUrl}/categories/${category.slug}`,
    lastModified: category.updatedAt || new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // Blog post pages
  const postUrls: MetadataRoute.Sitemap = posts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt || new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [
    ...staticUrls,
    ...brandUrls,
    ...saleUrls,
    ...categoryUrls,
    ...postUrls,
  ];
}
