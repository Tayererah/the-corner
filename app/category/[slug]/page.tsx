import { notFound } from "next/navigation";
import { getListings } from "@/lib/api";
import { getCategoryData, getAllCategories } from "@/lib/categories";
import CategoryView from "@/components/CategoryView";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllCategories().map((cat) => ({
    slug: cat.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const category = getCategoryData(slug);
  if (!category) {
    return {
      title: "Category Not Found — The Corner",
    };
  }

  return {
    title: `${category.name} | GZU Campus Marketplace — The Corner`,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = getCategoryData(slug);

  if (!category) {
    notFound();
  }

  const listings = await getListings();

  return <CategoryView category={category} initialListings={listings} />;
}
