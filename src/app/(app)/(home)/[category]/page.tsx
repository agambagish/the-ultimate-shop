import { CategoryHeader } from "@/modules/categories/ui/components/category-header";

interface Props {
  params: Promise<{ category: string }>;
}

export default async function ({ params }: Props) {
  const { category } = await params;

  return (
    <main className="min-h-screen">
      <CategoryHeader />
    </main>
  );
}
