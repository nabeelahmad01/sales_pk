import { Metadata } from 'next';
import dbConnect from '@/lib/mongodb';
import Sale from '@/models/Sale';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  try {
    await dbConnect();
    const sale = await Sale.findById(id).lean();
    
    if (!sale) {
      return {
        title: 'Sale Not Found - ShowSales.pk',
      };
    }

    return {
      title: `${sale.title} - ${sale.discountPercentage}% OFF | ShowSales.pk`,
      description: `Get ${sale.discountPercentage}% discount on ${sale.title} from ${sale.brandName}. ${sale.description}`,
      openGraph: {
        title: `${sale.title} - ${sale.discountPercentage}% OFF`,
        description: `Get ${sale.discountPercentage}% discount from ${sale.brandName}. Limited time offer!`,
        type: 'website',
        images: [sale.image],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${sale.title} - ${sale.discountPercentage}% OFF`,
        description: `Get ${sale.discountPercentage}% discount from ${sale.brandName}`,
        images: [sale.image],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Sale - ShowSales.pk',
    };
  }
}

export { default } from './page';
