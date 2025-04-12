import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { CategoryCard } from "@/features/home/components/category-card";
import { getFeaturedCategories } from "@/features/home/queries";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  description: string;
}

export async function FeaturedCategories({ title, description }: Props) {
  const { categories } = await getFeaturedCategories();

  return (
    <section className="px-4 py-16 md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            {title}
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600">{description}</p>
        </div>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((category, i) => (
            <CategoryCard key={i} category={category} index={i} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link
            href="#"
            className={cn(buttonVariants({ variant: "outline" }), "px-6")}
          >
            View All Categories
          </Link>
        </div>
      </div>
    </section>
  );
}
