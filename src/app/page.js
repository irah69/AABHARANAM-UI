import PerspectivesSection from '@/components/PerspectivesSection';
import Hero from '@/components/Hero';
import FeaturedProducts from '@/components/FeaturedProducts';

// SEO Metadata
export const metadata = {
  title: "Murgan Store - Premium Women's Fashion & Dresses",
  description:
    "Discover amazing women's dresses and apparel. Shop premium quality products with unbeatable prices and fast, free shipping on orders over ₹50.",
  keywords: "women dresses, fashion, dress store, online shopping",
};

async function getFeaturedProducts() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products`,
      {
        cache: "no-store", // always fetch fresh data
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }

    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function Home() {
  const products = await getFeaturedProducts();

  return (
    <>
      <Hero />

      {/* Collections Grid */}
   {/*    <CollectionsGrid /> */}

      {/* Featured Products Section */}
      {/* <section className="py-16 md:py-24 bg-white">
        <div className="container-custom">
          <div className="mb-10 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-light mb-2">Featured Products</h2>
            <p className="text-gray-600 text-xs md:text-sm font-light tracking-wide">DISCOVER OUR CAREFULLY CURATED SELECTION</p>
          </div>
          <ProductGrid products={featuredProducts} loading={loading} />
          <div className="text-center mt-10 md:mt-16">
            <a href="/products" className="btn-secondary-pedestal">
              View All Products
            </a>
          </div>
        </div>
      </section> */}
      <FeaturedProducts/>

      {/* Studio/Configuration Section */}
    {/*   <StudioSection /> */}

      {/* Benefits Section */}
      {/* <WhyChooseMurgan /> */}

      {/* Perspectives/Stories Section */}
      <PerspectivesSection />
    </>
  );
}