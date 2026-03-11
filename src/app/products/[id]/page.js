export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { publicApi } from "@/lib/apiClient";
import ProductDetailsContent from "@/components/ProductDetailsContent";

export async function generateStaticParams() {
  try {
    const products = await publicApi.getProducts({ page: 0, size: 1000 });
    const items = products?.content || [];

    return items.map((product) => ({
      id: String(product.id),
    }));
  } catch (error) {
    console.error("Failed to generate static params:", error);
    return [];
  }
}

export default async function ProductDetailsPage(props) {
  // ✅ NEXT 15 FIX
  const { id } = await props.params;

  const numericId = Number(id);

  if (!Number.isFinite(numericId)) {
    notFound();
  }

  let product = null;

  try {
    product = await publicApi.getProduct(numericId);
  } catch (error) {
    console.error("Error fetching product:", error);
  }

  if (!product) {
    notFound();
  }

  return <ProductDetailsContent product={product} />;
}