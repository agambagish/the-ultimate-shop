import { CategoryHeader } from "@/modules/categories/ui/components/category-header";

interface Props {
  params: Promise<{
    category: string;
    subcategory: string;
  }>;
}

export default async function ({ params }: Props) {
  const { category, subcategory } = await params;

  return (
    <main className="min-h-screen">
      <CategoryHeader />
    </main>
  );
}
