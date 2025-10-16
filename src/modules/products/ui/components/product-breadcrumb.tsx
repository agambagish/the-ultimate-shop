import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface Props {
  parentCategoryLabel?: string;
  parentCategorySlug?: string;
  subcategoryLabel?: string;
  subcategorySlug?: string;
  title: string;
}

export function ProductBreadcrumb({
  parentCategoryLabel,
  parentCategorySlug,
  subcategoryLabel,
  subcategorySlug,
  title,
}: Props) {
  return (
    <Breadcrumb className="mb-8">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/products">Products</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {parentCategorySlug && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/products/${parentCategorySlug}`}>
                  {parentCategoryLabel}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}
        {subcategorySlug && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href={`/products/${parentCategorySlug}/${subcategorySlug}`}
                >
                  {subcategoryLabel}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}
        <BreadcrumbItem>
          <BreadcrumbPage>{title}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
