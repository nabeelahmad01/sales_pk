import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Sale from '@/models/Sale';
import Brand from '@/models/Brand';

// Sample Pakistani brands data
const brandsData = [
  {
    name: 'Khaadi',
    slug: 'khaadi',
    logo: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop',
    description: 'Premium Pakistani fashion brand known for traditional and contemporary designs.',
    website: 'https://www.khaadi.com',
    category: 'Clothing',
    isActive: true,
  },
  {
    name: 'Gul Ahmed',
    slug: 'gul-ahmed',
    logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop',
    description: "One of Pakistan's leading textile and fashion brands.",
    website: 'https://www.gulahmed.com',
    category: 'Clothing',
    isActive: true,
  },
  {
    name: 'Sapphire',
    slug: 'sapphire',
    logo: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=200&h=200&fit=crop',
    description: 'Modern fashion brand offering western and eastern wear.',
    website: 'https://www.sapphireonline.pk',
    category: 'Clothing',
    isActive: true,
  },
  {
    name: 'Servis',
    slug: 'servis',
    logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop',
    description: "Pakistan's largest footwear brand with quality shoes.",
    website: 'https://www.servis.com.pk',
    category: 'Shoes',
    isActive: true,
  },
  {
    name: 'Bata',
    slug: 'bata',
    logo: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=200&h=200&fit=crop',
    description: 'International footwear brand with stores across Pakistan.',
    website: 'https://www.bata.pk',
    category: 'Shoes',
    isActive: true,
  },
  {
    name: 'Bonanza',
    slug: 'bonanza',
    logo: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=200&h=200&fit=crop',
    description: 'Quality sweaters and winter wear specialists.',
    website: 'https://www.bonanzagt.com',
    category: 'Clothing',
    isActive: true,
  },
  {
    name: 'Junaid Jamshed',
    slug: 'junaid-jamshed',
    logo: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=200&h=200&fit=crop',
    description: "Premium men's and women's fashion and fragrances.",
    website: 'https://www.junaidjamshed.com',
    category: 'Clothing',
    isActive: true,
  },
  {
    name: 'Outfitters',
    slug: 'outfitters',
    logo: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200&h=200&fit=crop',
    description: 'Youth-focused western fashion brand.',
    website: 'https://www.outfitters.com.pk',
    category: 'Clothing',
    isActive: true,
  },
];

// Sample sales data
const salesData = [
  {
    title: 'Winter Collection Clearance',
    description: 'Massive discounts on entire winter collection. Shawls, sweaters, and more!',
    brandName: 'Khaadi',
    category: 'Clothing',
    discountPercentage: 50,
    originalPrice: 8999,
    salePrice: 4499,
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=400&fit=crop',
    startDate: new Date('2024-12-15'),
    endDate: new Date('2025-01-15'),
    isActive: true,
    isFeatured: true,
    link: 'https://www.khaadi.com/sale',
  },
  {
    title: 'Year End Mega Sale',
    description: 'End the year with great savings! Up to 70% off on selected items.',
    brandName: 'Gul Ahmed',
    category: 'Clothing',
    discountPercentage: 70,
    originalPrice: 12999,
    salePrice: 3899,
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=400&fit=crop',
    startDate: new Date('2024-12-20'),
    endDate: new Date('2025-01-20'),
    isActive: true,
    isFeatured: true,
    link: 'https://www.gulahmed.com/sale',
  },
  {
    title: 'Flat 40% Off on All Shoes',
    description: 'Shop the latest collection of casual and formal shoes at amazing prices.',
    brandName: 'Servis',
    category: 'Shoes',
    discountPercentage: 40,
    originalPrice: 5999,
    salePrice: 3599,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=400&fit=crop',
    startDate: new Date('2024-12-10'),
    endDate: new Date('2025-01-10'),
    isActive: true,
    isFeatured: true,
    link: 'https://www.servis.com.pk/sale',
  },
  {
    title: 'Premium Collection - 30% Off',
    description: 'Exclusive discounts on our premium unstitched collection.',
    brandName: 'Sapphire',
    category: 'Clothing',
    discountPercentage: 30,
    originalPrice: 7500,
    salePrice: 5250,
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=400&fit=crop',
    startDate: new Date('2024-12-18'),
    endDate: new Date('2025-01-05'),
    isActive: true,
    isFeatured: false,
    link: 'https://www.sapphireonline.pk/sale',
  },
  {
    title: 'Sweater Season Sale',
    description: 'Stay warm with our quality sweaters at unbeatable prices.',
    brandName: 'Bonanza',
    category: 'Clothing',
    discountPercentage: 60,
    originalPrice: 4599,
    salePrice: 1839,
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=400&fit=crop',
    startDate: new Date('2024-12-01'),
    endDate: new Date('2025-01-31'),
    isActive: true,
    isFeatured: true,
    link: 'https://www.bonanzagt.com/sale',
  },
  {
    title: 'Bata Winter Carnival',
    description: 'Get ready for winter with comfortable boots and shoes.',
    brandName: 'Bata',
    category: 'Shoes',
    discountPercentage: 45,
    originalPrice: 6999,
    salePrice: 3849,
    image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&h=400&fit=crop',
    startDate: new Date('2024-12-15'),
    endDate: new Date('2025-01-15'),
    isActive: true,
    isFeatured: false,
    link: 'https://www.bata.pk/sale',
  },
  {
    title: 'J. Exclusive Eid Preview',
    description: 'Early bird discounts on upcoming Eid festive collection.',
    brandName: 'Junaid Jamshed',
    category: 'Clothing',
    discountPercentage: 25,
    originalPrice: 15999,
    salePrice: 11999,
    image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&h=400&fit=crop',
    startDate: new Date('2024-12-20'),
    endDate: new Date('2025-02-10'),
    isActive: true,
    isFeatured: true,
    link: 'https://www.junaidjamshed.com/sale',
  },
  {
    title: 'Outfitters Blowout Sale',
    description: 'Huge discounts on jeans, tees, and casual wear for young shoppers.',
    brandName: 'Outfitters',
    category: 'Clothing',
    discountPercentage: 55,
    originalPrice: 3999,
    salePrice: 1799,
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&h=400&fit=crop',
    startDate: new Date('2024-12-12'),
    endDate: new Date('2025-01-12'),
    isActive: true,
    isFeatured: false,
    link: 'https://www.outfitters.com.pk/sale',
  },
];

export async function POST() {
  try {
    await dbConnect();
    
    // Clear existing data
    await Brand.deleteMany({});
    await Sale.deleteMany({});
    
    // Insert brands
    const brands = await Brand.insertMany(brandsData);
    console.log(`✅ Inserted ${brands.length} brands`);
    
    // Create a map of brand names to IDs
    const brandMap = new Map(brands.map(b => [b.name, b._id.toString()]));
    
    // Add brandId to sales data
    const salesWithBrandId = salesData.map(sale => ({
      ...sale,
      brandId: brandMap.get(sale.brandName) || '',
    }));
    
    // Insert sales
    const sales = await Sale.insertMany(salesWithBrandId);
    console.log(`✅ Inserted ${sales.length} sales`);
    
    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully!',
      data: {
        brands: brands.length,
        sales: sales.length,
      },
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed database' },
      { status: 500 }
    );
  }
}
