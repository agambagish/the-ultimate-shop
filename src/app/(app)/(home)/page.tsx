import config from "@payload-config";
import { getPayload } from "payload";

import { CategoryBar } from "@/modules/home/ui/components/category-bar";
import { Hero } from "@/modules/home/ui/components/hero";
import type { Category } from "@/payload-types";

export default async function Page() {
  const payload = await getPayload({
    config,
  });

  const data = await payload.find({
    collection: "categories",
    depth: 1,
    pagination: false,
    where: {
      parent: {
        exists: false,
      },
    },
    sort: "label",
  });

  const formattedData = data.docs.map((doc) => ({
    ...doc,
    subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
      ...(doc as Category),
      subcategories: undefined,
    })),
  }));

  return (
    <main className="relative min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Hero />
        <CategoryBar data={formattedData} />
      </div>
    </main>
  );
}
